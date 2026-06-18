import { ScrollReveal } from "@/components/animations/ScrollReveal";
import Link from "next/link";
import { Search, Star, Phone, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "How It Works",
  description: "How to use the Only For Seniors directory.",
};

export default function HowItWorksPage() {
  return (
    <div className="yp-paper">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-emerald-900 mb-3 text-center">
          How Only For Seniors Works
        </h1>
        <p className="text-xl text-emerald-800 text-center mb-12 max-w-2xl mx-auto">
          Whether you&apos;re 65 or 95, our directory is built to be simple.
        </p>

        <div className="space-y-6">
          {[
            {
              icon: <Search className="w-10 h-10" />,
              title: "1. Search or browse",
              body: "Type what you need into the big search bar, or tap a colour-coded category that interests you.",
            },
            {
              icon: <Star className="w-10 h-10" />,
              title: "2. Pick a business",
              body: "Every listing shows a description, hours, photos, and reviews. Look for the green ✓ Verified badge.",
            },
            {
              icon: <Phone className="w-10 h-10" />,
              title: "3. Tap to call",
              body: "Press the big orange button to call them right from your phone. Or tap the green button to send a message.",
            },
            {
              icon: <MessageSquare className="w-10 h-10" />,
              title: "4. Get help",
              body: "The business replies, books your service, or answers your questions. It&apos;s that simple.",
            },
            {
              icon: <ShieldCheck className="w-10 h-10" />,
              title: "5. Leave a review",
              body: "Help other seniors by sharing your experience. Honest reviews keep our community safe.",
            },
          ].map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.05}>
              <div className="card-retro flex items-start gap-4">
                <div className="shrink-0 w-20 h-20 rounded-chunky bg-emerald-700 text-white
                  flex items-center justify-center border-2 border-black">
                  {s.icon}
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-emerald-900 mb-1">
                    {s.title}
                  </h2>
                  <p className="text-lg text-emerald-800 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories" className="btn-ember text-lg">
            Start Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
