import Link from "next/link";

/**
 * Footer — taste-skill style.
 *
 * Pure white background. Logo + tagline on the left, horizontal links on
 * the right. Senior-friendly: link text is 20px (text-lg in our 18px-base
 * rem scale) so older eyes can read comfortably. High-contrast black on
 * white. No columns, no headings above the links.
 */
export function Footer() {
  const primaryLinks = [
    { href: "/about/", label: "About" },
    { href: "/categories/news/", label: "News" },
    { href: "/categories/", label: "Browse" },
    { href: "/how-it-works/", label: "How It Works" },
    { href: "/for-businesses/", label: "For Businesses" },
    { href: "/pricing/", label: "Pricing" },
    { href: "/contact/", label: "Contact" },
  ];

  const legalLinks = [
    { href: "/help/", label: "Help" },
    { href: "/privacy/", label: "Privacy" },
    { href: "/terms/", label: "Terms" },
    { href: "/accessibility/", label: "Accessibility" },
  ];

  return (
    <footer className="border-t border-stone-200 bg-white mt-16 sm:mt-20">
      {/* Top row: brand on left, links on right */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="md:max-w-md">
          <Link href="/" aria-label="Only For Seniors — home">
            <span className="font-display font-bold text-black text-xl">
              Only For Seniors
            </span>
          </Link>
          <p className="mt-3 text-lg text-stone-700 leading-relaxed">
            Canada&apos;s senior marketplace. No ads. No spam. Just the people who can help.
          </p>
          {/* Phone on its own line — no inline crowding */}
          <p className="mt-4 text-base text-stone-600">
            Call our free senior help line:
          </p>
          <p className="mt-1">
            <a
              href="tel:1-855-555-0123"
              className="font-display font-black text-black text-2xl hover:underline whitespace-nowrap"
            >
              1-855-555-0123
            </a>
          </p>
        </div>

        {/* Links — right side */}
        <nav
          aria-label="Footer"
          className="flex flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-16"
        >
          {/* Column 1 — site */}
          <div>
            <h3 className="text-base font-display font-medium text-black mb-3 uppercase tracking-wide">
              Site
            </h3>
            <ul className="flex flex-col gap-1">
              {primaryLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center min-h-touch py-1 text-lg text-stone-700 hover:text-black hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — support & legal */}
          <div>
            <h3 className="text-base font-display font-medium text-black mb-3 uppercase tracking-wide">
              Support
            </h3>
            <ul className="flex flex-col gap-1">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center min-h-touch py-1 text-lg text-stone-700 hover:text-black hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom row: copyright + legal text */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-base text-stone-600">
            © {new Date().getFullYear()} Only For Seniors · Made with care in Canada
          </p>
          <p className="text-base text-stone-600">
            Built for Canadian seniors
          </p>
        </div>
      </div>
    </footer>
  );
}
