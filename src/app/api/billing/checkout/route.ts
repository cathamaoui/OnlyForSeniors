import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import Stripe from "stripe";

// Stripe is optional - if no key is configured, we fall back to a demo flow.
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    // Demo mode - return no URL so the client falls back to the simulator
    return NextResponse.json({ url: null });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe not fully configured" }, { status: 500 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?activated=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
      metadata: { userId: session.user.id },
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
