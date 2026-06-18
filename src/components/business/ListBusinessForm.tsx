"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Subcategory { id: string; name: string; }
interface Category { id: string; name: string; subcategories: Subcategory[]; }

export function ListBusinessForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const subcategories = categories.find((c) => c.id === categoryId)?.subcategories ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);

    const payload = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("name"),
      phone: data.get("phone"),
      business: {
        name: data.get("businessName"),
        tagline: data.get("tagline"),
        description: data.get("description"),
        email: data.get("businessEmail"),
        phone: data.get("businessPhone"),
        website: data.get("website"),
        addressLine1: data.get("addressLine1"),
        city: data.get("city"),
        province: data.get("province"),
        postalCode: data.get("postalCode"),
        serviceArea: data.get("serviceArea"),
        categoryId: data.get("categoryId"),
        subcategoryId: data.get("subcategoryId") || null,
        priceRange: data.get("priceRange"),
        yearsInBusiness: data.get("yearsInBusiness") ? Number(data.get("yearsInBusiness")) : null,
      },
    };

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Something went wrong. Please try again.");
        return;
      }
      router.push("/list-business/success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="bg-ember-100 border-2 border-ember-700 text-ember-900 rounded-chunky p-3 font-bold">
          {error}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="font-display font-black text-xl text-emerald-900 mb-2">
          1. Your account
        </legend>
        <div>
          <label htmlFor="name" className="field-label">Your name</label>
          <input id="name" name="name" required className="field-input" placeholder="Jane Smith" />
          <span className="instruction">The owner / manager name</span>
        </div>
        <div>
          <label htmlFor="email" className="field-label">Your email</label>
          <input id="email" name="email" type="email" required className="field-input" placeholder="you@business.com" />
          <span className="instruction">Used for login and notifications</span>
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input id="password" name="password" type="password" required minLength={8} className="field-input" />
          <span className="instruction">At least 8 characters</span>
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" className="field-input" />
        </div>
      </fieldset>

      <fieldset className="space-y-4 pt-2 border-t-2 border-black">
        <legend className="font-display font-black text-xl text-emerald-900 mb-2 pt-2">
          2. Your business
        </legend>
        <div>
          <label htmlFor="businessName" className="field-label">Business name</label>
          <input id="businessName" name="businessName" required className="field-input" />
        </div>
        <div>
          <label htmlFor="tagline" className="field-label">Tagline (short marketing line)</label>
          <input id="tagline" name="tagline" className="field-input" maxLength={120} placeholder="Family-owned pharmacy serving Toronto since 1962" />
          <span className="instruction">One short sentence seniors will see first</span>
        </div>
        <div>
          <label htmlFor="description" className="field-label">Description</label>
          <textarea id="description" name="description" required rows={5} className="field-textarea" />
          <span className="instruction">Tell seniors what makes you special. Use plain language.</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="field-label">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="field-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Choose…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <span className="instruction">Pick the closest match</span>
          </div>
          <div>
            <label htmlFor="subcategoryId" className="field-label">Subcategory</label>
            <select
              id="subcategoryId"
              name="subcategoryId"
              className="field-input"
              disabled={subcategories.length === 0}
            >
              <option value="">Choose…</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <span className="instruction">Optional but helps seniors find you</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessEmail" className="field-label">Business email</label>
            <input id="businessEmail" name="businessEmail" type="email" required className="field-input" />
          </div>
          <div>
            <label htmlFor="businessPhone" className="field-label">Business phone</label>
            <input id="businessPhone" name="businessPhone" type="tel" className="field-input" placeholder="(555) 123-4567" />
            <span className="instruction">Displayed as a big tap-to-call button</span>
          </div>
        </div>

        <div>
          <label htmlFor="website" className="field-label">Website (optional)</label>
          <input id="website" name="website" type="url" className="field-input" placeholder="https://" />
        </div>

        <div>
          <label htmlFor="addressLine1" className="field-label">Address</label>
          <input id="addressLine1" name="addressLine1" className="field-input" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="field-label">City</label>
            <input id="city" name="city" required className="field-input" />
          </div>
          <div>
            <label htmlFor="province" className="field-label">Province</label>
            <select id="province" name="province" required className="field-input">
              <option value="">Choose…</option>
              {["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="postalCode" className="field-label">Postal code</label>
            <input id="postalCode" name="postalCode" className="field-input" placeholder="A1A 1A1" />
          </div>
        </div>
        <div>
          <label htmlFor="serviceArea" className="field-label">Service area</label>
          <input id="serviceArea" name="serviceArea" className="field-input" placeholder="Greater Toronto Area" />
          <span className="instruction">Where you serve customers (if different from city)</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceRange" className="field-label">Price range</label>
            <input id="priceRange" name="priceRange" className="field-input" placeholder="$25/hr or $$" />
            <span className="instruction">A short hint, not exact pricing</span>
          </div>
          <div>
            <label htmlFor="yearsInBusiness" className="field-label">Years in business</label>
            <input id="yearsInBusiness" name="yearsInBusiness" type="number" min={0} className="field-input" />
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={submitting} className="btn-ember w-full text-xl">
        {submitting ? "Creating your account…" : "Create My Account — $10/month"}
      </button>
      <span className="instruction">
        You&apos;ll be taken to secure Stripe checkout after creating your account.
      </span>
    </form>
  );
}
