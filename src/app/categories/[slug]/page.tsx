import { prisma } from "@/lib/db";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await prisma.category.findUnique({ where: { slug } });
  return { title: c?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ province?: string; sub?: string }>;
}) {
  const { slug } = await params;
  const { province, sub } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: { orderBy: { name: "asc" } },
    },
  });
  if (!category) notFound();

  const businesses = await prisma.business.findMany({
    where: {
      categoryId: category.id,
      isPublished: true,
      ...(province ? { province } : {}),
      ...(sub ? { subcategoryId: sub } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-emerald-800 font-bold
            hover:text-ember-600 mb-4 min-h-touch"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          All categories
        </Link>

        <div
          className="rounded-chunky border-4 border-black p-6 sm:p-8 mb-8
            bg-cream-50"
          style={{ borderTop: `12px solid ${category.color}` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-20 h-20 rounded-chunky border-2 border-black
                flex items-center justify-center text-5xl"
              style={{ backgroundColor: category.color + "22" }}
              aria-hidden="true"
            >
              {category.icon}
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mb-2">
                {category.name}
              </h1>
              <p className="text-lg text-emerald-800 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategory filter chips */}
        {category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="field-label">Filter by subcategory</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/categories/${slug}`}
                className={`min-h-touch px-4 py-2 rounded-chunky border-2 border-black
                  font-bold text-base ${
                    !sub ? "bg-emerald-700 text-white" : "bg-cream-50 text-emerald-900 hover:bg-cream-100"
                  }`}
              >
                All ({businesses.length})
              </Link>
              {category.subcategories.map((s) => (
                <Link
                  key={s.id}
                  href={`/categories/${slug}?sub=${s.id}`}
                  className={`min-h-touch px-4 py-2 rounded-chunky border-2 border-black
                    font-bold text-base ${
                      sub === s.id
                        ? "bg-emerald-700 text-white"
                        : "bg-cream-50 text-emerald-900 hover:bg-cream-100"
                    }`}
                >
                  {s.name}
                </Link>
              ))}
            </div>
            <span className="instruction">
              Tap a subcategory to narrow down the list
            </span>
          </div>
        )}

        {/* Results */}
        {businesses.length === 0 ? (
          <div className="card-retro text-center">
            <p className="text-2xl font-display font-black text-emerald-900 mb-2">
              No businesses listed here yet.
            </p>
            <p className="text-emerald-800 mb-4">
              Know a great senior-friendly business? Be the first to add it!
            </p>
            <Link href="/list-business" className="btn-ember">
              List Your Business
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b, i) => {
              const avg =
                b.reviews.length > 0
                  ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
                  : undefined;
              return (
                <ScrollReveal key={b.id} delay={i * 0.04}>
                  <BusinessCard
                    slug={b.slug}
                    name={b.name}
                    tagline={b.tagline}
                    city={b.city}
                    province={b.province}
                    categoryName={b.category.name}
                    rating={avg}
                    reviewCount={b.reviews.length}
                    isVerified={b.isVerified}
                    isFeatured={b.isFeatured}
                    priceRange={b.priceRange}
                    phone={b.phone}
                    logoUrl={b.logoUrl}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
