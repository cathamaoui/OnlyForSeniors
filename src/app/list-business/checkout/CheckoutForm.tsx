"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
  Tag as TagIcon,
  Image as ImageIcon,
  CalendarDays,
} from "lucide-react";
import { PROVINCES, type ProvinceCode, formatCAD } from "@/lib/canadaTax";
import {
  loadSignup,
  saveSignup,
  markStep,
  totalWithTax,
  type Checkout,
} from "@/lib/signup";
import {
  ADDONS,
  buildPurchase,
  formatDateShort,
  formatInterval,
  getAddon,
  todayIso,
  addDaysIso,
  normaliseAddonList,
} from "@/lib/addons";

type Errors = Partial<Record<keyof Checkout, string>>;

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExp(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validate(c: Checkout): Errors {
  const e: Errors = {};
  if (!c.cardName?.trim()) e.cardName = "Name on card is required.";
  const digits = (c.cardNumberMasked ?? "").replace(/\D/g, "");
  if (!digits) e.cardNumberMasked = "Card number is required.";
  else if (digits.length < 13 || digits.length > 19)
    e.cardNumberMasked = "Enter a valid card number.";

  const exp = (c.cardExp ?? "").trim();
  if (!exp) e.cardExp = "Expiry is required.";
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp))
    e.cardExp = "Use MM/YY.";
  else {
    const [mm, yy] = exp.split("/").map((n) => Number(n));
    const now = new Date();
    const expYear = 2000 + yy;
    const expDate = new Date(expYear, mm, 0); // last day of month
    if (expDate < now) e.cardExp = "Card has expired.";
  }

  if (!c.billingStreet?.trim()) e.billingStreet = "Street is required.";
  if (!c.billingCity?.trim()) e.billingCity = "City is required.";
  if (!c.billingProvince) e.billingProvince = "Choose a province.";
  if (!c.billingPostal?.trim()) e.billingPostal = "Postal code is required.";
  if (!c.agreedToTerms) e.agreedToTerms = "Please agree to the terms to continue.";
  if (!c.agreedToContact) e.agreedToContact = "Please confirm you may be contacted for clarification.";

  // Date-required add-ons need a future start date.
  const today = todayIso();
  for (const purchase of c.addons ?? []) {
    const a = getAddon(purchase.id);
    if (!a?.dateRequired) continue;
    if (!purchase.startDate) {
      e.addons = `Please pick a start date for ${a.title}.`;
      break;
    }
    if (purchase.startDate < today) {
      e.addons = `${a.title}: start date can't be in the past.`;
      break;
    }
  }
  return e;
}

export function CheckoutForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Checkout>({
    plan: "monthly",
    cardName: "",
    cardNumberMasked: "",
    cardLast4: "",
    cardExp: "",
    billingStreet: "",
    billingCity: "",
    billingProvince: "",
    billingPostal: "",
    agreedToTerms: false,
    agreedToContact: false,
    addons: [],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Checkout, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = loadSignup();
    // Migrate any old string[] addon list to the new AddonPurchase[] shape
    const migratedAddons = normaliseAddonList(s.checkout?.addons ?? []);
    // Pre-fill billing from profile if available
    const merged: Checkout = {
      ...form,
      ...s.checkout,
      billingStreet: s.checkout?.billingStreet ?? s.profile?.street ?? "",
      billingCity: s.checkout?.billingCity ?? s.profile?.city ?? "",
      billingProvince: (s.checkout?.billingProvince ?? s.profile?.province ?? "") as ProvinceCode,
      billingPostal: s.checkout?.billingPostal ?? s.profile?.postalCode ?? "",
      cardName: s.checkout?.cardName ?? s.account?.contactName ?? "",
      addons: migratedAddons,
    };
    setForm(merged);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (loadSignup().completedSteps < 2) {
      router.replace("/list-business/profile/");
    }
  }, [mounted, router]);

  const tax = useMemo(
    () => {
      const selectedAddons = form.addons
        .map((p) => getAddon(p.id))
        .filter((a): a is NonNullable<ReturnType<typeof getAddon>> => Boolean(a));
      return totalWithTax(
        form.billingProvince as ProvinceCode,
        selectedAddons.map((a) => ({ price: a.price }))
      );
    },
    [form.billingProvince, form.addons]
  );

  const toggleAddon = (id: string) => {
    setForm((prev) => {
      const has = prev.addons.some((p) => p.id === id);
      if (has) {
        return { ...prev, addons: prev.addons.filter((p) => p.id !== id) };
      }
      const a = getAddon(id);
      if (!a) return prev;
      // Default start date: today. The buyer can change it inline.
      return { ...prev, addons: [...prev.addons, buildPurchase(a, todayIso())] };
    });
  };

  const updateAddonDate = (id: string, startDate: string) => {
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.map((p) =>
        p.id === id
          ? {
              id,
              startDate,
              endDate: (() => {
                const a = getAddon(id);
                if (!a) return p.endDate;
                const days =
                  a.interval === "weekly" ? 7 :
                  a.interval === "monthly" ? 30 :
                  1;
                return addDaysIso(startDate, days - 1);
              })(),
            }
          : p
      ),
    }));
  };

  const onChange = <K extends keyof Checkout>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target;
      let value: Checkout[K];
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        value = target.checked as Checkout[K];
      } else {
        value = target.value as Checkout[K];
      }
      const next = { ...form, [k]: value };
      setForm(next);
      if (touched[k]) setErrors(validate(next));
    };

  const onCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    const digits = formatted.replace(/\D/g, "");
    const last4 = digits.slice(-4);
    const next = { ...form, cardNumberMasked: formatted, cardLast4: last4 };
    setForm(next);
    if (touched.cardNumberMasked) setErrors(validate(next));
  };

  const onExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...form, cardExp: formatExp(e.target.value) };
    setForm(next);
    if (touched.cardExp) setErrors(validate(next));
  };

  const onBlur = (k: keyof Checkout) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({
      cardName: true,
      cardNumberMasked: true,
      cardExp: true,
      billingStreet: true,
      billingCity: true,
      billingProvince: true,
      billingPostal: true,
      agreedToTerms: true,
      agreedToContact: true,
    });
    if (Object.keys(v).length > 0) {
      const firstErrKey = Object.keys(v)[0];
      const el = document.getElementById(`cfield-${firstErrKey}`);
      el?.focus();
      return;
    }
    setSubmitting(true);
    // Mock the payment: in production this would POST to /api/checkout which
    // would create a Stripe Subscription. Here we just persist and move on.
    setTimeout(() => {
      const state = markStep(loadSignup(), 3);
      state.checkout = form;
      saveSignup(state);
      router.push("/list-business/confirmation/");
    }, 600);
  };

  if (!mounted) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  const errFor = (k: keyof Checkout) => (touched[k] ? errors[k] : undefined);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
    >
      {/* LEFT — payment + billing */}
      <div className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 space-y-6">
        <fieldset>
          <legend className="text-lg font-display font-bold text-stone-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Payment
          </legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="cfield-cardName" className="block text-base font-bold text-black mb-2">
                Name on card
              </label>
              <input
                id="cfield-cardName"
                type="text"
                autoComplete="cc-name"
                value={form.cardName}
                onChange={onChange("cardName")}
                onBlur={onBlur("cardName")}
                aria-invalid={Boolean(errFor("cardName"))}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                placeholder="As shown on the card"
              />
              {errFor("cardName") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("cardName")}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cfield-cardNumberMasked" className="block text-base font-bold text-black mb-2">
                  Card number
                </label>
                <input
                  id="cfield-cardNumberMasked"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={form.cardNumberMasked}
                  onChange={onCardNumberChange}
                  onBlur={onBlur("cardNumberMasked")}
                  aria-invalid={Boolean(errFor("cardNumberMasked"))}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="1234 5678 9012 3456"
                />
                {errFor("cardNumberMasked") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("cardNumberMasked")}</p>}
              </div>
              <div>
                <label htmlFor="cfield-cardExp" className="block text-base font-bold text-black mb-2">
                  Expiry (MM/YY)
                </label>
                <input
                  id="cfield-cardExp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={form.cardExp}
                  onChange={onExpChange}
                  onBlur={onBlur("cardExp")}
                  aria-invalid={Boolean(errFor("cardExp"))}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="MM/YY"
                />
                {errFor("cardExp") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("cardExp")}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-base text-stone-800">
              <Lock className="w-4 h-4 text-blue-700" />
              <span>Card info is encrypted and never stored on our servers.</span>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-display font-bold text-stone-900 mb-3">
            Billing address
          </legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="cfield-billingStreet" className="block text-base font-bold text-black mb-2">
                Street
              </label>
              <input
                id="cfield-billingStreet"
                type="text"
                autoComplete="street-address"
                value={form.billingStreet}
                onChange={onChange("billingStreet")}
                onBlur={onBlur("billingStreet")}
                aria-invalid={Boolean(errFor("billingStreet"))}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              />
              {errFor("billingStreet") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("billingStreet")}</p>}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cfield-billingCity" className="block text-base font-bold text-black mb-2">
                  City
                </label>
                <input
                  id="cfield-billingCity"
                  type="text"
                  autoComplete="address-level2"
                  value={form.billingCity}
                  onChange={onChange("billingCity")}
                  onBlur={onBlur("billingCity")}
                  aria-invalid={Boolean(errFor("billingCity"))}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                />
                {errFor("billingCity") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("billingCity")}</p>}
              </div>
              <div>
                <label htmlFor="cfield-billingProvince" className="block text-base font-bold text-black mb-2">
                  Province
                </label>
                <select
                  id="cfield-billingProvince"
                  value={form.billingProvince}
                  onChange={onChange("billingProvince")}
                  onBlur={onBlur("billingProvince")}
                  aria-invalid={Boolean(errFor("billingProvince"))}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Choose…</option>
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code}
                    </option>
                  ))}
                </select>
                {errFor("billingProvince") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("billingProvince")}</p>}
              </div>
              <div>
                <label htmlFor="cfield-billingPostal" className="block text-base font-bold text-black mb-2">
                  Postal code
                </label>
                <input
                  id="cfield-billingPostal"
                  type="text"
                  autoComplete="postal-code"
                  value={form.billingPostal}
                  onChange={onChange("billingPostal")}
                  onBlur={onBlur("billingPostal")}
                  aria-invalid={Boolean(errFor("billingPostal"))}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="A1A 1A1"
                />
                {errFor("billingPostal") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("billingPostal")}</p>}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Add-on upgrades — opt-in, à la carte */}
        <fieldset>
          <legend className="text-lg font-display font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Boost your listing
          </legend>
          <p className="text-base text-stone-700 mb-3">
            Optional add-ons. Pick what you need — change or cancel any of them any time.
          </p>
          <div className="space-y-3">
            {ADDONS.map((a) => {
              const purchase = form.addons.find((p) => p.id === a.id);
              const checked = Boolean(purchase);
              const Icon =
                a.id === "top-bump" ? Zap
                : a.id === "senior-discount-badge" ? TagIcon
                : a.id === "media-pack" ? ImageIcon
                : CalendarDays;
              const reminderDate = purchase && purchase.startDate
                ? addDaysIso(purchase.endDate, -1) // day before end
                : "";
              return (
                <div
                  key={a.id}
                  className={[
                    "rounded-lg border-2 transition-colors",
                    checked
                      ? "border-blue-700 bg-blue-50"
                      : "border-stone-500 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <label className="flex items-start gap-3 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(a.id)}
                      className="mt-1 w-5 h-5 shrink-0"
                      aria-describedby={`addon-${a.id}-title`}
                    />
                    <Icon
                      className={`w-5 h-5 mt-0.5 shrink-0 ${checked ? "text-blue-700" : "text-stone-700"}`}
                      strokeWidth={2.25}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span
                          id={`addon-${a.id}-title`}
                          className="text-base font-bold text-stone-900"
                        >
                          {a.title}
                        </span>
                        {a.highlight && (
                          <span className="text-base font-semibold text-blue-700 bg-blue-100 border border-blue-700 rounded-full px-2 py-0.5">
                            Popular
                          </span>
                        )}
                        <span className="text-base font-bold text-stone-900 ml-auto whitespace-nowrap">
                          {formatCAD(a.price)}
                          <span className="text-stone-700 font-normal">
                            {formatInterval(a.interval)}
                          </span>
                        </span>
                      </span>
                      <span className="block text-base text-stone-700 mt-1 leading-snug">
                        {a.blurb}
                      </span>
                    </span>
                  </label>

                  {/* Auto-renews notice — appears on every checked add-on so
                      the buyer is never surprised. Bolded for visibility. */}
                  {checked && (
                    <div className="px-4 pb-4 pl-12 -mt-1">
                      <p className="flex items-start gap-2 text-base font-bold text-stone-900">
                        <RefreshCw
                          className="w-4 h-4 mt-1 shrink-0 text-blue-700"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span>
                          {a.interval === "weekly" && "Auto-renews every week on the same day. Cancel any time."}
                          {a.interval === "monthly" && "Auto-renews every month on the same day. Cancel any time."}
                          {a.interval === "per-event" && a.dateLabel?.toLowerCase().includes("sale")
                            ? "Auto-renews the same sale each month. Cancel any time."
                            : a.interval === "per-event" && (a.dateLabel?.toLowerCase().includes("class") || a.dateLabel?.toLowerCase().includes("workshop"))
                            ? "Auto-renews the same class each month. Cancel any time."
                            : a.interval === "per-event"
                            ? "Auto-renews the same event each month. Cancel any time."
                            : ""}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Date picker for date-required add-ons */}
                  {checked && a.dateRequired && (
                    <div className="px-4 pb-4 pl-12 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          htmlFor={`addon-date-${a.id}`}
                          className="text-base font-semibold text-stone-900"
                        >
                          {a.dateLabel ?? "Start date"}
                        </label>
                        <input
                          id={`addon-date-${a.id}`}
                          type="date"
                          min={todayIso()}
                          value={purchase?.startDate ?? todayIso()}
                          onChange={(e) => updateAddonDate(a.id, e.target.value)}
                          className="min-h-touch px-3 py-2 text-base bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                      {purchase?.startDate && (
                        <p className="text-base text-stone-800">
                          <span className="font-semibold">
                            {a.interval === "per-event" ? "Listed on " : "Live "}
                            {formatDateShort(purchase.startDate)}
                          </span>
                          {purchase.startDate !== purchase.endDate && (
                            <>
                              {" "}→ {formatDateShort(purchase.endDate)}
                            </>
                          )}
                          {a.interval !== "per-event" && (
                            <>
                              {" "}·{" "}
                              <span className="text-stone-700">
                                Reminder email sent {formatDateShort(reminderDate)}
                              </span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {errFor("addons") && (
            <p className="mt-2 text-base text-red-700 font-semibold">{errFor("addons")}</p>
          )}
        </fieldset>

        {/* Refund + acknowledgement box */}
        <div className="rounded-lg border-2 border-stone-500 bg-stone-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <p className="text-base text-stone-800">
              Listings are reviewed by our team within 24 hours.{" "}
              <strong>Should your posting not be approved, you will receive a full refund.</strong>{" "}
              Thank you for choosing to enhance the lives of seniors.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="cfield-agreedToContact"
              type="checkbox"
              checked={form.agreedToContact}
              onChange={onChange("agreedToContact")}
              onBlur={onBlur("agreedToContact")}
              className="mt-1 w-5 h-5 shrink-0"
            />
            <span className="text-base text-stone-800">
              I understand I may be contacted for clarification.
            </span>
          </label>
          {errFor("agreedToContact") && (
            <p className="text-base text-red-700 font-semibold">
              {errFor("agreedToContact")}
            </p>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="cfield-agreedToTerms"
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={onChange("agreedToTerms")}
              onBlur={onBlur("agreedToTerms")}
              className="mt-1 w-5 h-5 shrink-0"
            />
            <span className="text-base text-stone-800">
              I agree to the{" "}
              <Link href="/terms/" className="font-semibold text-blue-700 underline hover:text-blue-800">
                Terms of Service
              </Link>{" "}
              and the $10/month recurring subscription.
            </span>
          </label>
          {errFor("agreedToTerms") && (
            <p className="text-base text-red-700 font-semibold">
              {errFor("agreedToTerms")}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Link
            href="/list-business/profile/"
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-stone-500 disabled:border-stone-500"
          >
            {submitting ? "Processing…" : <>Pay {formatCAD(tax.total)} now <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>

      {/* RIGHT — order summary */}
      <aside className="bg-white border-2 border-black rounded-lg p-6 h-fit lg:sticky lg:top-24">
        <h2 className="text-lg font-display font-black text-stone-900 mb-4">
          Order summary
        </h2>
        <dl className="text-base text-stone-800 space-y-2">
          <div className="flex justify-between">
            <dt>Monthly subscription</dt>
            <dd>{formatCAD(tax.base)}</dd>
          </div>
          {form.addons.length > 0 && (
            <>
              {form.addons.map((purchase) => {
                const a = getAddon(purchase.id);
                if (!a) return null;
                return (
                  <div key={purchase.id} className="flex justify-between text-stone-800">
                    <dt className="pr-2">
                      {a.title}
                      <span className="block text-base text-stone-700">
                        {formatInterval(a.interval)}
                        {purchase.startDate && (
                          <>
                            {" · "}
                            {formatDateShort(purchase.startDate)}
                            {purchase.startDate !== purchase.endDate && (
                              <> – {formatDateShort(purchase.endDate)}</>
                            )}
                          </>
                        )}
                      </span>
                    </dt>
                    <dd>{formatCAD(a.price)}</dd>
                  </div>
                );
              })}
              <div className="flex justify-between text-stone-700 border-t border-stone-200 pt-2">
                <dt>Subtotal (add-ons)</dt>
                <dd>{formatCAD(tax.addonsSubtotal)}</dd>
              </div>
            </>
          )}
          <div className="flex justify-between text-stone-700">
            <dt>
              {tax.label}{" "}
              <span className="text-stone-600">
                ({(tax.rate * 100).toFixed(tax.rate % 1 ? 3 : 0).replace(/\.?0+$/, "")}%)
              </span>
            </dt>
            <dd>{formatCAD(tax.tax)}</dd>
          </div>
          <div className="border-t-2 border-stone-300 pt-2 mt-2 flex justify-between text-lg font-bold">
            <dt>Total due today</dt>
            <dd>{formatCAD(tax.total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-base text-stone-700">
          Renews monthly. Cancel any time from your dashboard — no cancellation fee.
          Add-ons are billed with your subscription and can be turned off any time.
        </p>
        <ul className="mt-4 space-y-2 text-base text-stone-800">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>Full business profile</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>Listed in all relevant categories</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>Direct contact from seniors</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>Reviews &amp; ratings</span>
          </li>
        </ul>
        <div className="mt-4 flex items-center gap-2 text-base text-stone-700">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Secure checkout</span>
        </div>
      </aside>
    </form>
  );
}
