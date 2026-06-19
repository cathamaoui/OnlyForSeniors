import Link from "next/link";
import { MapPin, BadgeCheck, Heart, Phone, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/lib/businesses";
import { CategorySearch } from "@/components/ui/CategorySearch";
import { CategoryCard } from "@/components/ui/CategoryCard";

export const metadata = {
  title: "Only For Seniors — Canada's Senior Marketplace",
  description:
    "Find trusted businesses, services, and products for Canadian seniors. No ads. Just the people who can help.",
};

/**
 * Short, plain-language descriptions for each category card on the
 * homepage. Keys are category slugs. Falls back to the category's own
 * description (if any) or to a generic placeholder.
 */
const CATEGORY_BLURBS: Record<string, string> = {
  "active-aging-recreation":
    "Fitness and intergenerational programs to keep you active and connected.",
  "training-careers":
    "Career coaching, skills training, and volunteer-to-paid pathways for encore careers.",
  "senior-travel":
    "Travel agents, group tours, cruises, and accessible trips designed for older travelers.",
  community:
    "Senior centres, day programs, recreation, and caregiver relief.",
  dating: "Senior dating sites, matchmaking, and companionship clubs.",
  "falls-wandering":
    "Grab bars, medical alerts, fall detection, and home safety equipment.",
  "health-wellness":
    "Doctors, nurses, physiotherapy, dental, hearing, and mental health.",
  "home-adaptations":
    "Senior-friendly handyman, smart-home tech, mobile grooming, and errand help.",
  "home-care":
    "Personal care, meal services, housekeeping, and companionship at home.",
  "home-maintenance":
    "Handyman, snow removal, lawn care, and house cleaning services.",
  housing:
    "Retirement living, assisted living, long-term care, and respite options.",
  "intimate-wellness":
    "Friendship clubs, intimacy aids, bedroom safety, and relationship coaching.",
  "legal-financial":
    "Estate law, financial planning, tax help, and benefits navigation.",
  pastoral:
    "In-home pastoral visits, worship services, and end-of-life spiritual care.",
  "pet-therapy":
    "Therapy animals, pet sitting, dog walking, mobile vets, and grooming.",
  "sexual-health":
    "Pelvic floor therapy, menopause care, ED clinics, and STI testing.",
  shopping:
    "Pharmacy and grocery delivery, medical supplies, and adaptive clothing.",
  events:
    "Senior fairs, workshops, social events, outdoor trips, and support groups.",
  transportation:
    "Rides, medical transport, wheelchair vans, and mobility equipment.",
  "transition-downsizing":
    "Senior move managers, estate sales, memoir writers, and legacy services.",
  "volunteer":
    "Volunteer opportunities, board positions, and skills-based giving.",
  "tech-help-for-seniors":
    "Patient, one-on-one tech help for smartphones, video calls, online banking, and digital organization.",
  "senior-concierge-errands":
    "Errands, companion drivers, adult day programs, fraud protection, and personal concierge services.",
  "wellness-comfort":
    "Mobile hair and beauty, adult day clubs, and loneliness and grief support.",
};

function describe(c: { slug: string; description?: string }): string {
  return CATEGORY_BLURBS[c.slug] ?? c.description ?? "Browse trusted local services.";
}

export default function HomePage() {
  const allCats = getAllCategories()
    .filter((c) => !c.isNews)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-cream">
      {/* HERO */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-10 md:pt-10 md:pb-14">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.05] sm:leading-[0.95] tracking-tight max-w-4xl text-black text-balance">
            Your Trusted Hub for{" "}
            <span className="italic font-display font-medium text-black">
              Senior Living
            </span>{" "}
            &amp; Local Care.
          </h1>

          <h2 className="mt-5 text-lg md:text-xl text-stone-700 max-w-2xl leading-relaxed">
            Connecting adults with high-trust local services, independent
            living resources, and vibrant social events right in your
            neighborhood.
          </h2>

          {/* Search bar — plain input, no All Categories button. Category
              discovery happens through the tiles below. */}
          <div className="mt-8 max-w-4xl">
            <CategorySearch categories={allCats} />
          </div>

          {/* Trust strip */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
            <div className="flex items-start gap-3 text-base">
              <BadgeCheck className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">Verified businesses</p>
                <p className="text-stone-700">Every listing is reviewed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <Heart className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">No ads, ever</p>
                <p className="text-stone-700">We never sell your data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-base">
              <MapPin className="w-6 h-6 text-black flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-black">Local to you</p>
                <p className="text-stone-700">Filter by city and province.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — taste-skill "Current skills" pattern. 4 columns on
          desktop, 2 on tablet, 1 on mobile. Cards link to each category's
          landing page. 21 categories (news excluded), alphabetical. */}
      <section className="max-w-6xl mx-auto px-4 pb-14 sm:pb-20">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-black leading-[1.05] tracking-tight">
            Current{" "}
            <span className="italic font-display font-black text-black">
              categories.
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed">
            Pick the right service for what you need — every card below leads
            to a verified category page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {allCats.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              description={describe(cat)}
            />
          ))}
        </div>
      </section>

      {/* Help line */}
      <section className="max-w-4xl mx-auto px-4 py-8 sm:py-10 text-center border-t border-stone-200">
        <div className="inline-flex flex-col items-center gap-2 text-stone-700">
          <div className="inline-flex items-center gap-2 text-base">
            <Phone className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span>Need help? Call our free senior help line.</span>
          </div>
          <a
            href="tel:1-855-555-0123"
            className="font-display font-black text-black text-3xl sm:text-4xl hover:underline whitespace-nowrap"
          >
            1-855-555-0123
          </a>
          <p className="text-base text-stone-600">Mon–Fri 8am–8pm ET</p>
        </div>
      </section>
    </div>
  );
}