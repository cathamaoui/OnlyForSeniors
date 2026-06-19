"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Business, Category } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { SubcategoryCard } from "@/components/ui/SubcategoryCard";
import { searchEverything } from "@/lib/search";
import { getSubcategoryBlurb } from "@/lib/subcategoryBlurbs";

type Props = {
  businesses: Business[];
  categories: Category[];
};

export function SearchClient({ businesses, categories }: Props) {
  const [q, setQ] = useState("");

  // Read initial query from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initial = params.get("q");
      if (initial) setQ(initial);
    }
  }, []);

  const results = useMemo(
    () => searchEverything(q, categories, businesses),
    [q, categories, businesses]
  );

  const hasAnyResults =
    results.categoryHits.length > 0 ||
    results.subcategoryHits.length > 0 ||
    results.businessHits.length > 0;

  return (
    <>
      {/* Live search input — pre-filled with the URL ?q= and editable.
          The wrapper is a single pill, the input itself has no background
          so the white of the pill shows through cleanly. min-h-touch on
          the wrapper keeps it tall enough for senior fingers. */}
      <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center bg-white border-2 border-stone-900 rounded-full min-h-touch px-4">
          <Search className="w-5 h-5 text-stone-700 flex-shrink-0" strokeWidth={2} />
          <input
            type="text"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by keyword or describe what you need…"
            aria-label="Search listings and categories"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 px-3 py-2 text-lg outline-none bg-transparent w-full"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white border-2 border-black rounded-full font-display font-medium text-lg hover:bg-stone-800 min-h-touch"
        >
          Search
        </button>
      </form>

      {/* No query yet — show all listings + all categories */}
      {!q.trim() && (
        <>
          <p className="text-base text-stone-700">
            Showing all {businesses.length} listings. Try a keyword like{" "}
            <em>physiotherapy</em>, <em>handyman</em>, <em>cleaning</em>, or{" "}
            <em>travel</em>.
          </p>

          <section className="pt-4">
            <h2 className="text-2xl font-display font-medium text-black mb-4">
              Browse all categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {categories
                .filter((c) => !c.isNews)
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <CategoryCard key={c.slug} category={c} />
                ))}
            </div>
          </section>

          {businesses.length > 0 && (
            <section className="pt-6">
              <h2 className="text-2xl font-display font-medium text-black mb-4">
                All listings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Active query — show results */}
      {q.trim() && (
        <>
          {/* Confidence callout — when intent matcher is confident */}
          {results.hasTopMatch && results.topCategory && (
            <section className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border-2 border-stone-900">
              <p className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-2">
                Best match for &ldquo;{q}&rdquo;
              </p>
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-display font-medium text-black leading-tight">
                    {results.topCategory.name}
                  </h2>
                  <p className="mt-2 text-base text-stone-700">
                    Try this category — it matches what you described.
                  </p>
                </div>
                <Link
                  href={`/categories/${results.topCategory.slug}/`}
                  className="inline-flex items-center gap-2 min-h-touch px-5 py-3 bg-black text-white rounded-full font-display font-medium text-lg hover:bg-stone-800 flex-shrink-0"
                >
                  Open category
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>
          )}

          {/* Subcategories that matched */}
          {results.subcategoryHits.length > 0 && (
            <section className="pt-2">
              <h2 className="text-2xl font-display font-medium text-black mb-4">
                {results.hasTopMatch ? "Also matches" : "Closest categories"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {results.subcategoryHits.slice(0, 6).map((hit) => (
                  <SubcategoryCard
                    key={`${hit.category.slug}-${hit.subcategory.slug}`}
                    categorySlug={hit.category.slug}
                    subcategory={hit.subcategory}
                    description={getSubcategoryBlurb(
                      hit.category.slug,
                      hit.subcategory.slug
                    )}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Businesses that matched */}
          {results.businessHits.length > 0 && (
            <section className="pt-2">
              <h2 className="text-2xl font-display font-medium text-black mb-4">
                Listings ({results.businessHits.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.businessHits.map((hit) => (
                  <BusinessCard key={hit.business.id} business={hit.business} />
                ))}
              </div>
            </section>
          )}

          {/* Fallback — no category, subcategory, or business matched */}
          {!hasAnyResults && (
            <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 text-center border-2 border-stone-200">
              <Search className="w-10 h-10 mx-auto text-stone-400 mb-4" strokeWidth={1.5} />
              <p className="text-xl text-black font-display font-medium">
                No matches for &ldquo;{q}&rdquo;
              </p>
              <p className="text-base text-stone-700 mt-2 max-w-xl mx-auto">
                Try a single keyword (e.g. <em>physio</em>, <em>travel</em>,{" "}
                <em>rides</em>), or browse all categories below.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {categories
                  .filter((c) => !c.isNews)
                  .slice(0, 8)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}/`}
                      className="px-3 py-2 text-base text-black hover:underline underline-offset-4"
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}