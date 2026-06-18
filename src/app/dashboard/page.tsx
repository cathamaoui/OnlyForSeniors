import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Mail, Building2, BarChart3, CreditCard, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/business/login");

  const [businesses, subscription] = await Promise.all([
    prisma.business.findMany({
      where: { ownerId: session.user.id },
      include: {
        _count: { select: { reviews: true, inquiries: true } },
      },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className="yp-paper">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-black">
              Welcome, {session.user.name}
            </h1>
            <p className="text-black">Manage your business listings and subscription.</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="btn-yp-outline">
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </form>
        </div>

        {businesses.length === 0 && (
          <div className="yp-card text-center">
            <p className="font-display text-2xl text-black mb-3">
              You don&apos;t have a business yet.
            </p>
            <Link href="/list-business" className="btn-yp">
              Create Your Business Listing
            </Link>
          </div>
        )}

        <div className="grid gap-6">
          {businesses.map((b) => (
            <div key={b.id} className="yp-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {b.isPublished ? (
                      <span className="inline-block bg-black text-yp-500 text-xs font-black
                        uppercase px-2 py-1 border-2 border-black">
                        ✓ Live
                      </span>
                    ) : (
                      <span className="inline-block bg-yp-500 text-black text-xs font-black
                        uppercase px-2 py-1 border-2 border-black">
                        Pending
                      </span>
                    )}
                    {b.isFeatured && (
                      <span className="inline-block bg-black text-yp-500 text-xs font-black
                        uppercase px-2 py-1 border-2 border-black">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl text-black">
                    {b.name}
                  </h2>
                  <p className="text-black">{b.city}, {b.province}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/businesses/${b.slug}`} className="btn-yp-outline">
                    View Public Page
                  </Link>
                  <Link href={`/dashboard/businesses/${b.id}/edit`} className="btn-yp">
                    Edit
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <Stat
                  icon={<BarChart3 className="w-6 h-6" />}
                  label="Profile views"
                  value={b.isFeatured ? "Boosted" : "Normal"}
                />
                <Stat
                  icon={<Mail className="w-6 h-6" />}
                  label="Inquiries"
                  value={String(b._count.inquiries)}
                />
                <Stat
                  icon={<Building2 className="w-6 h-6" />}
                  label="Reviews"
                  value={String(b._count.reviews)}
                />
                <Stat
                  icon={<CreditCard className="w-6 h-6" />}
                  label="Subscription"
                  value={subscription ? "Active" : "Inactive"}
                />
              </div>

              {!subscription && (
                <div className="mt-6 bg-yp-500 border-2 border-black rounded-chunky p-4">
                  <p className="font-bold text-black">
                    Your listing won&apos;t appear in the directory until your subscription is active.
                  </p>
                  <Link href="/dashboard/billing" className="btn-yp mt-3 inline-block">
                    Activate for $10/month
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-yp-500 border-2 border-black rounded-chunky p-3">
      <div className="text-black mb-1">{icon}</div>
      <p className="text-2xl font-display text-black">{value}</p>
      <p className="text-sm text-black">{label}</p>
    </div>
  );
}
