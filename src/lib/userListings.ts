// User-created listings are stored separately from the static businesses.json
// in localStorage. This lets the demo flow work end-to-end without a backend:
// businesses sign up, create a listing, and (in a future step) see it on
// their dashboard and in the public directory.
//
// Each listing mirrors the shape of a directory Business but is owned by the
// subscriber that created it. The id is namespaced ("u-" prefix) so it never
// collides with the static catalog.

import type { Business } from "./businesses";

export type UserListing = Business & {
  ownerEmail: string;
  status: "draft" | "pending" | "published" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
};

const STORAGE_KEY = "ofs-user-listings";

function readAll(): UserListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: UserListing[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getUserListings(): UserListing[] {
  return readAll();
}

export function getUserListingsFor(email: string | undefined): UserListing[] {
  if (!email) return [];
  const e = email.toLowerCase();
  return readAll().filter((l) => l.ownerEmail.toLowerCase() === e);
}

export function addUserListing(listing: UserListing): UserListing[] {
  const all = readAll();
  all.unshift(listing);
  writeAll(all);
  return all;
}

export function deleteUserListing(id: string): UserListing[] {
  const next = readAll().filter((l) => l.id !== id);
  writeAll(next);
  return next;
}

export function nextUserListingId(): string {
  // Namespaced id, monotonic per browser. Good enough for a static demo.
  const existing = readAll();
  const max = existing.reduce((m, l) => {
    const n = Number(l.id.replace(/^u-/, "")) || 0;
    return Math.max(m, n);
  }, 0);
  return `u-${String(max + 1).padStart(3, "0")}`;
}
