import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Mail, Building2, BarChart3, CreditCard, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/business/login");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.user.id },
    include: {
      _count: { select: { reviews: true, inquiries: true } },
      subscription: true,
    },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900">
              Welcome, {session.user.name}
            </h1>
            <p className="text-emerald-800">Manage your business listings and subscription.</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="btn-outline">
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </form>
        </div>

        {businesses.length === 0 && (
          <div className="card-retro text-center">
            <p className="font-display text-2xl text-emerald-900 mb-3">
              You don&apos;t have a business yet.
            </p>
            <Link href="/list-business" className="btn-ember">
              Create Your Business Listing
            </Link>
          </div>
        )}

        <div className="grid gap-6">
          {businesses.map((b) => (
            <div key={b.id} className="card-retro">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {b.isPublished ? (
                      <span className="inline-block bg-emerald-700 text-white text-xs font-black
                        uppercase px-2 py-1 rounded border-2 border-black">
                        ✓ Live
                      </span>
                    ) : (
                      <span className="inline-block bg-ember-600 text-white text-xs font-black
                        uppercase px-2 py-1 rounded border-2 border-black">
                        Pending
                      </span>
                    )}
                    {b.isFeatured && (
                      <span className="inline-block bg-ember-500 text-white text-xs font-black
                        uppercase px-2 py-1 rounded border-2 border-black">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-black text-2xl text-emerald-900">
                    {b.name}
                  </h2>
                  <p className="text-emerald-800">{b.city}, {b.province}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/businesses/${b.slug}`} className="btn-outline">
                    View Public Page
                  </Link>
                  <Link href={`/dashboard/businesses/${b.id}/edit`} className="btn-primary">
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
                  value={b.subscription ? "Active" : "Inactive"}
                />
              </div>

              {!b.subscription && (
                <div className="mt-6 bg-ember-100 border-2 border-ember-700 rounded-chunky p-4">
                  <p className="font-bold text-ember-900">
                    Your listing won&apos;t appear in the directory until your subscription is active.
                  </p>
                  <Link href="/dashboard/billing" className="btn-ember mt-3">
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
    <div className="bg-cream-100 border-2 border-black rounded-chunky p-3">
      <div className="text-emerald-700 mb-1">{icon}</div>
      <p className="text-2xl font-display font-black text-emerald-900">{value}</p>
      <p className="text-sm text-emerald-800">{label}</p>
    </div>
  );
}
