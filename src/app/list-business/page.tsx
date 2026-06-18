import { prisma } from "@/lib/db";
import { ListBusinessForm } from "@/components/business/ListBusinessForm";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "List Your Business — $10/month",
  description: "Join the Only For Seniors directory. Reach Canadian seniors for just $10/month.",
};

export default async function ListBusinessPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subcategories: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="yp-paper">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-block bg-ember-600 text-white font-black uppercase
              tracking-wider text-sm px-3 py-1.5 rounded-chunky border-2 border-black mb-3">
              For Business Owners
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-emerald-900 mb-4">
              List your business for $10/month
            </h1>
            <p className="text-xl text-emerald-800 max-w-2xl mx-auto">
              Reach thousands of Canadian seniors looking for trusted services.
              No contracts. Cancel anytime.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <ScrollReveal>
            <div className="card-retro h-full">
              <h2 className="font-display font-black text-2xl text-emerald-900 mb-4">
                What you get
              </h2>
              <ul className="space-y-3 text-lg">
                {[
                  "Custom business profile with photos, hours, and contact info",
                  "Get discovered through our colour-coded category directory",
                  "Direct contact from seniors in your area via message or phone",
                  "Senior-friendly badge to build trust",
                  "Customer reviews to grow your reputation",
                  "Featured listing upgrades available",
                  "Mobile-friendly — seniors use phones and tablets",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="shrink-0 bg-emerald-700 text-white rounded-full w-7 h-7 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-emerald-900">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 bg-cream-200 border-2 border-black rounded-chunky p-4">
                <p className="font-display font-black text-2xl text-emerald-900">
                  $10 CAD / month
                </p>
                <p className="text-emerald-800">
                  Billed monthly. Securely processed by Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="card-retro">
              <h2 className="font-display font-black text-2xl text-emerald-900 mb-4">
                Sign up &amp; create your listing
              </h2>
              <ListBusinessForm categories={categories.map(c => ({
                id: c.id,
                name: c.name,
                subcategories: c.subcategories.map(s => ({ id: s.id, name: s.name })),
              }))} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
