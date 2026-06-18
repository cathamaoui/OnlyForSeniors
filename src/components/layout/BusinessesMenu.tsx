"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Briefcase, FileEdit } from "lucide-react";

export function BusinessesMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 px-3 py-2 text-base font-semibold text-stone-800 hover:text-black"
      >
        Businesses
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="For businesses"
          className="absolute right-0 mt-2 w-64 bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden z-30"
        >
          <Link
            href="/for-businesses/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 px-4 py-3 hover:bg-stone-100 border-b border-stone-200"
          >
            <Briefcase className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>
              <span className="block font-semibold text-stone-900">Why list with us</span>
              <span className="block text-base text-stone-700 mt-0.5">
                How the directory works for your business
              </span>
            </span>
          </Link>
          <Link
            href="/list-business/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 px-4 py-3 hover:bg-stone-100"
          >
            <FileEdit className="w-5 h-5 mt-0.5 text-blue-700 shrink-0" />
            <span>
              <span className="block font-semibold text-stone-900">Post a listing</span>
              <span className="block text-base text-stone-700 mt-0.5">
                $10 / month — get listed in 24 hours
              </span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
