// Languages commonly spoken in Canada, with a small set of additional options
// surfaced in the "other" dropdown for anything not on the primary list.

export const LANGUAGES: { code: string; name: string; native?: string }[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "zh", name: "Mandarin / Cantonese" },
  { code: "pa", name: "Punjabi" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "de", name: "German" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ru", name: "Russian" },
  { code: "ro", name: "Romanian" },
  { code: "el", name: "Greek" },
  { code: "tl", name: "Tagalog (Filipino)" },
  { code: "vi", name: "Vietnamese" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "th", name: "Thai" },
  { code: "ta", name: "Tamil" },
  { code: "bn", name: "Bengali" },
  { code: "fa", name: "Farsi (Persian)" },
  { code: "so", name: "Somali" },
  { code: "sw", name: "Swahili" },
  { code: "iu", name: "Inuktitut" },
  { code: "oj", name: "Anishinaabemowin (Ojibwe)" },
  { code: "cr", name: "Cree" },
];

// "Other" options — less-common languages a senior may encounter. The form
// lets the business pick a primary + "other" combo so they can advertise
// every language they actually speak.
export const OTHER_LANGUAGES: string[] = [
  "American Sign Language (ASL)",
  "Quebec Sign Language (LSQ)",
  "Gujarati",
  "Kurdish (Sorani)",
  "Pashto",
  "Tigrinya",
  "Amharic",
  "Yoruba",
  "Igbo",
  "Haitian Creole",
  "Indonesian / Malay",
  "Maltese",
  "Croatian",
  "Serbian",
  "Hungarian",
  "Czech",
  "Slovak",
  "Finnish",
  "Norwegian",
  "Swedish",
  "Hebrew",
  "Yiddish",
  "Armenian",
  "Georgian",
  "Mongolian",
  "Nepali",
  "Sinhala",
  "Burmese",
  "Khmer",
  "Lao",
  "Tibetan",
  "Hawaiian",
  "Yiddish",
  "Other (specify in description)",
];

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

// --------------------------------------------------------------------
// All available languages in a single list, used by the new combined
// multi-select dropdown. Each entry is either a code (from LANGUAGES) or
// the raw name (from OTHER_LANGUAGES). The `findLanguageLabel` helper
// resolves either form back to a display string.
// --------------------------------------------------------------------
export type LanguageOption = { value: string; label: string; group: "primary" | "other" };

export const ALL_LANGUAGE_OPTIONS: LanguageOption[] = [
  ...LANGUAGES.map((l) => ({ value: l.code, label: l.name, group: "primary" as const })),
  ...OTHER_LANGUAGES.map((n) => ({ value: n, label: n, group: "other" as const })),
];

/** Resolve any value (code, raw name, or free text) to a display label. */
export function findLanguageLabel(value: string): string {
  // Primary by code
  const fromCode = LANGUAGES.find((l) => l.code === value);
  if (fromCode) return fromCode.name;
  // Other by exact name
  if (OTHER_LANGUAGES.includes(value)) return value;
  // Free text — capitalise first letter for nicer display
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
