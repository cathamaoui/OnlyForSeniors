import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const businessSchema = z.object({
  name: z.string().min(1).max(120),
  tagline: z.string().optional(),
  description: z.string().min(10).max(4000),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().min(1),
  province: z.string().length(2),
  postalCode: z.string().optional(),
  serviceArea: z.string().optional(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional().nullable(),
  priceRange: z.string().optional(),
  yearsInBusiness: z.number().int().nullable().optional(),
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional(),
  business: businessSchema,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    let baseSlug = slugify(parsed.data.business.name);
    if (!baseSlug) baseSlug = "business";
    let slug = baseSlug;
    let n = 1;
    while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone,
        passwordHash,
        role: "BUSINESS",
        businesses: {
          create: {
            ...parsed.data.business,
            website: parsed.data.business.website || undefined,
            slug,
          },
        },
      },
      include: { businesses: true },
    });

    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      businessId: user.businesses[0]?.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
