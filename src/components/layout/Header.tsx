import Link from "next/link";

export function Header() {
  return (
    <header className="border-b-2 border-black bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yp border-2 border-black rounded flex items-center justify-center font-display font-black text-black">
            YP
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">Only For Seniors</p>
            <p className="text-xs text-stone-600">Canada's senior marketplace</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/categories"
            className="hidden sm:inline-block px-3 py-2 text-sm font-bold border-2 border-black hover:bg-yp"
          >
            Browse
          </Link>
          <Link
            href="/list-business"
            className="inline-block px-3 py-2 text-sm font-bold bg-black text-yp border-2 border-black"
          >
            Post a Listing
          </Link>
        </div>
      </div>
    </header>
  );
}
