import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 text-center mb-4">
          Simple, Honest Pricing
        </h1>
        <p className="text-lg sm:text-xl text-stone-700 text-center mb-10">
          For seniors it&apos;s <strong>free</strong>. For businesses, one flat rate.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* For Seniors — free */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="font-display font-black text-2xl text-stone-900">For Seniors</h2>
            <p className="text-5xl font-display font-black text-stone-900 my-3">Free</p>
            <ul className="space-y-3 text-stone-700 mt-4">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Search the directory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Read reviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Call or message any business</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Leave your own reviews</span>
              </li>
            </ul>
          </div>

          {/* For Businesses — $10/mo */}
          <div className="bg-stone-900 text-white border border-stone-900 rounded-2xl p-6 sm:p-8">
            <span className="inline-block bg-white text-stone-900 font-bold text-sm uppercase tracking-wide px-2 py-1 rounded mb-3">
              Most Popular
            </span>
            <h2 className="font-display font-black text-2xl">For Businesses</h2>
            <p className="text-5xl font-display font-black my-3">
              $10<span className="text-xl text-stone-300"> / month</span>
            </p>
            <ul className="space-y-3 text-stone-200 mt-4">
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Full business profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Category listing &amp; search</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Direct customer contact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Reviews &amp; ratings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-md flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>Cancel anytime</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/list-business"
                className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 bg-white text-stone-900 border border-white font-display font-bold text-lg rounded-full hover:bg-stone-100"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
