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
  phone?: string | null;
  logoUrl?: string | null;
}

/**
 * Yellow-Pages style business listing card.
 * Mimics the classic format: company name, services listed, BIG phone number.
 */
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
  phone,
  logoUrl,
}: BusinessCardProps) {
  return (
    <Link
      href={`/businesses/${slug}`}
      className="group relative block bg-paper border-2 border-black
        transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5
        shadow-yp hover:shadow-yp-lg"
    >
      {/* Featured display-ad strip */}
      {isFeatured && (
        <div
          className="px-2 py-1 bg-black text-yp-500 text-xs uppercase tracking-widest
            text-center border-b-2 border-black font-bold"
        >
          ⭐ Featured Display Listing
        </div>
      )}

      <div className="p-4">
        {/* Company name + verified badge */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className="shrink-0 w-12 h-12 bg-yp-500 border-2 border-black
              flex items-center justify-center overflow-hidden"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl" aria-hidden="true">🏬</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl text-black leading-tight
              flex items-center gap-1 flex-wrap">
              {name}
              {isVerified && (
                <BadgeCheck
                  className="w-5 h-5 text-black shrink-0"
                  aria-label="Verified business"
                />
              )}
            </h3>
            {tagline && (
              <p className="text-black text-sm leading-snug mt-0.5 line-clamp-2">
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Location bar */}
        <div className="bg-yp-500 border border-black px-2 py-1 mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="inline-flex items-center gap-1 font-bold text-black">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {city}, {province}
          </span>
          <span className="text-black/50">·</span>
          <span className="font-bold text-black uppercase tracking-wide text-xs">
            {categoryName}
          </span>
          {priceRange && (
            <>
              <span className="text-black/50">·</span>
              <span className="font-bold text-black">{priceRange}</span>
            </>
          )}
        </div>

        {/* BIG phone number - the focal point of a YP listing */}
        {phone && (
          <div
            className="bg-black text-yp-500 px-3 py-2 border-2 border-black
              font-display text-2xl tracking-wider text-center"
          >
            <Phone className="w-5 h-5 inline mr-2 -mt-0.5" aria-hidden="true" />
            {phone}
          </div>
        )}

        {/* Reviews line */}
        {rating !== undefined && rating > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-4 h-4 ${
                  n <= Math.round(rating) ? "fill-black text-black" : "text-black/20"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="font-bold ml-1 text-black">{rating.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-black/60">({reviewCount} reviews)</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-black/20 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-black font-bold">
            See Full Listing
          </span>
          <span
            className="text-black text-lg transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
