import Link from "next/link";
import { FontResizer } from "@/components/ui/FontResizer";
import { BusinessesMenu } from "@/components/layout/BusinessesMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    // Header — sits on the cream page background. Wordmark + tagline on
    // the left (no logo tile), desktop nav on the right.
    <header className="bg-white sticky top-0 z-20 border-b border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
        {/* Brand block: wordmark only, no tagline */}
        <Link
          href="/"
          aria-label="Only For Seniors — home"
          className="block min-h-touch flex items-center flex-shrink-0"
        >
          <span className="block font-display font-bold text-xl sm:text-2xl text-black leading-tight">
            Only For Seniors
          </span>
        </Link>

        {/* Desktop nav (>= md) — bare text links with separators */}
        <nav className="hidden md:inline-flex items-center gap-5 lg:gap-7">
          <Link
            href="/about/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline underline-offset-4 decoration-2"
          >
            About
          </Link>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <Link
            href="/categories/news/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline underline-offset-4 decoration-2"
          >
            News
          </Link>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <Link
            href="/categories/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline underline-offset-4 decoration-2"
          >
            Browse
          </Link>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <BusinessesMenu />
          <span aria-hidden="true" className="text-stone-300">·</span>
          <Link
            href="/contact/"
            className="text-base font-semibold text-stone-800 hover:text-black hover:underline underline-offset-4 decoration-2"
          >
            Contact
          </Link>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <FontResizer />
        </nav>

        {/* Mobile (< md) — hamburger reveals full-screen overlay */}
        <MobileMenu />
      </div>
    </header>
  );
}
