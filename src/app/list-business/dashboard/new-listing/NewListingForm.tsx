"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
  Users,
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
  contactName: string;
  contactPhone: string;
  email: string;
  website: string;
  city: string;
  province: ProvinceCode | "";
  serviceArea: string;
  cost: string;
  costUnit: "" | "per-hour" | "per-day" | "per-service" | "per-person" | "per-family" | "estimate" | "other";
  costUnitOther: string; // free-text when costUnit === "other"
  image: string;
  tags: string;
  languages: string[];   // language codes from lib/languages.ts
  otherLanguage: string; // free-text or selected from the "other" list
  // Capacity (events only): "unlimited" or "limited-N" where N is a number
  capacityMode: "" | "unlimited" | "limited";
  capacityLimit: string; // only used when capacityMode === "limited"
  // Accessibility options (events and services)
  accessibility: {
    wheelchairAccessible: boolean;
    hearingLoop: boolean;
    elevator: boolean;
    accessibleParking: boolean;
    accessibleWashroom: boolean;
    serviceAnimalsWelcome: boolean;
    largePrintMaterials: boolean;
    quietSpace: boolean;
  };
  accessibilityNotes: string; // free-text "other"
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
    contactName: "",
    contactPhone: "",
    email: "",
    website: "",
    city: "",
    province: "",
    serviceArea: "",
    cost: "",
    costUnit: "" as Form["costUnit"],
    costUnitOther: "",
    image: "",
    tags: "",
    languages: [] as string[],
    otherLanguage: "",
    capacityMode: "" as Form["capacityMode"],
    capacityLimit: "",
    accessibility: {
      wheelchairAccessible: false,
      hearingLoop: false,
      elevator: false,
      accessibleParking: false,
      accessibleWashroom: false,
      serviceAnimalsWelcome: false,
      largePrintMaterials: false,
      quietSpace: false,
    },
    accessibilityNotes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Form | "agreed", boolean>>>({});
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [agreedContact, setAgreedContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [provinceChangeNote, setProvinceChangeNote] = useState<string | null>(null);
  const [langPanelOpen, setLangPanelOpen] = useState(false);

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

  /** Changing the province means the current city is likely wrong. Clear it
   *  so the user is forced to pick a city that actually belongs to the new
   *  province. The on-screen datalist will only show cities for the new
   *  province, so re-typing takes one click. */
  const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value as ProvinceCode | "";
    const oldProvince = form.province;
    const knownCities = newProvince ? citiesFor(newProvince) : [];
    const cityStillValid = knownCities.includes(form.city);
    if (oldProvince && newProvince && oldProvince !== newProvince && form.city && !cityStillValid) {
      // Friendly explainer in a tiny inline notice — gone after 4s
      setProvinceChangeNote(
        `We cleared your city because "${form.city}" is in ${PROVINCES.find((p) => p.code === oldProvince)?.name ?? oldProvince}, not ${PROVINCES.find((p) => p.code === newProvince)?.name ?? newProvince}.`
      );
      setTimeout(() => setProvinceChangeNote(null), 6000);
    }
    setForm((prev) => ({ ...prev, province: newProvince, city: cityStillValid ? prev.city : "" }));
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
              : form.costUnit === "per-person"
              ? "per person"
              : form.costUnit === "per-family"
              ? "per family"
              : form.costUnit === "other"
              ? form.costUnitOther.trim() || "(custom unit)"
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
    const capacityLine =
      form.type === "event" && form.capacityMode === "unlimited"
        ? "\n\nCapacity: unlimited — anyone can attend."
        : form.type === "event" && form.capacityMode === "limited" && form.capacityLimit
        ? `\n\nCapacity: limited to ${form.capacityLimit} guest${form.capacityLimit === "1" ? "" : "s"}.`
        : "";

    const accessLabels: Array<[keyof Form["accessibility"], string]> = [
      ["wheelchairAccessible", "Wheelchair accessible"],
      ["hearingLoop", "Hearing loop"],
      ["elevator", "Elevator on site"],
      ["accessibleParking", "Accessible parking"],
      ["accessibleWashroom", "Accessible washroom"],
      ["serviceAnimalsWelcome", "Service animals welcome"],
      ["largePrintMaterials", "Large-print materials"],
      ["quietSpace", "Quiet space available"],
    ];
    const pickedAccess = accessLabels
      .filter(([k]) => form.accessibility[k])
      .map(([, l]) => l);
    const accessibilityLine =
      pickedAccess.length > 0 || form.accessibilityNotes.trim()
        ? `\n\nAccessibility: ${[
            ...pickedAccess,
            form.accessibilityNotes.trim(),
          ]
            .filter(Boolean)
            .join("; ")}.`
        : "";

    const fullDescription =
      form.description.trim() +
      costLine +
      languageLine +
      capacityLine +
      accessibilityLine;

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

        {/* Name + tagline -- field label and placeholder change with the
            selected type so the user always knows what they're naming */}
        <div>
          <label htmlFor="nfield-name" className="block text-base font-bold text-black mb-2">
            {form.type === "service" && "Service name"}
            {form.type === "event" && "Event name"}
            {form.type === "product" && "Product name"}
          </label>
          <input
            id="nfield-name"
            type="text"
            value={form.name}
            onChange={onChange("name")}
            onBlur={onBlur("name")}
            aria-invalid={Boolean(errFor("name"))}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder={
              form.type === "service"
                ? "e.g. Mobile Dental Hygiene by Lisa"
                : form.type === "event"
                ? "e.g. Spring Open House at Moncton Library"
                : "e.g. Easy-Open Jar Opener — 3-pack"
            }
          />
          {errFor("name") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("name")}</p>}
        </div>

        <div>
          <label htmlFor="nfield-tagline" className="block text-base font-bold text-black mb-2">
            Tagline
            <span className="ml-2 text-base font-normal text-stone-700">
              {form.type === "service" && "one short sentence that sells the service"}
              {form.type === "event" && "when, where, and why seniors should come"}
              {form.type === "product" && "what it is and why seniors (or their families) need it"}
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
              onChange={onProvinceChange}
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

        {/* Contact -- business phone (required) + optional contact person
            (name + their phone). Keeps the two phone numbers clearly
            distinguished so they don't look like duplicates. */}
        <fieldset className="space-y-4">
          <div>
            <label htmlFor="nfield-phone" className="block text-base font-bold text-black mb-2">
              Business phone
              <span className="ml-2 text-base font-normal text-stone-700">
                the main number seniors will call
              </span>
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
          <div className="rounded-lg border-2 border-stone-200 bg-stone-50 p-4 space-y-4">
            <p className="text-base font-semibold text-stone-900">
              List a Contact <span className="font-normal text-stone-700">(Optional — leave blank to skip)</span>
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nfield-contactName" className="block text-base font-bold text-black mb-2">
                  Contact name
                </label>
                <input
                  id="nfield-contactName"
                  type="text"
                  autoComplete="name"
                  value={form.contactName}
                  onChange={onChange("contactName")}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="e.g. Lisa Chen, Manager"
                />
              </div>
              <div>
                <label htmlFor="nfield-contactPhone" className="block text-base font-bold text-black mb-2">
                  Contact phone
                </label>
                <input
                  id="nfield-contactPhone"
                  type="tel"
                  autoComplete="tel-national"
                  value={form.contactPhone}
                  onChange={onChange("contactPhone")}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="(416) 555-0143"
                />
              </div>
            </div>
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
                <option value="per-person">Per person</option>
                <option value="per-family">Per family</option>
                <option value="estimate">Estimate</option>
                <option value="other">Other (type your own)</option>
              </select>
            </div>
            {form.costUnit === "other" && (
              <div className="sm:col-span-2">
                <label htmlFor="nfield-costUnitOther" className="block text-base font-bold text-black mb-2">
                  Type your unit
                  <span className="ml-2 text-base font-normal text-stone-700">
                    e.g. "per visit", "per class", "per month"
                  </span>
                </label>
                <input
                  id="nfield-costUnitOther"
                  type="text"
                  maxLength={40}
                  value={form.costUnitOther}
                  onChange={onChange("costUnitOther")}
                  className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                  placeholder="per visit"
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* Capacity — only relevant for events. User picks "Unlimited"
            or "Limited to" with a number of guests. */}
        {form.type === "event" && (
          <fieldset className="rounded-lg border-2 border-stone-200 bg-white p-4 space-y-3">
            <legend className="text-base font-bold text-stone-900 px-2">
              Space Limited to
            </legend>
            <p className="text-base text-stone-700 -mt-1">
              Tell families if there's a cap on how many guests can attend.
            </p>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 min-h-touch cursor-pointer">
                <input
                  type="radio"
                  name="capacityMode"
                  value="unlimited"
                  checked={form.capacityMode === "unlimited"}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, capacityMode: "unlimited", capacityLimit: "" }))
                  }
                  className="w-5 h-5"
                />
                <span className="text-base font-semibold text-stone-900">
                  Unlimited — anyone can come
                </span>
              </label>
              <label className="inline-flex items-center gap-2 min-h-touch cursor-pointer">
                <input
                  type="radio"
                  name="capacityMode"
                  value="limited"
                  checked={form.capacityMode === "limited"}
                  onChange={() => setForm((prev) => ({ ...prev, capacityMode: "limited" }))}
                  className="w-5 h-5"
                />
                <span className="text-base font-semibold text-stone-900">Limited to</span>
                {form.capacityMode === "limited" && (
                  <input
                    id="nfield-capacityLimit"
                    type="number"
                    min={1}
                    max={1000}
                    value={form.capacityLimit}
                    onChange={onChange("capacityLimit")}
                    className="ml-1 w-28 min-h-touch px-3 py-2 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                    placeholder="e.g. 20"
                    aria-label="Maximum number of guests"
                  />
                )}
                {form.capacityMode === "limited" && (
                  <span className="text-base text-stone-700">guests</span>
                )}
              </label>
            </div>
          </fieldset>
        )}

        {/* Accessibility — for both events and in-person services.
            Common access checkboxes + a free-text "Other" notes field. */}
        {(form.type === "event" || form.type === "service") && (
          <fieldset className="rounded-lg border-2 border-stone-200 bg-white p-4 space-y-4">
            <legend className="text-base font-bold text-stone-900 px-2 flex items-center gap-2">
              <Accessibility className="w-5 h-5" /> Accessibility
            </legend>
            <p className="text-base text-stone-700 -mt-1">
              Check everything that's true. Helps families with mobility, hearing, vision, or sensory needs decide if this is right for them.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["wheelchairAccessible", "Wheelchair accessible"],
                ["hearingLoop", "Hearing loop / assistive listening"],
                ["elevator", "Elevator on site"],
                ["accessibleParking", "Accessible parking"],
                ["accessibleWashroom", "Accessible washroom"],
                ["serviceAnimalsWelcome", "Service animals welcome"],
                ["largePrintMaterials", "Large-print materials available"],
                ["quietSpace", "Quiet space available"],
              ] as const).map(([key, label]) => (
                <label
                  key={key}
                  className={[
                    "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors",
                    form.accessibility[key]
                      ? "border-blue-700 bg-blue-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={form.accessibility[key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, [key]: e.target.checked },
                      }))
                    }
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="text-base font-semibold text-stone-900">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="nfield-accessibilityNotes" className="block text-base font-bold text-black mb-2">
                Other accessibility notes <span className="font-normal text-stone-700">(optional)</span>
              </label>
              <textarea
                id="nfield-accessibilityNotes"
                rows={3}
                maxLength={300}
                value={form.accessibilityNotes}
                onChange={onChange("accessibilityNotes")}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
                placeholder="e.g. Sign-language interpreter on request, scent-free environment, step-free entrance at the side door."
              />
            </div>
          </fieldset>
        )}

        {/* Languages spoken — clickable chips. The list of languages is
            hidden until the user clicks "Pick languages". Picked languages
            appear in a separate "Selected" panel with × buttons to remove. */}
        <fieldset>
          <legend className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
            <Languages className="w-5 h-5" /> Languages spoken
          </legend>
          <p className="text-base text-stone-700 mb-3">
            Helps families find you. You can pick more than one.
          </p>

          {/* The "Pick languages" toggle button */}
          <button
            type="button"
            onClick={() => setLangPanelOpen((v) => !v)}
            aria-expanded={langPanelOpen}
            aria-controls="nfield-languages-panel"
            className={[
              "inline-flex items-center gap-2 min-h-touch px-5 py-3 text-base font-semibold border-2 rounded-lg",
              langPanelOpen
                ? "border-blue-700 bg-blue-50 text-blue-800"
                : "border-stone-500 bg-white text-stone-800 hover:bg-stone-100",
            ].join(" ")}
          >
            <Languages className="w-5 h-5" />
            {langPanelOpen
              ? "Hide language list"
              : form.languages.length + (form.otherLanguage.trim() ? 1 : 0) > 0
              ? `Pick languages (${form.languages.length + (form.otherLanguage.trim() ? 1 : 0)} selected)`
              : "Pick languages"}
            {langPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Hidden until expanded: list of language chips */}
          {langPanelOpen && (
            <div
              id="nfield-languages-panel"
              className="mt-3 rounded-lg border-2 border-stone-200 bg-stone-50 p-4"
            >
              <p className="text-base font-semibold text-stone-900 mb-2">
                Tap a language to add it. Tap again to remove.
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
                      {active && <Check className="w-4 h-4 inline mr-1" strokeWidth={3} />}
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected-languages panel — shows what was picked, with × to remove */}
          {(form.languages.length > 0 || form.otherLanguage.trim().length > 0) && (
            <div className="mt-3 rounded-lg border-2 border-blue-700 bg-blue-50 p-4">
              <p className="text-base font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-700" />
                You speak
                <span className="text-base font-normal text-stone-700">
                  ({form.languages.length + (form.otherLanguage.trim() ? 1 : 0)})
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {form.languages.map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 min-h-touch pl-3 pr-1 py-1 text-base font-semibold bg-white text-stone-900 border-2 border-blue-700 rounded-lg"
                  >
                    {languageName(code)}
                    <button
                      type="button"
                      aria-label={`Remove ${languageName(code)}`}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          languages: prev.languages.filter((c) => c !== code),
                        }))
                      }
                      className="ml-1 w-7 h-7 inline-flex items-center justify-center text-stone-700 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
                {form.otherLanguage.trim() && (
                  <span className="inline-flex items-center gap-1 min-h-touch pl-3 pr-1 py-1 text-base font-semibold bg-white text-stone-900 border-2 border-blue-700 rounded-lg">
                    {form.otherLanguage}
                    <button
                      type="button"
                      aria-label={`Remove ${form.otherLanguage}`}
                      onClick={() => setForm((prev) => ({ ...prev, otherLanguage: "" }))}
                      className="ml-1 w-7 h-7 inline-flex items-center justify-center text-stone-700 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Free-text "Other language" — always visible so the user can type
              even without opening the chip list */}
          <div className="mt-4">
            <label htmlFor="nfield-otherLanguage" className="block text-base font-bold text-black mb-2">
              Other language <span className="font-normal text-stone-700">(optional, type your own)</span>
            </label>
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
            : form.costUnit === "per-person"
            ? "/ person"
            : form.costUnit === "per-family"
            ? "/ family"
            : form.costUnit === "other"
            ? `/ ${form.costUnitOther.trim() || "unit"}`
            : "(estimate)"
        }`
      : null;
  const languageChips = [
    ...form.languages.map((c) => languageName(c)),
    form.otherLanguage,
  ].filter(Boolean);

  const accessLabels: Array<[keyof Form["accessibility"], string]> = [
    ["wheelchairAccessible", "Wheelchair accessible"],
    ["hearingLoop", "Hearing loop"],
    ["elevator", "Elevator on site"],
    ["accessibleParking", "Accessible parking"],
    ["accessibleWashroom", "Accessible washroom"],
    ["serviceAnimalsWelcome", "Service animals welcome"],
    ["largePrintMaterials", "Large-print materials"],
    ["quietSpace", "Quiet space available"],
  ];
  const pickedAccess = accessLabels
    .filter(([k]) => form.accessibility[k])
    .map(([, l]) => l);

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
              {form.type === "event" && (form.capacityMode === "unlimited" || (form.capacityMode === "limited" && form.capacityLimit)) && (
                <div className="flex items-start gap-2 pt-2 border-t border-stone-200">
                  <Users className="w-4 h-4 mt-0.5 text-blue-700 shrink-0" />
                  <p className="text-base text-stone-800">
                    {form.capacityMode === "unlimited" ? (
                      <><span className="font-bold">Capacity:</span> unlimited</>
                    ) : (
                      <><span className="font-bold">Capacity:</span> limited to {form.capacityLimit} guest{form.capacityLimit === "1" ? "" : "s"}</>
                    )}
                  </p>
                </div>
              )}
              {(pickedAccess.length > 0 || form.accessibilityNotes.trim()) && (
                <div className="flex items-start gap-2 pt-2 border-t border-stone-200">
                  <Accessibility className="w-4 h-4 mt-0.5 text-blue-700 shrink-0" />
                  <p className="text-base text-stone-800">
                    <span className="font-bold">Accessibility: </span>
                    {[...pickedAccess, form.accessibilityNotes.trim()].filter(Boolean).join("; ")}
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
