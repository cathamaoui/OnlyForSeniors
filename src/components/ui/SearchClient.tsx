"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Business, Category } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

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

  const matches = useMemo(() => {
    if (!q.trim()) return businesses;
    const needle = q.toLowerCase().trim();
    return businesses.filter((b) =>
      [b.name, b.tagline, b.description, b.city, b.province, ...(b.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [businesses, q]);

  return (
    <>
      <p className="text-base text-stone-800">
        {q ? (
          <>
            <span className="font-bold">{matches.length}</span> result{matches.length === 1 ? "" : "s"} for "<strong>{q}</strong>"
          </>
        ) : (
          <>
            Showing all {matches.length} listings. Type to search, e.g. "physiotherapy", "snow removal", "pharmacy"…
          </>
        )}
      </p>

      {/* Live search input (replaces the form above) */}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Live search…"
        className="w-full px-4 py-3 border-2 border-black rounded text-lg"
      />

      {matches.length === 0 ? (
        <div className="bg-white border-2 border-stone-500 rounded-lg p-12 text-center text-stone-800">
          <p className="text-lg">No listings match your search.</p>
          <p className="text-base mt-2">Try a different word, or browse a category.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}/`}
                className="px-3 py-2 text-base bg-white border-2 border-black hover:bg-stone-100"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </>
  );
}
