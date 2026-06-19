import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Newspaper, Clock } from "lucide-react";
import {
  getCategoryBySlug,
  getBusinessesByCategory,
  getAllBusinesses,
  getAllCategories,
  getAllSubcategoriesWithCounts,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

function todayLabel() {
  return new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  return {
    title: cat ? `${cat.name} — Only For Seniors` : "Category — Only For Seniors",
    description: cat ? `Browse ${cat.name} on Only For Seniors.` : undefined,
  };
}

type Search = { [key: string]: string | string[] | undefined };

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  // News is a special route — it acts as a feed of everything posted or
  // changed in the past 24 hours, across all categories.
  if (slug === "news") {
    const feed = [...getAllBusinesses()].reverse();
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/categories/"
              className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
            >
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
            <p className="text-base text-stone-700">
              {feed.length} update{feed.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Page header */}
        <div className="bg-stone-50">
          <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg flex-shrink-0">
                <Newspaper className="w-6 h-6" strokeWidth={2.25} />
              </span>
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-stone-900 leading-tight">
                  What&apos;s New
                </h1>
                <p className="mt-2 text-base sm:text-lg text-stone-700 max-w-2xl">
                  Everything new or updated across the directory in the last 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 shrink-0 text-stone-700" />
            <div>
              <p className="font-semibold text-stone-900">
                Today&apos;s feed — {todayLabel()}
              </p>
              <p className="text-base text-stone-700 mt-1">
                Listings appear in reverse chronological order.
              </p>
            </div>
          </div>

          {feed.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
              <p className="text-lg text-stone-900 font-bold">No new listings today.</p>
              <p className="text-base text-stone-700 mt-2">Check back tomorrow.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {feed.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal category page. Static export: always sort newest first.
  const sorted = [...getBusinessesByCategory(slug)].sort((a, b) => {
    const ad = a.dateAdded ? Date.parse(a.dateAdded) : 0;
    const bd = b.dateAdded ? Date.parse(b.dateAdded) : 0;
    return bd - ad;
  });

  // Build a subcategory → count lookup so we can show counts on the chips.
  const subs = getAllSubcategoriesWithCounts();
  const subCount = (subSlug: string) =>
    subs.find((s) => s.subcategory.slug === subSlug)?.count ?? 0;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar — Back link + category name */}
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/categories/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          <p className="text-base text-stone-700 hidden sm:block">
            {sorted.length} listing{sorted.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Page header — icon, title, optional description */}
      <div className="bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
          <div className="flex items-start gap-4">
            <CategoryIcon category={cat} size="lg" />
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-stone-900 leading-tight">
                {cat.name}
              </h1>
              {cat.description && (
                <p className="mt-2 text-base sm:text-lg text-stone-700 max-w-2xl">
                  {cat.description}
                </p>
              )}
              <p className="mt-2 text-base text-stone-700 sm:hidden">
                {sorted.length} listing{sorted.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Subcategory chips — clean monochrome, with counts on the right */}
        {cat.subcategories.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="font-display font-bold text-base mb-3 text-stone-800">
              Browse by sub-category
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/categories/${cat.slug}`}
                className="px-3 py-2 text-base bg-stone-900 text-white border border-stone-900 font-bold rounded-full"
              >
                All ({sorted.length})
              </Link>
              {cat.subcategories.map((sub) => {
                const count = subCount(sub.slug);
                return (
                  <Link
                    key={sub.slug}
                    href={`/categories/${cat.slug}/${sub.slug}`}
                    className="px-3 py-2 text-base bg-white text-stone-900 border border-stone-200 rounded-full hover:bg-stone-50 hover:border-stone-900"
                  >
                    {sub.name}
                    {count > 0 && (
                      <span className="ml-2 text-stone-500">({count})</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Listings grid */}
        {sorted.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <p className="text-lg text-stone-900 font-bold">No listings in this category yet.</p>
            <p className="text-base text-stone-700 mt-2">Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
