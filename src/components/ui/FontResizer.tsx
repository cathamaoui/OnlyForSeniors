"use client";

import { useEffect, useRef, useState } from "react";
import { Type, Check } from "lucide-react";

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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Adjust text size"
        title="Text size"
        className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 text-stone-800 bg-white border-2 border-stone-500 rounded-lg hover:bg-stone-100 hover:border-black"
      >
        <Type className="w-5 h-5" strokeWidth={2.25} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Text size"
          className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden z-30"
        >
          <p className="px-4 py-2 text-base font-semibold text-stone-800 border-b border-stone-200 bg-stone-50">
            Text size
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
                    className="w-full flex items-center justify-between gap-3 px-4 py-2 text-left text-base text-stone-800 hover:bg-stone-100"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-block font-bold leading-none"
                        style={{ fontSize: `${14 * s.value}px` }}
                        aria-hidden="true"
                      >
                        Aa
                      </span>
                      <span>{s.label}</span>
                    </span>
                    {active && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
