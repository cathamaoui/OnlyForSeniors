// Down-weight display headings. After switching to DM Sans (low-contrast,
// never-bold), `font-black` / `font-bold` overrides on headings make them
// look chunky. Dial everything down to `font-medium` (500) which is the
// crisp-but-not-bold target.
//
// Affected classes:
//   font-display font-black  -> font-display font-medium
//   font-display font-bold   -> font-display font-medium
//
// Button labels and small UI text intentionally keep `font-bold` since
// those are small surfaces where bold helps tap targets read. So we only
// touch headings: h1, h2, h3 (and span/h2 combinations).
//
// Approach: scan all tsx files, only rewrite on lines containing `font-display`
// followed by `font-(black|bold)`. We anchor on a heading-tag context by
// requiring either an <h1-<h6> tag OR a parent h1-h6 within the same className.
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
const RE = /font-display font-(black|bold|extrabold|semibold)/g;

for (const f of walk("src")) {
  let before = fs.readFileSync(f, "utf8");
  // Only convert on lines that ALSO look like headings (h1-h6) — leave
  // buttons, spans, list items, etc. alone.
  const lines = before.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (RE.test(l) && /<h[1-6]\b/.test(l)) {
      lines[i] = l.replace(RE, "font-display font-medium");
      total++;
    }
    RE.lastIndex = 0;
  }
  const after = lines.join("\n");
  if (before !== after) {
    fs.writeFileSync(f, after);
    console.log("updated", f);
  }
}
console.log("lines updated:", total);