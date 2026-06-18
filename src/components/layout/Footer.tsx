import Link from "next/link";
import { getAllCategories } from "@/lib/businesses";

export function Footer() {
  const cats = getAllCategories();
  return (
    <footer className="border-t-2 border-black bg-black text-yp mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yp text-black font-display font-black flex items-center justify-center rounded">
              YP
            </div>
            <span className="font-display font-bold">Only For Seniors</span>
          </div>
          <p className="text-sm mt-2 opacity-90">
            Canada's senior marketplace. No ads. No spam. Just the people who can help.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold mb-2">Browse</h4>
          <ul className="space-y-1 text-sm">
            {cats.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:underline">
                  {c.icon} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold mb-2">For Business Owners</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/list-business" className="hover:underline">Post a Listing</Link></li>
            <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link href="/how-it-works" className="hover:underline">How It Works</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-yp/30 text-center text-xs py-3 opacity-80">
        © {new Date().getFullYear()} Only For Seniors · Made with care in Canada
      </div>
    </footer>
  );
}
