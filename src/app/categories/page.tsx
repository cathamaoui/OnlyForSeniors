import { prisma } from "@/lib/db";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Categories",
  description: "Browse every senior service category on Only For Seniors.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { businesses: true } } },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-display font-black text-4xl sm:text-5xl text-emerald-900 mb-3">
            All Service Categories
          </h1>
          <p className="text-xl text-emerald-800 max-w-2xl mx-auto">
            The full directory. Tap any tab to explore.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.04}>
              <CategoryCard
                slug={c.slug}
                name={c.name}
                description={c.description}
                icon={c.icon}
                color={c.color}
                businessCount={c._count.businesses}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
