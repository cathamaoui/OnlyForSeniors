// Boost Center data model.
//
// After a business buys an add-on at checkout, some boosts need extra
// information before they're actually useful:
//
//   - Top of Category bump -> which of their listings to pin to the top
//   - Senior Discount badge -> short discount text + attach to a listing
//   - Multi-Media Pack      -> photos + video URL + attach to a listing
//   - Event / Sale / Class  -> title, time, venue, description, attach
//
// This file is the per-boost "extra info" store. The dashboard reads it
// from localStorage, shows a glowing card if the info is missing, and
// the inline form writes back here.

import { ADDONS, formatInterval, getAddon, type Addon, type AddonInterval } from "./addons";

const STORAGE_KEY = "ofs-boosts";

/** Per-boost extra fields. Only the keys that the boost actually uses
 * are filled in; everything else is `undefined`. */
export type BoostDetails = {
  /** Which of the user's listings to attach the boost to. */
  listingId?: string;

  // Top of Category bump
  pinnedListingId?: string;

  // Senior Discount badge
  discountLabel?: string;       // e.g. "10% off first visit"
  discountNotes?: string;       // longer terms / conditions

  // Multi-Media Pack
  photoUrls?: string[];         // up to 10
  videoUrl?: string;            // YouTube or Vimeo

  // Event / Sale / Class Spotlight (shared fields)
  boostTitle?: string;          // "Spring Open House"
  startTime?: string;           // "10:00"
  endTime?: string;             // "12:00"
  venueName?: string;
  venueAddress?: string;
  description?: string;

  // Sale-specific
  salePercentOff?: number;      // 0-100

  // Class-specific
  scheduleNote?: string;        // "Every Tuesday at 2pm"
  pricePerClass?: string;       // "$20 per class"
};

export type BoostRecord = {
  id: string;            // addon id, e.g. "top-bump"
  startDate: string;     // ISO yyyy-mm-dd
  endDate: string;       // ISO yyyy-mm-dd
  details: BoostDetails;
  /** When the user last saved the extra info. */
  updatedAt: string;
};

export type BoostStatus = "missing-info" | "complete" | "not-purchased";

/** What extra fields each boost needs. Returns the list of field names
 * that are still empty. Empty array = "complete". */
export function missingFields(addon: Addon, details: BoostDetails): string[] {
  const need: string[] = [];
  if (!details.listingId && needsListing(addon)) {
    need.push("listing");
  }
  if (addon.id === "top-bump" && !details.pinnedListingId) {
    need.push("pinnedListing");
  }
  if (addon.id === "senior-discount-badge") {
    if (!details.discountLabel) need.push("discountLabel");
  }
  if (addon.id === "media-pack") {
    if (!details.photoUrls || details.photoUrls.length === 0) need.push("photos");
    if (!details.videoUrl) need.push("video");
  }
  if (
    addon.id === "event-spotlight-event" ||
    addon.id === "event-spotlight-sale" ||
    addon.id === "event-spotlight-class"
  ) {
    if (!details.boostTitle) need.push("title");
    if (!details.startTime) need.push("startTime");
    if (!details.endTime) need.push("endTime");
    if (!details.venueName) need.push("venue");
    if (!details.description) need.push("description");
  }
  if (addon.id === "event-spotlight-sale") {
    if (details.salePercentOff == null) need.push("percent");
  }
  if (addon.id === "event-spotlight-class") {
    if (!details.scheduleNote) need.push("schedule");
    if (!details.pricePerClass) need.push("pricePerClass");
  }
  return need;
}

/** Boosts that need to be attached to one of the business's listings. */
export function needsListing(addon: Addon): boolean {
  return (
    addon.id === "top-bump" ||
    addon.id === "senior-discount-badge" ||
    addon.id === "media-pack"
  );
}

/** Human label for each missing field. */
export function missingFieldLabel(field: string): string {
  switch (field) {
    case "listing": return "Pick a listing to attach this boost to";
    case "pinnedListing": return "Choose which listing to pin to the top";
    case "discountLabel": return "Describe your senior discount";
    case "photos": return "Add at least one high-res photo";
    case "video": return "Add a YouTube or Vimeo video URL";
    case "title": return "Give your event a title";
    case "startTime": return "Pick a start time";
    case "endTime": return "Pick an end time";
    case "venue": return "Name the venue or location";
    case "description": return "Write a short description";
    case "percent": return "What % off is the sale?";
    case "schedule": return "What's the class schedule?";
    case "pricePerClass": return "How much per class?";
    default: return field;
  }
}

// -------- localStorage --------

function readAll(): Record<string, BoostRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BoostRecord>;
  } catch {
    return {};
  }
}

function writeAll(records: Record<string, BoostRecord>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** Read the saved details for a specific boost. Returns an empty record
 * if the user hasn't started filling in the form yet. */
export function loadBoost(addonId: string): BoostRecord {
  const all = readAll();
  return (
    all[addonId] ?? {
      id: addonId,
      startDate: "",
      endDate: "",
      details: {},
      updatedAt: "",
    }
  );
}

/** Save (or overwrite) the extra fields for a specific boost. */
export function saveBoost(addonId: string, details: BoostDetails): BoostRecord {
  const all = readAll();
  const prev = all[addonId];
  const next: BoostRecord = {
    id: addonId,
    startDate: prev?.startDate ?? "",
    endDate: prev?.endDate ?? "",
    details,
    updatedAt: new Date().toISOString(),
  };
  all[addonId] = next;
  writeAll(all);
  return next;
}

/** Read the saved record plus its add-on metadata in one shot. */
export function loadBoostWithAddon(addonId: string): {
  record: BoostRecord;
  addon: Addon | undefined;
  status: BoostStatus;
  missing: string[];
} {
  const addon = getAddon(addonId);
  const record = loadBoost(addonId);
  if (!addon) {
    return { record, addon, status: "not-purchased", missing: [] };
  }
  const missing = missingFields(addon, record.details);
  const status: BoostStatus = missing.length === 0 ? "complete" : "missing-info";
  return { record, addon, status, missing };
}

/** Build a list of all 6 boosts, with their current status. Used by the
 * dashboard Boost Center. */
export function listAllBoosts(
  purchases: { id: string; startDate: string; endDate: string }[]
): Array<{
  addon: Addon;
  purchased: boolean;
  startDate: string;
  endDate: string;
  status: BoostStatus;
  missing: string[];
  details: BoostDetails;
}> {
  return ADDONS.map((addon) => {
    const purchase = purchases.find((p) => p.id === addon.id);
    if (!purchase) {
      return {
        addon,
        purchased: false,
        startDate: "",
        endDate: "",
        status: "not-purchased" as BoostStatus,
        missing: [],
        details: {},
      };
    }
    const record = loadBoost(addon.id);
    const missing = missingFields(addon, record.details);
    return {
      addon,
      purchased: true,
      startDate: purchase.startDate,
      endDate: purchase.endDate,
      status: missing.length === 0 ? "complete" : "missing-info",
      missing,
      details: record.details,
    };
  });
}

/** Re-export helpers the dashboard might need without importing addons. */
export { formatInterval, type AddonInterval };
