"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loadSignup } from "@/lib/signup";

type Errors = { email?: string; password?: string; form?: string };

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!email.trim()) next.email = "Enter your email.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Mock authentication: in production this hits /api/auth/login which
    // verifies the hashed password and returns a session token. Here we
    // accept the email/password if it matches what's stored in localStorage
    // (so the demo flow works end-to-end). Otherwise show a generic error.
    setTimeout(() => {
      const s = loadSignup();
      const acct = s.account;
      if (acct?.email && acct.email.toLowerCase() === email.toLowerCase() && acct.password === password) {
        router.push("/list-business/dashboard/");
      } else {
        setErrors({
          form: "We couldn't sign you in with those details. Double-check your email and password, or sign up for a new account.",
        });
        setSubmitting(false);
      }
    }, 400);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white border-2 border-stone-200 rounded-lg p-6 sm:p-8 space-y-5"
    >
      {errors.form && (
        <div
          role="alert"
          className="border-2 border-red-700 bg-red-50 text-red-800 text-base p-3 rounded-lg"
        >
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-base font-bold text-black mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-700" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="w-full min-h-touch pl-11 pr-4 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="you@business.ca"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-base text-red-700 font-semibold">{errors.email}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="login-password" className="text-base font-bold text-black">
            Password
          </label>
          <Link
            href="mailto:hello@onlyforseniors.ca?subject=Password reset"
            className="text-base font-semibold text-blue-700 underline hover:text-blue-800"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-700" />
          <input
            id="login-password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            className="w-full min-h-touch pl-11 pr-14 py-3 text-lg bg-white text-black border-2 border-stone-500 rounded-lg focus:border-blue-700 focus:ring-4 focus:ring-blue-100 placeholder:text-stone-600"
            placeholder="Your password"
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
        {errors.password && (
          <p className="mt-2 text-base text-red-700 font-semibold">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 min-h-touch px-7 py-3 text-lg font-bold text-white bg-blue-700 border-2 border-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-stone-500 disabled:border-stone-500"
      >
        {submitting ? "Signing in…" : <>Sign in <ArrowRight className="w-5 h-5" /></>}
      </button>

      <p className="text-center text-base text-stone-800">
        Don&apos;t have an account?{" "}
        <Link
          href="/list-business/"
          className="font-semibold text-blue-700 underline hover:text-blue-800"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
