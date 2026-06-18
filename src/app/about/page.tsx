import Link from "next/link";
import { ArrowLeft, BadgeCheck, Heart, MapPin, Shield, Mail, Sparkles } from "lucide-react";

export const metadata = {
  title: "About — Only For Seniors",
  description: "About Only For Seniors, Canada's no-ads senior marketplace.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 border-2 border-stone-300 text-stone-800 font-semibold text-sm hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl font-display font-bold">About</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <section>
          <p className="inline-block text-xs font-bold tracking-widest uppercase bg-black text-white px-3 py-1 rounded-full">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-black leading-tight">
            Help that seniors can trust.
          </h2>
          <p className="mt-3 text-lg text-stone-700 leading-relaxed">
            Only For Seniors is a Canadian directory of verified home care, transportation,
            health, and daily living services for older adults and their families.
            We do not run ads. We do not sell your data. We do not let anyone pay to appear
            higher in the list. Every listing is reviewed before it goes live.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5">
            <BadgeCheck className="w-6 h-6 text-emerald-700" />
            <h3 className="font-display font-bold text-lg mt-2">Verified businesses</h3>
            <p className="text-sm text-stone-600">
              Every listing is reviewed by a real person. We check basic business details
              before publishing.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5">
            <Heart className="w-6 h-6 text-rose-600" />
            <h3 className="font-display font-bold text-lg mt-2">No ads, ever</h3>
            <p className="text-sm text-stone-600">
              We never show ads. The only way a business appears in search results is by
              being a verified listing.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5">
            <MapPin className="w-6 h-6 text-blue-700" />
            <h3 className="font-display font-bold text-lg mt-2">Local to you</h3>
            <p className="text-sm text-stone-600">
              Filter by city, province, or sub-category to find help close to home.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5">
            <Shield className="w-6 h-6 text-stone-700" />
            <h3 className="font-display font-bold text-lg mt-2">Your data stays yours</h3>
            <p className="text-sm text-stone-600">
              We do not sell your contact information to third parties. Period.
            </p>
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-lg p-6">
          <h3 className="font-display font-bold text-xl">For business owners</h3>
          <p className="text-stone-700 mt-2">
            Listing on Only For Seniors costs <strong>CAD $10/month</strong>. That pays for
            the review process, hosting, and keeping the site ad-free for users. There is no
            upsell, no "premium" tier, no algorithm tricks. One flat rate, one fair listing.
          </p>
          <Link
            href="/list-business/"
            className="inline-block mt-4 px-6 py-3 bg-blue-700 text-white font-display font-bold rounded-lg hover:bg-blue-800"
          >
            Post a Listing — $10/mo
          </Link>
        </section>

        <section>
          <h3 className="font-display font-bold text-xl">Get in touch</h3>
          <p className="text-stone-700 mt-2">
            Have a question, a suggestion, or a business to add? We'd love to hear from you.
          </p>
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 border-2 border-black rounded-lg font-semibold hover:bg-stone-50"
          >
            <Mail className="w-4 h-4" /> Contact us
          </Link>
        </section>
      </div>
    </div>
  );
}
