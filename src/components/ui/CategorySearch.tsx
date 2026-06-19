"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Category } from "@/lib/businesses";
import { matchIntent } from "@/lib/intentMatcher";

type Props = {
  categories: Category[];
  /** Optional placeholder override. */
  placeholder?: string;
};

/**
 * The hero search bar on the homepage.
 *
 * Behaviour:
 *   - If the matcher is confident (e.g. "I need a handyman"), auto-route
 *     to the matching category page.
 *   - Otherwise submit to /search/?q=... and let SearchClient render
 *     the mixed results.
 */
export function CategorySearch({ categories, placeholder }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }

    // Try intent matcher first — confident matches go straight to category.
    const intent = matchIntent(q, categories);
    if (intent.isConfident && intent.best) {
      router.push(`/categories/${intent.best.slug}/?from=search`);
      return;
    }

    router.push(`/search/?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Search Only For Seniors"
      className="flex flex-col sm:flex-row gap-2"
    >
      <div className="flex-1 flex items-center bg-white border-2 border-stone-900 rounded-full px-4">
        <Search className="w-5 h-5 text-stone-700 flex-shrink-0" strokeWidth={2} />
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? "Search for any service, by name or by need…"}
          aria-label="Search"
          className="flex-1 min-h-touch px-3 py-3 text-lg outline-none"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-black text-white border-2 border-black rounded-full font-display font-medium text-lg hover:bg-stone-800 min-h-touch"
      >
        Search
      </button>
    </form>
  );
}