"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X, Check } from "lucide-react";
import type { Category } from "@/lib/businesses";
import { CategoryIcon, iconForSlug } from "@/components/ui/CategoryIcon";

export function CategorySearch({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Filter out the meta "news" category from the dropdown (it has its own page).
  const list = categories.filter((c) => !c.isNews);

  function submit() {
    const q = query.trim();
    if (picked && !q) {
      router.push(`/categories/${picked.slug}/`);
      return;
    }
    if (q && picked) {
      router.push(`/categories/${picked.slug}/?q=${encodeURIComponent(q)}`);
      return;
    }
    if (q) {
      router.push(`/search/?q=${encodeURIComponent(q)}`);
      return;
    }
    // Empty submit → just open the dropdown if it's closed.
    setOpen(true);
  }

  function pick(cat: Category) {
    setPicked(cat);
    setOpen(false);
    // Focus the input so the user can keep typing.
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function clearPicked() {
    setPicked(null);
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* The big search input. On mobile it stacks: row 1 = category button,
          row 2 = text input + Search button. On sm+ it's one horizontal row. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col sm:flex-row gap-2 bg-white border-2 border-stone-200 rounded-2xl p-2 shadow-sm focus-within:border-stone-900 focus-within:ring-4 focus-within:ring-stone-200"
        role="search"
        aria-label="Search listings and categories"
      >
        {/* Category button — opens the dropdown */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="category-search-menu"
          className="inline-flex items-center justify-between gap-2 px-4 py-3 sm:py-2 text-lg sm:text-base font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl sm:rounded-full min-h-touch"
        >
          <span className="flex items-center gap-2 min-w-0">
            {picked ? (
              <CategoryIcon category={picked} size="sm" />
            ) : (
              <span aria-hidden="true" className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-lg flex-shrink-0">
                {(() => {
                  const I = iconForSlug("default");
                  return <I className="w-4 h-4" strokeWidth={2.25} />;
                })()}
              </span>
            )}
            <span className="truncate">
              {picked ? picked.name : "All categories"}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* Clear-picked X — only shows when a category is selected */}
        {picked && (
          <button
            type="button"
            onClick={clearPicked}
            aria-label="Clear selected category"
            className="absolute right-24 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-full text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Text input */}
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
          onFocus={() => setOpen(true)}
          placeholder={
            picked
              ? `Search in ${picked.name}…`
              : "What do you need help with today?"
          }
          className="flex-1 min-h-touch px-4 py-2 text-lg sm:text-xl outline-none bg-transparent text-stone-900 placeholder:text-stone-500"
          aria-label="Search"
        />

        {/* Search submit */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white border-2 border-stone-900 rounded-xl sm:rounded-full font-display font-bold text-lg hover:bg-black min-h-touch"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>

      {/* Dropdown — full category list, scrollable, shows icon + name + count. */}
      {open && (
        <div
          id="category-search-menu"
          role="menu"
          className="absolute z-30 left-0 right-0 mt-2 bg-white border-2 border-stone-200 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto"
        >
          <div className="p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
            {/* "All categories" reset option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                clearPicked();
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-stone-100 ${
                !picked ? "bg-stone-100" : ""
              }`}
            >
              <span aria-hidden="true" className="inline-flex items-center justify-center w-7 h-7 bg-black text-white rounded-md flex-shrink-0">
                {(() => {
                  const I = iconForSlug("default");
                  return <I className="w-3.5 h-3.5" strokeWidth={2.25} />;
                })()}
              </span>
              <span className="flex-1 font-bold text-stone-900">All categories</span>
              {!picked && <Check className="w-4 h-4 text-stone-900" aria-hidden="true" />}
            </button>
            {list.map((cat) => {
              const active = picked?.slug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="menuitem"
                  onClick={() => pick(cat)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-stone-100 ${
                    active ? "bg-stone-100" : ""
                  }`}
                >
                  <CategoryIcon category={cat} size="sm" />
                  <span className="flex-1 text-stone-900 line-clamp-1">
                    {cat.name}
                  </span>
                  {active && (
                    <Check className="w-4 h-4 text-stone-900" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
