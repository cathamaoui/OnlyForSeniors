"use client";

import { useRef, useState } from "react";
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
  const [focused, setFocused] = useState(false);
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

        {/* Search icon on the left of the input — permanent visual cue
            that this is the right place to type. Hides on focus to give
            the text room to breathe. */}
        <span
          aria-hidden="true"
          className={`flex items-center justify-center pl-3 text-stone-500 transition-opacity ${
            focused ? "opacity-0 w-0 pl-0" : "opacity-100"
          }`}
        >
          <Search className="w-5 h-5" strokeWidth={2} />
        </span>

        <input
          ref={inputRef}
          id="hero-search"
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          spellCheck={false}
          placeholder="What do you need help with today?"
          className="hero-search-input flex-1 min-h-touch px-3 py-2 text-lg sm:text-xl outline-none bg-transparent text-stone-900 placeholder:text-stone-500"
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