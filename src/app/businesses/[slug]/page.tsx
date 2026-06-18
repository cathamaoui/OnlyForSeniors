import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Globe,
  MapPin,
  Mail,
  Star,
  BadgeCheck,
  Shield,
  Home,
  Wifi,
  Truck,
  Languages,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { InquiryForm } from "@/components/business/InquiryForm";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const dynamic = "force-dynamic";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = await prisma.business.findUnique({ where: { slug } });
  return { title: b?.name ?? "Business" };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategory: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      hours: { orderBy: { dayOfWeek: "asc" } },
      images: { orderBy: { order: "asc" } },
    },
  });
  if (!business) notFound();

  const avg =
    business.reviews.length > 0
      ? business.reviews.reduce((s, r) => s + r.rating, 0) / business.reviews.length
      : 0;

  return (
    <div className="yp-paper">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/businesses"
          className="inline-flex items-center gap-2 text-emerald-800 font-bold
            hover:text-ember-600 mb-4 min-h-touch"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Back to directory
        </Link>

        {/* Header card */}
        <ScrollReveal>
          <div className="card-retro mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-24 h-24 bg-emerald-100 border-2 border-black
                rounded-chunky flex items-center justify-center text-5xl">
                {business.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={business.logoUrl} alt="" className="w-full h-full object-cover rounded-chunky" />
                ) : (
                  "🏬"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {business.isFeatured && (
                    <span className="inline-block bg-ember-600 text-white text-xs font-black
                      uppercase tracking-wider px-2 py-1 rounded-chunky border-2 border-black">
                      ⭐ Featured
                    </span>
                  )}
                  {business.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-700 text-white
                      text-xs font-black uppercase tracking-wider px-2 py-1 rounded-chunky
                      border-2 border-black">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900">
                  {business.name}
                </h1>
                {business.tagline && (
                  <p className="text-lg text-emerald-800 mt-1">{business.tagline}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-emerald-800">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    {business.city}, {business.province}
                    {business.serviceArea && business.serviceArea !== business.city &&
                      ` · ${business.serviceArea}`}
                  </span>
                  <Link
                    href={`/categories/${business.category.slug}`}
                    className="inline-block bg-cream-200 text-emerald-900 font-bold
                      px-2 py-0.5 rounded hover:bg-ember-100"
                  >
                    {business.category.name}
                  </Link>
                  {business.subcategory && (
                    <span className="text-sm">· {business.subcategory.name}</span>
                  )}
                </div>
                {avg > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-5 h-5 ${
                          n <= Math.round(avg)
                            ? "fill-ember-500 text-ember-500"
                            : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="font-bold text-emerald-900 ml-1">
                      {avg.toFixed(1)} ({business.reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick-action buttons - big, friendly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="btn-ember"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Call {business.phone}
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Globe className="w-5 h-5" aria-hidden="true" />
                  Visit Website
                </a>
              )}
              <a
                href="#inquiry"
                className="btn-primary sm:col-span-2"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                Send a Message
              </a>
            </div>
            <span className="instruction">
              The big orange button calls them right now. The green button opens your email or contact form.
            </span>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal>
              <div className="card-retro">
                <h2 className="font-display font-black text-2xl text-emerald-900 mb-3">
                  About this business
                </h2>
                <p className="text-emerald-800 leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            </ScrollReveal>

            {/* Accessibility badges */}
            <ScrollReveal>
              <div className="card-retro">
                <h2 className="font-display font-black text-2xl text-emerald-900 mb-3">
                  Senior-Friendly Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { v: business.wheelchairAccess, icon: <Shield className="w-5 h-5" />, label: "Wheelchair Accessible" },
                    { v: business.seniorDiscount, icon: <Tag className="w-5 h-5" />, label: "Senior Discount Offered" },
                    { v: business.homeVisits, icon: <Home className="w-5 h-5" />, label: "Home Visits Available" },
                    { v: business.isMobileService, icon: <Truck className="w-5 h-5" />, label: "Mobile / They Come to You" },
                    { v: business.isOnlineService, icon: <Wifi className="w-5 h-5" />, label: "Online / Remote Service" },
                    { v: business.bilingualStaff, icon: <Languages className="w-5 h-5" />, label: "Bilingual Staff" },
                    { v: business.offersDelivery, icon: <Truck className="w-5 h-5" />, label: "Delivery Available" },
                  ]
                    .filter((f) => f.v)
                    .map((f) => (
                      <li
                        key={f.label}
                        className="flex items-center gap-2 bg-emerald-100 text-emerald-900
                          font-bold px-3 py-2 rounded-chunky border-2 border-emerald-700"
                      >
                        {f.icon}
                        {f.label}
                      </li>
                    ))}
                </ul>
                {!business.wheelchairAccess &&
                  !business.seniorDiscount &&
                  !business.homeVisits &&
                  !business.isMobileService &&
                  !business.isOnlineService &&
                  !business.bilingualStaff &&
                  !business.offersDelivery && (
                    <p className="text-emerald-800 italic">
                      This business has not yet listed accessibility features. Call them to ask.
                    </p>
                  )}
              </div>
            </ScrollReveal>

            {/* Reviews */}
            <ScrollReveal>
              <div className="card-retro">
                <h2 className="font-display font-black text-2xl text-emerald-900 mb-3">
                  Reviews ({business.reviews.length})
                </h2>
                {business.reviews.length === 0 ? (
                  <p className="text-emerald-800 italic">No reviews yet. Be the first!</p>
                ) : (
                  <ul className="space-y-4">
                    {business.reviews.map((r) => (
                      <li key={r.id} className="border-l-4 border-ember-500 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-emerald-900">{r.user.name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`w-4 h-4 ${
                                  n <= r.rating
                                    ? "fill-ember-500 text-ember-500"
                                    : "text-gray-300"
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="font-bold text-emerald-900">{r.title}</p>
                        <p className="text-emerald-800 leading-relaxed">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScrollReveal>
              <div className="card-retro">
                <h2 className="font-display font-black text-2xl text-emerald-900 mb-3">
                  Hours
                </h2>
                <ul className="space-y-1 text-emerald-800">
                  {DAYS.map((day, idx) => {
                    const h = business.hours.find((x) => x.dayOfWeek === idx);
                    return (
                      <li key={day} className="flex justify-between">
                        <span className="font-bold">{day}</span>
                        <span>
                          {h && !h.isClosed ? `${h.openTime} – ${h.closeTime}` : "Closed"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>

            {business.priceRange && (
              <ScrollReveal>
                <div className="card-retro">
                  <h2 className="font-display font-black text-2xl text-emerald-900 mb-2">
                    Pricing
                  </h2>
                  <p className="text-2xl font-display font-black text-ember-700">
                    {business.priceRange}
                  </p>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div id="inquiry" className="card-retro">
                <h2 className="font-display font-black text-2xl text-emerald-900 mb-3">
                  Send a Message
                </h2>
                <InquiryForm businessId={business.id} businessName={business.name} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
