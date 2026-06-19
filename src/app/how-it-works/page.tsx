import Link from "next/link";
import { Search, Star, Phone, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How It Works",
  description: "How to use the Only For Seniors directory.",
};

const STEPS = [
  {
    icon: Search,
    title: "1. Search or browse",
    body: "Type what you need into the big search bar, or pick a category from the dropdown to narrow your search.",
  },
  {
    icon: Star,
    title: "2. Pick a business",
    body: "Every listing shows a description, hours, photos, and reviews. Look for the verified badge.",
  },
  {
    icon: Phone,
    title: "3. Tap to call",
    body: "Press the call button on any listing to dial them right from your phone. No app downloads needed.",
  },
  {
    icon: MessageSquare,
    title: "4. Get help",
    body: "The business replies, books your service, or answers your questions. It's that simple.",
  },
  {
    icon: ShieldCheck,
    title: "5. Leave a review",
    body: "Help other seniors by sharing your experience. Honest reviews keep our community safe.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 mb-3 text-center">
          How Only For Seniors Works
        </h1>
        <p className="text-lg sm:text-xl text-stone-700 text-center mb-12 max-w-2xl mx-auto">
          Whether you&apos;re 65 or 95, our directory is built to be simple.
        </p>

        <div className="space-y-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-start gap-4 sm:gap-5"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-stone-900 text-white rounded-xl flex-shrink-0"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.25} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 mb-1">
                    {s.title}
                  </h2>
                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-7 py-3 bg-stone-900 text-white border border-stone-900 rounded-full font-display font-bold text-lg hover:bg-black"
          >
            Start Browsing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
