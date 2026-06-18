import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EditBusinessForm } from "@/components/dashboard/EditBusinessForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Business" };

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/business/login");

  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id },
    include: { subcategory: true },
  });
  if (!business || business.ownerId !== session.user.id) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subcategories: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/dashboard"
          className="text-emerald-800 font-bold hover:text-ember-600 mb-3 inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mb-6">
          Edit {business.name}
        </h1>
        <EditBusinessForm
          business={{
            id: business.id,
            name: business.name,
            tagline: business.tagline,
            description: business.description,
            email: business.email,
            phone: business.phone,
            website: business.website,
            addressLine1: business.addressLine1,
            city: business.city,
            province: business.province,
            postalCode: business.postalCode,
            serviceArea: business.serviceArea,
            categoryId: business.categoryId,
            subcategoryId: business.subcategoryId,
            priceRange: business.priceRange,
            yearsInBusiness: business.yearsInBusiness,
            wheelchairAccess: business.wheelchairAccess,
            seniorDiscount: business.seniorDiscount,
            homeVisits: business.homeVisits,
            isMobileService: business.isMobileService,
            isOnlineService: business.isOnlineService,
            offersDelivery: business.offersDelivery,
            bilingualStaff: business.bilingualStaff,
          }}
          categories={categories.map(c => ({
            id: c.id, name: c.name,
            subcategories: c.subcategories.map(s => ({ id: s.id, name: s.name })),
          }))}
        />
      </div>
    </div>
  );
}
