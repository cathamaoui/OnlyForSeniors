// Rewrite subcategoryBlurbs to remove concierge-tech/ entries and add
// the two new category entries.
const fs = require("fs");
const f = "src/lib/subcategoryBlurbs.ts";
let s = fs.readFileSync(f, "utf8");

// 1. Remove all concierge-tech/X entries (we re-key them under new slugs).
const oldEntries = [
  'concierge-tech/adult-day-centres',
  'concierge-tech/senior-concierge',
  'concierge-tech/fraud-prevention',
  'concierge-tech/tech-training',
  'concierge-tech/digital-organization',
  'concierge-tech/smartphone-help',
  'concierge-tech/video-calls',
  'concierge-tech/online-banking',
  'concierge-tech/companion-drivers',
  'concierge-tech/errand-services',
];

let removed = 0;
for (const k of oldEntries) {
  // Escape for regex
  const re = new RegExp('  "' + k.replace(/\//g, '\\/') + '":[^\\n]+\\n');
  const before = s.length;
  s = s.replace(re, '');
  if (s.length !== before) removed++;
}
console.log("removed entries:", removed);

// 2. Replace the comment block.
s = s.replace(/\/\/ concierge-tech\n[\s\S]*?(?=\n  \/\/ home-care\n)/, '');

// 3. Insert the two new category blocks before "// home-care".
const newBlock =
`// tech-help-for-seniors
  "tech-help-for-seniors/tech-training":
    "Patient, one-on-one tech lessons for any skill level.",
  "tech-help-for-seniors/smartphone-help":
    "iPhone and Android setup, lessons, and troubleshooting.",
  "tech-help-for-seniors/video-calls":
    "Get set up on Zoom, FaceTime, or WhatsApp video calls.",
  "tech-help-for-seniors/online-banking":
    "Patient help with banking apps, transfers, and bill pay.",
  "tech-help-for-seniors/digital-organization":
    "Photo, document, and password organization made simple.",

  // senior-concierge-errands
  "senior-concierge-errands/senior-concierge":
    "Personal concierge help for errands, scheduling, and life admin.",
  "senior-concierge-errands/errand-services":
    "Grocery runs, pharmacy pickup, and personal shopping.",
  "senior-concierge-errands/companion-drivers":
    "Friendly drivers for appointments, errands, and visits.",
  "senior-concierge-errands/adult-day-centres":
    "Structured daytime programs with activities and meals.",
  "senior-concierge-errands/fraud-prevention":
    "Help recognizing scams and securing your accounts.",

`;

s = s.replace("  // home-care\n", newBlock + "  // home-care\n");
fs.writeFileSync(f, s);
console.log("written");