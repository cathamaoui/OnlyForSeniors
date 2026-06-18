"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Mail,
  Printer,
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
import { formatDateShort, formatInterval, getAddon, normaliseAddonList } from "@/lib/addons";

function today(): string {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function invoiceNumber(): string {
  // Deterministic-looking but not secure — fine for a static-export demo.
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rnd = Math.floor(Math.random() * 36 * 36)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `OFS-${ts}-${rnd}`;
}

export function Confirmation() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ReturnType<typeof loadSignup> | null>(null);

  useEffect(() => {
    setData(loadSignup());
    setMounted(true);
  }, []);

  const selectedAddons = useMemo(
    () =>
      normaliseAddonList(data?.checkout?.addons ?? [])
        .map((p) => getAddon(p.id))
        .filter((a): a is NonNullable<ReturnType<typeof getAddon>> => Boolean(a)),
    [data]
  );

  const purchases = useMemo(
    () => normaliseAddonList(data?.checkout?.addons ?? []),
    [data]
  );

  const tax = useMemo(
    () =>
      totalWithTax(
        data?.checkout?.billingProvince as ProvinceCode,
        selectedAddons.map((a) => ({ price: a.price }))
      ),
    [data, selectedAddons]
  );

  const province = getProvince(data?.checkout?.billingProvince);
  const provinceForInvoice = province ?? getProvince(data?.profile?.province);
  const category = useMemo(
    () => getAllCategories().find((c) => c.slug === data?.profile?.categorySlug),
    [data]
  );
  const sub = useMemo(
    () => category?.subcategories.find((s) => s.slug === data?.profile?.subcategorySlug),
    [category, data]
  );

  if (!mounted || !data) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  const acct = data.account ?? {};
  const prof = data.profile ?? {};
  const co = data.checkout ?? {};
  const inv = invoiceNumber();

  return (
    <div className="space-y-6">
      {/* Success card */}
      <div className="bg-white border-2 border-black rounded-lg p-6 sm:p-8 text-center">
        <div className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-blue-100 mb-4">
          <CheckCircle2 className="w-9 h-9 text-blue-700" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
          You&apos;re in.
        </h1>
        <p className="mt-3 text-lg text-stone-700 max-w-xl mx-auto">
          Welcome to Only For Seniors, {acct.contactName?.split(" ")[0] ?? "friend"}.
          Your subscription is active. We&apos;ll email your invoice and login
          details to <strong>{acct.email}</strong> within a few minutes.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/list-business/dashboard/"
            className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
          >
            Go to your dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 text-lg font-bold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            <Printer className="w-5 h-5" /> Print invoice
          </button>
        </div>
      </div>

      {/* Invoice */}
      <article className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 print:border-black">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b-2 border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-black text-white border border-black rounded-lg flex items-center justify-center font-display font-black text-base">
                OFS
              </div>
              <p className="font-display font-bold text-lg text-stone-900">
                Only For Seniors
              </p>
            </div>
            <p className="text-base text-stone-700 mt-1">
              hello@onlyforseniors.ca
            </p>
            <p className="text-base text-stone-700">onlyforseniors.ca</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-base font-bold text-stone-900">Invoice</p>
            <p className="text-base text-stone-700">No. {inv}</p>
            <p className="text-base text-stone-700">{today()}</p>
          </div>
        </header>

        <section className="grid sm:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm font-bold text-stone-700 mb-1">Bill to</p>
            <p className="text-base font-semibold text-stone-900">
              {acct.businessName}
            </p>
            <p className="text-base text-stone-800">{acct.contactName}</p>
            <p className="text-base text-stone-800">{co.billingStreet ?? prof.street}</p>
            <p className="text-base text-stone-800">
              {co.billingCity ?? prof.city}
              {(co.billingProvince ?? prof.province) && (
                <>
                  , {(co.billingProvince as string) || (prof.province as string)}
                </>
              )}{" "}
              {co.billingPostal ?? prof.postalCode}
            </p>
            <p className="text-base text-stone-800 mt-1">{acct.email}</p>
            <p className="text-base text-stone-800">{acct.phone}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-stone-700 mb-1">Subscription</p>
            <p className="text-base font-semibold text-stone-900">
              Only For Seniors — Business Listing
            </p>
            <p className="text-base text-stone-800">Monthly · renews automatically</p>
            <p className="text-base text-stone-800">
              Category: {category ? `${category.icon} ${category.name}` : "—"}
            </p>
            {sub && (
              <p className="text-base text-stone-800">Sub-category: {sub.name}</p>
            )}
            <p className="text-base text-stone-800">Service area: {prof.serviceArea || "—"}</p>
          </div>
        </section>

        <section className="mt-6">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b-2 border-stone-200 text-stone-700">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-right py-2 font-bold w-24">Qty</th>
                <th className="text-right py-2 font-bold w-32">Unit</th>
                <th className="text-right py-2 font-bold w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-200">
                <td className="py-3 text-stone-900">
                  Monthly business listing subscription
                </td>
                <td className="py-3 text-right text-stone-800">1</td>
                <td className="py-3 text-right text-stone-800">{formatCAD(PLAN_BASE_CAD)}</td>
                <td className="py-3 text-right text-stone-800">{formatCAD(PLAN_BASE_CAD)}</td>
              </tr>
              {purchases.map((purchase) => {
                const a = getAddon(purchase.id);
                if (!a) return null;
                return (
                  <tr key={purchase.id} className="border-b border-stone-200">
                    <td className="py-3 text-stone-900">
                      {a.title}
                      {purchase.startDate && (
                        <span className="block text-base text-stone-700">
                          {a.interval === "per-event" ? "Date: " : "Live: "}
                          {formatDateShort(purchase.startDate)}
                          {purchase.startDate !== purchase.endDate && (
                            <> – {formatDateShort(purchase.endDate)}</>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-stone-800">1</td>
                    <td className="py-3 text-right text-stone-800">{formatCAD(a.price)}</td>
                    <td className="py-3 text-right text-stone-800">{formatCAD(a.price)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right py-2 text-stone-700">
                  Subtotal
                </td>
                <td className="text-right py-2 text-stone-800">{formatCAD(tax.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right py-2 text-stone-700">
                  {provinceForInvoice?.label ?? "Tax"} (
                  {(tax.rate * 100).toFixed(tax.rate % 1 ? 3 : 0).replace(/\.?0+$/, "")}%)
                </td>
                <td className="text-right py-2 text-stone-800">{formatCAD(tax.tax)}</td>
              </tr>
              <tr className="border-t-2 border-stone-300">
                <td colSpan={3} className="text-right py-3 text-lg font-bold text-stone-900">
                  Total paid (CAD)
                </td>
                <td className="text-right py-3 text-lg font-bold text-stone-900">
                  {formatCAD(tax.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="mt-6 text-base text-stone-700">
          <p>
            <span className="font-semibold text-stone-900">Payment method:</span> Card
            ending in <strong>{co.cardLast4 || "••••"}</strong> ·{" "}
            Expires {co.cardExp || "—"}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-stone-900">Tax breakdown:</span>{" "}
            {provinceForInvoice?.breakdown ?? "—"}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-stone-900">Next charge date:</span>{" "}
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>

        <footer className="mt-8 pt-4 border-t border-stone-200 text-base text-stone-700">
          Thank you for joining Only For Seniors. Questions? Email{" "}
          <a
            href="mailto:hello@onlyforseniors.ca"
            className="font-semibold text-blue-700 underline hover:text-blue-800"
          >
            hello@onlyforseniors.ca
          </a>
          .
        </footer>
      </article>

      {/* Next steps */}
      <div className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-display font-black text-stone-900 mb-3">
          What happens next
        </h2>
        <ol className="space-y-3 text-base text-stone-800">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0">1</span>
            <span>
              Check your inbox at <strong>{acct.email}</strong> — we&apos;ve sent your invoice, login link, and a short guide to creating your first listing.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0">2</span>
            <span>
              Create your first service, event, or product posting from your dashboard. Takes about 5 minutes per listing.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0">3</span>
            <span>
              Most listings go live within 24 hours after our team verifies the contact info.
            </span>
          </li>
        </ol>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            Back to home
          </Link>
          <a
            href={`mailto:hello@onlyforseniors.ca?subject=New subscription ${inv}`}
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            <Mail className="w-4 h-4" /> Email support
          </a>
        </div>
      </div>
    </div>
  );
}
