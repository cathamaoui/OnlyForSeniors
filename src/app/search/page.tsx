import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getAllBusinesses, getAllCategories } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

export const metadata = {
  title: "Search — Only For Seniors",
  description: "Search listings on Only For Seniors.",
};

type Search = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").trim();

  const all = getAllBusinesses();
  const cats = getAllCategories();

  const matches = q
    ? all.filter((b) =>
        [b.name, b.tagline, b.description, b.city, b.province, ...(b.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : all;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-yp text-black border-2 border-black font-display uppercase tracking-wide text-sm shadow-yp-sm hover:bg-yellow-300"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-bold">Search</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center bg-white border-2 border-black rounded-lg px-3">
            <Search className="w-5 h-5 text-stone-600" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search listings..."
              className="flex-1 min-h-touch px-3 py-3 text-lg outline-none"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-yp border-2 border-black rounded-lg font-display font-bold text-lg hover:bg-stone-900"
          >
            Search
          </button>
        </form>

        <p className="text-stone-700">
          {q ? (
            <>
              <span className="font-bold">{matches.length}</span> result{matches.length === 1 ? "" : "s"} for "<strong>{q}</strong>"
            </>
          ) : (
            <>Showing all {matches.length} listings. Try searching for "physiotherapy", "snow removal", "pharmacy"…</>
          )}
        </p>

        {matches.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-lg p-12 text-center text-stone-600">
            <p className="text-lg">No listings match your search.</p>
            <p className="text-sm mt-2">Try a different word, or browse a category.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {cats.slice(0, 6).map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="px-3 py-2 text-sm bg-yp border-2 border-black hover:bg-yellow-300"
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
      </div>
    </div>
  );
}
