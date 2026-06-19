"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const STORAGE_KEY = "ofs-font-scale";
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.6;
const DEFAULT_SCALE = 1;

const SIZES: { label: string; value: number }[] = [
  { label: "Small", value: 0.9 },
  { label: "Default", value: 1 },
  { label: "Large", value: 1.2 },
  { label: "Extra Large", value: 1.4 },
];

function applyScale(scale: number) {
  // 1rem is anchored to 18px in :root. We scale that anchor so the entire
  // rem-based type scale scales together.
  const baseRem = 18 * scale;
  document.documentElement.style.fontSize = `${baseRem}px`;
}

function getInitialScale(): number {
  if (typeof window === "undefined") return DEFAULT_SCALE;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_SCALE;
  const parsed = Number.parseFloat(saved);
  if (Number.isFinite(parsed) && parsed >= MIN_SCALE && parsed <= MAX_SCALE) {
    return parsed;
  }
  return DEFAULT_SCALE;
}

export function FontResizer() {
  const [scale, setScale] = useState<number>(DEFAULT_SCALE);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initial = getInitialScale();
    setScale(initial);
    applyScale(initial);
    setMounted(true);
  }, []);

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

  const choose = (value: number) => {
    setScale(value);
    applyScale(value);
    window.localStorage.setItem(STORAGE_KEY, String(value));
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      {/* Closed state — a plain text link labelled "Text size" so seniors
          immediately understand what this control does. No icon, no
          bubble. Mirrors the rest of the header. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Adjust text size"
        className="inline-flex items-center gap-1 text-base font-semibold text-stone-800 hover:text-black hover:underline"
      >
        Text size
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Text size"
          className="absolute right-0 mt-2 w-64 bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden z-30"
        >
          <p className="px-4 py-2 text-base font-bold text-stone-900 border-b border-stone-200 bg-cream-100">
            Pick a text size
          </p>
          <ul className="py-1">
            {SIZES.map((s) => {
              const active = mounted && Math.abs(scale - s.value) < 0.001;
              return (
                <li key={s.value}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => choose(s.value)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-stone-900 hover:bg-stone-100 ${
                      active ? "bg-stone-100" : ""
                    }`}
                  >
                    {/* Show the literal "Aa" preview rendered at the target
                        size, so seniors can SEE what they're picking. */}
                    <span className="flex items-baseline gap-3">
                      <span
                        className="inline-block font-display font-bold leading-none"
                        style={{ fontSize: `${16 * s.value}px` }}
                        aria-hidden="true"
                      >
                        Aa
                      </span>
                      <span
                        className="font-semibold"
                        style={{ fontSize: `${14 * s.value}px` }}
                      >
                        {s.label}
                      </span>
                    </span>
                    {active && <Check className="w-5 h-5 text-black shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="px-4 py-2 text-sm text-stone-700 border-t border-stone-200 bg-cream-100">
            We&apos;ll remember your choice.
          </p>
        </div>
      )}
    </div>
  );
}
