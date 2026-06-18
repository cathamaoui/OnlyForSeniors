"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ofs-font-scale";
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.6;
const STEP = 0.1;
const DEFAULT_SCALE = 1;

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
  // We render a stable SSR shell so the button is always present, then
  // upgrade the label on the client to avoid hydration mismatch.
  const [scale, setScale] = useState<number>(DEFAULT_SCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialScale();
    setScale(initial);
    applyScale(initial);
    setMounted(true);
  }, []);

  const decrease = () => {
    const next = Math.max(MIN_SCALE, Math.round((scale - STEP) * 10) / 10);
    setScale(next);
    applyScale(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  };

  const increase = () => {
    const next = Math.min(MAX_SCALE, Math.round((scale + STEP) * 10) / 10);
    setScale(next);
    applyScale(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  };

  const reset = () => {
    setScale(DEFAULT_SCALE);
    applyScale(DEFAULT_SCALE);
    window.localStorage.setItem(STORAGE_KEY, String(DEFAULT_SCALE));
  };

  return (
    <div
      className="flex items-center gap-1 ml-2 pl-2 border-l-2 border-stone-500"
      role="group"
      aria-label="Adjust text size"
    >
      <button
        type="button"
        onClick={decrease}
        disabled={mounted && scale <= MIN_SCALE}
        aria-label="Decrease text size"
        className="min-h-touch min-w-touch px-2 py-1 text-base font-bold text-black bg-white border-2 border-black rounded-md hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Decrease text size"
      >
        A−
      </button>
      <button
        type="button"
        onClick={reset}
        aria-label="Reset text size"
        className="min-h-touch px-2 py-1 text-base font-bold text-black bg-white border-2 border-black rounded-md hover:bg-stone-200"
        title="Reset text size"
      >
        A
      </button>
      <button
        type="button"
        onClick={increase}
        disabled={mounted && scale >= MAX_SCALE}
        aria-label="Increase text size"
        className="min-h-touch min-w-touch px-2 py-1 text-lg font-black text-black bg-white border-2 border-black rounded-md hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Increase text size"
      >
        A+
      </button>
    </div>
  );
}
