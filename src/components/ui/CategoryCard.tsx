import Link from "next/link";
import { clsx } from "clsx";

interface CategoryCardProps {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  businessCount?: number;
}

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
      className={clsx(
        "group relative block card-retro",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.85)]"
      )}
      style={{ borderTop: `8px solid ${color}` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-16 h-16 rounded-chunky border-2 border-black
            flex items-center justify-center text-4xl"
          style={{ backgroundColor: color + "22" }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-xl text-emerald-900 leading-tight mb-1">
            {name}
          </h3>
          <p className="text-emerald-800 leading-snug line-clamp-3">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 font-bold text-emerald-800
            group-hover:text-ember-600 transition-colors"
        >
          Browse {name.split(" ")[0]}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
        {typeof businessCount === "number" && (
          <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
            {businessCount} listed
          </span>
        )}
      </div>
      <span className="instruction">
        Tap to open the {name.toLowerCase()} directory
      </span>
    </Link>
  );
}
