"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Plain search bar — single input + Search button. No dropdown, no
 * category picker inside the bar. Category discovery happens through
 * the visible tiles on the homepage, so seniors don't need a second
 * mechanism hidden inside the form.
 *
 * Submits to /search/?q=... which uses the smart intent matcher to
 * route natural-language queries to the right category.
 */
export function CategorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Autofocus on desktop, never on mobile (annoying for keyboard users).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  function submit() {
    const q = query.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search/?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex gap-2 bg-white border-2 border-stone-200 rounded-2xl p-2 shadow-sm focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-200"
        role="search"
        aria-label="Search listings and categories"
      >
        <label htmlFor="hero-search" className="sr-only">
          Search listings
        </label>
        <input
          ref={inputRef}
          id="hero-search"
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you need help with today?"
          className="flex-1 min-h-touch px-4 py-2 text-lg sm:text-xl outline-none bg-transparent text-stone-900 placeholder:text-stone-500"
          aria-label="Search"
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white border-2 border-stone-900 rounded-xl sm:rounded-full font-display font-bold text-lg hover:bg-black min-h-touch"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}