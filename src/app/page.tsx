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
      {/* Top bar */}
      <header className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yp border-2 border-black rounded flex items-center justify-center font-display font-black text-black">
              YP
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none">Only For Seniors</p>
              <p className="text-xs text-stone-600">Canada's senior marketplace</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/categories"
              className="hidden sm:inline-block px-3 py-2 text-sm font-bold border-2 border-black hover:bg-yp"
            >
              Browse
            </Link>
            <Link
              href="/list-business"
              className="inline-block px-3 py-2 text-sm font-bold bg-black text-yp border-2 border-black"
            >
              Post a Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Search */}
      <section className="border-b-2 border-black bg-yp">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <h1 className="text-3xl md:text-5xl font-display font-black leading-tight">
            Trusted services<br />
            <span className="inline-block bg-black text-yp px-3 py-1 mt-1">for Canadian seniors.</span>
          </h1>
          <p className="mt-3 text-base md:text-lg max-w-2xl">
            No ads. No spam. Just verified businesses, real reviews, and people who care.
          </p>

          <form action="/search" method="GET" className="mt-6 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center bg-white border-2 border-black rounded-lg px-3">
              <Search className="w-5 h-5 text-stone-600" />
              <input
                type="text"
                name="q"
                placeholder="What are you looking for? e.g. 'ride to doctor', 'grocery delivery'"
                className="flex-1 min-w-touch px-3 py-3 text-lg outline-none"
                aria-label="Search"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-yp border-2 border-black rounded-lg font-display font-bold text-lg hover:bg-stone-900 min-h-touch"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-bold text-black">Popular:</span>
            {["Personal Care", "House Cleaning", "Rides", "Snow Removal", "Physiotherapy", "Pharmacy Delivery"].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-sm px-3 py-1 bg-white border-2 border-black rounded-full hover:bg-yellow-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar — All categories (Kijiji-style flat list) */}
        <aside className="space-y-4">
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="bg-black text-yp px-4 py-2 font-display font-bold uppercase tracking-wide text-sm">
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
                      <span className="flex items-center gap-2 text-sm">
                        <span aria-hidden>{cat.icon}</span>
                        <span className="line-clamp-1">{cat.name}</span>
                      </span>
                      <span className="text-xs text-stone-500">({count})</span>
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
              <h3 className="font-display font-bold uppercase tracking-wide text-sm">Need help?</h3>
            </div>
            <p className="text-sm mb-2">Call our free senior help line.</p>
            <a href="tel:1-855-555-0123" className="block text-2xl font-display font-black underline">
              1-855-555-0123
            </a>
            <p className="text-xs mt-1">Mon–Fri 8am–8pm ET</p>
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
                  className="text-sm font-bold text-blue-700 hover:underline flex items-center gap-1"
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
                  <Star className="w-6 h-6 fill-yp stroke-black" />
                  Featured Listings
                </h2>
                <span className="text-sm text-stone-600">{totalListings} total listings</span>
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
                className="text-sm font-bold hover:underline flex items-center gap-1"
              >
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {allCards.length === 0 ? (
              <div className="bg-white border-2 border-black rounded-lg p-12 text-center text-stone-600">
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
                <p className="text-sm text-stone-700">Every business is reviewed before being listed.</p>
              </div>
              <div>
                <Heart className="w-6 h-6 text-rose-700" />
                <h3 className="font-bold mt-1">No Ads, Ever</h3>
                <p className="text-sm text-stone-700">We never show ads. We never sell your data.</p>
              </div>
              <div>
                <MapPin className="w-6 h-6 text-blue-700" />
                <h3 className="font-bold mt-1">Local to You</h3>
                <p className="text-sm text-stone-700">Filter by city and province across Canada.</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-black text-yp mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yp text-black font-display font-black flex items-center justify-center rounded">YP</div>
              <span className="font-display font-bold">Only For Seniors</span>
            </div>
            <p className="text-sm mt-2 opacity-90">Canada's senior marketplace. No ads. No spam. Just the people who can help.</p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-2">Browse</h4>
            <ul className="space-y-1 text-sm">
              {allCats.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="hover:underline">{c.icon} {c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-2">For Business Owners</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/list-business" className="hover:underline">Post a Listing</Link></li>
              <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">How It Works</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-yp/30 text-center text-xs py-3 opacity-80">
          © {new Date().getFullYear()} Only For Seniors · Made with care in Canada
        </div>
      </footer>
    </div>
  );
}
