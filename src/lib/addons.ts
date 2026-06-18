// A la carte add-on upgrades offered at checkout. Each one is opt-in and
// stacks on top of the $10/month base subscription. Prices are in CAD and
// are subject to the buyer's provincial sales tax.
//
// A static export can't enforce server-side billing for these, but the
// checkout form collects which ones the customer selected, the order summary
// recalculates with them, and the invoice confirms what was purchased.

export type AddonInterval = "monthly" | "weekly" | "per-event";

export type Addon = {
  id: string;
  title: string;
  blurb: string;
  price: number; // CAD, before tax
  interval: AddonInterval;
  highlight?: boolean; // recommended badge
  /** Which add-ons require the buyer to pick a start date. */
  dateRequired?: boolean;
  /** Human hint for what the start date represents. */
  dateLabel?: string;
};

// A purchased add-on carries the chosen start date so we know when the bump
// becomes live, when it ends, and (for the future email reminder) when the
// notice should go out. The `endDate` is calculated on save from the
// add-on's interval -- the buyer never enters it.
export type AddonPurchase = {
  id: string;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;   // ISO yyyy-mm-dd (inclusive)
};

export const ADDONS: Addon[] = [
  {
    id: "top-bump",
    title: "Top of Category bump",
    blurb:
      "Push your listing to the very top of its category search page. Buy it any week you need a boost.",
    price: 7,
    interval: "weekly",
    highlight: true,
    dateRequired: true,
    dateLabel: "Bump start date",
  },
  {
    id: "senior-discount-badge",
    title: "Senior Discount badge",
    blurb:
      "Show a bright visual badge on your card so seniors know you offer an exclusive promotion or discount.",
    price: 3,
    interval: "monthly",
  },
  {
    id: "media-pack",
    title: "Multi-Media Expansion Pack",
    blurb:
      "Upgrade from a single photo to up to 10 high-resolution photos plus an embedded YouTube or Vimeo intro video. Video builds massive trust for in-home services.",
    price: 5,
    interval: "monthly",
    highlight: true,
  },
  {
    id: "event-spotlight-event",
    title: "Event Spotlight",
    blurb:
      "Host a one-off event? Pay a flat $5 micro-fee to list it on the public Events Calendar for the month it falls in.",
    price: 5,
    interval: "per-event",
    highlight: true,
    dateRequired: true,
    dateLabel: "Event date",
  },
  {
    id: "event-spotlight-sale",
    title: "Sale Spotlight",
    blurb:
      "Running a seasonal or clearance sale? Pay a flat $5 micro-fee to feature it on the public Events Calendar for the month it runs.",
    price: 5,
    interval: "per-event",
    highlight: true,
    dateRequired: true,
    dateLabel: "Sale start date",
  },
  {
    id: "event-spotlight-class",
    title: "Workshop or Class Spotlight",
    blurb:
      "Teaching a workshop or class? Pay a flat $5 micro-fee to list it on the public Events Calendar for the month it starts in.",
    price: 5,
    interval: "per-event",
    highlight: true,
    dateRequired: true,
    dateLabel: "First class date",
  },
];

export function getAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}

export function formatInterval(interval: AddonInterval): string {
  switch (interval) {
    case "weekly":
      return " / week";
    case "monthly":
      return " / month";
    case "per-event":
      return " / event";
  }
}

/** Number of days a single purchase of this add-on covers. */
export function addonDurationDays(interval: AddonInterval): number {
  switch (interval) {
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    case "per-event":
      return 1; // ends the day of the event
  }
}

/** Returns the ISO yyyy-mm-dd `n` days after `iso`. */
export function addDaysIso(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Build an AddonPurchase from a chosen start date and an add-on id. */
export function buildPurchase(addon: Addon, startDate: string): AddonPurchase {
  const days = addonDurationDays(addon.interval);
  return {
    id: addon.id,
    startDate,
    endDate: addDaysIso(startDate, days - 1), // inclusive
  };
}

/** "2026-06-22" -> "Jun 22, 2026" */
export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "2026-06-22" -> "Mon Jun 22" */
export function formatDateShort(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Today in yyyy-mm-dd, local time. */
export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** How many days from now until the end date (negative if past). */
export function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00").getTime();
  const now = new Date(todayIso() + "T00:00:00").getTime();
  return Math.round((target - now) / 86_400_000);
}

/**
 * Migrate a possibly-old `addons: string[]` array (just ids) into the
 * new AddonPurchase[] shape. Used for backward-compat with localStorage
 * records that pre-date the date-aware upgrade.
 */
export function normaliseAddonList(raw: unknown): AddonPurchase[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];
  if (
    raw.every(
      (x) =>
        x && typeof x === "object" && "id" in (x as object) && "startDate" in (x as object)
    )
  ) {
    return raw as AddonPurchase[];
  }
  // Legacy: string ids with no dates. Synthesise a "starts today" window so
  // the dashboard reminder logic still works.
  const today = todayIso();
  return (raw as string[])
    .filter((id): id is string => typeof id === "string")
    .map((id) => {
      const a = getAddon(id);
      const days = a ? addonDurationDays(a.interval) : 7;
      return {
        id,
        startDate: today,
        endDate: addDaysIso(today, days - 1),
      };
    });
}
