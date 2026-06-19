/**
 * Intent knowledge base for smart category matching.
 *
 * Each entry maps a category slug to:
 *  - keywords[]: single words/phrases that should trigger this category
 *  - subHints[]: additional natural-language phrasings (longer patterns)
 *
 * Synonyms are added so seniors can describe what they need in their own
 * words. All matching is case-insensitive and stem-tolerant.
 *
 * If a category is missing here it still matches via its name and slug
 * tokens, but the entries below dramatically improve recall.
 */
export type CategoryIntent = {
  /** The category slug (must match a real category in businesses.json). */
  slug: string;
  /** Single-word or short-phrase keywords. Lowercase, no punctuation. */
  keywords: string[];
  /** Longer natural-language patterns. Lowercase, can be multi-word. */
  subHints: string[];
};

export const CATEGORY_INTENTS: CategoryIntent[] = [
  {
    slug: "home-care",
    keywords: [
      "care", "caregiver", "carer", "aide", "psw", "personal",
      "shower", "bathing", "dressing", "grooming", "toileting",
      "incontinence", "mobility", "transfer", "lift",
      "companion", "companionship", "meal", "meals", "cooking",
      "housekeeping", "housekeeper", "cleaning", "tidy",
      "live-in", "overnight", "respite",
    ],
    subHints: [
      "i need help at home",
      "help with bathing",
      "help getting dressed",
      "someone to help me shower",
      "i need a caregiver",
      "need help with meals",
      "help around the house",
      "someone to keep me company",
      "i need a personal support worker",
      "in home care",
      "home care worker",
      "personal care aide",
    ],
  },
  {
    slug: "home-maintenance",
    keywords: [
      "handyman", "handyperson", "fix", "repair", "broken", "leak",
      "plumb", "plumber", "plumbing", "electric", "electrician",
      "roof", "roofing", "gutter", "fence", "deck",
      "snow", "shovel", "lawn", "grass", "mow", "mowing",
      "yard", "garden", "hedges", "tree", "trimming",
      "house cleaning", "housekeeping", "maid", "tidy up",
      "deep clean", "spring clean",
    ],
    subHints: [
      "i need my house cleaned",
      "house cleaning service",
      "need someone to shovel snow",
      "need a handyman",
      "fix things around the house",
      "help with yard work",
      "mow my lawn",
      "leaky faucet",
      "something is broken",
      "i need a cleaner",
      "maid service",
      "house cleaner",
      "spring cleaning",
    ],
  },
  {
    slug: "health-wellness",
    keywords: [
      "doctor", "nurse", "nursing", "physio", "physiotherapy",
      "physical therapy", "foot care", "footcare", "chiropody",
      "dental", "dentist", "dentures", "hearing", "audiology",
      "audiologist", "vision", "optometrist", "glasses", "eyes",
      "massage", "therapist", "therapy",
      "blood pressure", "diabetes", "medication", "pill",
      "pharmacy", "prescription",
    ],
    subHints: [
      "i need a doctor",
      "need physiotherapy",
      "help with my feet",
      "i can't hear well",
      "need new glasses",
      "back pain",
      "sore knees",
      "i need a massage",
      "help managing medications",
      "diabetes care",
      "blood pressure check",
    ],
  },
  {
    slug: "transportation",
    keywords: [
      "ride", "rides", "drive", "driving", "driver",
      "transport", "transportation", "taxi", "cab",
      "uber", "lyft",
      "wheelchair", "accessible", "stretcher",
      "medical transport", "ambulatory",
      "mobility scooter", "walker",
    ],
    subHints: [
      "i need a ride",
      "i need a driver",
      "someone to drive me",
      "transport to a doctor",
      "wheelchair accessible ride",
      "i can't drive anymore",
      "ride to the hospital",
      "need to get to an appointment",
    ],
  },
  {
    slug: "falls-wandering",
    keywords: [
      "fall", "falls", "falling",
      "wandering", "lost", "elopement",
      "alert", "pendant", "medical alert", "lifeline",
      "gps", "tracker", "tracking",
      "grab bar", "grab bars", "handrail", "rail",
      "non slip", "non-slip", "slip", "slipping",
      "walker", "rollator", "cane", "walking stick",
      "hip protector", "bed alarm",
      "balance",
    ],
    subHints: [
      "i'm afraid of falling",
      "i keep falling",
      "my mom keeps falling",
      "my dad falls",
      "i'm worried about falling",
      "need a medical alert",
      "life alert",
      "emergency button",
      "my husband wanders",
      "my wife wanders",
      "grab bars for bathroom",
      "make my house safer",
      "i lost my balance",
    ],
  },
  {
    slug: "pet-therapy",
    keywords: [
      "pet", "pets", "dog", "dogs", "cat", "cats",
      "puppy", "kitten", "animal", "animals",
      "therapy dog", "service dog", "service animal",
      "pet sitter", "pet sitting", "dog sitter",
      "dog walk", "dog walking", "walker",
      "groomer", "grooming",
      "vet", "veterinary", "veterinarian",
      "foster", "adoption", "rescue",
    ],
    subHints: [
      "i need someone to walk my dog",
      "dog walker",
      "pet sitter while i'm away",
      "mobile vet",
      "vet comes to me",
      "i want a therapy dog",
      "i want a service dog",
      "need help with my pet",
      "cat sitter",
    ],
  },
  {
    slug: "wellness-comfort",
    keywords: [
      "beauty", "hair", "haircut", "salon", "barber",
      "mobile hair", "in-home hair",
      "spa", "massage", "wellness", "relaxation",
      "lonely", "loneliness", "grief", "bereavement", "loss",
      "depression", "anxiety", "mental health", "counseling",
      "social", "club", "friends",
      "adult day", "day club",
    ],
    subHints: [
      "i'm lonely",
      "i feel alone",
      "i lost my spouse",
      "my husband passed away",
      "my wife passed away",
      "i need someone to talk to",
      "i'm sad",
      "i'm grieving",
      "hairdresser comes to me",
      "i can't get to the salon",
      "mobile hairdresser",
    ],
  },
  {
    slug: "tech-help-for-seniors",
    keywords: [
      "tech", "technology", "computer", "laptop", "tablet",
      "ipad", "iphone", "android", "smartphone", "phone help",
      "zoom", "facetime", "video call", "video chat",
      "email", "text", "messaging", "whatsapp",
      "internet", "wifi", "wi-fi", "router",
      "online banking", "banking app", "password",
      "printer", "google", "facebook",
      "smart home", "alexa", "google home", "siri",
    ],
    subHints: [
      "help with my phone",
      "help with my computer",
      "i can't figure out zoom",
      "i lost my password",
      "help me with email",
      "help with online banking",
      "i don't understand technology",
      "show me how to video call",
      "learn how to use my ipad",
    ],
  },
  {
    slug: "senior-concierge-errands",
    keywords: [
      "concierge", "errand", "errands",
      "groceries", "pickup", "delivery",
      "pharmacy", "prescription",
      "scam", "fraud", "phishing", "robocall",
      "driver", "companion", "ride",
      "day program", "day centre", "day center",
      "life admin", "personal assistant",
    ],
    subHints: [
      "i got scammed",
      "i think i got a scam call",
      "need someone to run errands",
      "groceries picked up",
      "prescription picked up",
      "i need a ride",
      "adult day program",
      "need help with life admin",
    ],
  },
  {
    // Legacy slug — preserved so any old links still resolve.
    slug: "concierge-tech",
    keywords: [
      "tech", "technology", "concierge", "errand", "errands",
    ],
    subHints: [],
  },
  {
    slug: "transition-downsizing",
    keywords: [
      "downsize", "downsizing", "move", "moving", "mover", "movers",
      "relocate", "relocation",
      "estate", "liquidation", "estate sale",
      "declutter", "decluttering",
      "memoir", "legacy", "biography", "life story",
      "gift", "grandchild", "grandchildren",
    ],
    subHints: [
      "i'm moving to a smaller place",
      "moving to assisted living",
      "moving out of my house",
      "downsize my home",
      "i need to get rid of stuff",
      "estate sale",
      "write my life story",
      "memoir writer",
      "gift for grandchildren",
    ],
  },
  {
    slug: "home-adaptations",
    keywords: [
      "adapt", "adaptation", "adaptations",
      "renovation", "renovate", "remodel",
      "wheelchair ramp", "ramp", "stair lift", "stairlift",
      "walk-in tub", "walk-in shower",
      "smart home", "home automation",
      "handyman", "odd jobs",
      "errand", "concierge",
    ],
    subHints: [
      "i need a ramp",
      "make my home accessible",
      "walk in bathtub",
      "stairs are too hard",
      "can't use the stairs anymore",
      "smart home setup",
      "alexa for seniors",
      "someone to run errands for me",
    ],
  },
  {
    slug: "active-aging",
    keywords: [
      "fitness", "exercise", "yoga", "tai chi", "stretch",
      "recreation", "hobby", "hobbies", "class", "classes",
      "travel", "tour", "vacation", "trip",
      "encore", "career", "work", "job", "retirement job",
      "volunteer", "intergenerational",
      "adaptive", "sport", "sports",
    ],
    subHints: [
      "i want to stay fit",
      "exercise classes for seniors",
      "yoga for older adults",
      "travel for seniors",
      "i want to travel",
      "i want to work again",
      "encore career",
      "i want a part time job",
    ],
  },
  {
    slug: "pastoral",
    keywords: [
      "church", "pastor", "priest", "minister", "rabbi",
      "imam", "spiritual", "spirituality", "faith", "religion",
      "worship", "prayer", "bible", "scripture",
      "sacrament", "communion", "last rites",
      "chaplain", "interfaith",
      "funeral", "end of life", "death",
      "visitation", "home visit",
    ],
    subHints: [
      "i want a pastor to visit",
      "i need prayer",
      "end of life care",
      "spiritual care",
      "chaplain visit",
      "someone from my church",
      "i can't get to church",
      "home worship",
    ],
  },
  {
    slug: "volunteer",
    keywords: [
      "volunteer", "volunteering", "give back",
      "help out", "community service",
      "board member", "board of directors",
      "nonprofit", "charity", "charitable",
      "skills based", "peer support", "mentor", "mentoring",
    ],
    subHints: [
      "i want to volunteer",
      "where can i volunteer",
      "give back to the community",
      "join a board",
      "mentor someone",
    ],
  },
  {
    slug: "legal-financial",
    keywords: [
      "lawyer", "attorney", "legal", "law", "estate",
      "will", "testament", "power of attorney", "poa",
      "probate", "trust", "estate planning",
      "financial", "financial planner", "financial advisor",
      "money", "investment", "retirement income", "pension",
      "tax", "taxes", "tax preparation", "tax return",
      "cpp", "oas", "gis", "benefits", "old age security",
      "senior benefits", "government benefits",
      "accountant", "bookkeeping",
    ],
    subHints: [
      "i need a lawyer",
      "help with my will",
      "estate planning",
      "help with taxes",
      "do my taxes",
      "financial advice",
      "i don't understand my pension",
      "how do i get old age security",
      "help with benefits",
    ],
  },
  {
    slug: "community",
    keywords: [
      "community", "centre", "center", "senior centre",
      "day program", "day program", "program",
      "recreation", "social", "activity", "activities",
      "group", "club", "meetup",
      "caregiver", "respite", "relief",
    ],
    subHints: [
      "senior centre near me",
      "day program for seniors",
      "activities for seniors",
      "i want to meet people",
      "caregiver needs a break",
    ],
  },
  {
    slug: "housing",
    keywords: [
      "housing", "retirement home", "retirement living",
      "senior living", "long term care", "long-term care",
      "assisted living", "care home", "nursing home",
      "respite", "respite care",
      "move in", "placement",
    ],
    subHints: [
      "retirement home",
      "looking for a nursing home",
      "assisted living",
      "long term care placement",
      "i need more help than i can get at home",
    ],
  },
  {
    slug: "dating",
    keywords: [
      "dating", "date", "match", "matchmaking",
      "companion", "companionship", "friendship",
      "romance", "romantic", "love",
      "second marriage", "remarriage",
      "pen pal", "letters",
      "social club", "mixer",
    ],
    subHints: [
      "i want to date again",
      "senior dating",
      "looking for a companion",
      "looking for friends",
      "i'm lonely and want company",
    ],
  },
  {
    slug: "sexual-health",
    keywords: [
      "sexual", "sex", "intimate", "intimacy",
      "pelvic floor", "menopause", "hormone",
      "ed", "erectile", "dysfunction",
      "sti", "std", "testing",
      "couples counseling", "couples therapy",
      "sex therapist",
    ],
    subHints: [
      "menopause help",
      "pelvic floor therapy",
      "i'm having intimacy issues",
      "couples therapy",
      "sexual health for seniors",
    ],
  },
  {
    slug: "intimate-wellness",
    keywords: [
      "intimate", "intimacy", "romance", "romantic",
      "love", "connection",
      "friendship", "companionship",
      "relationship", "relationship coaching",
      "mature", "wellness",
      "bedroom", "bedroom safety",
    ],
    subHints: [
      "i want to feel close to my partner",
      "relationship coaching",
      "intimacy advice",
      "mature dating",
    ],
  },
  {
    slug: "shopping",
    keywords: [
      "shopping", "shop", "store",
      "delivery", "deliver", "delivered",
      "pharmacy delivery", "rx delivery",
      "grocery", "groceries", "food",
      "medical supplies", "adaptive clothing",
      "online shopping", "amazon",
    ],
    subHints: [
      "i need groceries delivered",
      "pharmacy delivery",
      "i can't get to the store",
      "deliver to my house",
      "medical supplies",
      "adaptive clothing",
    ],
  },
  {
    slug: "events",
    keywords: [
      "event", "events", "fair", "fairs",
      "workshop", "workshops", "class", "classes",
      "social event", "outdoor", "trip", "trips",
      "fundraiser", "fundraising", "support group",
      "meetup", "gathering",
    ],
    subHints: [
      "senior fair",
      "events near me",
      "workshops for seniors",
      "support group",
      "things to do this weekend",
    ],
  },
];

/** Common misspellings → canonical word used in keywords. */
export const SPELLING_FIXES: Record<string, string> = {
  "physiotherapie": "physiotherapy",
  "phisio": "physio",
  "phisotherapy": "physiotherapy",
  "chiroprody": "chiropody",
  "aidiologist": "audiologist",
  "optomitrist": "optometrist",
  "optamologist": "optometrist",
  "masseuse": "massage",
  "masseur": "massage",
  "compainion": "companion",
  "compainionship": "companionship",
  "pharmacist": "pharmacy",
  "perscription": "prescription",
  "priscripition": "prescription",
  "docter": "doctor",
  "doc": "doctor",
  "hosptial": "hospital",
  "wheelcahir": "wheelchair",
  "wheelchar": "wheelchair",
  "ambulance": "medical transport",
  "ridemshare": "ride",
};

/** Light stopwords — common small words that don't help with matching. */
export const STOPWORDS = new Set([
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

/**
 * Very small set of suffixes to strip when tokenizing so that
 * "cleaning" / "cleaned" / "cleans" all match "clean".
 * Conservative — only strips common English suffixes.
 */
const SUFFIX_RULES: Array<[RegExp, string]> = [
  [/ies$/, "y"],
  [/ied$/, "y"],
  [/ying$/, "y"],
  [/ing$/, ""],
  [/ed$/, ""],
  [/ers$/, "er"],
  [/er$/, ""],
  [/est$/, ""],
  [/s$/, ""],
];

export function stem(word: string): string {
  const w = word.toLowerCase();
  if (w.length <= 3) return w;
  for (const [re, rep] of SUFFIX_RULES) {
    if (re.test(w) && w.replace(re, rep).length >= 3) {
      return w.replace(re, rep);
    }
  }
  return w;
}