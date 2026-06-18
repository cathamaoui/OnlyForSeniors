import Link from "next/link";
import { Star, MapPin, Phone, BadgeCheck } from "lucide-react";

interface BusinessCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
  city: string;
  province: string;
  categoryName: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  priceRange?: string | null;
  logoUrl?: string | null;
}

export function BusinessCard({
  slug,
  name,
  tagline,
  city,
  province,
  categoryName,
  rating,
  reviewCount,
  isVerified,
  isFeatured,
  priceRange,
  logoUrl,
}: BusinessCardProps) {
  return (
    <Link
      href={`/businesses/${slug}`}
      className="group block card-retro hover:-translate-y-1
        hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.85)] transition-all"
    >
      {isFeatured && (
        <div className="inline-block bg-ember-600 text-white text-xs font-black
          uppercase tracking-wider px-2 py-1 rounded-chunky mb-2 border-2 border-black">
          ⭐ Featured
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-16 h-16 bg-emerald-100 border-2 border-black
          rounded-chunky flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl" aria-hidden="true">🏬</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-black text-xl text-emerald-900 leading-tight
            flex items-center gap-2 flex-wrap">
            {name}
            {isVerified && (
              <BadgeCheck
                className="w-5 h-5 text-emerald-600 shrink-0"
                aria-label="Verified business"
              />
            )}
          </h3>
          {tagline && (
            <p className="text-emerald-800 text-sm leading-snug mt-1 line-clamp-2">
              {tagline}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-emerald-800">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {city}, {province}
            </span>
            <span className="inline-block bg-cream-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
              {categoryName}
            </span>
            {priceRange && (
              <span className="font-bold text-ember-700">{priceRange}</span>
            )}
          </div>
          {rating && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-ember-500 text-ember-500" aria-hidden="true" />
              <span className="font-bold">{rating.toFixed(1)}</span>
              {reviewCount && <span className="text-emerald-700">({reviewCount} reviews)</span>}
            </div>
          )}
        </div>
      </div>
      <span className="instruction">
        Tap to view full details, hours, and contact info
      </span>
    </Link>
  );
}
