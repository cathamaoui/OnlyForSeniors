// Strip pill-style nav across the site (round 2). Catches the patterns
// that round 1 missed: back-nav pills WITHOUT shadow-sm but with
// `border` + `rounded-full`, and the in-content section-eyebrow pills
// (black rounded-full tags like "Our mission").
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

let total = 0;

for (const f of walk("src")) {
  let before = fs.readFileSync(f, "utf8");
  let after = before;

  // Pattern A: back-nav pill that has rounded-full + border (no shadow).
  after = after.replace(
    /className="([^"]*\brounded-full\b[^"]*\bborder\b[^"]*)"/g,
    (full, cls) => {
      // Skip if it has shadow-sm (already handled by round 1)
      if (cls.includes("shadow-sm")) return full;
      let next = cls
        .replace(/\brounded-full\b/g, "")
        .replace(/\bbg-white\b/g, "")
        .replace(/\bborder(?:-2)?\s+(?:border-)?\S+/g, "")
        .replace(/\bhover:bg-stone-\d+\b/g, "hover:underline")
        .replace(/\bhover:border-stone-\d+\b/g, "")
        .replace(/\bfont-semibold\b/g, "font-normal")
        .replace(/\bfont-bold\b/g, "font-normal")
        .replace(/\s+/g, " ")
        .trim();
      if (!next.includes("hover:underline")) {
        next = next + " hover:underline";
      }
      total++;
      return `className="${next.trim()}"`;
    }
  );

  // Pattern B: black "eyebrow" pill — bg-... text-white + px-3 py-1
  // + rounded-full + font-bold, e.g. "Our mission" / "FOR BUSINESS OWNERS".
  // Replace with a tiny uppercase label (no chrome).
  after = after.replace(
    /className="([^"]*\bbg-(?:black|stone-900)\b[^"]*\btext-white\b[^"]*\brounded-full\b[^"]*)"/g,
    (full, cls) => {
      let next = cls
        .replace(/\bbg-(?:black|stone-900)\b/g, "")
        .replace(/\btext-white\b/g, "text-stone-500")
        .replace(/\brounded-full\b/g, "")
        .replace(/\bpx-\d+\b/g, "")
        .replace(/\bpy-\d+\b/g, "")
        .replace(/\bfont-bold\b/g, "font-medium")
        .replace(/\buppercase\b/g, "uppercase")
        .replace(/\s+/g, " ")
        .trim();
      total++;
      return `className="${next.trim()}"`;
    }
  );

  if (before !== after) {
    fs.writeFileSync(f, after);
    console.log("updated", f);
  }
}
console.log("links/buttons updated:", total);