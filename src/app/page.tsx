import Link from "next/link";
import { MapPin, ChevronRight, BadgeCheck, Newspaper, Heart, Phone, Briefcase } from "lucide-react";
import {
  getAllCategories,
  getAllBusinesses,
  getRecentBusinesses,
  getCategoryCounts,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { CategorySearch } from "@/components/ui/CategorySearch";

export const metadata = {
  title: "Only For Seniors — Canada's Senior Marketplace",
  description: "Find trusted businesses, services, and products for Canadian seniors. No ads. Just the people who can help.",
};

export default function HomePage() {
  const allCats = getAllCategories();
  const businesses = getAllBusinesses();
  const recent = getRecentBusinesses(24, 8);
  const catCounts = getCategoryCounts();
  const totalListings = businesses.length;

  // What's new (last 24h)
  const news = recent.slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero / Search — taste-skill-inspired. Calm stone background, massive
          Bitter serif headline with italic accent, single big search input
          with a categories dropdown that opens to the full list. */}
      <section className="bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10 md:pt-10 md:pb-16">
          {/* Eyebrow — subtle accent label above the H1 */}
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-8 h-[3px] bg-stone-900" aria-hidden="true" />
            <p className="text-base font-semibold text-stone-700">
              For Canadians 65 and older
            </p>
          </div>

          {/* H1 — value proposition. Massive serif with italic accent. */}
          <h1 className="mt-3 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] tracking-tight max-w-4xl text-stone-900">
            Trusted help,{" "}
            <span className="italic font-display font-black text-stone-900">
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

          {/* Trust strip — quick value props (all icons unified to blue) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
            <div className="flex items-start gap-3 text-base">
              <BadgeCheck className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Verified businesses</p>
                <p className="text-stone-700">Every listing is reviewed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <Heart className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">No ads, ever</p>
                <p className="text-stone-700">We never sell your data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <MapPin className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Local to you</p>
                <p className="text-stone-700">Filter by city and province.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On mobile: main (hero + search) first, sidebar below.
          On desktop: side-by-side. */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar — All categories (flat list) */}
        <aside className="space-y-4">
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="bg-black text-white px-4 py-2 font-display font-bold   text-base">
              All Categories
            </div>
            <ul>
              {allCats.map((cat) => {
                const count = catCounts.find((c) => c.category.slug === cat.slug)?.count ?? 0;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="flex items-center justify-between gap-2 px-4 py-3 border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
                    >
                      <span className="flex items-center gap-2 text-base">
                        <span aria-hidden>{cat.icon}</span>
                        <span className="line-clamp-1">{cat.name}</span>
                      </span>
                      <span className="text-base text-stone-700">({count})</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Help line */}
          <div className="bg-emerald-700 text-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              <h3 className="font-display font-bold   text-base">Need help?</h3>
            </div>
            <p className="text-base mb-2">Call our free senior help line.</p>
            <a
              href="tel:1-855-555-0123"
              aria-label="Call our free senior help line at 1-855-555-0123"
              className="inline-flex items-center gap-2 text-2xl font-display font-black text-stone-900"
            >
              <Phone className="w-6 h-6 text-blue-700" strokeWidth={2.5} />
              1-855-555-0123
            </a>
            <p className="text-base mt-1">Mon–Fri 8am–8pm ET</p>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-8">
          {/* What's New (Past 24 Hours) */}
          {news.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-xl md:text-2xl font-display font-black">
                  <Newspaper className="w-6 h-6 text-blue-700" />
                  What's New (Past 24 Hours)
                </h2>
                <Link
                  href="/categories/news"
                  className="text-base font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {news.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </section>
          )}

          {/* Featured (removed in PR4 — the search bar with category dropdown
              is the new primary way to find listings, and the All Categories
              list below replaces the curated featured set). */}

          {/* Browse all categories — a clean grid of the 22 categories. Each
              card shows the icon, name, and how many listings are in it. */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-display font-black text-stone-900">
                <Briefcase className="w-6 h-6" />
                Browse all categories
              </h2>
              <span className="text-base text-stone-700">
                {totalListings} total listings
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allCats
                .filter((c) => !c.isNews)
                .map((cat) => {
                  const count = catCounts.find((c) => c.category.slug === cat.slug)?.count ?? 0;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}/`}
                      className="group flex items-center gap-3 p-4 bg-white border-2 border-stone-200 rounded-2xl hover:border-stone-900 hover:shadow-sm transition-colors min-h-touch"
                    >
                      <span aria-hidden="true" className="text-3xl flex-shrink-0">
                        {cat.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-display font-bold text-stone-900 line-clamp-2 group-hover:underline">
                          {cat.name}
                        </span>
                        <span className="block text-base text-stone-700">
                          {count} listing{count === 1 ? "" : "s"}
                        </span>
                      </span>
                      <ChevronRight
                        className="w-5 h-5 text-stone-400 group-hover:text-stone-900 flex-shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
            </div>
          </section>

          {/* Why this is different */}
          <section className="bg-white border-2 border-black rounded-lg p-6">
            <h2 className="text-xl md:text-2xl font-display font-black mb-3">
              Why Only For Seniors?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <BadgeCheck className="w-6 h-6 text-emerald-700" />
                <h3 className="font-bold mt-1">Verified Businesses</h3>
                <p className="text-base text-stone-700">Every business is reviewed before being listed.</p>
              </div>
              <div>
                <Heart className="w-6 h-6 text-rose-700" />
                <h3 className="font-bold mt-1">No Ads, Ever</h3>
                <p className="text-base text-stone-700">We never show ads. We never sell your data.</p>
              </div>
              <div>
                <MapPin className="w-6 h-6 text-blue-700" />
                <h3 className="font-bold mt-1">Local to You</h3>
                <p className="text-base text-stone-700">Filter by city and province across Canada.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
