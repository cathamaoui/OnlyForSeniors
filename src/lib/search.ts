import type { Business, Category, Subcategory } from "@/lib/businesses";
import { matchIntent } from "@/lib/intentMatcher";
import { stem } from "@/lib/searchIntents";

/**
 * A unified search across businesses, categories, and subcategories.
 *
 * Returns a ranked list of every match with a score so the UI can group
 * results into: top category (intent match), category cards, business
 * cards.
 *
 * Strategy:
 *   1. Run the intent matcher against the 22 categories. If it picks a
 *      confident winner, that becomes the "top match".
 *   2. Tokenize the query (lowercase, stem, drop stopwords).
 *   3. For every business, score by how many tokens appear in its name,
 *      tagline, description, tags, city, province, category, and
 *      subcategory names. Use BOTH exact-token and stem-token matching
 *      so partial words like "phys" still match "physiotherapy".
 *   4. For every category, score by how many tokens appear in the
 *      category name and its subcategory names.
 *   5. Apply spelling fixes to tokens before scoring so common typos
 *      (e.g. "phisio") still resolve.
 */

export type BusinessHit = { business: Business; score: number };
export type CategoryHit = { category: Category; score: number; matchedTerms: string[] };
export type SubcategoryHit = {
  category: Category;
  subcategory: Subcategory;
  score: number;
};

export type SearchResults = {
  /** True if the intent matcher found a confident top category. */
  hasTopMatch: boolean;
  /** The top category (intent match), if confident. */
  topCategory: Category | null;
  /** Confidence of the top match (0-1). */
  topConfidence: number;
  /** Categories that matched (excluding the top one). Sorted by score. */
  categoryHits: CategoryHit[];
  /** Subcategories that matched. */
  subcategoryHits: SubcategoryHit[];
  /** Businesses that matched. Sorted by score. */
  businessHits: BusinessHit[];
  /** The raw query string, trimmed. */
  query: string;
  /** Tokens after tokenization (useful for showing what we parsed). */
  tokens: string[];
};

/** Stopwords copied here so we don't import the module twice in callers. */
const STOP = new Set([
  "i", "me", "my", "we", "us", "our", "you", "your", "they", "them",
  "a", "an", "the", "and", "or", "but", "to", "of", "in", "on", "at",
  "for", "with", "by", "from", "as", "is", "am", "are", "was", "were",
  "be", "been", "being", "do", "does", "did", "have", "has", "had",
  "this", "that", "these", "those", "it", "its",
  "need", "needs", "want", "wants", "wanted", "looking",
  "find", "found", "get", "gets", "got",
  "someone", "somebody", "anything", "something", "help",
  "today", "tomorrow", "now", "please", "thanks",
  "can", "could", "should", "would", "will", "shall",
  "very", "really", "just", "only", "also", "too", "much", "many",
  "some", "any", "all", "no", "not",
]);

/** Lightweight spelling fix map (subset — keeps the matcher resilient). */
const FIXES: Record<string, string> = {
  "phisio": "physio",
  "phisotherapy": "physiotherapy",
  "compainion": "companion",
  "handym": "handyman",
  "docter": "doctor",
  "hosptial": "hospital",
  "wheelcahir": "wheelchair",
  "priscripition": "prescription",
  "aidiologist": "audiologist",
  "optomitrist": "optometrist",
  "chiroprody": "chiropody",
  "masseuse": "massage",
};

/** Tokenize a search query into stemmed, lowercased words. */
function tokenizeQuery(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => FIXES[w] ?? w)
    .filter((w) => !STOP.has(w))
    .map(stem);
}

/** True if any token is a prefix of any stem in the haystack, or vice versa. */
function tokenMatchesAnyStem(token: string, stems: string[]): boolean {
  for (const s of stems) {
    if (token === s) return true;
    if (token.length >= 3 && s.startsWith(token)) return true;
    if (s.length >= 3 && token.startsWith(s)) return true;
  }
  return false;
}

/** Stem an arbitrary multi-word phrase into its token stems. */
function stemsOf(phrase: string): string[] {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map(stem);
}

export function searchEverything(
  query: string,
  categories: Category[],
  businesses: Business[]
): SearchResults {
  const q = query.trim();
  if (!q) {
    return {
      hasTopMatch: false,
      topCategory: null,
      topConfidence: 0,
      categoryHits: [],
      subcategoryHits: [],
      businessHits: [],
      query: "",
      tokens: [],
    };
  }

  const tokens = tokenizeQuery(q);
  const intent = matchIntent(q, categories);

  // ---- 1. Score categories (using tokens + category + subcategory names) ----
  const categoryHits: CategoryHit[] = [];
  const subcategoryHits: SubcategoryHit[] = [];

  for (const cat of categories) {
    if (cat.isNews) continue;
    const catNameStems = stemsOf(cat.name);
    const catSlugStems = cat.slug.split("-").map(stem);

    let catScore = 0;
    const matched = new Set<string>();

    for (const t of tokens) {
      if (catNameStems.includes(t) || catSlugStems.includes(t)) {
        catScore += 4;
        matched.add(cat.name);
      } else if (tokenMatchesAnyStem(t, [...catNameStems, ...catSlugStems])) {
        catScore += 2;
        matched.add(cat.name);
      }
    }

    // Also factor in intent matcher's score for this category if any.
    const intentHit = intent.candidates.find((c) => c.category.slug === cat.slug);
    if (intentHit) {
      catScore += intentHit.score;
      for (const term of intentHit.matchedTerms) matched.add(term);
    }

    if (catScore > 0) {
      categoryHits.push({
        category: cat,
        score: catScore,
        matchedTerms: Array.from(matched).slice(0, 6),
      });
    }

    // ---- 2. Score each subcategory ----
    for (const sub of cat.subcategories ?? []) {
      const subNameStems = stemsOf(sub.name);
      const subSlugStems = sub.slug.split("-").map(stem);
      let subScore = 0;
      for (const t of tokens) {
        if (subNameStems.includes(t) || subSlugStems.includes(t)) {
          subScore += 4;
        } else if (tokenMatchesAnyStem(t, [...subNameStems, ...subSlugStems])) {
          subScore += 2;
        }
      }
      if (subScore > 0) {
        subcategoryHits.push({ category: cat, subcategory: sub, score: subScore });
      }
    }
  }

  categoryHits.sort((a, b) => b.score - a.score);
  subcategoryHits.sort((a, b) => b.score - a.score);

  // ---- 3. Score businesses ----
  const businessHits: BusinessHit[] = [];
  for (const b of businesses) {
    const hayStems: string[] = [];
    for (const field of [
      b.name,
      b.tagline,
      b.description,
      b.city,
      b.province,
      ...(b.tags ?? []),
    ]) {
      hayStems.push(...stemsOf(field));
    }
    // Also include the category + subcategory name (helps route).
    const cat = categories.find((c) => c.slug === b.categorySlug);
    if (cat) hayStems.push(...stemsOf(cat.name));
    if (cat) {
      const sub = cat.subcategories?.find((s) => s.slug === b.subcategorySlug);
      if (sub) hayStems.push(...stemsOf(sub.name));
    }

    let score = 0;
    let hits = 0;
    for (const t of tokens) {
      if (hayStems.includes(t)) {
        score += 3;
        hits++;
      } else if (tokenMatchesAnyStem(t, hayStems)) {
        score += 2;
        hits++;
      }
    }
    if (hits === tokens.length && tokens.length > 0) score += 5; // bonus for all tokens matched
    if (score > 0) businessHits.push({ business: b, score });
  }
  businessHits.sort((a, b) => b.score - a.score);

  // ---- 4. Top match from intent matcher ----
  const topCategory = intent.best;
  const hasTopMatch = intent.isConfident && topCategory !== null;
  const topConfidence = intent.candidates[0]?.confidence ?? 0;

  return {
    hasTopMatch,
    topCategory,
    topConfidence,
    categoryHits,
    subcategoryHits,
    businessHits,
    query: q,
    tokens,
  };
}