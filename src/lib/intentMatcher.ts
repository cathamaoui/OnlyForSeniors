import type { Category } from "@/lib/businesses";
import {
  CATEGORY_INTENTS,
  SPELLING_FIXES,
  STOPWORDS,
  stem,
  type CategoryIntent,
} from "@/lib/searchIntents";

/** Score breakdown so callers can show *why* a category matched. */
export type CategoryMatch = {
  category: Category;
  score: number;
  /** Keywords / subcategory names that contributed to the score. */
  matchedTerms: string[];
  /** 0–1, normalized across all candidates. */
  confidence: number;
};

/** Full result returned by `matchIntent`. */
export type IntentResult = {
  /** Highest-scoring category, or null if nothing scored above the noise floor. */
  best: Category | null;
  /** All non-zero candidates, sorted descending by score. */
  candidates: CategoryMatch[];
  /** Convenience: did we hit the auto-route threshold? */
  isConfident: boolean;
  /** Convenience: did we hit *any* of the categories? */
  hasMatch: boolean;
};

/** Auto-route to the top match when score >= this value. */
export const AUTO_ROUTE_THRESHOLD = 6;
/** Below this score the intent is considered noise. */
export const NOISE_FLOOR = 2;

const INTENT_BY_SLUG: Map<string, CategoryIntent> = new Map(
  CATEGORY_INTENTS.map((i) => [i.slug, i])
);

/**
 * Tokenize the user's free-text query into a set of stemmed words.
 * - lowercases
 * - strips possessives
 * - applies spelling fixes
 * - removes stopwords
 * - stems each remaining token
 */
export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SPELLING_FIXES[w] ?? w)
    .filter((w) => !STOPWORDS.has(w))
    .map(stem);
}

/**
 * Score one category against the tokenized query.
 * Higher = better match. Score is intentionally unbounded so we can compare
 * relative strength between categories.
 */
export function scoreCategory(
  category: Category,
  tokens: string[]
): CategoryMatch {
  let score = 0;
  const matched = new Set<string>();

  const intent = INTENT_BY_SLUG.get(category.slug);
  const tokensSet = new Set(tokens);

  // 1. Keyword matches (single words/phrases).
  if (intent) {
    for (const kw of intent.keywords) {
      const kwTokens = kw.toLowerCase().split(/\s+/);
      // multi-word keyword: require all tokens to be present in order (loose).
      if (kwTokens.length > 1) {
        if (containsPhrase(tokens, kwTokens)) {
          score += 4;
          matched.add(kw);
        }
        continue;
      }
      // single-word keyword: stem and exact-match.
      const stemmedKw = stem(kwTokens[0]);
      if (tokensSet.has(stemmedKw)) {
        score += 3;
        matched.add(kw);
      }
    }

    // 2. Sub-hint phrases — bonus points for natural phrasing.
    for (const hint of intent.subHints) {
      const hintTokens = hint.toLowerCase().split(/\s+/).map(stem);
      if (containsPhrase(tokens, hintTokens)) {
        score += 5;
        matched.add(`"${hint}"`);
      }
    }
  }

  // 3. Category-name tokens (always).
  const nameTokens = category.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map(stem);
  for (const nt of nameTokens) {
    if (tokensSet.has(nt)) {
      score += 2;
      matched.add(`name:${nt}`);
    }
  }

  // 4. Subcategory-name tokens.
  for (const sub of category.subcategories ?? []) {
    const subTokens = sub.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .map(stem);
    for (const st of subTokens) {
      if (tokensSet.has(st)) {
        score += 2;
        matched.add(`sub:${sub.slug}`);
      }
    }
    // Subcategory slug itself (handles "snow", "grab", "walk", etc.).
    const slugTokens = sub.slug.split("-").filter(Boolean).map(stem);
    for (const st of slugTokens) {
      if (tokensSet.has(st)) {
        score += 1;
        matched.add(`sub:${sub.slug}`);
      }
    }
  }

  // 5. Category slug itself.
  for (const slugPart of category.slug.split("-").map(stem)) {
    if (tokensSet.has(slugPart)) {
      score += 1;
    }
  }

  return {
    category,
    score,
    matchedTerms: Array.from(matched),
    confidence: 0, // filled in by matchIntent
  };
}

/** True if every token in `phrase` appears in `tokens` in the same order. */
function containsPhrase(tokens: string[], phrase: string[]): boolean {
  if (phrase.length === 0) return false;
  let i = 0;
  for (const t of tokens) {
    if (t === phrase[i]) i++;
    if (i === phrase.length) return true;
  }
  return false;
}

/**
 * Run the full intent matcher.
 * Returns the best category (if any) plus a ranked list of candidates.
 */
export function matchIntent(
  query: string,
  categories: Category[]
): IntentResult {
  const cleaned = query.trim();
  if (!cleaned) {
    return { best: null, candidates: [], isConfident: false, hasMatch: false };
  }

  const tokens = tokenize(cleaned);
  if (tokens.length === 0) {
    return { best: null, candidates: [], isConfident: false, hasMatch: false };
  }

  const scored: CategoryMatch[] = categories
    .map((c) => scoreCategory(c, tokens))
    .filter((m) => m.score > 0);

  scored.sort((a, b) => b.score - a.score);

  // Normalize confidence against top score (top is always 1.0; rest scaled).
  const top = scored[0]?.score ?? 0;
  if (top > 0) {
    for (const m of scored) m.confidence = m.score / top;
  }

  const best = scored[0] && scored[0].score >= AUTO_ROUTE_THRESHOLD ? scored[0].category : null;
  const isConfident = !!best;

  return {
    best,
    candidates: scored,
    isConfident,
    hasMatch: scored.length > 0,
  };
}

/** Friendly text explaining *why* a category matched (for the did-you-mean UI). */
export function explainMatch(match: CategoryMatch): string {
  const cleaned = match.matchedTerms
    .filter((t) => !t.startsWith("name:") && !t.startsWith("sub:"))
    .slice(0, 4);
  if (cleaned.length === 0) return `Matched ${match.category.name.toLowerCase()}`;
  if (cleaned.length === 1) return `Matched on “${cleaned[0]}”`;
  if (cleaned.length === 2) return `Matched on “${cleaned[0]}” and “${cleaned[1]}”`;
  return `Matched on “${cleaned.slice(0, 3).join("”, “")}”, and more`;
}