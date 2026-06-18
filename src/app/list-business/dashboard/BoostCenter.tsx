"use client";

// Boost Center -- a 6-card grid on the business dashboard. Each card has
// 3 visual states:
//   1. "not-purchased"   -- neutral, with a "Get this boost" CTA
//   2. "missing-info"    -- glowing blue/green border + inline form
//   3. "complete"        -- calm green checkmark + "Edit" button
//
// The component owns the inline form state and persists each change to
// localStorage via src/lib/boosts.ts.

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Tag as TagIcon,
  Zap,
} from "lucide-react";
import {
  formatDateShort,
  formatInterval,
  type Addon,
} from "@/lib/addons";
import {
  loadBoost,
  missingFieldLabel,
  needsListing,
  saveBoost,
  type BoostDetails,
  type BoostStatus,
} from "@/lib/boosts";
import type { UserListing } from "@/lib/userListings";

type BoostCard = {
  addon: Addon;
  purchased: boolean;
  startDate: string;
  endDate: string;
  status: BoostStatus;
  missing: string[];
  details: BoostDetails;
};

type Props = {
  cards: BoostCard[];
  listings: UserListing[];
};

const COLORS: Record<string, { ring: string; bg: string; icon: string; glow: string; chip: string }> = {
  "top-bump":              { ring: "ring-amber-500",  bg: "bg-amber-50",   icon: "text-amber-700",  glow: "shadow-amber-300", chip: "bg-amber-100 text-amber-900 border-amber-500" },
  "senior-discount-badge": { ring: "ring-emerald-500",bg: "bg-emerald-50", icon: "text-emerald-700",glow: "shadow-emerald-300", chip: "bg-emerald-100 text-emerald-900 border-emerald-500" },
  "media-pack":            { ring: "ring-purple-500", bg: "bg-purple-50",  icon: "text-purple-700", glow: "shadow-purple-300", chip: "bg-purple-100 text-purple-900 border-purple-500" },
  "event-spotlight-event": { ring: "ring-rose-500",   bg: "bg-rose-50",    icon: "text-rose-700",   glow: "shadow-rose-300", chip: "bg-rose-100 text-rose-900 border-rose-500" },
  "event-spotlight-sale":  { ring: "ring-orange-500", bg: "bg-orange-50",  icon: "text-orange-700", glow: "shadow-orange-300", chip: "bg-orange-100 text-orange-900 border-orange-500" },
  "event-spotlight-class": { ring: "ring-indigo-500", bg: "bg-indigo-50",  icon: "text-indigo-700", glow: "shadow-indigo-300", chip: "bg-indigo-100 text-indigo-900 border-indigo-500" },
};

function iconFor(addonId: string) {
  if (addonId === "top-bump") return Zap;
  if (addonId === "senior-discount-badge") return TagIcon;
  if (addonId === "media-pack") return ImageIcon;
  return CalendarDays;
}

export function BoostCenter({ cards, listings }: Props) {
  return (
    <section className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-display font-black text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-700" /> Boost Center
          </h2>
          <p className="text-base text-stone-700 mt-1 max-w-2xl">
            Promotional add-ons that put your listings in front of more seniors. Bought boosts that need extra info glow until you finish setting them up.
          </p>
        </div>
        <Link
          href="/list-business/#boosts"
          className="text-base font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
        >
          Compare all boosts <ChevronDown className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <BoostCardView key={c.addon.id} card={c} listings={listings} />
        ))}
      </div>
    </section>
  );
}

function BoostCardView({ card, listings }: { card: BoostCard; listings: UserListing[] }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<BoostDetails>(card.details);
  const Icon = iconFor(card.addon.id);
  const palette = COLORS[card.addon.id] ?? COLORS["top-bump"];

  const onSave = () => {
    saveBoost(card.addon.id, details);
    setOpen(false);
    // Soft reload: re-mount by reloading the dashboard data
    if (typeof window !== "undefined") window.location.reload();
  };

  // ---------- NOT PURCHASED ----------
  if (!card.purchased) {
    return (
      <div className="rounded-lg border-2 border-stone-200 bg-stone-50 p-5 flex flex-col">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${palette.bg} ${palette.icon} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-stone-900">{card.addon.title}</h3>
            <p className="text-base text-stone-700 mt-1">{card.addon.blurb}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-bold text-stone-900">
            ${card.addon.price}<span className="font-normal text-stone-700">{formatInterval(card.addon.interval)}</span>
          </span>
          <Link
            href="/list-business/checkout/"
            className="inline-flex items-center gap-1 min-h-touch px-4 py-2 text-base font-semibold text-blue-700 bg-white border-2 border-blue-700 rounded-lg hover:bg-blue-50"
          >
            <Plus className="w-4 h-4" /> Add boost
          </Link>
        </div>
      </div>
    );
  }

  // ---------- COMPLETE ----------
  if (card.status === "complete") {
    return (
      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${palette.bg} ${palette.icon} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              {card.addon.title}
              <span className="inline-flex items-center gap-1 text-base font-semibold text-emerald-900 bg-emerald-200 border-2 border-emerald-500 rounded-full px-2 py-0.5">
                <Check className="w-4 h-4" /> Active
              </span>
            </h3>
            <p className="text-base text-stone-700 mt-1">
              {card.addon.interval === "per-event"
                ? `Live on ${formatDateShort(card.startDate)}`
                : `Live ${formatDateShort(card.startDate)} – ${formatDateShort(card.endDate)}`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 min-h-touch px-4 py-2 text-base font-semibold text-stone-900 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            {open ? <>Hide <ChevronUp className="w-4 h-4" /></> : <>Edit <ChevronDown className="w-4 h-4" /></>}
          </button>
        </div>
        {open && (
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <BoostFormFields
              card={card}
              details={details}
              setDetails={setDetails}
              listings={listings}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-1 min-h-touch px-5 py-2 text-base font-bold text-white bg-emerald-700 border-2 border-emerald-700 rounded-lg hover:bg-emerald-800"
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- MISSING INFO (glowing) ----------
  return (
    <div
      className={`rounded-lg border-4 ${palette.ring} ${palette.bg} p-5 shadow-lg ${palette.glow} animate-pulse-slow`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-white ${palette.icon} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 flex-wrap">
            {card.addon.title}
            <span className={`text-base font-semibold ${palette.chip} border-2 rounded-full px-2 py-0.5`}>
              Action needed
            </span>
          </h3>
          <p className="text-base text-stone-800 mt-1">
            {card.addon.interval === "per-event"
              ? `Live on ${formatDateShort(card.startDate)}`
              : `Live ${formatDateShort(card.startDate)} – ${formatDateShort(card.endDate)}`}
          </p>
          <p className="text-base text-stone-800 mt-1">
            Finish setting up to publish. Still to do:
          </p>
          <ul className="mt-1 space-y-1 text-base text-stone-800">
            {card.missing.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-stone-700 shrink-0" />
                {missingFieldLabel(f)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1 min-h-touch px-5 py-2 text-base font-bold text-white ${palette.icon.replace("text-", "bg-").replace("-700", "-700")} border-2 rounded-lg hover:opacity-90`}
        >
          {open ? "Hide form" : "Complete your posting"}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {open && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          <BoostFormFields
            card={card}
            details={details}
            setDetails={setDetails}
            listings={listings}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-1 min-h-touch px-5 py-2 text-base font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
            >
              Save and finish setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------- The per-boost form fields --------

function BoostFormFields({
  card,
  details,
  setDetails,
  listings,
}: {
  card: BoostCard;
  details: BoostDetails;
  setDetails: (d: BoostDetails) => void;
  listings: UserListing[];
}) {
  const a = card.addon;
  const set = <K extends keyof BoostDetails>(k: K, v: BoostDetails[K]) =>
    setDetails({ ...details, [k]: v });

  const inputClass =
    "w-full min-h-touch px-3 py-2 text-base bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-3">
      {/* Listing dropdown (for bumps/badges/media) */}
      {needsListing(a) && (
        <Field label="Attach to listing">
          <select
            value={details.listingId ?? ""}
            onChange={(e) => set("listingId", e.target.value)}
            className={inputClass}
          >
            <option value="">-- Choose a listing --</option>
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          {listings.length === 0 && (
            <p className="text-base text-amber-900 mt-1">
              You don't have any listings yet. <Link href="/list-business/dashboard/new-listing/" className="font-semibold underline">Create one first</Link>.
            </p>
          )}
        </Field>
      )}

      {/* Top of Category bump: which listing to pin */}
      {a.id === "top-bump" && (
        <Field label="Which listing to pin to the top">
          <select
            value={details.pinnedListingId ?? ""}
            onChange={(e) => set("pinnedListingId", e.target.value)}
            className={inputClass}
          >
            <option value="">-- Choose a listing --</option>
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {/* Senior Discount badge */}
      {a.id === "senior-discount-badge" && (
        <>
          <Field label="Your discount (short)">
            <input
              type="text"
              maxLength={50}
              value={details.discountLabel ?? ""}
              onChange={(e) => set("discountLabel", e.target.value)}
              className={inputClass}
              placeholder="e.g. 10% off first visit"
            />
          </Field>
          <Field label="Terms / notes (optional)">
            <textarea
              rows={3}
              value={details.discountNotes ?? ""}
              onChange={(e) => set("discountNotes", e.target.value)}
              className={inputClass}
              placeholder="Any conditions, expiry, etc."
            />
          </Field>
        </>
      )}

      {/* Multi-Media Pack */}
      {a.id === "media-pack" && (
        <>
          <Field label="Up to 10 photo URLs (one per line)">
            <textarea
              rows={5}
              value={(details.photoUrls ?? []).join("\n")}
              onChange={(e) =>
                set(
                  "photoUrls",
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 10)
                )
              }
              className={inputClass}
              placeholder={"https://...\nhttps://..."}
            />
          </Field>
          <Field label="YouTube or Vimeo video URL">
            <input
              type="url"
              value={details.videoUrl ?? ""}
              onChange={(e) => set("videoUrl", e.target.value)}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Field>
        </>
      )}

      {/* Event / Sale / Class Spotlight (shared fields) */}
      {a.id.startsWith("event-spotlight-") && (
        <>
          <Field label="Title">
            <input
              type="text"
              maxLength={80}
              value={details.boostTitle ?? ""}
              onChange={(e) => set("boostTitle", e.target.value)}
              className={inputClass}
              placeholder={a.id === "event-spotlight-sale" ? "Spring Clearance Sale" : a.id === "event-spotlight-class" ? "Yoga for Seniors" : "Open House"}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Start time">
              <input
                type="time"
                value={details.startTime ?? ""}
                onChange={(e) => set("startTime", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="End time">
              <input
                type="time"
                value={details.endTime ?? ""}
                onChange={(e) => set("endTime", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Venue name">
            <input
              type="text"
              value={details.venueName ?? ""}
              onChange={(e) => set("venueName", e.target.value)}
              className={inputClass}
              placeholder="e.g. West End Community Centre"
            />
          </Field>
          <Field label="Venue address (optional)">
            <input
              type="text"
              value={details.venueAddress ?? ""}
              onChange={(e) => set("venueAddress", e.target.value)}
              className={inputClass}
              placeholder="123 Main St, City, Province"
            />
          </Field>
          {a.id === "event-spotlight-sale" && (
            <Field label="% off">
              <input
                type="number"
                min={0}
                max={100}
                value={details.salePercentOff ?? ""}
                onChange={(e) => set("salePercentOff", e.target.value === "" ? undefined : Number(e.target.value))}
                className={inputClass}
                placeholder="20"
              />
            </Field>
          )}
          {a.id === "event-spotlight-class" && (
            <>
              <Field label="Class schedule">
                <input
                  type="text"
                  value={details.scheduleNote ?? ""}
                  onChange={(e) => set("scheduleNote", e.target.value)}
                  className={inputClass}
                  placeholder="Every Tuesday at 2pm"
                />
              </Field>
              <Field label="Price per class">
                <input
                  type="text"
                  value={details.pricePerClass ?? ""}
                  onChange={(e) => set("pricePerClass", e.target.value)}
                  className={inputClass}
                  placeholder="$20 per class, materials included"
                />
              </Field>
            </>
          )}
          <Field label="Description">
            <textarea
              rows={4}
              maxLength={500}
              value={details.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
              placeholder="What's the event / sale / class about? Who is it for? What should attendees bring?"
            />
          </Field>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-base font-bold text-stone-900 mb-1">{label}</span>
      {children}
    </label>
  );
}
