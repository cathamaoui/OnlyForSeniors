import { Button } from "@/components/ui/Button";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-emerald-900 text-center mb-4">
          Simple, Honest Pricing
        </h1>
        <p className="text-xl text-emerald-800 text-center mb-10">
          For seniors it&apos;s <strong>free</strong>. For businesses, one flat rate.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-retro">
            <h2 className="font-display font-black text-2xl text-emerald-900">For Seniors</h2>
            <p className="text-5xl font-display font-black text-emerald-700 my-3">Free</p>
            <ul className="space-y-2 text-emerald-800">
              <li>✓ Search the directory</li>
              <li>✓ Read reviews</li>
              <li>✓ Call or message any business</li>
              <li>✓ Leave your own reviews</li>
            </ul>
          </div>

          <div
            className="card-retro bg-emerald-800 text-cream-50"
            style={{ borderColor: "black" }}
          >
            <span className="inline-block bg-ember-500 text-white font-black text-xs uppercase
              tracking-wider px-2 py-1 rounded-chunky border-2 border-black mb-2">
              Most Popular
            </span>
            <h2 className="font-display font-black text-2xl">For Businesses</h2>
            <p className="text-5xl font-display font-black my-3">
              $10<span className="text-xl text-cream-200"> / month</span>
            </p>
            <ul className="space-y-2 text-cream-100">
              <li>✓ Full business profile</li>
              <li>✓ Category listing &amp; search</li>
              <li>✓ Direct customer contact</li>
              <li>✓ Reviews &amp; ratings</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <div className="mt-6">
              <Button href="/list-business" variant="primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
