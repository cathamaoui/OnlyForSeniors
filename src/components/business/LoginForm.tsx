"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-ember-100 border-2 border-ember-700 text-ember-900 rounded-chunky p-3 font-bold">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="login-email" className="field-label">Email</label>
        <input id="login-email" name="email" type="email" required className="field-input" />
      </div>
      <div>
        <label htmlFor="login-password" className="field-label">Password</label>
        <input id="login-password" name="password" type="password" required className="field-input" />
        <span className="instruction">Forgot your password? Call us at 1-800-555-0199.</span>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        <LogIn className="w-5 h-5" />
        {submitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
