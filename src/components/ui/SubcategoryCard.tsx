import Link from "next/link";
import { iconForSlugServer } from "@/components/ui/categoryIcons";
import type { Subcategory } from "@/lib/businesses";

/**
 * Tile-card variant of a subcategory, matching the homepage CategoryCard
 * style: white card, black icon, title, optional count eyebrow, and a
 * plain-language description.
 *
 * Used on the category landing page in place of the previous pill/chip
 * layout so seniors see every subcategory as a clickable tile that
 * mirrors the homepage.
 */
type Props = {
  /** Parent category slug — used to build the link and pick a relevant icon. */
  categorySlug: string;
  /** The subcategory to render. */
  subcategory: Subcategory;
  /** Optional short description (otherwise we fall back to slug-derived copy). */
  description?: string;
  /** Optional business count for the eyebrow. */
  count?: number;
};

export function SubcategoryCard({
  categorySlug,
  subcategory,
  description,
  count,
}: Props) {
  const Icon = iconForSlugServer(categorySlug);
  const blurb =
    description ??
    subcategory.description ??
    `Browse ${subcategory.name.toLowerCase()} services.`;

  return (
    <Link
      href={`/categories/${categorySlug}/${subcategory.slug}/`}
      className="group flex flex-col items-center text-center bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Icon — transparent background, black stroke, matching the
          homepage category cards. */}
      <div className="mb-5">
        <Icon className="w-12 h-12 text-black" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="font-display font-medium text-xl text-black leading-tight">
        {subcategory.name}
      </h3>

      {/* Eyebrow — listing count or generic label */}
      <p className="mt-1.5 text-xs uppercase tracking-wider font-bold text-stone-500">
        {typeof count === "number"
          ? `${count} listing${count === 1 ? "" : "s"}`
          : "Subcategory"}
      </p>

      {/* Description */}
      {blurb ? (
        <p className="mt-4 text-base text-stone-700 leading-relaxed">
          {blurb}
        </p>
      ) : null}
    </Link>
  );
}