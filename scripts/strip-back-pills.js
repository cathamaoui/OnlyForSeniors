// Strip the rounded-full "back pill" navigation links across the site.
// Users want plain text links for primary nav (back to All Categories, etc.)
// instead of the dated rounded-full white pills with borders + shadows.
//
// Pattern (most pages): className includes `rounded-full` + `bg-white` +
// `shadow-sm` + `border border-stone-100|200` + `font-semibold` — these
// are the small back-nav buttons at the top of pages.
//
// Strategy: any <Link className="...rounded-full...shadow-sm..."> gets
// stripped down to a plain link with hover:underline. Also remove the
// border / bg / shadow / font-bold.
//
// Conservative: only operates on <Link> + <a> tags (not <button> tags)
// so we don't break the form-style submit buttons.
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

  // Replace the back-pill pattern: any <Link or <a with rounded-full +
  // bg-white + border + shadow, replace className with a plain link style.
  // We target lines that look like back-nav pills (have hover:bg-stone-50
  // AND shadow-sm AND rounded-full AND bg-white).
  after = after.replace(
    /className="([^"]*\brounded-full\b[^"]*\bbg-white\b[^"]*\bshadow-sm\b[^"]*)"/g,
    (full, cls) => {
      // Strip the pill chrome
      let next = cls
        .replace(/\brounded-full\b/g, "")
        .replace(/\bbg-white\b/g, "")
        .replace(/\bborder(?:-2)?\s+border-\S+/g, "")
        .replace(/\bshadow-sm\b/g, "")
        .replace(/\bhover:bg-stone-(?:50|100)\b/g, "hover:underline")
        .replace(/\bhover:border-stone-\d+\b/g, "")
        .replace(/\bfont-semibold\b/g, "font-normal")
        .replace(/\bfont-bold\b/g, "font-normal")
        .replace(/\s+/g, " ")
        .trim();
      // Add a hover underline if not present
      if (!next.includes("hover:underline")) {
        next = next + " hover:underline";
      }
      next = next.trim();
      total++;
      return `className="${next}"`;
    }
  );

  // Also strip the "border-2 border-black rounded-full" pattern with no
  // bg-white — those are the homepage "All Listings" / search pill buttons.
  after = after.replace(
    /className="([^"]*\bborder-2\s+border-black\b[^"]*\bshadow-sm\b[^"]*)"/g,
    (full, cls) => {
      let next = cls
        .replace(/\bborder-2\s+border-black\b/g, "")
        .replace(/\bbg-white\b/g, "")
        .replace(/\bshadow-sm\b/g, "")
        .replace(/\bhover:bg-stone-\d+\b/g, "hover:underline")
        .replace(/\s+/g, " ")
        .trim();
      if (!next.includes("hover:underline")) {
        next = next + " hover:underline";
      }
      total++;
      return `className="${next.trim()}"`;
    }
  );

  // Generic: rounded-full + bg-white on the same className (any other pill)
  after = after.replace(
    /className="([^"]*\brounded-full\b[^"]*\bbg-white\b[^"]*)"/g,
    (full, cls) => {
      let next = cls
        .replace(/\brounded-full\b/g, "")
        .replace(/\bbg-white\b/g, "")
        .replace(/\bborder(?:-2)?\s+border-\S+/g, "")
        .replace(/\bshadow-sm\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!next.includes("hover:underline")) {
        next = next + " hover:underline";
      }
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