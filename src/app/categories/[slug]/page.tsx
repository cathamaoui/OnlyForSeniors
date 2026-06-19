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
import { SubcategoryCard } from "@/components/ui/SubcategoryCard";
import { getSubcategoryBlurb } from "@/lib/subcategoryBlurbs";

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
      <div className="min-h-screen bg-cream">
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/categories/"
              className="inline-flex items-center gap-2 min-h-touch text-base font-semibold text-stone-800 hover:text-black hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
            <p className="text-base text-stone-700">
              {feed.length} update{feed.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Page header */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
            <div className="flex items-start gap-4">
              <Newspaper className="w-14 h-14 text-black flex-shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-black leading-tight">
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
          <div className="bg-white rounded-2xl p-5 flex items-start gap-3 shadow-sm">
            <Clock className="w-5 h-5 mt-0.5 shrink-0 text-black" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-black">
                Today&apos;s feed — {todayLabel()}
              </p>
              <p className="text-base text-stone-700 mt-1">
                Listings appear in reverse chronological order.
              </p>
            </div>
          </div>

          {feed.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <p className="text-lg text-black font-bold">No new listings today.</p>
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
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/categories/"
            className="inline-flex items-center gap-2 min-h-touch text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          <p className="text-base text-stone-700 hidden sm:block">
            {sorted.length} listing{sorted.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Page header — icon, title, optional description */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
          <div className="flex items-start gap-4">
            <CategoryIcon category={cat} size="lg" />
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-black leading-tight">
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
        {/* Subcategory tile cards — mirror the homepage layout so seniors
            get a consistent pattern across the site. */}
        {cat.subcategories.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-black mb-4 sm:mb-6">
              Browse{" "}
              <span className="italic font-display font-medium text-black">
                {cat.name.toLowerCase()}.
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {cat.subcategories.map((sub) => {
                const count = subCount(sub.slug);
                return (
                  <SubcategoryCard
                    key={sub.slug}
                    categorySlug={cat.slug}
                    subcategory={sub}
                    count={count}
                    description={getSubcategoryBlurb(cat.slug, sub.slug)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Listings grid */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-lg text-black font-bold">No listings in this category yet.</p>
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
