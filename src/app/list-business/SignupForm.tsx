"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, RotateCcw, ShieldCheck } from "lucide-react";
import {
  loadSignup,
  saveSignup,
  markStep,
  clearSignup,
  type Account,
} from "@/lib/signup";

function validate(a: Account): Partial<Record<keyof Account, string>> {
  const errors: Partial<Record<keyof Account, string>> = {};
  if (!a.businessName?.trim()) errors.businessName = "Business name is required.";
  if (!a.contactName?.trim()) errors.contactName = "Your name is required.";
  if (!a.email?.trim()) errors.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email))
    errors.email = "Enter a valid email address.";
  if (!a.phone?.trim()) errors.phone = "Phone is required.";
  else if (a.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Enter a 10-digit phone number.";
  if (!a.password) errors.password = "Password is required.";
  else if (a.password.length < 8)
    errors.password = "Use at least 8 characters.";
  return errors;
}

export function SignupForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<Account>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Account, string>>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof Account, boolean>>>({});

  useEffect(() => {
    const s = loadSignup();
    if (s.account) {
      setForm((prev) => ({ ...prev, ...s.account }) as Account);
    }
    setMounted(true);
  }, []);

  const onChange = (k: keyof Account) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };

  const onBlur = (k: keyof Account) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({
      businessName: true,
      contactName: true,
      email: true,
      phone: true,
      password: true,
    });
    if (Object.keys(v).length > 0) {
      // scroll to first error
      const firstErrKey = Object.keys(v)[0];
      const el = document.getElementById(`field-${firstErrKey}`);
      el?.focus();
      return;
    }
    const state = markStep(loadSignup(), 1);
    state.account = form;
    saveSignup(state);
    router.push("/list-business/profile/");
  };

  // Don't render autofill-conflicting values until after hydration to avoid
  // mismatch warnings.
  if (!mounted) {
    return <div className="bg-white border-2 border-stone-200 rounded-lg p-8 h-96" aria-hidden="true" />;
  }

  const errFor = (k: keyof Account) => (touched[k] ? errors[k] : undefined);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 space-y-5"
    >
      <div>
        <label htmlFor="field-businessName" className="block text-base font-bold text-black mb-2">
          Business name
        </label>
        <input
          id="field-businessName"
          name="businessName"
          type="text"
          autoComplete="organization"
          required
          value={form.businessName}
          onChange={onChange("businessName")}
          onBlur={onBlur("businessName")}
          aria-invalid={Boolean(errFor("businessName"))}
          aria-describedby={errFor("businessName") ? "err-businessName" : undefined}
          className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
          placeholder="e.g. Maple Leaf Home Care"
        />
        {errFor("businessName") && (
          <p id="err-businessName" className="mt-2 text-base text-red-700 font-semibold">
            {errFor("businessName")}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="field-contactName" className="block text-base font-bold text-black mb-2">
            Your name
          </label>
          <input
            id="field-contactName"
            name="contactName"
            type="text"
            autoComplete="name"
            required
            value={form.contactName}
            onChange={onChange("contactName")}
            onBlur={onBlur("contactName")}
            aria-invalid={Boolean(errFor("contactName"))}
            aria-describedby={errFor("contactName") ? "err-contactName" : undefined}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="First and last name"
          />
          {errFor("contactName") && (
            <p id="err-contactName" className="mt-2 text-base text-red-700 font-semibold">
              {errFor("contactName")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-phone" className="block text-base font-bold text-black mb-2">
            Phone
          </label>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={onChange("phone")}
            onBlur={onBlur("phone")}
            aria-invalid={Boolean(errFor("phone"))}
            aria-describedby={errFor("phone") ? "err-phone" : undefined}
            className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="(416) 555-0142"
          />
          {errFor("phone") && (
            <p id="err-phone" className="mt-2 text-base text-red-700 font-semibold">
              {errFor("phone")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="field-email" className="block text-base font-bold text-black mb-2">
          Email
        </label>
        <input
          id="field-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={onChange("email")}
          onBlur={onBlur("email")}
          aria-invalid={Boolean(errFor("email"))}
          aria-describedby={errFor("email") ? "err-email" : undefined}
          className="w-full min-h-touch px-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
          placeholder="you@business.ca"
        />
        {errFor("email") && (
          <p id="err-email" className="mt-2 text-base text-red-700 font-semibold">
            {errFor("email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="field-password" className="block text-base font-bold text-black mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="field-password"
            name="password"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={onChange("password")}
            onBlur={onBlur("password")}
            aria-invalid={Boolean(errFor("password"))}
            aria-describedby={errFor("password") ? "err-password" : "pwd-hint"}
            className="w-full min-h-touch px-4 py-3 pr-14 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-stone-800 hover:text-black"
          >
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errFor("password") ? (
          <p id="err-password" className="mt-2 text-base text-red-700 font-semibold">
            {errFor("password")}
          </p>
        ) : (
          <p id="pwd-hint" className="mt-2 text-base text-stone-700">
            At least 8 characters. Mix letters and numbers for a stronger password.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-base text-stone-800">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
        <span>Your info is private. We never sell or share business data.</span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-touch px-5 py-3 text-base font-semibold text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm("Start over? This will erase your account info and any progress on this device.")) {
                clearSignup();
                setForm({
                  businessName: "",
                  contactName: "",
                  email: "",
                  phone: "",
                  password: "",
                });
                setErrors({});
                setTouched({});
                if (typeof window !== "undefined") window.location.reload();
              }
            }}
            className="inline-flex items-center justify-center gap-2 min-h-touch px-5 py-3 text-base font-semibold text-red-700 bg-white border-2 border-red-700 rounded-lg hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4" /> Start over
          </button>
        </div>
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
