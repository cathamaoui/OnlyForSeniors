import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional().nullable(),
  description: z.string().min(10),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  addressLine1: z.string().optional().nullable(),
  city: z.string().min(1),
  province: z.string().length(2),
  postalCode: z.string().optional().nullable(),
  serviceArea: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional().nullable(),
  priceRange: z.string().optional().nullable(),
  yearsInBusiness: z.number().int().nullable().optional(),
  wheelchairAccess: z.boolean().optional(),
  seniorDiscount: z.boolean().optional(),
  homeVisits: z.boolean().optional(),
  isMobileService: z.boolean().optional(),
  isOnlineService: z.boolean().optional(),
  offersDelivery: z.boolean().optional(),
  bilingualStaff: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const business = await prisma.business.findUnique({ where: { id } });
  if (!business || business.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    await prisma.business.update({
      where: { id },
      data: {
        ...data,
        website: data.website || null,
        subcategoryId: data.subcategoryId || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
