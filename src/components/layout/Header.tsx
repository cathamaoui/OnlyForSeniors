"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Phone } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Browse Sections" },
  { href: "/businesses", label: "Find a Business" },
  { href: "/list-business", label: "List Your Business" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-yp-500 border-b-4 border-black">
      {/* Top utility bar - black banner with white text */}
      <div className="bg-black text-yp-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <a
            href="tel:1-800-555-0199"
            className="inline-flex items-center gap-2 font-bold hover:underline"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Call us: 1-800-555-0199</span>
          </a>
          <span className="hidden sm:inline">
            🇨🇦 Proudly serving Canadian seniors since 2026
          </span>
          <Link
            href="/help"
            className="hover:underline font-semibold"
          >
            Need help?
          </Link>
        </div>
      </div>

      {/* Main bar - the "book cover" look */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 p-1 -m-1
            border-2 border-transparent hover:border-black
            transition-colors"
          aria-label="Only For Seniors home - click to go to homepage"
          title="Click to go to homepage"
        >
          {/* Clean text logo with a YP badge */}
          <span
            className="bg-black text-yp-500 border-2 border-black px-2 py-1
              font-display text-base sm:text-lg uppercase tracking-tight
              group-hover:bg-yp-500 group-hover:text-black transition-colors"
            aria-hidden="true"
          >
            YP
          </span>
          <span className="font-display text-xl sm:text-2xl text-black leading-none">
            <span className="block">Only For</span>
            <span className="block -mt-0.5">Seniors</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-base text-black
                border-2 border-transparent
                hover:border-black hover:bg-yp-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="btn-yp"
            aria-label="Search the directory"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden btn-yp-outline !px-3"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={clsx(
          "lg:hidden border-t-2 border-black bg-yp-500",
          open ? "block" : "hidden"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="min-h-touch flex items-center px-4 text-base text-black
                border-2 border-transparent hover:border-black"
            >
              {l.label}
              <span className="instruction ml-auto !mt-0">
                Tap to open
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
