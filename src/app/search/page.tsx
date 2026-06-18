import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getAllBusinesses, getAllCategories } from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { SearchClient } from "@/components/ui/SearchClient";

export const metadata = {
  title: "Search — Only For Seniors",
  description: "Search listings on Only For Seniors.",
};

export default function SearchPage() {
  const businesses = getAllBusinesses();
  const categories = getAllCategories();
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-display   text-base shadow-sm hover:bg-stone-100"
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
            <Search className="w-5 h-5 text-stone-800" />
            <input
              type="text"
              name="q"
              placeholder="Search listings..."
              className="flex-1 min-h-touch px-3 py-3 text-lg outline-none"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-black border-2 border-black rounded-lg font-display font-bold text-lg hover:bg-stone-900"
          >
            Search
          </button>
        </form>

        <SearchClient businesses={businesses} categories={categories} />
      </div>
    </div>
  );
}
