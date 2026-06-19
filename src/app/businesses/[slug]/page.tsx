import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  BadgeCheck,
  Clock,
  Tag,
} from "lucide-react";
import { getBusinessById, getCategoryBySlug, getSubcategory, getAllBusinesses } from "@/lib/businesses";
import { DetailActions } from "@/components/ui/DetailActions";

export function generateStaticParams() {
  return getAllBusinesses().map((b) => ({ slug: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBusinessById(slug);
  return {
    title: b ? `${b.name} — Only For Seniors` : "Listing — Only For Seniors",
    description: b?.tagline,
  };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBusinessById(slug);
  if (!b) notFound();

  const cat = getCategoryBySlug(b.categorySlug);
  const sub = getSubcategory(b.subcategorySlug);

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href={cat ? `/categories/${cat.slug}` : "/businesses"}
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 text-black font-display text-base hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <DetailActions />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-stone-100 border-2 border-black rounded-lg overflow-hidden">
            <Image
              src={b.image}
              alt={b.name}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
              priority
            />
            {b.isFeatured && (
              <span className="absolute top-3 left-3 text-black text-base font-bold px-3 py-1.5 rounded hover:underline">
                Featured
              </span>
            )}
          </div>

          {/* Title + meta */}
          <div className="bg-white border-2 border-black rounded-lg p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-medium leading-normal">
                  {b.name}
                </h1>
                {b.tagline && (
                  <p className="text-lg text-stone-700 mt-1">{b.tagline}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-base flex-wrap">
                  <span className="flex items-center gap-1 text-stone-800">
                    <MapPin className="w-4 h-4" />
                    {b.city}, {b.province}
                  </span>
                  {b.priceRange && (
                    <span className="font-bold text-black">{b.priceRange}</span>
                  )}
                  {b.isVerified && (
                    <span className="flex items-center gap-1 text-stone-900 font-bold">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {b.rating !== undefined && (
              <div className="mt-4 flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 fill-stone-900 stroke-black" />
                <span className="font-bold">{b.rating.toFixed(1)}</span>
                {b.reviewCount !== undefined && (
                  <span className="text-stone-800">({b.reviewCount} reviews)</span>
                )}
              </div>
            )}

            {b.tags && b.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {b.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-base px-3 py-1 bg-stone-100 border-2 border-black rounded"
                  >
                    <Tag className="w-3 h-3" /> {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h2 className="font-display font-medium text-lg mb-2">About this listing</h2>
              <p className="text-stone-800 leading-relaxed whitespace-pre-line">{b.description}</p>
            </div>

            {cat && (
              <div className="mt-6 pt-4 border-t-2 border-stone-200 text-base text-stone-800">
                Listed in:{" "}
                <Link href={`/categories/${cat.slug}`} className="font-bold hover:underline">
                  {cat.name}
                </Link>
                {sub && (
                  <>
                    {" › "}
                    <Link
                      href={`/categories/${cat.slug}/${sub.subcategory.slug}`}
                      className="hover:underline"
                    >
                      {sub.subcategory.name}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Inquiry form */}
          <div className="bg-white border-2 border-black rounded-lg p-6">
            <h2 className="text-xl font-display font-medium mb-3">Send a message</h2>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 border-2 border-black rounded"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border-2 border-black rounded"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                className="w-full px-3 py-2 border-2 border-black rounded"
              />
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-black text-black border-2 border-black font-display font-bold hover:bg-stone-900"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white border-2 border-black rounded-lg p-4 space-y-3">
            {b.phone && (
              <a
                href={`tel:${b.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded font-bold text-lg hover:bg-stone-100"
              >
                <Phone className="w-5 h-5" /> {b.phone}
              </a>
            )}
            {b.email && (
              <a
                href={`mailto:${b.email}`}
                className="flex items-center gap-3 p-3 border-2 border-black rounded hover:bg-stone-50"
              >
                <Mail className="w-5 h-5" /> <span className="text-base">{b.email}</span>
              </a>
            )}
            {b.website && (
              <a
                href={b.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border-2 border-black rounded hover:bg-stone-50"
              >
                <Globe className="w-5 h-5" /> <span className="text-base">Visit website</span>
              </a>
            )}

            {(b.address || b.postalCode) && (
              <div className="flex items-start gap-3 p-3 border-2 border-black rounded">
                <MapPin className="w-5 h-5 mt-0.5" />
                <div className="text-base">
                  {b.address && <p>{b.address}</p>}
                  <p>
                    {b.city}, {b.province} {b.postalCode}
                  </p>
                </div>
              </div>
            )}

            {b.hours && (
              <div className="flex items-center gap-3 p-3 border-2 border-black rounded">
                <Clock className="w-5 h-5" />
                <span className="text-base">{b.hours}</span>
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-4 text-base">
            <p className="font-bold mb-1">Safety tip</p>
            <p className="text-stone-800">
              Always verify a business before sending money or personal information.
              If something feels off, ask a friend or family member for advice.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
