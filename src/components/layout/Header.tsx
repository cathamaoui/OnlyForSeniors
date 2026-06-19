import Link from "next/link";
import { FontResizer } from "@/components/ui/FontResizer";
import { BusinessesMenu } from "@/components/layout/BusinessesMenu";

export function Header() {
  return (
    // Floating header — sits on the cream page background. No logo tile;
    // just text-as-links inline, no pill wrapping the nav. Tasteskill-style.
    <header className="bg-cream sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="block">
          <p className="font-display font-bold text-lg leading-normal">Only For Seniors</p>
          <p className="text-base text-stone-800">Canada&apos;s senior marketplace</p>
        </Link>
        {/* Nav — bare text links, no bubble, no rounded pill. Hover
            underlines only. Sits flush on the cream header. */}
        <nav className="inline-flex items-center gap-4 sm:gap-6">
          <Link
            href="/about/"
            className="hidden md:inline-block text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            About
          </Link>
          <Link
            href="/categories/news/"
            className="hidden md:inline-block text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            News
          </Link>
          <Link
            href="/categories/"
            className="hidden sm:inline-block text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            Browse
          </Link>
          <BusinessesMenu />
          <Link
            href="/contact/"
            className="hidden sm:inline-block text-base font-semibold text-stone-800 hover:text-black hover:underline"
          >
            Contact
          </Link>
          <FontResizer />
        </nav>
      </div>
    </header>
  );
}
