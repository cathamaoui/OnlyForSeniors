import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Sparkles, Tag, Calendar } from "lucide-react";
import { Event, formatEventDate, formatEventTimeRange } from "@/lib/events";
import { getSubcategory } from "@/lib/businesses";

type Props = {
  event: Event;
  /** "list" = card with image on top; "inline" = compact row. */
  variant?: "list" | "inline";
};

/**
 * Renders a single event.
 *
 * Boosted events get a gold border, a "Featured" pill, and are
 * visually larger so they pop on the calendar.
 */
export function EventCard({ event, variant = "list" }: Props) {
  const sub = getSubcategory(event.subcategorySlug);
  const subName = sub?.subcategory.name;
  const isBoosted = event.isBoosted;

  if (variant === "inline") {
    return (
      <Link
        href={event.url ?? "#"}
        target={event.url ? "_blank" : undefined}
        rel={event.url ? "noopener noreferrer" : undefined}
        className={[
          "block bg-white rounded-lg border-2 p-3 hover:shadow-sm transition",
          isBoosted ? "border-amber-500" : "border-stone-200",
        ].join(" ")}
      >
        <div className="flex items-start gap-2">
          {isBoosted && (
            <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-black line-clamp-1">
              {event.title}
            </p>
            <p className="text-xs text-stone-600 line-clamp-1">
              {formatEventTimeRange(event.startTime, event.endTime)} · {event.venue}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // variant === "list"
  return (
    <Link
      href={event.url ?? "#"}
      target={event.url ? "_blank" : undefined}
      rel={event.url ? "noopener noreferrer" : undefined}
      className={[
        "group block bg-white rounded-2xl overflow-hidden border-2 transition hover:shadow-lg",
        isBoosted ? "border-amber-500" : "border-stone-200",
      ].join(" ")}
    >
      <div className="relative aspect-[16/9] bg-stone-100">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {isBoosted && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-500 text-black text-sm font-bold px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Featured
          </span>
        )}
        <span
          className={[
            "absolute top-3 right-3 text-sm font-bold px-2.5 py-1 rounded-full",
            event.isFree
              ? "bg-white text-black border-2 border-black"
              : "bg-black text-white",
          ].join(" ")}
        >
          {event.isFree ? "Free" : event.price ?? "Ticketed"}
        </span>
      </div>
      <div className="p-5">
        {subName && (
          <p className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-1">
            {subName}
          </p>
        )}
        <h3 className="text-xl font-display font-medium text-black leading-tight group-hover:underline">
          {event.title}
        </h3>
        <p className="mt-2 text-base text-stone-700 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 space-y-1.5 text-base text-stone-700">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
            <span>
              {event.startDate === event.endDate
                ? formatEventDate(event.startDate)
                : `${formatEventDate(event.startDate)} – ${formatEventDate(event.endDate)}`}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
            <span>
              {formatEventTimeRange(event.startTime, event.endTime)}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
            <span className="line-clamp-1">
              {event.venue}, {event.city}, {event.province}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-black flex-shrink-0" strokeWidth={1.5} />
            <span>By {event.organizer}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}