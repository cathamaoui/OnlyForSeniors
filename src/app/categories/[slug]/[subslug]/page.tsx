import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getSubcategory,
  getBusinessesBySubcategory,
  getAllCategories,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";

export function generateStaticParams() {
  const out: Array<{ slug: string; subslug: string }> = [];
  for (const cat of getAllCategories()) {
    for (const sub of cat.subcategories) {
      out.push({ slug: cat.slug, subslug: sub.slug });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}) {
  const { subslug } = await params;
  const found = getSubcategory(subslug);
  return {
    title: found ? `${found.subcategory.name} — Only For Seniors` : "Subcategory — Only For Seniors",
  };
}

type Search = { [key: string]: string | string[] | undefined };

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}) {
  const { slug, subslug } = await params;
  const found = getSubcategory(subslug);
  if (!found) notFound();
  const { category, subcategory } = found;

  // Static export: always sort newest first.
  const sorted = [...getBusinessesBySubcategory(subslug)].sort((a, b) => {
    const ad = a.dateAdded ? Date.parse(a.dateAdded) : 0;
    const bd = b.dateAdded ? Date.parse(b.dateAdded) : 0;
    return bd - ad;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/categories/${slug}`}
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-yp text-black border-2 border-black font-display uppercase tracking-wide text-sm shadow-yp-sm hover:bg-yellow-300"
          >
            <ArrowLeft className="w-4 h-4" /> {category.name}
          </Link>
          <h1 className="text-xl md:text-2xl font-display font-bold truncate">
            {category.icon} {subcategory.name}
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-stone-700">
            <span className="font-bold">{sorted.length}</span> listing{sorted.length === 1 ? "" : "s"} in {subcategory.name}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-lg p-12 text-center">
            <p className="text-lg text-stone-600">No listings in this sub-category yet.</p>
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
