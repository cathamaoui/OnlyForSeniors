import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Help & Support",
  description: "Get help using OnlyForSeniors.ca",
};

export default function HelpPage() {
  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-black text-4xl text-emerald-900 mb-3 text-center">
          Help &amp; Support
        </h1>
        <p className="text-xl text-emerald-800 text-center mb-10">
          We&apos;re here for you. Pick the way that works best.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a href="tel:1-800-555-0199" className="card-retro text-center hover:-translate-y-1 transition-transform">
            <Phone className="w-12 h-12 text-ember-600 mx-auto mb-2" />
            <h2 className="font-display font-black text-xl text-emerald-900">Call us</h2>
            <p className="text-emerald-800">1-800-555-0199</p>
            <p className="text-sm text-emerald-700 mt-1">Mon–Fri, 9am–5pm ET</p>
          </a>

          <a href="mailto:hello@onlyforseniors.ca" className="card-retro text-center hover:-translate-y-1 transition-transform">
            <Mail className="w-12 h-12 text-emerald-700 mx-auto mb-2" />
            <h2 className="font-display font-black text-xl text-emerald-900">Email us</h2>
            <p className="text-emerald-800">hello@onlyforseniors.ca</p>
            <p className="text-sm text-emerald-700 mt-1">We reply within 1 business day</p>
          </a>
        </div>

        <div className="card-retro mt-8">
          <h2 className="font-display font-black text-2xl text-emerald-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-7 h-7" /> Common Questions
          </h2>

          <div className="space-y-4">
            <details className="border-b-2 border-black pb-3">
              <summary className="font-bold text-lg cursor-pointer">Is OnlyForSeniors.ca free to use?</summary>
              <p className="mt-2 text-emerald-800">
                Yes! Searching and contacting businesses is completely free for seniors.
                Business owners pay $10/month to be listed.
              </p>
            </details>
            <details className="border-b-2 border-black pb-3">
              <summary className="font-bold text-lg cursor-pointer">How do I know a business is trustworthy?</summary>
              <p className="mt-2 text-emerald-800">
                Look for the green ✓ Verified badge. Read reviews from other seniors.
                Every business must agree to our senior-friendly service standards.
              </p>
            </details>
            <details className="border-b-2 border-black pb-3">
              <summary className="font-bold text-lg cursor-pointer">I&apos;m not comfortable using a computer. Can I still use the site?</summary>
              <p className="mt-2 text-emerald-800">
                Absolutely! Tap the big orange phone button on any business to call them
                directly — no typing needed. Or call us at 1-800-555-0199 and we&apos;ll help.
              </p>
            </details>
            <details className="border-b-2 border-black pb-3">
              <summary className="font-bold text-lg cursor-pointer">Can I use the site on my phone or tablet?</summary>
              <p className="mt-2 text-emerald-800">
                Yes. The site works on any device — phone, tablet, or computer. Buttons
                are large and easy to tap.
              </p>
            </details>
            <details>
              <summary className="font-bold text-lg cursor-pointer">Do you sell my information?</summary>
              <p className="mt-2 text-emerald-800">
                Never. We respect your privacy. Read our{" "}
                <Link href="/privacy" className="text-ember-600 underline">Privacy Policy</Link>.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
