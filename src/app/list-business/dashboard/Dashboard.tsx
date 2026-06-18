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
} from "lucide-react";
import {
  loadSignup,
  clearSignup,
  totalWithTax,
  formatCAD,
  PLAN_BASE_CAD,
} from "@/lib/signup";
import { getProvince, type ProvinceCode, PROVINCES } from "@/lib/canadaTax";
import { getAllCategories } from "@/lib/businesses";

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

  useEffect(() => {
    const s = loadSignup();
    if (!s.completedSteps) {
      router.replace("/list-business/");
      return;
    }
    setData(s);
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
