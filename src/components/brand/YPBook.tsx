"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { clsx } from "clsx";
import { usePageTurnSound } from "@/hooks/usePageTurnSound";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  businessCount?: number;
}

const PROVINCES = [
  { code: "", name: "All of Canada" },
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Quebec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "PE", name: "PEI" },
  { code: "NL", name: "Newfoundland" },
];

/**
 * Yellow-Pages style "Book" with:
 * - Big prominent search bar at the top
 * - Color-coded side tabs (mimics the real YP book tabs)
 * - 3D page-curl transition when switching sections
 * - Skeuomorphic page-turn sound effect
 * - Swipe gestures on mobile to flip pages
 * - Prev/Next buttons for accessibility
 */
export function YPBook({ categories }: { categories: Category[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [soundOn, setSoundOn] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const active = categories[activeIndex];
  const { playPageTurn } = usePageTurnSound();

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = (newIndex: number, dir: "forward" | "backward") => {
    if (newIndex === activeIndex || newIndex < 0 || newIndex >= categories.length) return;
    if (flipping) return;
    setDirection(dir);
    setFlipping(true);
    if (soundOn) playPageTurn(dir);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setFlipping(false);
    }, 50); // tiny delay so the keyframe triggers fresh
  };

  const goNext = () => goTo((activeIndex + 1) % categories.length, "forward");
  const goPrev = () => goTo((activeIndex - 1 + categories.length) % categories.length, "backward");

  // Keyboard arrows for accessibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, flipping, soundOn]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dx = touchEndX.current - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="yp-book-stack">
      {/* ===== TOP — Big Search Bar (the book cover) ===== */}
      <div className="bg-black text-yp-500 p-4 sm:p-6 border-b-4 border-black">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7" aria-hidden="true" />
            <span className="font-display text-xl sm:text-2xl uppercase tracking-wider">
              The OnlyForSeniors Directory
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSoundOn((s) => !s)}
            className="text-yp-500 hover:text-white text-sm font-display uppercase tracking-wider
              inline-flex items-center gap-1 px-2 py-1 border-2 border-yp-700"
            aria-label={soundOn ? "Turn off page-turn sound" : "Turn on page-turn sound"}
            title={soundOn ? "Turn off page-turn sound" : "Turn on page-turn sound"}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundOn ? "Sound On" : "Sound Off"}
          </button>
        </div>

        <form
          action="/search"
          method="get"
          className="space-y-3"
          role="search"
        >
          <label htmlFor="ypbook-q" className="sr-only">
            Search the directory
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="ypbook-q"
                name="q"
                type="search"
                placeholder="What are you looking for?"
                className="w-full min-h-touch pl-12 pr-4 py-3 text-xl text-black bg-yp-500 border-2 border-yp-500
                  focus:border-paper focus:ring-4 focus:ring-yp-300/40 placeholder:text-black/60"
              />
            </div>
            <button
              type="submit"
              className="min-h-touch px-6 py-3 bg-yp-500 text-black border-2 border-yp-500
                hover:bg-yp-600 font-display text-lg uppercase tracking-wider
                inline-flex items-center justify-center gap-2"
            >
              Search
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-yp-100 text-sm">
            Type what you need — for example &quot;ride to doctor&quot; or &quot;grocery delivery&quot;.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-yp-700">
            <label htmlFor="ypbook-prov" className="text-yp-500 uppercase tracking-wider text-sm font-display">
              In:
            </label>
            <select
              id="ypbook-prov"
              name="province"
              className="flex-1 min-h-touch px-3 py-2 text-base text-black bg-yp-500 border-2 border-yp-500
                focus:border-paper focus:ring-4 focus:ring-yp-300/40"
              defaultValue=""
            >
              {PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* ===== MIDDLE — Book body: side tabs + flipping pages ===== */}
      <div className="flex bg-paper min-h-[460px]">
        {/* Side tabs */}
        <div
          className="flex-shrink-0 bg-black border-r-4 border-black py-2"
          role="tablist"
          aria-label="Browse directory sections"
        >
          {categories.map((c, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`ypbook-section-${c.id}`}
                onClick={() => goTo(i, i > activeIndex ? "forward" : "backward")}
                className={clsx(
                  "block w-full text-left transition-all duration-150",
                  "border-b-2 border-yp-500/20 last:border-b-0",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-paper"
                )}
                style={{
                  backgroundColor: isActive ? c.color : "#0a0a0a",
                  color: isActive ? "#000" : "#fcd116",
                  minHeight: "64px",
                  width: isActive ? "88px" : "72px",
                  transform: isActive ? "translateX(8px)" : "translateX(0)",
                  boxShadow: isActive ? "4px 4px 0 0 #000" : "none",
                  zIndex: isActive ? 10 : 1,
                  position: "relative",
                }}
              >
                <div className="flex flex-col items-center justify-center gap-1 p-2">
                  <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-center leading-tight font-display font-bold">
                    {c.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Page content with page-curl animation */}
        <div
          className="flex-1 min-w-0 relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Prev/Next buttons floating on the sides */}
          <button
            type="button"
            onClick={goPrev}
            disabled={flipping}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30
              min-h-touch w-12 bg-black text-yp-500 border-2 border-black
              hover:bg-yp-500 hover:text-black
              inline-flex items-center justify-center
              disabled:opacity-50"
            aria-label="Previous section (left arrow key)"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={flipping}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30
              min-h-touch w-12 bg-black text-yp-500 border-2 border-black
              hover:bg-yp-500 hover:text-black
              inline-flex items-center justify-center
              disabled:opacity-50"
            aria-label="Next section (right arrow key)"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* The page */}
          <div
            key={active?.id}
            className="yp-book-page p-4 sm:p-6 min-h-[420px] page-curl-anim"
            style={{
              transformStyle: "preserve-3d",
              animationName: direction === "forward" ? "pageCurlForward" : "pageCurlBackward",
              animationDuration: "0.7s",
              animationTimingFunction: "cubic-bezier(0.45, 0.05, 0.25, 1)",
              animationFillMode: "forwards",
            }}
            role="tabpanel"
            id={`ypbook-section-${active?.id}`}
            aria-labelledby={`ypbook-tab-${active?.id}`}
          >
            {active && (
              <>
                <div
                  className="flex items-center gap-3 pb-3 mb-4 border-b-4 border-black"
                  style={{ borderBottomColor: active.color }}
                >
                  <div
                    className="shrink-0 w-12 h-12 border-2 border-black flex items-center justify-center text-3xl"
                    style={{ backgroundColor: active.color }}
                    aria-hidden="true"
                  >
                    {active.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl sm:text-2xl text-black leading-tight">
                      {active.name}
                    </h2>
                    <p className="text-black/70 text-sm">
                      Section {activeIndex + 1} of {categories.length} ·{" "}
                      {typeof active.businessCount === "number"
                        ? `${active.businessCount} ${active.businessCount === 1 ? "listing" : "listings"}`
                        : "Browse this section"}
                    </p>
                  </div>
                </div>

                <p className="text-black leading-relaxed mb-5">
                  {active.description}
                </p>

                <Link
                  href={`/categories/${active.slug}`}
                  className="inline-flex items-center gap-2 min-h-touch px-5 py-3
                    bg-black text-yp-500 font-display uppercase tracking-wider text-base
                    border-2 border-black shadow-yp hover:shadow-yp-lg
                    transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                  Open the {active.name.split(" ")[0]} Section
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Link>
                <p className="instruction">
                  See all {typeof active.businessCount === "number" ? active.businessCount : ""} listings in this section
                </p>

                <div className="mt-6 pt-4 border-t border-black/20 text-sm text-black/70">
                  <p className="font-bold uppercase tracking-wider mb-1">
                    💡 Tip
                  </p>
                  <p>
                    Tap any coloured tab on the left to jump to a section.
                    Use the arrow keys (← →) or swipe left/right to turn pages.
                    The page-turn sound can be toggled in the top right.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM — All-sections quick link ===== */}
      <div className="bg-black text-yp-500 border-t-4 border-black p-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/categories"
          className="font-display uppercase tracking-wider text-sm hover:underline
            inline-flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          See All {categories.length} Sections
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <div className="text-xs text-yp-300">
          Page {activeIndex + 1} / {categories.length}
        </div>
      </div>
    </div>
  );
}
