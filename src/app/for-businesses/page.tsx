import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

export const metadata = {
  title: "For Businesses — Only For Seniors",
  description:
    "Reach Canadian seniors searching for trusted home care, health, transportation, and daily-living services. A clean, ad-free directory built for trust.",
};

const whatsIncluded = [
  {
    icon: BadgeCheck,
    title: "Verified business profile",
    body: "Business name, hours, services, service area, photos, and contact info in one place. Edit anytime from your dashboard.",
  },
  {
    icon: Search,
    title: "Listed in the right categories",
    body: "Seniors browse by need (home care, dental, rides, pet therapy, pastoral…). You show up where they're already looking.",
  },
  {
    icon: Star,
    title: "Reviews from real seniors & families",
    body: "Collect reviews on your own page. Verified ratings build the trust that makes phone calls happen.",
  },
  {
    icon: MessageSquare,
    title: "Direct contact — no middleman",
    body: "Seniors call, email, or message you directly. No lead fees, no per-click charges, no commissions on the work.",
  },
  {
    icon: BarChart3,
    title: "See what's working",
    body: "Profile views, calls, message opens, and review activity. Plain numbers, not vanity metrics.",
  },
  {
    icon: ShieldCheck,
    title: "No ads, no spam, no fake leads",
    body: "We don't run ad placements, sell your data, or flood seniors with promos. Just a clean directory that earns trust.",
  },
];

const whyItWorks = [
  {
    stat: "65+",
    label: "audience",
    body: "Every visitor is 65+ or looking for a senior in their life. No wasted impressions on the wrong demographic.",
  },
  {
    stat: "$10/mo",
    label: "flat fee",
    body: "One flat monthly rate. Cancel anytime. No contracts, no setup fees, no commission on jobs.",
  },
  {
    stat: "0",
    label: "ads on the site",
    body: "Your listing isn't competing with banner ads, promoted posts, or pay-to-rank placements. Seniors see you, not noise.",
  },
  {
    stat: "24h",
    label: "to go live",
    body: "Submit your profile, our team verifies, you're listed. Most businesses are searchable within one business day.",
  },
];

const whoPosts = [
  "Home care agencies (PSW, RN, palliative)",
  "Mobile dental, hearing, and foot-care",
  "Transportation and companion drivers",
  "Pet therapy and pastoral visitors",
  "Senior move managers and estate services",
  "Adult day clubs and social programs",
  "Mobile grooming and mobile vets",
  "Tech help, fraud prevention, online banking",
  "Snow removal, handyman, home adaptations",
  "Legal, financial, and patient advocates",
];

const steps = [
  {
    n: "1",
    title: "Send us your details",
    body: "Email hello@onlyforseniors.ca with your business name, services, service area, and a phone or email seniors can reach. We do the rest.",
  },
  {
    n: "2",
    title: "We build & verify your profile",
    body: "Our team creates your profile, uploads your photos, confirms your categories, and verifies your contact info. Free during launch.",
  },
  {
    n: "3",
    title: "Go live & start getting calls",
    body: "Your profile is published in the right categories. Seniors searching for your service see you — and can call, message, or email directly.",
  },
  {
    n: "4",
    title: "Grow with reviews",
    body: "After each job, ask the family or senior to leave a review. Verified reviews lift you to the top of search and compound over time.",
  },
];

const faqs = [
  {
    q: "Is this a pay-per-lead site?",
    a: "No. One flat $10/month, no per-lead fees, no commission on jobs. Seniors contact you directly.",
  },
  {
    q: "Who sees my listing?",
    a: "Anyone using onlyforseniors.ca — primarily seniors 65+ and the adult children helping them. We don't run external ad networks or sell your data.",
  },
  {
    q: "What categories can I list in?",
    a: "Home care, health & wellness, transportation, daily living, recreation, legal & financial, dating & companionship, faith & pastoral, pet therapy, and more. Full list at /categories.",
  },
  {
    q: "How long does setup take?",
    a: "Most profiles are live within 24 hours of receiving your details. We do the writing, photo selection, and category mapping for you during launch.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly plan, no contract. Cancel from your dashboard and your profile goes offline at the end of the billing period.",
  },
  {
    q: "How are reviews moderated?",
    a: "Reviews are written by verified seniors and families. We flag and remove anything that looks fake, abusive, or posted by competitors.",
  },
];

export default function ForBusinessesPage() {
  return (
    <div className="bg-stone-50">
      {/* HERO */}
      <section className="bg-white border-b-2 border-black">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-base font-bold   text-blue-700 mb-3">
            For businesses
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-stone-900 leading-normal">
            Reach the seniors <br className="hidden sm:block" />
            who actually need you.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-stone-700 max-w-2xl mx-auto">
            Only For Seniors is Canada&apos;s quiet, ad-free directory for
            home care, health, transportation, and daily-living services. One flat
            fee. Direct contact. No lead auctions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/list-business/"
              className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-4 bg-blue-700 text-white text-lg font-bold rounded-lg border-2 border-blue-700 hover:bg-blue-800 transition-colors"
            >
              Post a Listing — $10/mo <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:hello@onlyforseniors.ca"
              className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-4 bg-white text-black text-lg font-bold rounded-lg border-2 border-black hover:bg-stone-50 transition-colors"
            >
              <Mail className="w-5 h-5" /> Talk to a human
            </a>
          </div>
          <p className="mt-5 text-base text-stone-700">
            Free setup during launch · No contract · Cancel anytime
          </p>
        </div>
      </section>

      {/* WHY IT WORKS — STAT STRIP */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {whyItWorks.map((w) => (
            <div key={w.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-display font-black text-white">
                {w.stat}
              </p>
              <p className="text-base sm:text-base   text-stone-700 mt-1">
                {w.label}
              </p>
              <p className="text-base text-stone-200 mt-3 leading-relaxed">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-base font-bold   text-blue-700 mb-2">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            A real profile. Real seniors. Real calls.
          </h2>
          <p className="mt-3 text-lg text-stone-800 max-w-2xl mx-auto">
            Every business on the directory gets the same set of tools to earn
            trust and make it easy for seniors to reach them.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whatsIncluded.map((item) => (
            <div
              key={item.title}
              className="bg-white border-2 border-stone-200 rounded-lg p-6 hover:border-black transition-colors"
            >
              <item.icon className="w-7 h-7 text-blue-700 mb-3" />
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                {item.title}
              </h3>
              <p className="text-stone-800 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO POSTS */}
      <section className="bg-white border-y-2 border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-base font-bold   text-blue-700 mb-2">
              Who lists here
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900 mb-4">
              The businesses seniors actually hire.
            </h2>
            <p className="text-lg text-stone-800">
              From home care to mobile dental, from snow removal to pastoral
              visits — if a senior might need you, you belong in the directory.
            </p>
          </div>
          <ul className="space-y-3">
            {whoPosts.map((w) => (
              <li
                key={w}
                className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-lg px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span className="text-stone-800 font-medium">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-base font-bold   text-blue-700 mb-2">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            From email to live in 24 hours.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white border-2 border-stone-200 rounded-lg p-6 relative"
            >
              <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-display font-black text-lg mb-3">
                {s.n}
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                {s.title}
              </h3>
              <p className="text-stone-800 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING RECAP */}
      <section className="bg-white border-y-2 border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-base font-bold   text-blue-700 mb-2">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900 mb-4">
            One flat rate. No surprises.
          </h2>
          <p className="text-lg text-stone-800 mb-8 max-w-xl mx-auto">
            $10/month covers your full profile, all categories, and all the
            tools. We don&apos;t take a cut of your work.
          </p>
          <div className="bg-stone-50 border-2 border-black rounded-lg p-8 max-w-md mx-auto text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-black text-stone-900">
                $10
              </span>
              <span className="text-stone-800">/ month</span>
            </div>
            <ul className="mt-5 space-y-2 text-stone-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Full business profile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Listed in all relevant categories</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Direct contact from seniors</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Reviews &amp; ratings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Profile analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
                <span>Cancel anytime</span>
              </li>
            </ul>
            <Link
              href="/list-business/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 min-h-touch px-6 py-3 bg-blue-700 text-white text-lg font-bold rounded-lg border-2 border-blue-700 hover:bg-blue-800"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-8">
          <p className="text-base font-bold   text-blue-700 mb-2">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            Common questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="bg-white border-2 border-stone-200 rounded-lg group"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-stone-900 flex items-center justify-between">
                {f.q}
                <span className="ml-3 text-stone-700 group-open:rotate-45 transition-transform text-2xl leading-normal">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-stone-800 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black mb-3">
            Ready to be found by the seniors who need you?
          </h2>
          <p className="text-lg text-blue-100 mb-7 max-w-xl mx-auto">
            Free setup during launch. Most profiles are live within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/list-business/"
              className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-4 bg-white text-blue-700 text-lg font-bold rounded-lg border-2 border-white hover:bg-stone-100"
            >
              Post a Listing — $10/mo <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:hello@onlyforseniors.ca"
              className="inline-flex items-center justify-center gap-2 min-h-touch px-7 py-4 bg-blue-800 text-white text-lg font-bold rounded-lg border-2 border-white hover:bg-blue-900"
            >
              <Mail className="w-5 h-5" /> hello@onlyforseniors.ca
            </a>
          </div>
          <p className="mt-6 text-base text-blue-100 flex items-center justify-center gap-2 flex-wrap">
            <Clock className="w-4 h-4" /> Or just call —{" "}
            <Phone className="w-4 h-4" /> (416) 555-0142
          </p>
        </div>
      </section>
    </div>
  );
}
