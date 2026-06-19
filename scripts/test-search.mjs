// Quick offline smoke test for the new search logic.
// We can't import the .ts files directly, so we re-implement the key
// parts here and check scoring works as expected.
const STOP = new Set([
  "i","me","my","we","us","our","you","your","they","them","a","an","the","and","or","but","to","of","in","on","at","for","with","by","from","as","is","am","are","was","were","be","been","being","do","does","did","have","has","had","this","that","these","those","it","its","need","needs","want","wants","wanted","looking","find","found","get","gets","got","someone","somebody","anything","something","help","today","tomorrow","now","please","thanks","can","could","should","would","will","shall","very","really","just","only","also","too","much","many","some","any","all","no","not"
]);

function stem(w) {
  let s = w.toLowerCase();
  if (s.length > 4 && s.endsWith("ies")) s = s.slice(0, -3) + "y";
  if (s.length > 4 && s.endsWith("ing")) s = s.slice(0, -3);
  if (s.length > 3 && s.endsWith("ed")) s = s.slice(0, -2);
  if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  return s;
}

function tokenizeQuery(q) {
  return q.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(Boolean).filter((w) => !STOP.has(w)).map(stem);
}

function stemsOf(phrase) {
  return phrase.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 1).map(stem);
}

const queries = [
  "physio",
  "physiotherapy",
  "handyman",
  "i need my car cleaned",
  "rides to the doctor",
  "travel",
  "dating",
  "wills and estate",
  "hearing aid",
  "wheelchair",
  "computer help",
  "companion for my mom",
  "snow removal",
  "grocery delivery",
  "pet sitter",
];

const CATEGORIES = [
  { slug: "home-care", name: "Home Care", subcategories: [{ slug: "personal-care", name: "Personal Care" }, { slug: "companionship", name: "Companionship" }] },
  { slug: "home-maintenance", name: "Home Maintenance", subcategories: [{ slug: "handyman", name: "Handyman" }, { slug: "snow-removal", name: "Snow Removal" }] },
  { slug: "health-wellness", name: "Health & Wellness", subcategories: [{ slug: "physiotherapy", name: "Physiotherapy" }, { slug: "hearing", name: "Hearing" }] },
  { slug: "transportation", name: "Transportation", subcategories: [{ slug: "medical-rides", name: "Medical Rides" }] },
  { slug: "senior-travel", name: "Senior Travel", subcategories: [] },
  { slug: "dating", name: "Dating", subcategories: [] },
  { slug: "legal-financial", name: "Legal & Financial", subcategories: [{ slug: "wills-estate", name: "Wills & Estate" }] },
  { slug: "tech-help-for-seniors", name: "Tech Help for Seniors", subcategories: [] },
  { slug: "senior-concierge-errands", name: "Concierge & Errands", subcategories: [{ slug: "grocery-delivery", name: "Grocery Delivery" }] },
  { slug: "pet-therapy", name: "Pet & Therapy", subcategories: [] },
];

for (const q of queries) {
  const tokens = tokenizeQuery(q);
  const matches = [];
  for (const cat of CATEGORIES) {
    const stems = stemsOf(cat.name);
    for (const sub of cat.subcategories) stems.push(...stemsOf(sub.name));
    let score = 0;
    for (const t of tokens) {
      if (stems.includes(t)) score += 4;
      else if (t.length >= 3 && stems.some((s) => s.startsWith(t))) score += 2;
    }
    if (score > 0) matches.push({ cat: cat.name, score });
  }
  matches.sort((a, b) => b.score - a.score);
  console.log(`"${q}"  →  tokens=[${tokens.join(",")}]  matches: ${matches.map((m) => m.cat + "(" + m.score + ")").join(" | ") || "NONE"}`);
}