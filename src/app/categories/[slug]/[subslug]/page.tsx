import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getSubcategory,
  getBusinessesBySubcategory,
  getAllCategories,
} from "@/lib/businesses";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

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
    <div className="min-h-screen bg-white">
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={`/categories/${slug}`}
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
          >
            <ArrowLeft className="w-4 h-4" /> {category.name}
          </Link>
          <p className="text-base text-stone-700 hidden sm:block">
            {sorted.length} listing{sorted.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Page header — icon, parent category, subcategory */}
      <div className="bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 sm:pt-10 sm:pb-8">
          <div className="flex items-start gap-4">
            <CategoryIcon category={category} size="lg" />
            <div className="min-w-0">
              <p className="text-base font-semibold text-stone-700">
                {category.name}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-stone-900 leading-tight">
                {subcategory.name}
              </h1>
              <p className="mt-2 text-base text-stone-700 sm:hidden">
                {sorted.length} listing{sorted.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-stone-700">
            <span className="font-bold">{sorted.length}</span> listing{sorted.length === 1 ? "" : "s"} in {subcategory.name}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-lg text-stone-900 font-bold">No listings in this sub-category yet.</p>
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
