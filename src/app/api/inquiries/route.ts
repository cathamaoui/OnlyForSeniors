import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const inquiry = await prisma.inquiry.create({
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
