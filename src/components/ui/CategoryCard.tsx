import Link from "next/link";

interface CategoryCardProps {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  businessCount?: number;
}

/**
 * Yellow-Pages style category card.
 * - Black-on-yellow section header (mimics YP column header)
 * - White paper background for the body
 * - Sharp corners, thick black borders
 */
export function CategoryCard({
  slug,
  name,
  description,
  icon,
  color,
  businessCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block bg-paper border-2 border-black
        transition-transform duration-200
        hover:-translate-x-0.5 hover:-translate-y-0.5
        shadow-yp hover:shadow-yp-lg"
    >
      {/* Section header - black with colored stripe */}
      <div className="flex items-stretch border-b-2 border-black">
        <div
          className="w-2"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="flex-1 flex items-center gap-2 bg-black text-yp-500 px-3 py-2">
          <span className="text-xl" aria-hidden="true">{icon}</span>
          <h3 className="font-display text-base sm:text-lg uppercase tracking-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Listing count line */}
      <div className="px-3 py-1.5 bg-yp-500 text-black text-xs uppercase tracking-wider border-b border-black/30 font-bold">
        {typeof businessCount === "number" ? (
          businessCount === 0
            ? "No listings yet"
            : `${businessCount} ${businessCount === 1 ? "Listing" : "Listings"} In This Section`
        ) : (
          "Browse this section"
        )}
      </div>

      {/* Description */}
      <div className="p-3">
        <p className="text-black text-sm leading-snug line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer with "see section" CTA */}
      <div className="px-3 py-2 bg-yp-500 border-t-2 border-black
        flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-black font-bold">
          Open Section
        </span>
        <span
          className="text-black text-lg transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}
