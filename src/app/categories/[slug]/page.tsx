import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Newspaper, Clock } from "lucide-react";
import {
  getCategoryBySlug,
  getBusinessesByCategory,
  getAllBusinesses,
  getAllCategories,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

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
        <div className="border-b-2 border-black bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/categories/"
              className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-semibold   text-base hover:bg-stone-50"
            >
              <ArrowLeft className="w-4 h-4" /> All Categories
            </Link>
            <h1 className="text-xl md:text-2xl font-display font-bold truncate flex items-center gap-2">
              <Newspaper className="w-6 h-6" /> What&apos;s New
            </h1>
            <div className="w-24 hidden md:block" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white border-2 border-black rounded-lg p-5 flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 shrink-0 text-blue-700" />
            <div>
              <p className="font-semibold text-stone-900">
                Today&apos;s feed — {todayLabel()}
              </p>
              <p className="text-base text-stone-800 mt-1">
                Everything new or updated across the directory in the last 24 hours.
                Listings appear in reverse chronological order.
              </p>
            </div>
          </div>

          <p className="text-stone-700">
            <span className="font-bold">{feed.length}</span> recent update{feed.length === 1 ? "" : "s"}
          </p>

          {feed.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-12 text-center">
              <p className="text-lg text-stone-800">No new listings today.</p>
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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/categories/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-semibold   text-base hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-bold truncate">
            {cat.icon} {cat.name}
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Subcategory chips */}
        {cat.subcategories.length > 0 && (
          <div className="bg-white border-2 border-black rounded-lg p-4">
            <h2 className="font-display font-bold text-base   mb-3 text-stone-800">
              Browse by sub-category
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/categories/${cat.slug}`}
                className="px-3 py-2 text-base bg-black text-white border-2 border-black font-bold"
              >
                All
              </Link>
              {cat.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/categories/${cat.slug}/${sub.slug}`}
                  className="px-3 py-2 text-base bg-white text-black border-2 border-black hover:bg-stone-50"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sort + count */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-stone-700">
            <span className="font-bold">{sorted.length}</span> listing{sorted.length === 1 ? "" : "s"} in this category
          </p>
        </div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-lg p-12 text-center">
            <p className="text-lg text-stone-800">No listings in this category yet.</p>
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
