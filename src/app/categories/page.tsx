import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Back to home button - large and obvious for seniors */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-touch px-4 py-2
            bg-black text-yp-500 border-2 border-black
            hover:bg-yp-500 hover:text-black
            font-display uppercase tracking-wider text-base mb-6
            shadow-yp-sm"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mb-10 text-center">
          <div className="inline-block bg-black text-yp-500 px-3 py-1.5
            border-2 border-black uppercase tracking-widest text-sm mb-3">
            <BookOpen className="w-4 h-4 inline mr-1" aria-hidden="true" />
            All Sections
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-black mb-3">
            All Service Categories
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            The full directory. Tap any section to explore its listings.
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

        {/* Bottom back link too */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-5 py-3
              bg-yp-500 text-black border-2 border-black
              hover:bg-yp-600 font-display uppercase tracking-wider text-base
              shadow-yp"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Back to Home
          </Link>
          <p className="instruction">
            Or tap the YP logo in the top-left corner at any time
          </p>
        </div>
      </div>
    </div>
  );
}
