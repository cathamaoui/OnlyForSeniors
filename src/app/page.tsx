import Link from "next/link";
import { Search, MapPin, ChevronRight, Star, BadgeCheck, Newspaper, Heart, Phone, Briefcase } from "lucide-react";
import {
  getAllCategories,
  getAllBusinesses,
  getRecentBusinesses,
  getCategoryCounts,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

export const metadata = {
  title: "Only For Seniors — Canada's Senior Marketplace",
  description: "Find trusted businesses, services, and products for Canadian seniors. No ads. Just the people who can help.",
};

export default function HomePage() {
  const allCats = getAllCategories();
  const businesses = getAllBusinesses();
  const recent = getRecentBusinesses(24, 8);
  const featured = businesses.filter((b) => b.isFeatured);
  const catCounts = getCategoryCounts();
  const totalListings = businesses.length;

  // News + Featured + then everything else, deduped
  const news = recent.filter((b) => !b.isFeatured).slice(0, 4);
  const featuredOnly = featured.slice(0, 8);
  const allCards = businesses.filter((b) => !featured.includes(b));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero / Search */}
      <section className="border-b-2 border-black bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          {/* Eyebrow */}
          <p className="inline-block text-base font-bold   bg-black text-white px-3 py-1 rounded-full">
            Canada’s Senior Marketplace
          </p>

          {/* H1 — value proposition */}
          <h1 className="mt-4 text-4xl md:text-6xl font-display font-black leading-[1.05] tracking-tight max-w-3xl">
            Find help you can{" "}
            <span className="text-blue-700">trust</span>.
            <br className="hidden sm:block" />
            From people who{" "}
            <span className="text-blue-700">care</span>.
          </h1>

          {/* H2 — supporting subhead */}
          <h2 className="mt-4 text-base md:text-xl text-stone-700 max-w-2xl leading-relaxed">
            Browse verified home care, transportation, health, and daily living services
            across Canada. No ads, no spam — just real businesses and real reviews.
          </h2>

          {/* Primary search CTA */}
          <form action="/search" method="GET" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <label htmlFor="hero-search" className="sr-only">Search listings</label>
            <div className="flex-1 flex items-center bg-white border-2 border-black rounded-xl px-4 shadow-sm focus-within:ring-4 focus-within:ring-blue-200">
              <Search className="w-5 h-5 text-stone-700" />
              <input
                id="hero-search"
                type="text"
                name="q"
                placeholder="What do you need help with today?"
                className="flex-1 min-h-touch px-3 py-3 text-lg outline-none bg-transparent"
                aria-label="Search"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-700 text-white border-2 border-black rounded-xl font-display font-bold text-lg hover:bg-blue-800 min-h-touch shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick-pick popular searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-stone-800">Popular:</span>
            {["Personal Care", "House Cleaning", "Rides", "Snow Removal", "Physiotherapy", "Pharmacy Delivery"].map((tag) => (
              <Link
                key={tag}
                href={`/search/?q=${encodeURIComponent(tag)}`}
                className="text-base px-3 py-1.5 bg-white border border-stone-500 text-stone-800 rounded-full hover:border-black hover:bg-stone-50 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Trust strip — quick value props */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="flex items-start gap-2 text-base">
              <BadgeCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Verified businesses</p>
                <p className="text-stone-800">Every listing is reviewed.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-base">
              <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">No ads, ever</p>
                <p className="text-stone-800">We never sell your data.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-base">
              <MapPin className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Local to you</p>
                <p className="text-stone-800">Filter by city and province.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar — All categories (Kijiji-style flat list) */}
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
            <a href="tel:1-855-555-0123" className="block text-2xl font-display font-black underline">
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

          {/* Featured */}
          {featuredOnly.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-xl md:text-2xl font-display font-black">
                  <Star className="w-6 h-6 fill-stone-900 stroke-stone-900" />
                  Featured Listings
                </h2>
                <span className="text-base text-stone-800">{totalListings} total listings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredOnly.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </section>
          )}

          {/* All listings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-display font-black">
                <Briefcase className="w-6 h-6" />
                All Listings
              </h2>
              <Link
                href="/businesses"
                className="text-base font-bold hover:underline flex items-center gap-1"
              >
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {allCards.length === 0 ? (
              <div className="bg-white border-2 border-black rounded-lg p-12 text-center text-stone-800">
                No more listings to show.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCards.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            )}
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
