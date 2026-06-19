import Link from "next/link";
import { ArrowLeft, ChevronRight, Newspaper, Heart, MapPin, BadgeCheck } from "lucide-react";
import {
  getAllCategories,
  getAllSubcategoriesWithCounts,
  getCategoryCounts,
  getRecentBusinesses,
} from "@/lib/businesses";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

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
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Page header — large monochrome */}
      <div className="bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-stone-900 leading-tight">
            All Categories
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-700 max-w-2xl mx-auto">
            Pick a category on the left to browse listings — or use the search bar on the homepage to narrow down by service.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar — Kijiji-style flat list */}
        <aside className="space-y-6">
          {/* What's New (Past 24 Hours) — monochrome */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="bg-stone-900 text-white px-4 py-2 flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <h2 className="font-display font-bold text-base">
                What's New (Past 24h)
              </h2>
            </div>
            {recent.length === 0 ? (
              <p className="px-4 py-3 text-base text-stone-800">
                No new listings in the last 24 hours.
              </p>
            ) : (
              <ul>
                {recent.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/businesses/${b.id}`}
                      className="flex items-start justify-between gap-2 px-4 py-3 border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
                    >
                      <div>
                        <p className="font-semibold text-base line-clamp-1">{b.name}</p>
                        <p className="text-base text-stone-800">{b.city}, {b.province}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-1 text-stone-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* All categories with their subcategories, monochrome */}
          {categories.map((cat) => {
            const catCount = catCounts.find((c) => c.category.slug === cat.slug)?.count ?? 0;
            return (
              <div key={cat.slug} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-stone-200 bg-stone-900 text-white font-display font-bold text-base hover:bg-stone-700"
                >
                  <CategoryIcon category={cat} size="sm" className="!bg-white !text-stone-900" />
                  <span className="flex-1">{cat.name}</span>
                  <span className="font-normal text-base opacity-90">({catCount})</span>
                </Link>
                <ul>
                  {cat.subcategories.map((sub) => {
                    const subCount = subs.find((s) => s.subcategory.slug === sub.slug)?.count ?? 0;
                    return (
                      <li key={sub.slug}>
                        <Link
                          href={`/categories/${cat.slug}/${sub.slug}`}
                          className="flex items-center justify-between px-4 py-2 text-base border-b border-stone-200 last:border-b-0 hover:bg-stone-50"
                        >
                          <span>{sub.name}</span>
                          <span className="text-stone-700 text-base">({subCount})</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* Volunteer CTA — monochrome */}
          <div className="bg-stone-900 text-white border border-stone-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4" />
              <h2 className="font-display font-bold text-base">
                Want to Volunteer?
              </h2>
            </div>
            <p className="text-base mb-3 text-stone-200">
              Give your time, learn new skills, and meet people in your community.
            </p>
            <Link
              href="/categories/volunteer"
              className="inline-block bg-white text-stone-900 px-3 py-2 font-bold text-base border border-stone-900 hover:bg-stone-100"
            >
              Browse volunteer opportunities →
            </Link>
          </div>
        </aside>

        {/* Main — a single "Why this is different" explainer so the
            right side isn't empty when the sidebar is long. */}
        <main className="space-y-6">
          <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
              Why Only For Seniors?
            </h2>
            <p className="mt-2 text-base text-stone-700">
              We built this directory for one reason: to help Canadian seniors and
              their families find trusted local help without the noise.
            </p>
            <ul className="mt-5 space-y-3 text-base text-stone-900">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <BadgeCheck className="w-4 h-4" strokeWidth={2.5} />
                </span>
                <span><strong className="font-display font-bold">Verified businesses.</strong> Every listing is reviewed by a real person before it goes live.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" strokeWidth={2.5} />
                </span>
                <span><strong className="font-display font-bold">No ads, ever.</strong> We never show ads. We never sell your data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-stone-900 text-white rounded-md flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" strokeWidth={2.5} />
                </span>
                <span><strong className="font-display font-bold">Local to you.</strong> Filter by city and province — find help close to home, anywhere in Canada.</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
