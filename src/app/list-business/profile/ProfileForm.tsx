"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/lib/businesses";
import { PROVINCES, type ProvinceCode } from "@/lib/canadaTax";
import { citiesFor } from "@/lib/canadaCities";
import { loadSignup, saveSignup, markStep, type BusinessProfile } from "@/lib/signup";

type Errors = Partial<Record<keyof BusinessProfile, string>>;

function validate(p: BusinessProfile): Errors {
  const e: Errors = {};
  if (!p.street?.trim()) e.street = "Street address is required.";
  if (!p.city?.trim()) e.city = "City is required.";
  if (!p.province) e.province = "Choose a province.";
  if (!p.postalCode?.trim()) e.postalCode = "Postal code is required.";
  else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(p.postalCode.trim()))
    e.postalCode = "Format: A1A 1A1.";
  if (!p.categorySlug) e.categorySlug = "Choose a category.";
  if (!p.description?.trim()) e.description = "Tell seniors what you do.";
  else if (p.description.trim().length < 20)
    e.description = "Please write at least 20 characters.";
  return e;
}

export function ProfileForm() {
  const router = useRouter();
  const cats = getAllCategories();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<BusinessProfile>({
    street: "",
    city: "",
    province: "",
    postalCode: "",
    website: "",
    categorySlug: "",
    subcategorySlug: "",
    serviceArea: "",
    description: "",
    logoUrl: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BusinessProfile, boolean>>>({});

  useEffect(() => {
    const s = loadSignup();
    if (s.profile) setForm((prev) => ({ ...prev, ...s.profile }) as BusinessProfile);
    setMounted(true);
  }, []);

  // Block direct entry to step 2 if step 1 is not done
  useEffect(() => {
    if (!mounted) return;
    if (loadSignup().completedSteps < 1) {
      router.replace("/list-business/");
    }
  }, [mounted, router]);

  const onChange = <K extends keyof BusinessProfile>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...form, [k]: e.target.value };
      setForm(next);
      if (touched[k]) setErrors(validate(next));
    };

  /** When the province changes, the current city is likely wrong for the
   *  new province. Clear it unless it's still in the new province's list. */
  const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value as ProvinceCode | "";
    const knownCities = newProvince ? citiesFor(newProvince) : [];
    const stillValid = knownCities.includes(form.city);
    setForm((prev) => ({
      ...prev,
      province: newProvince,
      city: stillValid ? prev.city : "",
    }));
  };

  const onBlur = (k: keyof BusinessProfile) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({
      street: true,
      city: true,
      province: true,
      postalCode: true,
      categorySlug: true,
      description: true,
    });
    if (Object.keys(v).length > 0) {
      const firstErrKey = Object.keys(v)[0];
      const el = document.getElementById(`pfield-${firstErrKey}`);
      el?.focus();
      return;
    }
    const state = markStep(loadSignup(), 2);
    state.profile = form;
    saveSignup(state);
    router.push("/list-business/checkout/");
  };

  if (!mounted) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  const errFor = (k: keyof BusinessProfile) => (touched[k] ? errors[k] : undefined);
  const selectedCat = cats.find((c) => c.slug === form.categorySlug);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 space-y-6"
    >
      <fieldset>
        <legend className="text-lg font-display font-bold text-stone-900 mb-3">
          Address
        </legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="pfield-street" className="block text-base font-bold text-black mb-2">
              Street address
            </label>
            <input
              id="pfield-street"
              type="text"
              autoComplete="street-address"
              value={form.street}
              onChange={onChange("street")}
              onBlur={onBlur("street")}
              aria-invalid={Boolean(errFor("street"))}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="123 Main Street"
            />
            {errFor("street") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("street")}</p>}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pfield-province" className="block text-base font-bold text-black mb-2">
                Province
              </label>
              <select
                id="pfield-province"
                value={form.province}
                onChange={onProvinceChange}
                onBlur={onBlur("province")}
                aria-invalid={Boolean(errFor("province"))}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Choose…</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
              {errFor("province") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("province")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pfield-city" className="block text-base font-bold text-black mb-2">
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
                id="pfield-city"
                type="text"
                autoComplete="address-level2"
                list="profile-cities-datalist"
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
              <datalist id="profile-cities-datalist">
                {citiesFor((form.province as ProvinceCode) ?? "ON").map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errFor("city") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("city")}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="pfield-postalCode" className="block text-base font-bold text-black mb-2">
              Postal code
            </label>
            <input
              id="pfield-postalCode"
              type="text"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={onChange("postalCode")}
              onBlur={onBlur("postalCode")}
              aria-invalid={Boolean(errFor("postalCode"))}
              className="w-full max-w-xs min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="A1A 1A1"
            />
            {errFor("postalCode") && <p className="mt-2 text-base text-red-700 font-semibold">{errFor("postalCode")}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-display font-bold text-stone-900 mb-3">
          Category
        </legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="pfield-categorySlug" className="block text-base font-bold text-black mb-2">
              Primary category
            </label>
            <select
              id="pfield-categorySlug"
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

          {selectedCat && selectedCat.subcategories.length > 0 && (
            <div>
              <label htmlFor="pfield-subcategorySlug" className="block text-base font-bold text-black mb-2">
                Sub-category (optional)
              </label>
              <select
                id="pfield-subcategorySlug"
                value={form.subcategorySlug}
                onChange={onChange("subcategorySlug")}
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">None</option>
                {selectedCat.subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="pfield-serviceArea" className="block text-base font-bold text-black mb-2">
              Service area (optional)
            </label>
            <input
              id="pfield-serviceArea"
              type="text"
              value={form.serviceArea}
              onChange={onChange("serviceArea")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="e.g. Greater Toronto Area, Ottawa Valley, or All of BC"
            />
            <p className="mt-2 text-base text-stone-700">
              Tell seniors where you travel to. Helps your listing show up in local searches.
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-display font-bold text-stone-900 mb-3">
          About your business
        </legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="pfield-website" className="block text-base font-bold text-black mb-2">
              Website (optional)
            </label>
            <input
              id="pfield-website"
              type="url"
              autoComplete="url"
              value={form.website}
              onChange={onChange("website")}
              className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="https://yourbusiness.ca"
            />
          </div>
          <div>
            <label htmlFor="pfield-description" className="block text-base font-bold text-black mb-2">
              Description
            </label>
            <textarea
              id="pfield-description"
              rows={5}
              value={form.description}
              onChange={onChange("description")}
              onBlur={onBlur("description")}
              aria-invalid={Boolean(errFor("description"))}
              className="w-full px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
              placeholder="What do you do? Who do you help? What's special about your service? Speak plainly — seniors will read this."
            />
            {errFor("description") ? (
              <p className="mt-2 text-base text-red-700 font-semibold">{errFor("description")}</p>
            ) : (
              <p className="mt-2 text-base text-stone-700">
                {(form.description ?? "").length} / 20 minimum
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link
          href="/list-business/"
          className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
