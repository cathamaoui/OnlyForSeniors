import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/animations/HeroScene";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FloatingElement } from "@/components/animations/FloatingBook";
import { Phone, Shield, Heart, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { businesses: true } },
    },
  });

  return (
    <div className="yp-paper">
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block bg-ember-600 text-white font-black uppercase
              tracking-wider text-sm px-3 py-1.5 rounded-chunky border-2 border-black mb-6">
              📞 For Canadians 65+
            </span>
            <RevealText
              className="font-display font-black text-emerald-900
                text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6"
            >
              The friendly directory every senior deserves.
            </RevealText>
            <p className="text-xl lg:text-2xl text-emerald-900 leading-relaxed mb-8 max-w-2xl">
              Find trusted Canadian businesses for home care, transportation, health,
              shopping, and everything in between. One phone book. One tap away.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                href="/categories"
                variant="primary"
                instruction="Browse all senior service categories"
              >
                Browse the Directory
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                href="/list-business"
                variant="ember"
                instruction="Business owners — list your service for $10/month"
              >
                List Your Business
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-emerald-900">
              <div className="inline-flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                <span className="font-bold">Verified Businesses</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Heart className="w-5 h-5 text-ember-600" aria-hidden="true" />
                <span className="font-bold">Senior-Friendly Service</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <span className="font-bold">Trusted Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== QUICK SEARCH BAR ============== */}
      <section className="bg-emerald-800 text-cream-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <form
            action="/search"
            method="get"
            className="flex flex-col sm:flex-row gap-3"
            role="search"
          >
            <label htmlFor="hero-q" className="sr-only">
              Search the directory
            </label>
            <div className="flex-1">
              <input
                id="hero-q"
                name="q"
                type="search"
                placeholder="What do you need help with today?"
                className="w-full min-h-touch px-4 py-3 text-lg text-emerald-900
                  bg-cream-50 border-2 border-black rounded-chunky
                  focus:border-ember-500 focus:ring-4 focus:ring-ember-200"
              />
              <span className="instruction !text-cream-200">
                Example: &quot;Snow removal&quot;, &quot;Ride to doctor&quot;, &quot;Grocery delivery&quot;
              </span>
            </div>
            <label htmlFor="hero-prov" className="sr-only">Province</label>
            <select
              id="hero-prov"
              name="province"
              className="min-h-touch px-4 py-3 text-lg text-emerald-900
                bg-cream-50 border-2 border-black rounded-chunky
                focus:border-ember-500 focus:ring-4 focus:ring-ember-200 sm:w-48"
              defaultValue=""
            >
              <option value="">All of Canada</option>
              <option value="ON">Ontario</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="QC">Quebec</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
              <option value="NS">Nova Scotia</option>
              <option value="NB">New Brunswick</option>
              <option value="PE">PEI</option>
              <option value="NL">Newfoundland</option>
            </select>
            <Button type="submit" variant="ember">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* ============== CATEGORIES — Yellow Pages index ============== */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block bg-cream-200 text-emerald-900 font-bold
              uppercase tracking-wider text-sm px-3 py-1 rounded-chunky border-2 border-black mb-3">
              The Big Book of Services
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-emerald-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-emerald-800 max-w-2xl mx-auto">
              Just like the Yellow Pages you remember — only now it fits in your pocket.
              Pick a tab to find trusted help.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.05}>
              <CategoryCard
                slug={c.slug}
                name={c.name}
                description={c.description}
                icon={c.icon}
                color={c.color}
                businessCount={c._count.businesses}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="bg-cream-200 border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <ScrollReveal>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 text-center mb-12">
              How Only For Seniors Works
            </h2>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Browse or Search",
                body: "Look through our colour-coded categories or search for what you need — groceries, rides, repairs, anything.",
                icon: "🔍",
              },
              {
                step: "2",
                title: "Pick a Trusted Business",
                body: "Every business is reviewed for senior-friendliness. Look for the ✓ Verified badge and read real reviews.",
                icon: "⭐",
              },
              {
                step: "3",
                title: "Call, Book, or Message",
                body: "Tap the big phone button, send a message, or book online. It&apos;s that simple.",
                icon: "📞",
              },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.1}>
                <div className="card-retro text-center h-full">
                  <div className="text-6xl mb-3" aria-hidden="true">{s.icon}</div>
                  <div className="inline-block bg-emerald-700 text-white font-black
                    text-2xl w-12 h-12 rounded-full border-2 border-black mb-3 leading-[3rem]">
                    {s.step}
                  </div>
                  <h3 className="font-display font-black text-2xl text-emerald-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-emerald-800 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURED CTA — LIST YOUR BUSINESS ============== */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <ScrollReveal>
          <div className="relative card-retro bg-emerald-800 text-cream-50 border-black overflow-hidden">
            <div className="relative grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="inline-block bg-ember-600 text-white font-black uppercase
                  tracking-wider text-sm px-3 py-1 rounded-chunky border-2 border-black mb-4">
                  For Business Owners
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-cream-50 mb-4">
                  Reach thousands of Canadian seniors. Only $10/month.
                </h2>
                <p className="text-xl text-cream-100 leading-relaxed mb-6">
                  List your business, get discovered by the 65+ community, and grow
                  with purpose. No contracts. Cancel anytime.
                </p>
                <ul className="space-y-2 mb-8 text-cream-50 text-lg">
                  <li className="flex items-start gap-2">
                    <span className="text-ember-400 font-black" aria-hidden="true">✓</span>
                    Custom business profile with photos and hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember-400 font-black" aria-hidden="true">✓</span>
                    Direct contact from seniors in your area
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember-400 font-black" aria-hidden="true">✓</span>
                    Reviews to build your reputation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ember-400 font-black" aria-hidden="true">✓</span>
                    Senior-friendly listing badge
                  </li>
                </ul>
                <Button href="/list-business" variant="ember" instruction="Start your $10/month listing">
                  Get Started — $10/month
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              <FloatingElement className="flex justify-center" duration={5}>
                <div className="bg-cream-50 text-emerald-900 p-6 rounded-chunky border-4 border-black shadow-retro max-w-sm">
                  <div className="text-6xl text-center mb-3" aria-hidden="true">📖</div>
                  <p className="font-display font-black text-2xl text-center mb-2">
                    Like the Yellow Pages?
                  </p>
                  <p className="text-center leading-relaxed">
                    You&apos;ll love this. Same friendly format, now with a search bar,
                    reviews, and one-tap calling.
                  </p>
                </div>
              </FloatingElement>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ============== CALL ASSISTANCE STRIP ============== */}
      <section className="bg-ember-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white text-ember-600 rounded-full border-2 border-black w-14 h-14 flex items-center justify-center">
              <Phone className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display font-black text-2xl">Prefer to talk to a person?</p>
              <p className="text-cream-50">Call our friendly Canadian team — we&apos;ll help you find what you need.</p>
            </div>
          </div>
          <a
            href="tel:1-800-555-0199"
            className="btn-primary !bg-white !text-emerald-900 !border-black"
          >
            1-800-555-0199
          </a>
        </div>
      </section>
    </div>
  );
}
