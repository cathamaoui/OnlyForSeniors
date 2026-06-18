"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  ExternalLink,
  LogOut,
  Mail,
  Phone,
  Plus,
  Settings,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  loadSignup,
  saveSignup,
  clearSignup,
  totalWithTax,
  formatCAD,
  PLAN_BASE_CAD,
} from "@/lib/signup";
import { getProvince, type ProvinceCode, PROVINCES } from "@/lib/canadaTax";
import { getAllCategories } from "@/lib/businesses";
import {
  getUserListingsFor,
  deleteUserListing,
  type UserListing,
} from "@/lib/userListings";
import {
  formatDateShort,
  getAddon,
  normaliseAddonList,
  daysUntil,
  addDaysIso,
  buildPurchase,
  todayIso,
} from "@/lib/addons";
import { listAllBoosts } from "@/lib/boosts";
import { BoostCenter } from "./BoostCenter";

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function nextCharge(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ReturnType<typeof loadSignup> | null>(null);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [boostCards, setBoostCards] = useState<ReturnType<typeof listAllBoosts> | null>(null);

  useEffect(() => {
    const s = loadSignup();
    if (!s.completedSteps) {
      router.replace("/list-business/");
      return;
    }
    setData(s);
    const listings = getUserListingsFor(s.account?.email);
    setUserListings(listings);
    setBoostCards(listAllBoosts(normaliseAddonList(s.checkout?.addons ?? [])));
    setMounted(true);
  }, [router]);

  if (!mounted || !data) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  const acct = data.account ?? {};
  const prof = data.profile ?? {};
  const co = data.checkout ?? {};
  const cats = getAllCategories();
  const category = cats.find((c) => c.slug === prof.categorySlug);
  const sub = category?.subcategories.find((s) => s.slug === prof.subcategorySlug);
  const province = getProvince((co.billingProvince as ProvinceCode) || (prof.province as ProvinceCode));
  const tax = totalWithTax((co.billingProvince as ProvinceCode) || (prof.province as ProvinceCode));

  const onLogout = () => {
    if (confirm("Sign out of your dashboard? Your data will be cleared from this device.")) {
      clearSignup();
      router.push("/");
    }
  };

  // Read the purchased add-ons (with backward-compat for old string[] data).
  const purchases = normaliseAddonList(co.addons ?? []);

  // Renew an add-on: roll its end date forward by one more period from the
  // current end date. Stays inside the same data shape so the dashboard
  // updates instantly without a Stripe round-trip.
  const onRenewAddon = (id: string) => {
    if (!data) return;
    const a = getAddon(id);
    if (!a) return;
    const existing = purchases.find((p) => p.id === id);
    const days =
      a.interval === "weekly" ? 7 :
      a.interval === "monthly" ? 30 :
      1;
    // For renew, start fresh from the day after the current end (so there's
    // no gap). If there's no purchase, start today.
    const baseDate = existing ? addDaysIso(existing.endDate, 1) : todayIso();
    const fresh = buildPurchase(a, baseDate);
    const nextAddons = existing
      ? purchases.map((p) => (p.id === id ? fresh : p))
      : [...purchases, fresh];
    const nextState = {
      ...data,
      checkout: { ...data.checkout, addons: nextAddons },
      updatedAt: new Date().toISOString(),
    };
    setData(nextState);
    saveSignup(nextState);
  };

  const onDeleteListing = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      const next = deleteUserListing(id);
      setUserListings(getUserListingsFor(data?.account?.email));
      return next;
    }
    return userListings;
  };

  const statusBadge = (status: UserListing["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 text-base font-semibold text-blue-800 bg-blue-100 border-2 border-blue-700 rounded-full px-3 py-0.5">
            <CheckCircle2 className="w-4 h-4" /> Live
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-base font-semibold text-stone-800 bg-stone-200 border-2 border-stone-500 rounded-full px-3 py-0.5">
            <Clock className="w-4 h-4" /> Pending review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-base font-semibold text-red-800 bg-red-100 border-2 border-red-700 rounded-full px-3 py-0.5">
            <XCircle className="w-4 h-4" /> Not approved
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-full px-3 py-0.5">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome strip */}
      <div className="bg-white border-2 border-black rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-blue-700 mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
            {acct.businessName || acct.contactName || "Your business"}
          </h1>
          <p className="text-base text-stone-700 mt-1">
            Signed in as <strong>{acct.email}</strong>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/list-business/dashboard/new-listing/"
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
          >
            <Plus className="w-5 h-5" /> New listing
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business profile card */}
        <section className="lg:col-span-2 bg-white border-2 border-stone-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-black text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Business profile
            </h2>
            <Link
              href="/list-business/profile/"
              className="text-base font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              Edit <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-base">
            <div>
              <dt className="font-bold text-stone-700">Business name</dt>
              <dd className="text-stone-900">{acct.businessName || "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-stone-700">Contact</dt>
              <dd className="text-stone-900">{acct.contactName || "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-stone-700">Email</dt>
              <dd className="text-stone-900 flex items-center gap-1">
                <Mail className="w-4 h-4 text-stone-700" />
                {acct.email || "—"}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-stone-700">Phone</dt>
              <dd className="text-stone-900 flex items-center gap-1">
                <Phone className="w-4 h-4 text-stone-700" />
                {acct.phone || "—"}
              </dd>
            </div>
            <div className="sm:col-span-2 border-t border-stone-200 pt-4">
              <dt className="font-bold text-stone-700">Address</dt>
              <dd className="text-stone-900">
                {prof.street || "—"}
                {prof.city && (
                  <>
                    <br />
                    {prof.city}
                    {prof.province && `, ${prof.province}`} {prof.postalCode}
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-stone-700">Category</dt>
              <dd className="text-stone-900">
                {category ? `${category.icon} ${category.name}` : "—"}
                {sub && <span className="text-stone-700"> · {sub.name}</span>}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-stone-700">Service area</dt>
              <dd className="text-stone-900">{prof.serviceArea || "—"}</dd>
            </div>
            {prof.website && (
              <div className="sm:col-span-2">
                <dt className="font-bold text-stone-700">Website</dt>
                <dd className="text-stone-900">
                  <a
                    href={prof.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline hover:text-blue-800"
                  >
                    {prof.website}
                  </a>
                </dd>
              </div>
            )}
            {prof.description && (
              <div className="sm:col-span-2">
                <dt className="font-bold text-stone-700">Description</dt>
                <dd className="text-stone-900 whitespace-pre-line">
                  {prof.description}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Expiring add-ons (only date-bounded ones) */}
        {purchases.length > 0 && (
          <aside className="bg-white border-2 border-blue-700 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-display font-black text-stone-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-700" /> Time-limited add-ons
            </h2>
            <ul className="space-y-3 text-base">
              {purchases.map((p) => {
                const a = getAddon(p.id);
                if (!a) return null;
                const remaining = daysUntil(p.endDate);
                const expired = remaining < 0;
                const expiring = !expired && remaining <= 3;
                const badge = expired
                  ? { color: "red", label: "Expired" }
                  : expiring
                  ? { color: "amber", label: `${remaining} day${remaining === 1 ? "" : "s"} left` }
                  : { color: "blue", label: "Live" };
                const badgeClass =
                  badge.color === "red"
                    ? "text-red-800 bg-red-100 border-red-700"
                    : badge.color === "amber"
                    ? "text-amber-900 bg-amber-100 border-amber-700"
                    : "text-blue-800 bg-blue-100 border-blue-700";
                return (
                  <li
                    key={p.id}
                    className="rounded-lg border-2 border-stone-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-stone-900">{a.title}</p>
                      <span
                        className={`text-base font-semibold border-2 rounded-full px-2 py-0.5 ${badgeClass}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-stone-700 mt-1">
                      {a.interval === "per-event"
                        ? `Listed on ${formatDateShort(p.startDate)}`
                        : `Live ${formatDateShort(p.startDate)} – ${formatDateShort(p.endDate)}`}
                    </p>
                    <p className="text-stone-700">
                      {a.interval === "per-event" ? (
                        <>Reminder email sent the day before the event.</>
                      ) : (
                        <>
                          Reminder email sent {formatDateShort(addDaysIso(p.endDate, -1))}.
                        </>
                      )}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onRenewAddon(p.id)}
                        className="inline-flex items-center gap-1 min-h-touch px-4 py-2 text-base font-semibold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
                      >
                        {a.interval === "per-event" ? "Re-list" : "Renew"} · {a.interval === "weekly" ? "+1 week" : a.interval === "monthly" ? "+1 month" : "+1 day"}
                      </button>
                      <span className="text-base text-stone-700">
                        {formatCAD(a.price)} {a.interval === "weekly" ? "/week" : a.interval === "monthly" ? "/month" : "/event"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {/* Subscription card */}
        <aside className="bg-white border-2 border-stone-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-display font-black text-stone-900 flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" /> Subscription
          </h2>
          <div className="space-y-3 text-base">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-700" />
              <span className="font-bold text-stone-900">Active</span>
            </div>
            <div>
              <p className="text-stone-700">Plan</p>
              <p className="text-stone-900 font-semibold">
                Business listing — monthly
              </p>
            </div>
            <div>
              <p className="text-stone-700">Next charge</p>
              <p className="text-stone-900 font-semibold">{fmtDate(nextCharge())}</p>
            </div>
            <div>
              <p className="text-stone-700">Next charge amount</p>
              <p className="text-stone-900 font-bold text-lg">
                {formatCAD(tax.total)}{" "}
                <span className="text-base font-normal text-stone-700">
                  (incl. {province?.label ?? "tax"})
                </span>
              </p>
            </div>
            <div>
              <p className="text-stone-700">Card on file</p>
              <p className="text-stone-900 font-semibold">
                •••• {co.cardLast4 || "••••"}{" "}
                <span className="text-stone-700 font-normal">
                  exp {co.cardExp || "—"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-stone-200 flex flex-col gap-2">
            <Link
              href="/list-business/invoice/"
              className="text-base font-semibold text-blue-700 hover:text-blue-800"
            >
              View past invoices
            </Link>
            <Link
              href="/list-business/billing/"
              className="text-base font-semibold text-blue-700 hover:text-blue-800"
            >
              Update payment method
            </Link>
            <button
              type="button"
              className="text-left text-base font-semibold text-red-700 hover:text-red-800"
              onClick={() => alert("Cancellation is not yet self-serve. Email hello@onlyforseniors.ca to cancel.")}
            >
              Cancel subscription
            </button>
          </div>
        </aside>
      </div>

      {/* Boost Center -- 6 add-on cards, glowing when info is missing */}
      {boostCards && <BoostCenter cards={boostCards} listings={userListings} />}

      {/* Listings section */}
      <section className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-black text-stone-900">
            Your listings
          </h2>
          <Link
            href="/list-business/dashboard/new-listing/"
            className="inline-flex items-center gap-1 text-base font-semibold text-blue-700 hover:text-blue-800"
          >
            Create listing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {userListings.length === 0 ? (
          <div className="bg-stone-50 border-2 border-dashed border-stone-500 rounded-lg p-8 text-center">
            <p className="text-lg font-bold text-stone-900">No listings yet</p>
            <p className="text-base text-stone-700 mt-2 max-w-md mx-auto">
              Create your first service, event, or product listing. Each listing
              goes live within 24 hours after our team verifies the contact info.
            </p>
            <Link
              href="/list-business/dashboard/new-listing/"
              className="mt-5 inline-flex items-center gap-2 min-h-touch px-6 py-3 text-base font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
            >
              <Plus className="w-5 h-5" /> Create your first listing
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {userListings.map((l) => {
              const cat = cats.find((c) => c.slug === l.categorySlug);
              return (
                <li
                  key={l.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-stone-50 border-2 border-stone-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-stone-900 truncate">
                        {l.name}
                      </h3>
                      {statusBadge(l.status)}
                    </div>
                    {l.tagline && (
                      <p className="text-base text-stone-700 mt-1 line-clamp-2">
                        {l.tagline}
                      </p>
                    )}
                    <p className="text-base text-stone-700 mt-1 flex flex-wrap items-center gap-2">
                      <span>{cat ? `${cat.icon} ${cat.name}` : "Uncategorized"}</span>
                      {l.city && (
                        <>
                          <span>·</span>
                          <span>{l.city}, {l.province}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>Submitted {fmtDate(new Date(l.submittedAt))}</span>
                    </p>
                    {l.status === "rejected" && l.rejectionReason && (
                      <p className="mt-2 text-base text-red-800 font-semibold">
                        Reason: {l.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={() => onDeleteListing(l.id, l.name)}
                      className="inline-flex items-center gap-1 min-h-touch px-3 py-2 text-base font-semibold text-red-700 bg-white border-2 border-red-700 rounded-lg hover:bg-red-50"
                      aria-label={`Delete ${l.name}`}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Account settings row */}
      <section className="bg-white border-2 border-stone-200 rounded-lg p-6">
        <h2 className="text-lg font-display font-black text-stone-900 mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Account
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-base text-stone-700">
            Need to change your contact info, password, or notification settings?
          </p>
          <Link
            href="/list-business/dashboard/settings/"
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            Manage account
          </Link>
        </div>
      </section>
    </div>
  );
}
