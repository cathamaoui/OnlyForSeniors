import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-yp-500 mt-16 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl" aria-hidden="true">📖</span>
            <span className="font-display text-2xl">
              Only For Seniors
            </span>
          </div>
          <p className="text-yp-100 leading-relaxed">
            Canada&apos;s friendly directory built for the 65+ community.
            Trusted businesses. Easy to use. Right at your fingertips.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xl mb-3 text-yp-500 border-b border-yp-700 pb-2">
            Browse
          </h3>
          <ul className="space-y-2 text-yp-100">
            <li><Link href="/categories" className="hover:text-white hover:underline">All Sections</Link></li>
            <li><Link href="/businesses" className="hover:text-white hover:underline">Find a Business</Link></li>
            <li><Link href="/search" className="hover:text-white hover:underline">Search Directory</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white hover:underline">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl mb-3 text-yp-500 border-b border-yp-700 pb-2">
            For Business Owners
          </h3>
          <ul className="space-y-2 text-yp-100">
            <li><Link href="/list-business" className="hover:text-white hover:underline">List Your Business</Link></li>
            <li><Link href="/pricing" className="hover:text-white hover:underline">$10/Month Plan</Link></li>
            <li><Link href="/business/login" className="hover:text-white hover:underline">Owner Login</Link></li>
            <li><Link href="/help" className="hover:text-white hover:underline">Help &amp; Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl mb-3 text-yp-500 border-b border-yp-700 pb-2">
            Contact
          </h3>
          <ul className="space-y-2 text-yp-100">
            <li>📞 1-800-555-0199</li>
            <li>✉️ hello@onlyforseniors.ca</li>
            <li>📍 Toronto, Ontario</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-yp-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-yp-100">
          <p>© {new Date().getFullYear()} Only For Seniors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:text-white hover:underline">Terms</Link>
            <Link href="/accessibility" className="hover:text-white hover:underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
