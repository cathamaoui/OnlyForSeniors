"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Globe,
  Image as ImageIcon,
  Info,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { getAllCategories } from "@/lib/businesses";
import { PROVINCES, type ProvinceCode } from "@/lib/canadaTax";
import { loadSignup } from "@/lib/signup";
import {
  addUserListing,
  nextUserListingId,
  type UserListing,
} from "@/lib/userListings";
import { citiesFor } from "@/lib/canadaCities";
import { LANGUAGES, OTHER_LANGUAGES, languageName } from "@/lib/languages";

type ListingType = "service" | "event" | "product";

type Form = {
  type: ListingType;
  name: string;
  tagline: string;
  description: string;
  categorySlug: string;
  subcategorySlug: string;
  phone: string;
  contactPhone: string;
  email: string;
  website: string;
  city: string;
  province: ProvinceCode | "";
  serviceArea: string;
  priceRange: "" | "$" | "$$" | "$$$" | "$$$$" | "Free";
  cost: string;
  costUnit: "" | "per-hour" | "per-day" | "per-service" | "estimate";
  image: string;
  tags: string;
  languages: string[];   // language codes from lib/languages.ts
  otherLanguage: string; // free-text or selected from the "other" list
};

type Errors = Partial<Record<keyof Form | "agreed", string>>;

function validate(f: Form, agreed: boolean): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Listing name is required.";
  else if (f.name.trim().length < 3) e.name = "Use at least 3 characters.";
  if (!f.tagline.trim()) e.tagline = "A one-line tagline helps seniors scan your listing.";
  else if (f.tagline.length > 120) e.tagline = "Keep the tagline under 120 characters.";
  if (!f.description.trim()) e.description = "Describe what you offer.";
  else if (f.description.trim().length < 50)
    e.description = "Please write at least 50 characters so seniors know what to expect.";
  if (!f.categorySlug) e.categorySlug = "Choose a category.";
  if (!f.phone.trim()) e.phone = "Phone is required.";
  else if (f.phone.replace(/\D/g, "").length < 10)
    e.phone = "Enter a 10-digit phone number.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))
    e.email = "Enter a valid email.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!agreed) e.agreed = "Please confirm the listings guidelines and refund policy.";
  return e;
}

const TYPE_LABELS: Record<ListingType, { title: string; hint: string; icon: string }> = {
  service: {
    title: "Service",
    hint: "Something you do for a senior (home care, dental, transport, handyman…)",
    icon: "🛠",
  },
  event: {
    title: "Event",
    hint: "A specific date, time, and place (workshop, social, info session…)",
    icon: "📅",
  },
  product: {
    title: "Product",
    hint: "Something you sell or deliver (medical supply, mobility aid, gift…)",
    icon: "📦",
  },
};

export function NewListingForm() {
  const router = useRouter();
  const cats = getAllCategories();
  const [mounted, setMounted] = useState(false);
  const [signup, setSignup] = useState<ReturnType<typeof loadSignup> | null>(null);
  const [form, setForm] = useState<Form>({
    type: "service",
    name: "",
    tagline: "",
    description: "",
    categorySlug: "",
    subcategorySlug: "",
    phone: "",
    contactPhone: "",
    email: "",
    website: "",
    city: "",
    province: "",
    serviceArea: "",
    priceRange: "",
    cost: "",
    costUnit: "" as Form["costUnit"],
    image: "",
    tags: "",
    languages: [] as string[],
    otherLanguage: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Form | "agreed", boolean>>>({});
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [agreedContact, setAgreedContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const s = loadSignup();
    if (!s.completedSteps) {
      router.replace("/list-business/");
      return;
    }
    setSignup(s);
    const acct = s.account ?? {};
    const prof = s.profile ?? {};
    setForm((prev) => ({
      ...prev,
      categorySlug: prof.categorySlug ?? "",
      subcategorySlug: prof.subcategorySlug ?? "",
      phone: acct.phone ?? "",
      email: acct.email ?? "",
      website: prof.website ?? "",
      city: prof.city ?? "",
      province: (prof.province as ProvinceCode) ?? "",
      serviceArea: prof.serviceArea ?? "",
    }));
    setMounted(true);
  }, [router]);

  const selectedCat = cats.find((c) => c.slug === form.categorySlug);

  const onChange = <K extends keyof Form>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...form, [k]: e.target.value };
      setForm(next);
      if (touched[k]) setErrors(validate(next, agreedGuidelines && agreedContact));
    };

  const onBlur = (k: keyof Form) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form, agreedGuidelines && agreedContact));
  };

  const setType = (t: ListingType) => {
    setForm((prev) => ({ ...prev, type: t }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form, agreedGuidelines && agreedContact);
    setErrors(v);
    setTouched({
      name: true,
      tagline: true,
      description: true,
      categorySlug: true,
      phone: true,
      email: true,
      city: true,
      agreed: true,
    });
    if (Object.keys(v).length > 0) {
      const firstErrKey = Object.keys(v)[0];
      const el = document.getElementById(`nfield-${firstErrKey}`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    const id = nextUserListingId();
    // Build the description-side note for cost + languages so they show up
    // on the public card even though the underlying Business type doesn't have
    // dedicated fields for them yet.
    const costLine =
      form.cost && form.costUnit
        ? `\n\nCost: $${form.cost} ${
            form.costUnit === "per-hour"
              ? "per hour"
              : form.costUnit === "per-day"
              ? "per day"
              : form.costUnit === "per-service"
              ? "per service"
              : "(estimate)"
          }`
        : "";
    const languageLine =
      form.languages.length > 0 || form.otherLanguage
        ? `\n\nLanguages: ${[
            ...form.languages.map((c) => languageName(c)),
            form.otherLanguage,
          ]
            .filter(Boolean)
            .join(", ")}`
        : "";
    const fullDescription = form.description.trim() + costLine + languageLine;

    const listing: UserListing = {
      id,
      ownerEmail: (signup?.account?.email ?? "").toLowerCase(),
      status: "pending",
      submittedAt: new Date().toISOString(),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: fullDescription,
      categorySlug: form.categorySlug,
      subcategorySlug: form.subcategorySlug || "",
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim() || undefined,
      address: undefined,
      city: form.city.trim(),
      province: (form.province as string) || "ON",
      postalCode: "",
      priceRange: form.priceRange || undefined,
      isFeatured: false,
      isVerified: false,
      rating: undefined,
      reviewCount: undefined,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8),
      hours: undefined,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
    };
    addUserListing(listing);
    setTimeout(() => {
      setSuccess({ id, name: listing.name });
    }, 500);
  };

  if (!mounted) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border-2 border-black rounded-lg p-6 sm:p-8 text-center">
          <div className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-blue-100 mb-4">
            <CheckCircle2 className="w-9 h-9 text-blue-700" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            Listing received
          </h1>
          <p className="mt-3 text-lg text-stone-700 max-w-xl mx-auto">
            <strong>{success.name}</strong> has been submitted. Our team will
            review it within 24 hours. We&apos;ll email{" "}
            <strong>{signup?.account?.email}</strong> when it&apos;s live.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/list-business/dashboard/"
              className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
            >
              Back to dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccess(null);
                setForm((prev) => ({
                  ...prev,
                  name: "",
                  tagline: "",
                  description: "",
                  image: "",
                  tags: "",
                }));
              }}
              className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 text-lg font-bold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
            >
              <Sparkles className="w-5 h-5" /> Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errFor = (k: keyof Form | "agreed") => (touched[k] ? errors[k] : undefined);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/list-business/dashboard/"
          className="inline-flex items-center gap-2 text-base font-semibold text-stone-800 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-display font-black text-stone-900">
          Create a listing
        </h1>
        <p className="mt-2 text-lg text-stone-700">
          Add a service, event, or product. Most listings go live within 24 hours.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 space-y-7"
      >
        {/* Type */}
        <fieldset>
          <legend className="text-lg font-display font-bold text-stone-900 mb-3">
            What are you posting?
          </legend>
          <div className="grid sm:grid-cols-3 gap-3">
            {(Object.keys(TYPE_LABELS) as ListingType[]).map((t) => {
              const active = form.type === t;
              const meta = TYPE_LABELS[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={active}
                  className={[
                    "text-left p-4 rounded-lg border-2 transition-colors min-h-touch",
                    active
                      ? "border-blue-700 bg-blue-50"
                      : "border-stone-500 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <span className="text-2xl block mb-1" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <span className="block text-base font-bold text-stone-900">
                    {meta.title}
                  </span>
                  <span className="block text-base text-stone-700 mt-1 leading-snug">
                    {meta.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Name + tagline */}
        <div>
          <label htmlFor="nfield-name" className="block text-base font-bold text-black mb-2">
            Listing name
          </label>
          <input
            id="nfield-name"
            type="text"
            value={form.name}
            onChange={onChange("name")}
            onBlur={onBlur("name")}
            aria-invalid={Boolean(errFor("name"))}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="e.g. Mobile Dental Hygiene by Lisa"
          />
          {errFor("name") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("name")}</p>}
        </div>

        <div>
          <label htmlFor="nfield-tagline" className="block text-base font-bold text-black mb-2">
            Tagline
            <span className="ml-2 text-base font-normal text-stone-700">
              one short sentence that sells the service
            </span>
          </label>
          <input
            id="nfield-tagline"
            type="text"
            value={form.tagline}
            onChange={onChange("tagline")}
            onBlur={onBlur("tagline")}
            aria-invalid={Boolean(errFor("tagline"))}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="e.g. Friendly mobile dental cleanings, in your home"
            maxLength={120}
          />
          <div className="mt-1 flex items-center justify-between">
            {errFor("tagline") ? (
              <p className="text-base text-red-700 font-semibold">{errFor("tagline")}</p>
            ) : (
              <span />
            )}
            <span className="text-base text-stone-700">
              {form.tagline.length} / 120
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="nfield-description" className="block text-base font-bold text-black mb-2">
            Description
          </label>
          <textarea
            id="nfield-description"
            rows={6}
            value={form.description}
            onChange={onChange("description")}
            onBlur={onBlur("description")}
            aria-invalid={Boolean(errFor("description"))}
            className="w-full px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="What do you do? Who's it for? How does it work? What areas do you serve? Speak plainly — seniors will read this."
          />
          {errFor("description") ? (
            <p className="mt-2 text-base text-red-700 font-semibold">{errFor("description")}</p>
          ) : (
            <p className="mt-2 text-base text-stone-700">
              {(form.description ?? "").length} / 50 minimum
            </p>
          )}
        </div>

        {/* Category + sub */}
        <fieldset className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nfield-categorySlug" className="block text-base font-bold text-black mb-2">
              Category
            </label>
            <select
              id="nfield-categorySlug"
              value={form.categorySlug}
              onChange={onChange("categorySlug")}
              onBlur={onBlur("categorySlug")}
              aria-invalid={Boolean(errFor("categorySlug"))}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Choose a category…</option>
              {cats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {errFor("categorySlug") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("categorySlug")}</p>}
          </div>
          <div>
            <label htmlFor="nfield-subcategorySlug" className="block text-base font-bold text-black mb-2">
              Sub-category (optional)
            </label>
            <select
              id="nfield-subcategorySlug"
              value={form.subcategorySlug}
              onChange={onChange("subcategorySlug")}
              disabled={!selectedCat || selectedCat.subcategories.length === 0}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 disabled:bg-stone-100 disabled:text-stone-500"
            >
              <option value="">None</option>
              {selectedCat?.subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Location — province first, then city */}
        <fieldset className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nfield-province" className="block text-base font-bold text-black mb-2">
              Province
            </label>
            <select
              id="nfield-province"
              value={form.province}
              onChange={onChange("province")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Choose…</option>
              {PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="nfield-city" className="block text-base font-bold text-black mb-2">
              City
              <span className="ml-2 text-base font-normal text-stone-700">
                {form.province
                  ? `${citiesFor(form.province as ProvinceCode).length} popular cities in ${
                      PROVINCES.find((p) => p.code === form.province)?.name ?? form.province
                    }`
                  : "Pick a province first to see popular cities"}
              </span>
            </label>
            <input
              id="nfield-city"
              type="text"
              autoComplete="address-level2"
              list="cities-datalist"
              value={form.city}
              onChange={onChange("city")}
              onBlur={onBlur("city")}
              aria-invalid={Boolean(errFor("city"))}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder={
                form.province
                  ? "Pick from the list or type your city"
                  : "Pick a province first"
              }
            />
            <datalist id="cities-datalist">
              {citiesFor(form.province as ProvinceCode).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errFor("city") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("city")}</p>}
          </div>
        </fieldset>

        <div>
          <label htmlFor="nfield-serviceArea" className="block text-base font-bold text-black mb-2">
            Service area
          </label>
          <input
            id="nfield-serviceArea"
            type="text"
            value={form.serviceArea}
            onChange={onChange("serviceArea")}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="e.g. Greater Toronto Area, or All of BC"
          />
          <p className="mt-1 flex items-center gap-1 text-base text-stone-700">
            <MapPin className="w-4 h-4" /> Where will you travel to?
          </p>
        </div>

        {/* Contact */}
        <fieldset className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nfield-phone" className="block text-base font-bold text-black mb-2">
              Phone
            </label>
            <input
              id="nfield-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={onChange("phone")}
              onBlur={onBlur("phone")}
              aria-invalid={Boolean(errFor("phone"))}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="(416) 555-0142"
            />
            {errFor("phone") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("phone")}</p>}
          </div>
          <div>
            <label htmlFor="nfield-contactPhone" className="block text-base font-bold text-black mb-2">
              Contact phone (optional)
              <span className="ml-2 text-base font-normal text-stone-700">
                alternate or direct line
              </span>
            </label>
            <input
              id="nfield-contactPhone"
              type="tel"
              autoComplete="tel-national"
              value={form.contactPhone}
              onChange={onChange("contactPhone")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="e.g. cell or after-hours number"
            />
          </div>
        </fieldset>
        <div>
          <label htmlFor="nfield-email" className="block text-base font-bold text-black mb-2">
            Email
          </label>
          <input
            id="nfield-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange("email")}
            onBlur={onBlur("email")}
            aria-invalid={Boolean(errFor("email"))}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="you@business.ca"
          />
          {errFor("email") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("email")}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nfield-website" className="block text-base font-bold text-black mb-2">
              Website (optional)
            </label>
            <input
              id="nfield-website"
              type="url"
              value={form.website}
              onChange={onChange("website")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="https://yourbusiness.ca"
            />
          </div>
          <div>
            <label htmlFor="nfield-priceRange" className="block text-base font-bold text-black mb-2">
              Price range (optional)
            </label>
            <select
              id="nfield-priceRange"
              value={form.priceRange}
              onChange={onChange("priceRange")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Not applicable</option>
              <option value="Free">Free</option>
              <option value="$">$ — Budget</option>
              <option value="$$">$$ — Moderate</option>
              <option value="$$$">$$$ — Premium</option>
              <option value="$$$$">$$$$ — Luxury</option>
            </select>
          </div>
        </div>

        {/* Cost (optional) — useful for services with a set price */}
        <fieldset>
          <legend className="text-base font-bold text-stone-900 mb-1">
            Cost (optional)
            <span className="ml-2 text-base font-normal text-stone-700">
              If you have a set price, list it here
            </span>
          </legend>
          <div className="grid sm:grid-cols-[1fr_1fr] gap-4">
            <div>
              <label htmlFor="nfield-cost" className="block text-base font-bold text-black mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-stone-700 font-bold">
                  $
                </span>
                <input
                  id="nfield-cost"
                  type="text"
                  inputMode="decimal"
                  value={form.cost}
                  onChange={onChange("cost")}
                  className="w-full min-h-touch pl-9 pr-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="e.g. 75"
                />
              </div>
            </div>
            <div>
              <label htmlFor="nfield-costUnit" className="block text-base font-bold text-black mb-2">
                Per
              </label>
              <select
                id="nfield-costUnit"
                value={form.costUnit}
                onChange={onChange("costUnit")}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Choose…</option>
                <option value="per-hour">Per hour</option>
                <option value="per-day">Per day</option>
                <option value="per-service">Per service</option>
                <option value="estimate">Estimate</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Languages spoken — multi-select chips + "other" dropdown */}
        <fieldset>
          <legend className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Languages className="w-5 h-5" /> Languages spoken
          </legend>
          <p className="text-base text-stone-700 mb-3">
            Tap any language you can serve seniors in. Helps families find you.
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => {
              const active = form.languages.includes(l.code);
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      languages: active
                        ? prev.languages.filter((c) => c !== l.code)
                        : [...prev.languages, l.code],
                    }));
                  }}
                  aria-pressed={active}
                  className={[
                    "min-h-touch px-3 py-2 text-base font-semibold border-2 rounded-lg transition-colors",
                    active
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-stone-800 border-stone-500 hover:bg-stone-100",
                  ].join(" ")}
                >
                  {l.name}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label htmlFor="nfield-otherLanguage" className="block text-base font-bold text-black mb-2">
              Other language (optional)
              <span className="ml-2 text-base font-normal text-stone-700">
                pick from the list or type your own
              </span>
            </label>
            <div className="flex gap-2">
              <input
                id="nfield-otherLanguage"
                type="text"
                list="other-languages"
                value={form.otherLanguage}
                onChange={onChange("otherLanguage")}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                placeholder="e.g. Maltese"
              />
              <datalist id="other-languages">
                {OTHER_LANGUAGES.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>
          </div>
          {(form.languages.length > 0 || form.otherLanguage) && (
            <p className="mt-3 text-base text-stone-800">
              <span className="font-bold">You speak: </span>
              {[
                ...form.languages.map((c) => languageName(c)),
                form.otherLanguage,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="nfield-image" className="block text-base font-bold text-black mb-2">
            Image URL (optional)
          </label>
          <div className="relative">
            <ImageIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-700" />
            <input
              id="nfield-image"
              type="url"
              value={form.image}
              onChange={onChange("image")}
              className="w-full min-h-touch pl-11 pr-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="https://… (link to a photo of your service)"
            />
          </div>
          <p className="mt-1 text-base text-stone-700">
            Paste a link to a photo (your website, Facebook, an image host). We&apos;ll show a placeholder until you add one.
          </p>
        </div>

        <div>
          <label htmlFor="nfield-tags" className="block text-base font-bold text-black mb-2">
            Tags (optional)
          </label>
          <div className="relative">
            <TagIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-700" />
            <input
              id="nfield-tags"
              type="text"
              value={form.tags}
              onChange={onChange("tags")}
              className="w-full min-h-touch pl-11 pr-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="e.g. 24/7, Mobile, Veterans, Wheelchair-accessible"
            />
          </div>
          <p className="mt-1 text-base text-stone-700">
            Up to 8 short tags, separated by commas. Helps seniors find you in search.
          </p>
        </div>

        {/* Refund + clarify policy */}
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
              type="checkbox"
              checked={agreedContact}
              onChange={(e) => {
                setAgreedContact(e.target.checked);
                if (touched.agreed) setErrors(validate(form, agreedGuidelines && e.target.checked));
              }}
              onBlur={() => setTouched((t) => ({ ...t, agreed: true }))}
              className="mt-1 w-5 h-5 shrink-0"
            />
            <span className="text-base text-stone-800">
              I understand I may be contacted for clarification.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedGuidelines}
              onChange={(e) => {
                setAgreedGuidelines(e.target.checked);
                if (touched.agreed) setErrors(validate(form, e.target.checked && agreedContact));
              }}
              onBlur={() => setTouched((t) => ({ ...t, agreed: true }))}
              className="mt-1 w-5 h-5 shrink-0"
            />
            <span className="text-base text-stone-800">
              I agree to the listing guidelines and the{" "}
              <Link href="/terms/" className="font-semibold text-blue-700 underline hover:text-blue-800">
                Terms of Service
              </Link>
              .
            </span>
          </label>
          {errFor("agreed") && <p className="text-base text-red-700 font-semibold">{errFor("agreed")}</p>}
        </div>

        <div className="flex items-start gap-2 text-base text-stone-700">
          <Info className="w-4 h-4 mt-0.5 text-stone-700 shrink-0" />
          <span>
            You can edit or delete this listing any time from your dashboard.
          </span>
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Link
            href="/list-business/dashboard/"
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            Cancel
          </Link>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center justify-center gap-2 min-h-touch px-6 py-3 text-lg font-bold text-stone-900 bg-white border-2 border-black rounded-lg hover:bg-stone-100"
            >
              <Eye className="w-5 h-5" /> Preview
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-stone-500 disabled:border-stone-500"
            >
              {submitting ? "Submitting…" : <>Submit for review <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      </form>

      {showPreview && <PreviewModal form={form} onClose={() => setShowPreview(false)} signup={signup} cats={cats} />}
    </div>
  );
}

function PreviewModal({
  form,
  onClose,
  signup,
  cats,
}: {
  form: Form;
  onClose: () => void;
  signup: ReturnType<typeof loadSignup> | null;
  cats: ReturnType<typeof getAllCategories>;
}) {
  const cat = cats.find((c) => c.slug === form.categorySlug);
  const sub = cat?.subcategories.find((s) => s.slug === form.subcategorySlug);
  const costLabel =
    form.cost && form.costUnit
      ? `$${form.cost} ${
          form.costUnit === "per-hour"
            ? "/ hour"
            : form.costUnit === "per-day"
            ? "/ day"
            : form.costUnit === "per-service"
            ? "/ service"
            : "(estimate)"
        }`
      : null;
  const languageChips = [
    ...form.languages.map((c) => languageName(c)),
    form.otherLanguage,
  ].filter(Boolean);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-stone-200 sticky top-0 bg-white rounded-t-lg z-10">
          <div>
            <p className="text-base font-semibold text-blue-700">Preview</p>
            <h2 id="preview-title" className="text-xl font-display font-black text-stone-900">
              How seniors will see your listing
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 text-stone-800 hover:text-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Directory card preview */}
          <article className="bg-white border-2 border-black rounded-lg overflow-hidden">
            <div className="relative aspect-[4/3] bg-stone-100 border-b-2 border-black">
              {/* Using a regular <img> so we don't need to know the next/image
                  remote-pattern config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  form.image.trim() ||
                  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop"
                }
                alt={form.name || "Listing photo"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-display font-black text-stone-900">
                  {form.name || "Listing name"}
                </h3>
              </div>
              {form.tagline && (
                <p className="text-base text-stone-700">{form.tagline}</p>
              )}
              <div className="flex items-center gap-1 text-base text-stone-800 flex-wrap">
                <MapPin className="w-4 h-4" />
                <span>
                  {form.city || "City"}
                  {form.province && `, ${form.province}`}
                </span>
                {sub && (
                  <>
                    <span>·</span>
                    <span>{sub.name}</span>
                  </>
                )}
              </div>
              {form.description && (
                <p className="text-base text-stone-800 whitespace-pre-line">
                  {form.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200">
                {form.priceRange && (
                  <span className="text-base font-bold text-stone-900">
                    {form.priceRange}
                  </span>
                )}
                {costLabel && (
                  <span className="text-base font-bold text-blue-700">
                    {costLabel}
                  </span>
                )}
                {(signup?.account?.businessName || "Your business") && (
                  <span className="text-base text-stone-700">
                    · {signup?.account?.businessName || "Your business"}
                  </span>
                )}
              </div>
              {form.tags && (
                <div className="flex flex-wrap gap-1">
                  {form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="text-base px-2 py-0.5 bg-stone-100 border border-stone-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
              {languageChips.length > 0 && (
                <div className="flex items-start gap-2 pt-2 border-t border-stone-200">
                  <Languages className="w-4 h-4 mt-0.5 text-blue-700 shrink-0" />
                  <p className="text-base text-stone-800">
                    <span className="font-bold">Speaks: </span>
                    {languageChips.join(", ")}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-stone-200">
                <a
                  href={`tel:${form.phone}`}
                  className="inline-flex items-center justify-center gap-2 min-h-touch px-4 py-2 text-base font-bold bg-black text-white rounded-lg"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`mailto:${form.email}`}
                  className="inline-flex items-center justify-center gap-2 min-h-touch px-4 py-2 text-base font-bold bg-white text-black border-2 border-black rounded-lg"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
                {form.contactPhone && (
                  <a
                    href={`tel:${form.contactPhone}`}
                    className="inline-flex items-center justify-center gap-2 min-h-touch px-4 py-2 text-base font-bold bg-white text-black border-2 border-stone-500 rounded-lg"
                  >
                    <Phone className="w-4 h-4" /> {form.contactPhone}
                  </a>
                )}
                {form.website && (
                  <a
                    href={form.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-touch px-4 py-2 text-base font-bold bg-white text-black border-2 border-stone-500 rounded-lg"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </article>

          {/* Category + service area line */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-lg p-4 text-base text-stone-800">
            <p>
              <span className="font-bold">Category:</span>{" "}
              {cat ? `${cat.icon} ${cat.name}` : "Not selected"}{" "}
              {sub && <span className="text-stone-700">· {sub.name}</span>}
            </p>
            {form.serviceArea && (
              <p className="mt-1">
                <span className="font-bold">Service area:</span> {form.serviceArea}
              </p>
            )}
            <p className="mt-1 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="font-bold">Status:</span> Pending review (will go live
              within 24 hours)
            </p>
          </div>

          <p className="text-base text-stone-700">
            This is a preview. Your listing will look like this on{" "}
            <Link href="/" className="font-semibold text-blue-700 underline hover:text-blue-800">
              onlyforseniors.ca
            </Link>{" "}
            once it&apos;s approved.
          </p>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t-2 border-stone-200 bg-stone-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            Back to edit
          </button>
        </div>
      </div>
    </div>
  );
}
