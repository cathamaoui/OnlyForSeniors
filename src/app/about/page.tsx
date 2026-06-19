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
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <section>
          <p className="inline-block text-base font-bold   bg-black text-white px-3 py-1 rounded-full">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-black leading-normal">
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
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <BadgeCheck className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900">Verified businesses</h3>
            <p className="text-base text-stone-700">
              Every listing is reviewed by a real person. We check basic business details
              before publishing.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <Heart className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900">No ads, ever</h3>
            <p className="text-base text-stone-700">
              We never show ads. The only way a business appears in search results is by
              being a verified listing.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <MapPin className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900">Local to you</h3>
            <p className="text-base text-stone-700">
              Filter by city, province, or sub-category to find help close to home.
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <Shield className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900">Your data stays yours</h3>
            <p className="text-base text-stone-700">
              We do not sell your contact information to third parties. Period.
            </p>
          </div>
        </section>

        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8">
          <h3 className="font-display font-bold text-xl text-stone-900">For business owners</h3>
          <p className="text-stone-700 mt-2">
            Listing on Only For Seniors costs <strong>CAD $10/month</strong>. That pays for
            the review process, hosting, and keeping the site ad-free for users. There is no
            upsell, no "premium" tier, no algorithm tricks. One flat rate, one fair listing.
          </p>
          <Link
            href="/list-business/"
            className="inline-block mt-4 px-6 py-3 bg-stone-900 text-white font-display font-bold rounded-full hover:bg-black min-h-touch"
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
