import { prisma } from "@/lib/db";
import { BusinessCard } from "@/components/ui/BusinessCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search",
  description: "Search senior-friendly businesses across Canada.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; province?: string }>;
}) {
  const { q, province } = await searchParams;
  const query = q?.trim() ?? "";

  const results = await prisma.business.findMany({
    where: {
      isPublished: true,
      ...(province ? { province } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { tagline: { contains: query } },
              { description: { contains: query } },
              { city: { contains: query } },
              { category: { name: { contains: query } } },
              { subcategory: { name: { contains: query } } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
    take: 50,
  });

  return (
    <div className="yp-paper">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mb-2">
          {query ? `Results for &quot;${query}&quot;` : "Search the Directory"}
        </h1>
        <p className="text-lg text-emerald-800 mb-6">
          {results.length} match{results.length === 1 ? "" : "es"}.
        </p>

        <form action="/search" method="get" className="card-retro mb-8" role="search">
          <label htmlFor="search-q" className="field-label">
            What are you looking for?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="search-q"
              name="q"
              type="search"
              defaultValue={query}
              className="field-input flex-1"
              placeholder="e.g. snow removal, ride to doctor, grocery delivery"
            />
            <select
              name="province"
              defaultValue={province ?? ""}
              className="field-input sm:w-48"
            >
              <option value="">All of Canada</option>
              <option value="ON">Ontario</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="QC">Quebec</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
              <option value="NS">Nova Scotia</option>
              <option value="NB">New Brunswick</option>
              <option value="PE">PEI</option>
              <option value="NL">Newfoundland</option>
            </select>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
          <span className="instruction">
            Tip: be specific — try &quot;wheelchair-accessible dentist&quot; or &quot;home snow removal&quot;.
          </span>
        </form>

        {results.length === 0 ? (
          <div className="card-retro text-center">
            <p className="text-2xl font-display font-black text-emerald-900 mb-2">
              No matches.
            </p>
            <p className="text-emerald-800 mb-4">
              Try different words, or browse our{" "}
              <Link href="/categories" className="text-ember-600 font-bold underline">
                categories
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((b, i) => {
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
