import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { YPBook } from "@/components/brand/YPBook";
import {
  Phone,
  Shield,
  Heart,
  Star,
  ArrowRight,
  BookOpen,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { businesses: true } },
    },
  });

  // Map for the YPBook component
  const ypCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    color: c.color,
    businessCount: c._count.businesses,
  }));

  return (
    <div className="yp-paper">
      {/* ============== HERO ============== */}
      <section className="bg-yp-500 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-block bg-black text-yp-500 px-3 py-1.5
              border-2 border-black uppercase tracking-widest text-sm mb-6">
              📞 The Real Yellow Pages · For Canadians 65+
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-black leading-[1.1] mb-4">
              Let your fingers
              <br />
              do the walking.
            </h1>

            <p className="text-lg lg:text-xl text-black leading-relaxed mb-8 max-w-2xl">
              The friendly Canadian directory for seniors 65+ —
              home care, transportation, health, shopping, and everything in between.
              Same book you remember. Now it fits in your pocket.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                href="#directory"
                variant="primary"
                instruction="Open the directory below — search or tap a coloured tab"
              >
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                Open the Book
              </Button>
              <Button
                href="/list-business"
                variant="outline"
                instruction="Business owners — get listed for $10/month"
              >
                List Your Business
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-2xl">
              <div className="bg-black text-yp-500 text-center py-2 px-1 border-2 border-black">
                <Shield className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                <p className="text-xs uppercase">Verified</p>
              </div>
              <div className="bg-black text-yp-500 text-center py-2 px-1 border-2 border-black">
                <Heart className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                <p className="text-xs uppercase">Senior-First</p>
              </div>
              <div className="bg-black text-yp-500 text-center py-2 px-1 border-2 border-black">
                <Star className="w-5 h-5 mx-auto mb-1" aria-hidden="true" />
                <p className="text-xs uppercase">Trusted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== THE YP BOOK (with side tabs, big search, page-flip + sound) ============== */}
      <section
        id="directory"
        className="max-w-6xl mx-auto px-4 py-12 sm:py-16 scroll-mt-24"
      >
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-block bg-black text-yp-500 px-3 py-1.5
              border-2 border-black uppercase tracking-widest text-sm mb-3">
              Open the Book
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-black mb-3">
              Search or tap a tab
            </h2>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Search the whole directory, or tap a coloured tab on the left to
              jump to a section. Listen for the page-turn sound — just like the
              old Yellow Pages.
            </p>
          </div>
        </ScrollReveal>

        <YPBook categories={ypCategories} />
      </section>

      {/* ============== ALL SECTIONS (grid for deep browsing) ============== */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 border-t-4 border-black">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl text-black mb-3">
              Or browse every section
            </h2>
            <p className="text-lg text-black">
              A complete list of every category in the book.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-yp-500 border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl text-black text-center mb-10">
              How to Use the Book
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Search or tap a tab",
                body: "Use the big search bar at the top of the book, or tap any coloured tab on the left side.",
                icon: "🔍",
              },
              {
                step: "2",
                title: "Pick a listing",
                body: "Each entry shows who they are, where they are, and their big phone number. Look for the ✓ Verified stamp.",
                icon: "📖",
              },
              {
                step: "3",
                title: "Pick up the phone",
                body: "Tap the big black button to call them right now. That&apos;s all there is to it.",
                icon: "📞",
              },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.1}>
                <div className="yp-card text-center h-full">
                  <div className="text-5xl mb-3" aria-hidden="true">{s.icon}</div>
                  <div className="inline-block bg-black text-yp-500 text-2xl w-12 h-12
                    border-2 border-black mb-3 leading-[3rem] font-bold">
                    {s.step}
                  </div>
                  <h3 className="font-display text-2xl text-black mb-2">
                    {s.title}
                  </h3>
                  <p className="text-black leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA — Business owners ============== */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <ScrollReveal>
          <div className="relative yp-card bg-paper">
            <div className="relative grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="inline-block bg-black text-yp-500 px-3 py-1.5
                  border-2 border-black uppercase tracking-widest text-sm mb-4">
                  For Business Owners
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-black mb-4">
                  Get your name in the book. Only $10/month.
                </h2>
                <p className="text-lg text-black leading-relaxed mb-6">
                  Reach thousands of Canadian seniors. No contracts. Cancel anytime.
                </p>
                <ul className="space-y-2 mb-6 text-black text-lg">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" aria-hidden="true" />
                    Your own listing with photos, hours, and contact info
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" aria-hidden="true" />
                    Get found by seniors searching in your area
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" aria-hidden="true" />
                    Customer reviews build your reputation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-6 h-6 text-black shrink-0" aria-hidden="true" />
                    Verified badge so seniors know they can trust you
                  </li>
                </ul>
                <Button href="/list-business" variant="primary" instruction="Start your $10/month listing">
                  Get Listed Today
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              {/* "YP" badge card — no more bad mascot! */}
              <div className="flex justify-center">
                <div className="bg-black text-yp-500 border-4 border-black p-8 max-w-sm
                  shadow-yp-lg text-center">
                  <p className="text-7xl font-display font-black mb-2">YP</p>
                  <p className="text-2xl font-display uppercase tracking-widest mb-1">
                    Directory
                  </p>
                  <p className="text-yp-300 text-sm">
                    OnlyForSeniors.ca
                  </p>
                  <div className="mt-6 pt-6 border-t-2 border-yp-700">
                    <p className="text-4xl font-display font-black">$10</p>
                    <p className="text-yp-300 uppercase tracking-wider text-sm">
                      per month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ============== CALL ASSISTANCE STRIP ============== */}
      <section className="bg-black text-yp-500 border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-yp-500 text-black border-2 border-yp-500 w-14 h-14 flex items-center justify-center">
              <PhoneCall className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl">Prefer to talk to a person?</p>
              <p>Call our friendly Canadian team — we&apos;ll help you find what you need.</p>
            </div>
          </div>
          <a
            href="tel:1-800-555-0199"
            className="btn-yp-outline !bg-yp-500 !text-black"
          >
            1-800-555-0199
          </a>
        </div>
      </section>
    </div>
  );
}
