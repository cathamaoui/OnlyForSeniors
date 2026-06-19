/* eslint-disable no-console */
import { getAllCategories } from "../src/lib/businesses";
import { matchIntent } from "../src/lib/intentMatcher";

const cases: Array<{ q: string; expect: string }> = [
  { q: "i need my car cleaned", expect: "(no match - no car cleaning category)" },
  { q: "i need help with bathing", expect: "home-care" },
  { q: "i need a caregiver", expect: "home-care" },
  { q: "house cleaning service", expect: "home-maintenance" },
  { q: "shovel my snow", expect: "home-maintenance" },
  { q: "i'm afraid of falling", expect: "falls-wandering" },
  { q: "medical alert pendant", expect: "falls-wandering" },
  { q: "need a ride to the doctor", expect: "transportation" },
  { q: "wheelchair transport", expect: "transportation" },
  { q: "i can't hear well", expect: "health-wellness" },
  { q: "physiotherapy for my knee", expect: "health-wellness" },
  { q: "dog walker", expect: "pet-therapy" },
  { q: "i'm lonely", expect: "wellness-comfort" },
  { q: "my husband passed away", expect: "wellness-comfort" },
  { q: "help with my iphone", expect: "concierge-tech" },
  { q: "i got a scam call", expect: "concierge-tech" },
  { q: "help with my will", expect: "legal-financial" },
  { q: "do my taxes", expect: "legal-financial" },
  { q: "moving to a smaller place", expect: "transition-downsizing" },
  { q: "downsize my home", expect: "transition-downsizing" },
  { q: "i want to date again", expect: "dating" },
  { q: "pharmacy delivery", expect: "shopping" },
  { q: "groceries delivered", expect: "shopping" },
  { q: "prayer", expect: "pastoral" },
  { q: "chaplain visit", expect: "pastoral" },
  { q: "i want to volunteer", expect: "volunteer" },
  { q: "retirement home", expect: "housing" },
  { q: "assisted living", expect: "housing" },
  { q: "menopause", expect: "sexual-health" },
];

const cats = getAllCategories();
let passed = 0;
let failed = 0;

for (const c of cases) {
  const r = matchIntent(c.q, cats);
  const best = r.best?.slug ?? "(none)";
  const status =
    c.expect === "(no match - no car cleaning category)" ? best === "(none)" : best === c.expect;
  if (status) passed++;
  else failed++;
  console.log(
    `${status ? "PASS" : "FAIL"}  "${c.q}"\n      expected: ${c.expect}\n      got:      ${best}${
      r.candidates[0] ? ` (score=${r.candidates[0].score})` : ""
    }`
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);