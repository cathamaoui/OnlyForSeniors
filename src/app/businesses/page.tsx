import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllBusinesses, getAllCategories } from "@/lib/businesses";
import { BusinessesView } from "@/components/ui/BusinessesView";

export const metadata = {
  title: "All Listings — Only For Seniors",
  description: "Browse every listing on Only For Seniors.",
};

export default function AllBusinessesPage() {
  const businesses = getAllBusinesses();
  const categories = getAllCategories();
  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-display   text-base shadow-sm hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-medium">All Listings</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <BusinessesView businesses={businesses} categories={categories} />
      </div>
    </div>
  );
}
