"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Premium hero search bar. Single white "pill" with:
 *  - a black left icon block (the visual anchor that says "this is a search")
 *  - large input with a confident placeholder
 *  - a contrasting "Search" CTA on the right
 *
 * Submits to /search/?q=... which uses the smart intent matcher to
 * route natural-language queries to the right category.
 */
export function CategorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function submit() {
    const q = query.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search/?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      role="search"
      aria-label="Search listings and categories"
      className="flex w-full bg-white rounded-full border-2 border-stone-900 shadow-md overflow-hidden focus-within:ring-4 focus-within:ring-stone-300"
    >
      <label htmlFor="hero-search" className="sr-only">
        Search listings
      </label>

      {/* Left black icon block — visual anchor */}
      <span
        aria-hidden="true"
        className="flex items-center justify-center w-14 sm:w-16 bg-black text-white flex-shrink-0"
      >
        <Search className="w-6 h-6" strokeWidth={2.25} />
      </span>

      <input
        ref={inputRef}
        id="hero-search"
        type="text"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        placeholder="What do you need help with today?"
        className="hero-search-input flex-1 min-h-touch px-4 sm:px-5 py-3 text-lg sm:text-xl outline-none bg-transparent text-stone-900 placeholder:text-stone-500"
        aria-label="Search listings"
      />

      {/* Right CTA */}
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 bg-black text-white font-display font-medium text-lg hover:bg-stone-800 min-h-touch border-l-2 border-stone-900"
      >
        <Search className="w-5 h-5 sm:hidden" strokeWidth={2.5} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}