import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllBusinesses, getAllCategories } from "@/lib/businesses";
import { SearchClient } from "@/components/ui/SearchClient";

export const metadata = {
  title: "Search — Only For Seniors",
  description: "Search listings and categories on Only For Seniors.",
};

export default function SearchPage() {
  const businesses = getAllBusinesses();
  const categories = getAllCategories();
  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 text-black font-display text-base hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-medium">Search</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <SearchClient businesses={businesses} categories={categories} />
      </div>
    </div>
  );
}