import Link from "next/link";
import { iconForSlugServer } from "@/components/ui/categoryIcons";
import type { Category } from "@/lib/businesses";

/**
 * Taste-skill-style category tile. Used on the homepage to surface every
 * category as a clickable card matching the brand's "skills" pattern:
 *
 *   ┌──────────────────────────────┐
 *   │           [icon]             │
 *   │                              │
 *   │   Home Care                  │
 *   │   DAILY LIVING               │
 *   │   Verified caregivers,       │
 *   │   meal services, and         │
 *   │   companionship help.        │
 *   └──────────────────────────────┘
 *
 * Black icon tile at top, display-serif title, small uppercase eyebrow,
 * short description.
 */
type Props = {
  category: Category;
  /** Short marketing line shown below the title. */
  description?: string;
};

export function CategoryCard({ category, description }: Props) {
  const Icon = iconForSlugServer(category.slug);
  const subCount = category.subcategories?.length ?? 0;
  return (
    <Link
      href={`/categories/${category.slug}/`}
      className="group flex flex-col items-center text-center bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Icon — transparent background, black stroke. No tile, no border. */}
      <div className="mb-5">
        <Icon className="w-12 h-12 text-black" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="font-display font-medium text-xl text-black leading-tight">
        {category.name}
      </h3>

      {/* Eyebrow — subcategory count */}
      <p className="mt-1.5 text-xs uppercase tracking-wider font-bold text-stone-500">
        {subCount > 0 ? `${subCount} service${subCount === 1 ? "" : "s"}` : "Category"}
      </p>

      {/* Description (optional) — clamped to 3 lines so cards stay
          scannable on mobile. Full text is in the category description. */}
      {description ? (
        <p className="mt-4 text-base text-stone-700 leading-relaxed line-clamp-3">
          {description}
        </p>
      ) : category.description ? (
        <p className="mt-4 text-base text-stone-700 leading-relaxed line-clamp-3">
          {category.description}
        </p>
      ) : null}
    </Link>
  );
}