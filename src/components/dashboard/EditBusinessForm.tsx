"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Subcategory { id: string; name: string; }
interface Category { id: string; name: string; subcategories: Subcategory[]; }

interface BusinessData {
  id: string;
  name: string;
  tagline: string | null;
  description: string;
  email: string;
  phone: string | null;
  website: string | null;
  addressLine1: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  serviceArea: string | null;
  categoryId: string;
  subcategoryId: string | null;
  priceRange: string | null;
  yearsInBusiness: number | null;
  wheelchairAccess: boolean;
  seniorDiscount: boolean;
  homeVisits: boolean;
  isMobileService: boolean;
  isOnlineService: boolean;
  offersDelivery: boolean;
  bilingualStaff: boolean;
}

export function EditBusinessForm({
  business,
  categories,
}: { business: BusinessData; categories: Category[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(business.categoryId);
  const subcategories = categories.find((c) => c.id === categoryId)?.subcategories ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/businesses/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          tagline: data.get("tagline"),
          description: data.get("description"),
          email: data.get("email"),
          phone: data.get("phone"),
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
          wheelchairAccess: data.get("wheelchairAccess") === "on",
          seniorDiscount: data.get("seniorDiscount") === "on",
          homeVisits: data.get("homeVisits") === "on",
          isMobileService: data.get("isMobileService") === "on",
          isOnlineService: data.get("isOnlineService") === "on",
          offersDelivery: data.get("offersDelivery") === "on",
          bilingualStaff: data.get("bilingualStaff") === "on",
        }),
      });
      if (!res.ok) {
        setError("Could not save. Please try again.");
        return;
      }
      setSuccess(true);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-retro space-y-5">
      {success && (
        <div className="bg-emerald-100 border-2 border-emerald-700 text-emerald-900 rounded-chunky p-3 font-bold">
          ✓ Saved!
        </div>
      )}
      {error && (
        <div className="bg-ember-100 border-2 border-ember-700 text-ember-900 rounded-chunky p-3 font-bold">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="field-label">Business name</label>
        <input id="name" name="name" required defaultValue={business.name} className="field-input" />
      </div>
      <div>
        <label htmlFor="tagline" className="field-label">Tagline</label>
        <input id="tagline" name="tagline" defaultValue={business.tagline ?? ""} className="field-input" />
      </div>
      <div>
        <label htmlFor="description" className="field-label">Description</label>
        <textarea id="description" name="description" required rows={6} defaultValue={business.description} className="field-textarea" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="field-label">Category</label>
          <select id="categoryId" name="categoryId" required className="field-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="subcategoryId" className="field-label">Subcategory</label>
          <select id="subcategoryId" name="subcategoryId" className="field-input" defaultValue={business.subcategoryId ?? ""}>
            <option value="">—</option>
            {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" name="email" type="email" required defaultValue={business.email} className="field-input" />
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Phone</label>
          <input id="phone" name="phone" type="tel" defaultValue={business.phone ?? ""} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="field-label">Website</label>
        <input id="website" name="website" type="url" defaultValue={business.website ?? ""} className="field-input" />
      </div>

      <div>
        <label htmlFor="addressLine1" className="field-label">Address</label>
        <input id="addressLine1" name="addressLine1" defaultValue={business.addressLine1 ?? ""} className="field-input" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="field-label">City</label>
          <input id="city" name="city" required defaultValue={business.city} className="field-input" />
        </div>
        <div>
          <label htmlFor="province" className="field-label">Province</label>
          <select id="province" name="province" required defaultValue={business.province} className="field-input">
            {["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="postalCode" className="field-label">Postal code</label>
          <input id="postalCode" name="postalCode" defaultValue={business.postalCode ?? ""} className="field-input" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="serviceArea" className="field-label">Service area</label>
          <input id="serviceArea" name="serviceArea" defaultValue={business.serviceArea ?? ""} className="field-input" />
        </div>
        <div>
          <label htmlFor="priceRange" className="field-label">Price range</label>
          <input id="priceRange" name="priceRange" defaultValue={business.priceRange ?? ""} className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="yearsInBusiness" className="field-label">Years in business</label>
        <input id="yearsInBusiness" name="yearsInBusiness" type="number" min={0} defaultValue={business.yearsInBusiness ?? ""} className="field-input" />
      </div>

      <fieldset className="border-2 border-black rounded-chunky p-4">
        <legend className="font-display font-black text-lg text-emerald-900 px-2">
          Senior-friendly features
        </legend>
        <span className="instruction mb-3 block">
          Check the things that apply to your business. Seniors will see these as big badges.
        </span>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["wheelchairAccess", "Wheelchair accessible"],
            ["seniorDiscount", "Senior discount offered"],
            ["homeVisits", "Home visits available"],
            ["isMobileService", "Mobile — we come to you"],
            ["isOnlineService", "Online / remote service"],
            ["offersDelivery", "Delivery available"],
            ["bilingualStaff", "Bilingual staff"],
          ].map(([n, l]) => (
            <label key={n} className="flex items-center gap-2 min-h-touch cursor-pointer">
              <input type="checkbox" name={n} defaultChecked={business[n as keyof BusinessData] as boolean} className="w-6 h-6 accent-emerald-700" />
              <span className="text-lg">{l}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={submitting} className="btn-primary w-full text-lg">
        {submitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
