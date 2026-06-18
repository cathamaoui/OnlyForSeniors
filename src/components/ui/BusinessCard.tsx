import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, BadgeCheck } from "lucide-react";
import { Business, getSubcategory } from "@/lib/businesses";
import { SaveButton } from "./SaveButton";

type Props = {
  business: Business;
};

export function BusinessCard({ business }: Props) {
  const sub = getSubcategory(business.subcategorySlug);

  return (
    <Link
      href={`/businesses/${business.id}`}
      className="group flex flex-col bg-white border-2 border-black rounded-lg overflow-hidden transition-all duration-150 hover:shadow-lg hover:border-blue-700 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-stone-100 border-b-2 border-black">
        <Image
          src={business.image}
          alt={business.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        {business.isFeatured && (
          <span className="absolute top-2 left-2 bg-white text-black text-base font-bold px-2 py-1 rounded border border-black">
            Featured
          </span>
        )}
        {/* Nudge arrow -- appears on hover to signal clickability */}
        <span
          className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/95 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          <ArrowUpRight className="w-4 h-4 text-black" strokeWidth={2.5} />
        </span>
        <SaveButton />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-normal group-hover:text-blue-700 line-clamp-2">
            {business.name}
          </h3>
          {business.isVerified && (
            <BadgeCheck
              className="w-5 h-5 text-emerald-700 flex-shrink-0"
              aria-label="Verified"
            />
          )}
        </div>
        {business.tagline && (
          <p className="text-base text-stone-700 line-clamp-2">
            {business.tagline}
          </p>
        )}
        <div className="flex items-center gap-1 text-base text-stone-800 flex-wrap">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {business.city}, {business.province}
          </span>
          {sub && (
            <>
              <span>·</span>
              <span>{sub.subcategory.name}</span>
            </>
          )}
        </div>
        {business.rating !== undefined && (
          <div className="flex items-center gap-1 text-base">
            <Star className="w-4 h-4 fill-stone-900 stroke-black" />
            <span className="font-semibold">{business.rating.toFixed(1)}</span>
            {business.reviewCount !== undefined && (
              <span className="text-stone-800">({business.reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
