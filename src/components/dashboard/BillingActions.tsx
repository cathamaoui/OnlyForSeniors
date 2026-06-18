"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BillingActions({
  subscribed,
  cancelAtPeriodEnd,
}: {
  subscribed: boolean;
  cancelAtPeriodEnd?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function startCheckout() {
    setBusy(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        // For demo / when Stripe not configured, just simulate success
        await fetch("/api/billing/simulate-activate", { method: "POST" });
        router.push("/dashboard?activated=1");
      }
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!confirm("Cancel your subscription? Your listing will stay live until period end.")) return;
    setBusy(true);
    try {
      await fetch("/api/billing/cancel", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function resume() {
    setBusy(true);
    try {
      await fetch("/api/billing/resume", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!subscribed) {
    return (
      <button onClick={startCheckout} disabled={busy} className="btn-ember w-full text-lg">
        {busy ? "Loading…" : "Subscribe Now — $10/month"}
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {cancelAtPeriodEnd ? (
        <button onClick={resume} disabled={busy} className="btn-primary">
          Resume Subscription
        </button>
      ) : (
        <button onClick={cancel} disabled={busy} className="btn-outline">
          Cancel Subscription
        </button>
      )}
    </div>
  );
}
