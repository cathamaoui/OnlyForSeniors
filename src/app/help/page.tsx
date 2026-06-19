import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Help & Support",
  description: "Get help using OnlyForSeniors.ca",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 mb-3 text-center">
          Help &amp; Support
        </h1>
        <p className="text-lg sm:text-xl text-stone-700 text-center mb-10">
          We&apos;re here for you. Pick the way that works best.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="tel:1-800-555-0199"
            className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-stone-900 transition-colors"
          >
            <span aria-hidden="true" className="inline-flex items-center justify-center w-12 h-12 bg-stone-900 text-white rounded-xl mb-3">
              <Phone className="w-6 h-6" strokeWidth={2.25} />
            </span>
            <h2 className="font-display font-black text-xl text-stone-900">Call us</h2>
            <p className="text-stone-900 font-bold">1-800-555-0199</p>
            <p className="text-base text-stone-700 mt-1">Mon–Fri, 9am–5pm ET</p>
          </a>

          <a
            href="mailto:hello@onlyforseniors.ca"
            className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-stone-900 transition-colors"
          >
            <span aria-hidden="true" className="inline-flex items-center justify-center w-12 h-12 bg-stone-900 text-white rounded-xl mb-3">
              <Mail className="w-6 h-6" strokeWidth={2.25} />
            </span>
            <h2 className="font-display font-black text-xl text-stone-900">Email us</h2>
            <p className="text-stone-900 font-bold">hello@onlyforseniors.ca</p>
            <p className="text-base text-stone-700 mt-1">We reply within 1 business day</p>
          </a>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 mt-8">
          <h2 className="font-display font-black text-2xl text-stone-900 mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 bg-stone-900 text-white rounded-lg">
              <MessageCircle className="w-5 h-5" strokeWidth={2.25} />
            </span>
            Common Questions
          </h2>

          <div className="space-y-2">
            <details className="border-b border-stone-200 pb-3 group">
              <summary className="font-bold text-lg cursor-pointer text-stone-900 list-none flex items-center justify-between">
                Is OnlyForSeniors.ca free to use?
                <span aria-hidden="true" className="text-stone-500 group-open:rotate-180 transition-transform">›</span>
              </summary>
              <p className="mt-2 text-stone-700">
                Yes! Searching and contacting businesses is completely free for seniors.
                Business owners pay $10/month to be listed.
              </p>
            </details>
            <details className="border-b border-stone-200 pb-3 group">
              <summary className="font-bold text-lg cursor-pointer text-stone-900 list-none flex items-center justify-between">
                How do I know a business is trustworthy?
                <span aria-hidden="true" className="text-stone-500 group-open:rotate-180 transition-transform">›</span>
              </summary>
              <p className="mt-2 text-stone-700">
                Look for the verified badge. Read reviews from other seniors.
                Every business must agree to our senior-friendly service standards.
              </p>
            </details>
            <details className="border-b border-stone-200 pb-3 group">
              <summary className="font-bold text-lg cursor-pointer text-stone-900 list-none flex items-center justify-between">
                I&apos;m not comfortable using a computer. Can I still use the site?
                <span aria-hidden="true" className="text-stone-500 group-open:rotate-180 transition-transform">›</span>
              </summary>
              <p className="mt-2 text-stone-700">
                Absolutely! Tap the call button on any business to dial them
                directly — no typing needed. Or call us at 1-800-555-0199 and we&apos;ll help.
              </p>
            </details>
            <details className="border-b border-stone-200 pb-3 group">
              <summary className="font-bold text-lg cursor-pointer text-stone-900 list-none flex items-center justify-between">
                Can I use the site on my phone or tablet?
                <span aria-hidden="true" className="text-stone-500 group-open:rotate-180 transition-transform">›</span>
              </summary>
              <p className="mt-2 text-stone-700">
                Yes. The site works on any device — phone, tablet, or computer. Buttons
                are large and easy to tap.
              </p>
            </details>
            <details className="group">
              <summary className="font-bold text-lg cursor-pointer text-stone-900 list-none flex items-center justify-between">
                Do you sell my information?
                <span aria-hidden="true" className="text-stone-500 group-open:rotate-180 transition-transform">›</span>
              </summary>
              <p className="mt-2 text-stone-700">
                Never. We respect your privacy. Read our{" "}
                <Link href="/privacy" className="underline text-stone-900 font-bold hover:text-black">Privacy Policy</Link>.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
