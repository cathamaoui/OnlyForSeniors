import Link from "next/link";
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react";
import { getAllBusinesses, getAllCategories, getCategoryCounts } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

export const metadata = {
  title: "All Listings — Only For Seniors",
  description: "Browse every listing on Only For Seniors.",
};

type Search = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AllBusinessesPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").toLowerCase().trim();
  const catRaw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const sortRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const sort = sortRaw === "oldest" ? "oldest" : "newest";

  const all = getAllBusinesses();
  const cats = getAllCategories();
  const catCounts = getCategoryCounts();

  let filtered = all;
  if (q) {
    filtered = filtered.filter((b) =>
      [b.name, b.tagline, b.description, b.city, b.province, ...(b.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  if (catRaw) {
    filtered = filtered.filter((b) => b.categorySlug === catRaw);
  }
  const sorted = [...filtered].sort((a, b) => {
    const ad = a.dateAdded ? Date.parse(a.dateAdded) : 0;
    const bd = b.dateAdded ? Date.parse(b.dateAdded) : 0;
    return sort === "newest" ? bd - ad : ad - bd;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-yp text-black border-2 border-black font-display uppercase tracking-wide text-sm shadow-yp-sm hover:bg-yellow-300"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-bold">All Listings</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar — category filter */}
        <aside className="bg-white border-2 border-black rounded-lg p-4 h-fit">
          <h2 className="flex items-center gap-2 font-display font-bold mb-3">
            <Filter className="w-4 h-4" /> Filter
          </h2>
          <form method="GET" className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1 text-stone-600 uppercase">Search</label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="e.g. 'snow removal'"
                className="w-full px-3 py-2 border-2 border-black rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-stone-600 uppercase">Category</label>
              <select
                name="category"
                defaultValue={catRaw ?? ""}
                className="w-full px-3 py-2 border-2 border-black rounded bg-white"
              >
                <option value="">All categories</option>
                {cats.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 bg-black text-yp border-2 border-black font-display font-bold hover:bg-stone-900"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Main */}
        <main>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <p className="text-stone-700">
              <span className="font-bold">{sorted.length}</span> listing{sorted.length === 1 ? "" : "s"}
              {q && <span> matching "<strong>{q}</strong>"</span>}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              <span className="text-stone-600">Sort:</span>
              <Link
                href={`/businesses${q || catRaw ? `?${new URLSearchParams({ ...(q && { q }), ...(catRaw && { category: catRaw }), sort: "newest" }).toString()}` : "?sort=newest"}`}
                className={`px-3 py-1.5 border-2 border-black ${sort === "newest" ? "bg-black text-yp font-bold" : "bg-white hover:bg-yp"}`}
              >
                Newest
              </Link>
              <Link
                href={`/businesses${q || catRaw ? `?${new URLSearchParams({ ...(q && { q }), ...(catRaw && { category: catRaw }), sort: "oldest" }).toString()}` : "?sort=oldest"}`}
                className={`px-3 py-1.5 border-2 border-black ${sort === "oldest" ? "bg-black text-yp font-bold" : "bg-white hover:bg-yp"}`}
              >
                Oldest
              </Link>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-12 text-center">
              <p className="text-lg text-stone-600">No listings match your filters.</p>
              <Link href="/businesses" className="inline-block mt-3 text-blue-700 hover:underline font-bold">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
