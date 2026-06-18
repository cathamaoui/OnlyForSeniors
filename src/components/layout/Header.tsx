"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Phone } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/categories", label: "Browse Categories" },
  { href: "/businesses", label: "Find a Business" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/list-business", label: "List Your Business" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream-50 border-b-4 border-black">
      {/* Top utility bar */}
      <div className="bg-emerald-800 text-cream-50 text-sm">
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

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Only For Seniors home"
        >
          <span className="text-3xl" aria-hidden="true">📖</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-emerald-900 leading-none">
            Only For
            <span className="block text-ember-600 -mt-1">Seniors</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-lg font-bold text-emerald-900
                rounded-chunky hover:bg-emerald-100 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="btn-primary min-h-touch"
            aria-label="Search the directory"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden btn-outline !min-h-touch !px-3"
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
          "lg:hidden border-t-2 border-black bg-cream-100",
          open ? "block" : "hidden"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="min-h-touch flex items-center px-4 text-lg font-bold
                text-emerald-900 rounded-chunky hover:bg-emerald-100"
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
