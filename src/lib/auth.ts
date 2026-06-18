// Lightweight cookie-based session helpers.
// For production swap to NextAuth or Iron Session - the schema is
// already designed to support either.
import { cookies } from "next/headers";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "ofs_session";
const SESSION_DAYS = 30;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  // simple value - replace with signed JWT in production
  const value = `${userId}.${expires.getTime()}`;
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    expires,
    path: "/",
  });
  return { userId, expires };
}

export async function getSession() {
  const c = (await cookies()).get(SESSION_COOKIE);
  if (!c) return null;
  const [userId, expStr] = c.value.split(".");
  const exp = Number(expStr);
  if (!userId || !exp || Date.now() > exp) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? { user } : null;
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session.user;
}
