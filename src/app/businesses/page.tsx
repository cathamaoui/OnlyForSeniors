import { prisma } from "@/lib/db";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Businesses",
  description: "Browse all senior-friendly businesses across Canada.",
};

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; province?: string; cat?: string }>;
}) {
  const { q, province, cat } = await searchParams;

  const businesses = await prisma.business.findMany({
    where: {
      isPublished: true,
      ...(province ? { province } : {}),
      ...(cat ? { categoryId: cat } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { tagline: { contains: q } },
              { description: { contains: q } },
              { city: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
    take: 100,
  });

  return (
    <div className="yp-paper">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mb-2">
          All Businesses
        </h1>
        <p className="text-lg text-emerald-800 mb-6">
          {businesses.length} senior-friendly business{businesses.length === 1 ? "" : "es"} found.
        </p>

        {businesses.length === 0 ? (
          <div className="card-retro text-center">
            <p className="text-2xl font-display font-black text-emerald-900 mb-2">
              No matches yet.
            </p>
            <p className="text-emerald-800">Try a different search, or browse categories.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b, i) => {
              const avg =
                b.reviews.length > 0
                  ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
                  : undefined;
              return (
                <ScrollReveal key={b.id} delay={i * 0.03}>
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
