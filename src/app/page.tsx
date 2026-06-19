import Link from "next/link";
import { MapPin, BadgeCheck, Heart, Phone, ArrowRight } from "lucide-react";
import {
  getAllCategories,
} from "@/lib/businesses";
import { CategorySearch } from "@/components/ui/CategorySearch";

export const metadata = {
  title: "Only For Seniors — Canada's Senior Marketplace",
  description: "Find trusted businesses, services, and products for Canadian seniors. No ads. Just the people who can help.",
};

export default function HomePage() {
  const allCats = getAllCategories();

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero / Search — taste-skill-inspired. Warm cream background, massive
          Bitter serif headline with italic accent, single big search input
          with a categories dropdown that opens to the full list. */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10 md:pt-10 md:pb-16">
          {/* Eyebrow — subtle accent label above the H1 */}
          <p className="text-base font-semibold text-stone-700 mb-5">
            For Canadians 65 and older
          </p>

          {/* H1 — value proposition. Massive serif with italic accent. */}
          <h1 className="mt-3 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] tracking-tight max-w-4xl text-black">
            Trusted help,{" "}
            <span className="italic font-display font-black text-black">
              when you need it.
            </span>
          </h1>

          {/* Subhead */}
          <h2 className="mt-5 text-lg md:text-xl text-stone-700 max-w-2xl leading-relaxed">
            Browse verified home care, transportation, health, and daily living
            services across Canada. No ads, no spam — just real businesses and
            real reviews.
          </h2>

          {/* Primary search CTA — single big input with category dropdown */}
          <div className="mt-8 max-w-4xl">
            <CategorySearch categories={allCats} />
            <p className="mt-2 text-base text-stone-700">
              Pick a category to narrow your search, or type what you need.
            </p>
          </div>

          {/* Trust strip — quick value props, monochrome icons */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
            <div className="flex items-start gap-3 text-base">
              <BadgeCheck className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">Verified businesses</p>
                <p className="text-stone-700">Every listing is reviewed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <Heart className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">No ads, ever</p>
                <p className="text-stone-700">We never sell your data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <MapPin className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">Local to you</p>
                <p className="text-stone-700">Filter by city and province.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Below the hero — single column, minimal.
          The big search bar above is the primary way to find anything.
          This section offers two secondary paths: a "browse all" link
          and a small "Why OFS" explainer. */}

      {/* Browse all categories — text link, not a grid */}
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <Link
          href="/categories/"
          className="inline-flex items-center gap-2 text-lg sm:text-xl font-display font-bold text-black hover:text-stone-700 border-b-2 border-black pb-1"
        >
          Browse all 22 categories
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-2 text-base text-stone-700">
          Or use the search bar above to find a specific service.
        </p>
      </section>

      {/* Why this is different — kept brief, monochrome icons */}
      <section className="max-w-4xl mx-auto px-4 py-10 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-black text-center mb-6 sm:mb-8">
          Why Only For Seniors?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <BadgeCheck className="w-7 h-7 text-black" strokeWidth={1.5} />
            <h3 className="font-display font-bold text-lg mt-2 text-black">Verified businesses</h3>
            <p className="text-base text-stone-700 mt-1">
              Every business is reviewed by a real person before being listed.
            </p>
          </div>
          <div>
            <Heart className="w-7 h-7 text-black" strokeWidth={1.5} />
            <h3 className="font-display font-bold text-lg mt-2 text-black">No ads, ever</h3>
            <p className="text-base text-stone-700 mt-1">
              We never show ads. We never sell your data. Listings are paid for by the businesses themselves.
            </p>
          </div>
          <div>
            <MapPin className="w-7 h-7 text-black" strokeWidth={1.5} />
            <h3 className="font-display font-bold text-lg mt-2 text-black">Local to you</h3>
            <p className="text-base text-stone-700 mt-1">
              Filter by city and province. Find help close to home, anywhere in Canada.
            </p>
          </div>
        </div>
      </section>

      {/* Help line — small, monochrome, at the bottom */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:py-10 text-center border-t border-stone-200">
        <div className="inline-flex items-center gap-2 text-base text-stone-700">
          <Phone className="w-5 h-5 text-black" strokeWidth={1.5} />
          <span>Need help? Call our free senior help line:</span>
          <a
            href="tel:1-855-555-0123"
            className="font-display font-black text-black text-lg hover:underline"
          >
            1-855-555-0123
          </a>
        </div>
        <p className="text-base text-stone-700 mt-1">Mon–Fri 8am–8pm ET</p>
      </section>
    </div>
  );
}
