import Link from "next/link";
import { FontResizer } from "@/components/ui/FontResizer";
import { BusinessesMenu } from "@/components/layout/BusinessesMenu";

export function Header() {
  return (
    // Floating header — stone background, no hard border; the inner nav sits
    // in a rounded pill on the right. Tasteskill-style.
    <header className="bg-stone-50 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white border border-black rounded-lg flex items-center justify-center font-display font-black text-base">
            OFS
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-normal">Only For Seniors</p>
            <p className="text-base text-stone-800">Canada&apos;s senior marketplace</p>
          </div>
        </Link>
        {/* Floating nav pill — rounded-full, white, with a subtle border and shadow */}
        <nav className="inline-flex items-center gap-1 sm:gap-2 bg-white border border-stone-200 rounded-full px-2 sm:px-3 py-1.5 shadow-sm">
          <Link
            href="/about/"
            className="hidden md:inline-block px-3 py-1.5 text-base font-semibold text-stone-800 hover:text-black rounded-full hover:bg-stone-50"
          >
            About
          </Link>
          <Link
            href="/categories/news/"
            className="hidden md:inline-block px-3 py-1.5 text-base font-semibold text-stone-800 hover:text-black rounded-full hover:bg-stone-50"
          >
            News
          </Link>
          <Link
            href="/categories/"
            className="hidden sm:inline-block px-3 py-1.5 text-base font-semibold text-stone-800 hover:text-black rounded-full hover:bg-stone-50"
          >
            Browse
          </Link>
          <BusinessesMenu />
          <Link
            href="/contact/"
            className="hidden sm:inline-block px-3 py-1.5 text-base font-semibold text-stone-800 hover:text-black rounded-full hover:bg-stone-50"
          >
            Contact
          </Link>
          <FontResizer />
        </nav>
      </div>
    </header>
  );
}
