"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function InquiryForm({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({
          businessId,
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-2" aria-hidden="true">✅</div>
        <p className="font-display font-black text-2xl text-emerald-900 mb-1">
          Message sent!
        </p>
        <p className="text-emerald-800">
          {businessName} will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="inq-name" className="field-label">
          Your Name
        </label>
        <input
          id="inq-name"
          name="name"
          required
          className="field-input"
          placeholder="Jane Smith"
        />
        <span className="instruction">Please enter the name they should reply to</span>
      </div>
      <div>
        <label htmlFor="inq-email" className="field-label">
          Your Email
        </label>
        <input
          id="inq-email"
          name="email"
          type="email"
          required
          className="field-input"
          placeholder="jane@example.com"
        />
        <span className="instruction">We&apos;ll never share your email</span>
      </div>
      <div>
        <label htmlFor="inq-phone" className="field-label">
          Phone <span className="font-normal italic text-emerald-700">(optional)</span>
        </label>
        <input
          id="inq-phone"
          name="phone"
          type="tel"
          className="field-input"
          placeholder="(555) 123-4567"
        />
        <span className="instruction">Only used if they prefer to call you back</span>
      </div>
      <div>
        <label htmlFor="inq-message" className="field-label">
          Your Message
        </label>
        <textarea
          id="inq-message"
          name="message"
          required
          rows={5}
          className="field-textarea"
          placeholder="How can they help you?"
        />
        <span className="instruction">
          Describe what you need. The more detail, the faster they can help.
        </span>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        <Send className="w-5 h-5" aria-hidden="true" />
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
