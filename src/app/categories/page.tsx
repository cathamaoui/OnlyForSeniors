import Link from "next/link";
import { ArrowLeft, ChevronRight, Newspaper, Heart } from "lucide-react";
import {
  getAllCategories,
  getAllSubcategoriesWithCounts,
  getCategoryCounts,
  getRecentBusinesses,
} from "@/lib/businesses";

export const metadata = {
  title: "All Categories — Only For Seniors",
  description: "Browse every senior service category on Only For Seniors.",
};

export default function CategoriesPage() {
  const categories = getAllCategories().filter((c) => c.slug !== "news");
  const subs = getAllSubcategoriesWithCounts();
  const catCounts = getCategoryCounts();
  const recent = getRecentBusinesses(24, 5);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-display uppercase tracking-wide text-sm shadow-sm hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold">All Categories</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar — Kijiji-style flat list */}
        <aside className="space-y-6">
          {/* What's New (Past 24 Hours) */}
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="bg-blue-700 text-white px-4 py-2 flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <h2 className="font-display font-bold uppercase tracking-wide text-sm">
                What's New (Past 24h)
              </h2>
            </div>
            {recent.length === 0 ? (
              <p className="px-4 py-3 text-sm text-stone-600">
                No new listings in the last 24 hours.
              </p>
            ) : (
              <ul>
                {recent.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/businesses/${b.id}`}
                      className="flex items-start justify-between gap-2 px-4 py-3 border-b border-stone-200 last:border-b-0 hover:bg-blue-50"
                    >
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{b.name}</p>
                        <p className="text-xs text-stone-600">{b.city}, {b.province}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-1 text-stone-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* All categories with their subcategories, Kijiji-style */}
          {categories.map((cat) => {
            const catCount = catCounts.find((c) => c.category.slug === cat.slug)?.count ?? 0;
            return (
              <div key={cat.slug} className="bg-white border-2 border-black rounded-lg overflow-hidden">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="block px-4 py-3 border-b-2 border-black font-display font-bold text-base hover:underline"
                  style={{ backgroundColor: cat.color, color: "white" }}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}{" "}
                  <span className="font-normal text-sm opacity-90">({catCount})</span>
                </Link>
                <ul>
                  {cat.subcategories.map((sub) => {
                    const subCount = subs.find((s) => s.subcategory.slug === sub.slug)?.count ?? 0;
                    return (
                      <li key={sub.slug}>
                        <Link
                          href={`/categories/${cat.slug}/${sub.slug}`}
                          className="flex items-center justify-between px-4 py-2 text-sm border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
                        >
                          <span>{sub.name}</span>
                          <span className="text-stone-500 text-xs">({subCount})</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Volunteer CTA */}
          <div className="bg-emerald-700 text-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4" />
              <h2 className="font-display font-bold uppercase tracking-wide text-sm">
                Want to Volunteer?
              </h2>
            </div>
            <p className="text-sm mb-3">
              Give your time, learn new skills, and meet people in your community.
            </p>
            <Link
              href="/categories/volunteer"
              className="inline-block bg-white text-emerald-700 px-3 py-2 font-bold text-sm border-2 border-black"
            >
              Browse volunteer opportunities →
            </Link>
          </div>
        </aside>

        {/* Main — Featured cards grid */}
        <main>
          <div className="bg-white border-2 border-black rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold mb-2">Pick a Category</h2>
            <p className="text-stone-700 mb-6">
              Choose any category on the left to see local businesses, services, and listings.
              Every business has been verified. No ads — just the people who can help.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const catCount = catCounts.find((c) => c.category.slug === cat.slug)?.count ?? 0;
                return (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="block border-2 border-black rounded-lg p-4 hover:shadow-yp transition-shadow"
                  >
                    <div
                      className="text-2xl mb-2 inline-flex items-center justify-center w-10 h-10 rounded"
                      style={{ backgroundColor: cat.color, color: "white" }}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg">{cat.name}</h3>
                    <p className="text-sm text-stone-600">
                      {cat.subcategories.length} sub-categories · {catCount} listing{catCount === 1 ? "" : "s"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
