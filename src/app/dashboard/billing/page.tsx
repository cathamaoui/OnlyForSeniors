import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { BillingActions } from "@/components/dashboard/BillingActions";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect("/business/login");

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/dashboard" className="text-emerald-800 font-bold hover:text-ember-600">
          ← Back to dashboard
        </Link>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mt-3 mb-6">
          Subscription &amp; Billing
        </h1>

        <div className="card-retro">
          <h2 className="font-display font-black text-2xl text-emerald-900 mb-2">
            Only For Seniors — Business Listing
          </h2>
          <p className="text-3xl font-display font-black text-ember-700 mb-1">
            {formatPrice(10)} <span className="text-lg text-emerald-800">/ month</span>
          </p>
          <p className="text-emerald-800 mb-6">
            Includes full directory listing, messaging, reviews, and customer contact.
          </p>

          {sub ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                {sub.status === "ACTIVE" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-ember-600" />
                )}
                <span className="font-bold text-lg capitalize">
                  Status: {sub.status.toLowerCase()}
                </span>
              </div>
              <p className="text-emerald-800">
                Current period:{" "}
                {sub.currentPeriodStart.toLocaleDateString()} –{" "}
                {sub.currentPeriodEnd.toLocaleDateString()}
              </p>
              <BillingActions
                subscribed
                cancelAtPeriodEnd={sub.cancelAtPeriodEnd}
              />
            </div>
          ) : (
            <div>
              <p className="font-bold text-ember-700 mb-3">
                You don&apos;t have an active subscription.
              </p>
              <BillingActions subscribed={false} />
            </div>
          )}
        </div>

        <div className="card-retro mt-6 bg-cream-100">
          <h3 className="font-display font-black text-xl text-emerald-900 mb-2">
            How billing works
          </h3>
          <ul className="space-y-2 text-emerald-800">
            <li>• Secure payments by Stripe. We never see your card.</li>
            <li>• $10 CAD billed monthly.</li>
            <li>• Cancel anytime — your listing stays live until the end of the period.</li>
            <li>• Questions? Call 1-800-555-0199.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
