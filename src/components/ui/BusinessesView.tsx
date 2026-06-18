"use client";
import { useState, useMemo } from "react";
import { Business, Category } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { Filter, X } from "lucide-react";

type Props = {
  businesses: Business[];
  categories: Category[];
};

export function BusinessesView({ businesses, categories }: Props) {
  const [q, setQ] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const filtered = useMemo(() => {
    let out = businesses;
    if (q.trim()) {
      const needle = q.toLowerCase().trim();
      out = out.filter((b) =>
        [b.name, b.tagline, b.description, b.city, b.province, ...(b.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
    }
    if (categorySlug) {
      out = out.filter((b) => b.categorySlug === categorySlug);
    }
    return out;
  }, [businesses, q, categorySlug]);

  const hasFilters = q.trim() !== "" || categorySlug !== "";

  return (
    <div>
      <div className="bg-white border-2 border-black rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" />
          <h2 className="font-display font-bold">Filter</h2>
          {hasFilters && (
            <button
              onClick={() => {
                setQ("");
                setCategorySlug("");
              }}
              className="ml-auto text-sm text-blue-700 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search listings..."
            className="w-full px-3 py-2 border-2 border-black rounded"
          />
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full px-3 py-2 border-2 border-black rounded bg-white"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-stone-700 mb-4">
        <span className="font-bold">{filtered.length}</span> listing{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-black rounded-lg p-12 text-center text-stone-600">
          <p className="text-lg">No listings match your filters.</p>
          <p className="text-sm mt-2">Try a different category or clear the search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </div>
  );
}
