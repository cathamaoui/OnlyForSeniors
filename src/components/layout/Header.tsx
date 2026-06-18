import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white border border-black rounded-lg flex items-center justify-center font-display font-black text-sm">
            OFS
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">Only For Seniors</p>
            <p className="text-xs text-stone-600">Canada's senior marketplace</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/about/"
            className="hidden md:inline-block px-3 py-2 text-sm font-semibold text-stone-800 hover:text-black"
          >
            About
          </Link>
          <Link
            href="/categories/news/"
            className="hidden md:inline-block px-3 py-2 text-sm font-semibold text-stone-800 hover:text-black"
          >
            News
          </Link>
          <Link
            href="/categories/"
            className="hidden sm:inline-block px-3 py-2 text-sm font-semibold text-stone-800 hover:text-black"
          >
            Browse
          </Link>
          <Link
            href="/contact/"
            className="hidden sm:inline-block px-3 py-2 text-sm font-semibold text-stone-800 hover:text-black"
          >
            Contact
          </Link>
          <Link
            href="/list-business/"
            className="inline-block px-4 py-2 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 ml-1"
          >
            Post a Listing — $10/mo
          </Link>
        </nav>
      </div>
    </header>
  );
}
