"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { FontResizer } from "@/components/ui/FontResizer";

/**
 * Mobile navigation overlay. Shown only on small screens (under `sm` /
 * 640px). Slides down from the top when the hamburger button is pressed.
 *
 * Includes all the same destinations as the desktop header, plus a
 * "Businesses" sub-section so seniors don't lose access to those routes
 * on mobile.
 *
 * Closes on:
 *  - clicking any link
 *  - pressing the close (X) button
 *  - pressing Escape
 *  - clicking the backdrop
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger trigger — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden inline-flex items-center justify-center min-h-touch min-w-touch p-2 text-stone-800 hover:text-black"
      >
        <Menu className="w-7 h-7" strokeWidth={2} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            onClick={close}
            aria-label="Close menu backdrop"
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />

          {/* Slide-down panel */}
          <nav
            id="mobile-menu"
            aria-label="Main navigation"
            className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-stone-900 shadow-2xl md:hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b border-stone-300">
              <Link
                href="/"
                onClick={close}
                className="block min-h-touch flex items-center"
              >
                <p className="font-display font-bold text-lg leading-tight">
                  Only For Seniors
                </p>
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 text-stone-800 hover:text-black"
              >
                <X className="w-7 h-7" strokeWidth={2} />
              </button>
            </div>

            <ul className="max-w-6xl mx-auto px-2 py-3 space-y-1">
              <li>
                <Link
                  href="/about/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-lg font-semibold text-black rounded-lg hover:bg-white"
                >
                  About
                  <ChevronRight className="w-5 h-5 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/news/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-lg font-semibold text-black rounded-lg hover:bg-white"
                >
                  What&apos;s new
                  <ChevronRight className="w-5 h-5 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-lg font-semibold text-black rounded-lg hover:bg-white"
                >
                  Browse all categories
                  <ChevronRight className="w-5 h-5 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-lg font-semibold text-black rounded-lg hover:bg-white"
                >
                  Contact
                  <ChevronRight className="w-5 h-5 text-stone-500" />
                </Link>
              </li>

              {/* For businesses block */}
              <li className="pt-3">
                <p className="px-4 text-xs uppercase tracking-wider font-bold text-stone-500 mb-1">
                  For businesses
                </p>
              </li>
              <li>
                <Link
                  href="/for-businesses/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-base font-semibold text-stone-800 rounded-lg hover:bg-white"
                >
                  Why list with us
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/list-business/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-base font-semibold text-stone-800 rounded-lg hover:bg-white"
                >
                  Post a listing
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/list-business/login/"
                  onClick={close}
                  className="flex items-center justify-between min-h-touch px-4 py-3 text-base font-semibold text-stone-800 rounded-lg hover:bg-white"
                >
                  Business sign in
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </Link>
              </li>

              {/* Text size inline on mobile (saves a tap) */}
              <li className="pt-3 border-t border-stone-300 mt-2">
                <p className="px-4 text-xs uppercase tracking-wider font-bold text-stone-500 mb-1">
                  Display
                </p>
                <div className="px-4 py-2">
                  <FontResizer />
                </div>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}