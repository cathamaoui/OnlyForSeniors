import eventsData from "@/data/events.json";

/**
 * Event model
 *
 * Events are time-bound things (workshops, clinics, meetups) that a
 * business or community group can post on the OFS calendar. Unlike a
 * business listing, an event has a specific start/end date and time.
 *
 * Boosts:
 *   - `isBoosted: false` (default) — free listing, shows as a standard
 *     card on the calendar.
 *   - `isBoosted: true`             — paid boost, gets prominent
 *     placement (gold border, pinned to top, larger card).
 */
export type Event = {
  id: string;
  title: string;
  description: string;
  /** Name of the organization putting on the event. */
  organizer: string;
  /** OFS business id, if the event is hosted by a listed business. */
  businessId: string | null;
  categorySlug: string;
  subcategorySlug: string;
  /** ISO date string (YYYY-MM-DD). Inclusive. */
  startDate: string;
  endDate: string;
  /** 24h HH:MM. */
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  province: string;
  isFree: boolean;
  /** Human-readable price (e.g. "$5 per class"). Null when isFree. */
  price: string | null;
  url: string | null;
  image: string;
  isBoosted: boolean;
  tags: string[];
};

const events: Event[] = eventsData.events as Event[];

/** All events, sorted by start date ascending. */
export function getAllEvents(): Event[] {
  return [...events].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
}

/** All events for a specific YYYY-MM-DD date, with boosted events first. */
export function getEventsForDate(date: string): Event[] {
  return events
    .filter((e) => date >= e.startDate && date <= e.endDate)
    .sort((a, b) => {
      if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1;
      return a.startTime.localeCompare(b.startTime);
    });
}

/** Events that haven't ended yet (endDate >= today), boosted first. */
export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().slice(0, 10);
  return events
    .filter((e) => e.endDate >= today)
    .sort((a, b) => {
      if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1;
      return a.startDate.localeCompare(b.startDate);
    });
}

/** Events that are flagged as "boosted" — for featured/promoted display. */
export function getBoostedEvents(): Event[] {
  return events.filter((e) => e.isBoosted && e.endDate >= new Date().toISOString().slice(0, 10));
}

/**
 * Every event that has ANY day in the given month, sorted by start
 * date then start time. Used to render a printable list view.
 */
export function getEventsForMonth(year: number, month0: number): Event[] {
  const monthStart = `${year}-${String(month0 + 1).padStart(2, "0")}-01`;
  // Last day of the month
  const lastDay = new Date(year, month0 + 1, 0).getDate();
  const monthEnd = `${year}-${String(month0 + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return events
    .filter((e) => e.startDate <= monthEnd && e.endDate >= monthStart)
    .sort((a, b) => {
      const dc = a.startDate.localeCompare(b.startDate);
      if (dc !== 0) return dc;
      return a.startTime.localeCompare(b.startTime);
    });
}

/**
 * Non-boosted events for a given month. Used by the printable list
 * so promoted/featured ads don't show up on printouts.
 */
export function getPrintableEventsForMonth(year: number, month0: number): Event[] {
  return getEventsForMonth(year, month0).filter((e) => !e.isBoosted);
}

/** Lookup a single event by id. */
export function getEventById(id: string): Event | null {
  return events.find((e) => e.id === id) ?? null;
}

/** Format a YYYY-MM-DD into a short, friendly label like "Mon, Jun 22". */
export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format a YYYY-MM-DD into a long label like "Monday, June 22, 2026". */
export function formatEventDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Format "HH:MM" -> "10:00 AM". */
export function formatEventTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Format "HH:MM" + "HH:MM" -> "10:00 AM – 11:30 AM". */
export function formatEventTimeRange(start: string, end: string): string {
  return `${formatEventTime(start)} – ${formatEventTime(end)}`;
}

/** YYYY-MM-DD -> JS Date in local time. */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** JS Date -> YYYY-MM-DD. */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Get the first day of the calendar grid for a given month
 *  (Sunday-aligned 6-row grid). */
export function getCalendarGridStart(year: number, month0: number): Date {
  const first = new Date(year, month0, 1);
  const dow = first.getDay(); // 0 = Sun
  first.setDate(first.getDate() - dow);
  return first;
}

/** Total days in a given month. */
export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}