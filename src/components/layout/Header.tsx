import Link from "next/link";
import { FontResizer } from "@/components/ui/FontResizer";
import { BusinessesMenu } from "@/components/layout/BusinessesMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    // Floating header — sits on the cream page background. No logo tile;
    // just text-as-links inline, no pill wrapping the nav. Tasteskill-style.
    <header className="bg-cream sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="block min-h-touch flex items-center">
          <p className="font-display font-bold text-lg leading-normal">Only For Seniors</p>
          <p className="hidden sm:block text-base text-stone-800">Canada&apos;s senior marketplace</p>
        </Link>

        {/* Desktop nav (>= md) — bare text links */}
        <nav className="hidden md:inline-flex items-center gap-4 sm:gap-6">
          <Link
            href="/about/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            About
          </Link>
          <Link
            href="/categories/news/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            News
          </Link>
          <Link
            href="/categories/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            Browse
          </Link>
          <BusinessesMenu />
          <Link
            href="/contact/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            Contact
          </Link>
          <FontResizer />
        </nav>

        {/* Mobile (< md) — hamburger reveals full-screen overlay */}
        <MobileMenu />
      </div>
    </header>
  );
}
