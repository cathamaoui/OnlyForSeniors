import Link from "next/link";
import { getAllCategories } from "@/lib/businesses";

export function Footer() {
  const cats = getAllCategories();
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-stone-900 font-display font-black flex items-center justify-center rounded text-sm">OFS</div>
            <span className="font-display font-bold text-white">Only For Seniors</span>
          </div>
          <p className="text-sm mt-3 text-stone-400">
            Canada's senior marketplace. No ads. No spam. Just the people who can help.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-white">Site</h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/about/" className="text-stone-300 hover:text-white">About</Link></li>
            <li><Link href="/categories/news/" className="text-stone-300 hover:text-white">News</Link></li>
            <li><Link href="/contact/" className="text-stone-300 hover:text-white">Contact</Link></li>
            <li><Link href="/how-it-works/" className="text-stone-300 hover:text-white">How It Works</Link></li>
            <li><Link href="/pricing/" className="text-stone-300 hover:text-white">Pricing</Link></li>
            <li><Link href="/help/" className="text-stone-300 hover:text-white">Help</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-white">Browse</h4>
          <ul className="space-y-1.5 text-sm">
            {cats.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}/`} className="text-stone-300 hover:text-white">
                  {c.icon} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-3 text-white">For Business Owners</h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/list-business/" className="text-stone-300 hover:text-white">Post a Listing ($10/mo)</Link></li>
            <li><Link href="/pricing/" className="text-stone-300 hover:text-white">Pricing</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 text-center text-xs py-4 text-stone-500">
        © {new Date().getFullYear()} Only For Seniors · Made with care in Canada
      </div>
    </footer>
  );
}
