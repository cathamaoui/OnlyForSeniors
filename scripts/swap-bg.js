// One-off script to swap page-level `bg-white` for `bg-cream`.
// Only swaps the page-root wrappers, not inner section/element bgs.
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
for (const f of walk("src/app")) {
  const before = fs.readFileSync(f, "utf8");
  const after = before
    .replace(/className="min-h-screen bg-white"/g, 'className="min-h-screen bg-cream"')
    .replace(/className="min-h-screen flex flex-col bg-white"/g, 'className="min-h-screen flex flex-col bg-cream"');
  if (before !== after) {
    fs.writeFileSync(f, after);
    total++;
    console.log("updated", f);
  }
}
console.log("files updated:", total);