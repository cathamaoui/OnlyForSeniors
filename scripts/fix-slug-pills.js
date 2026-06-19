// Final pill cleanup
const fs = require("fs");
const f = "src/app/categories/[slug]/page.tsx";
let s = fs.readFileSync(f, "utf8");
const from =
  'className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black rounded-full font-semibold text-base hover:bg-stone-50 shadow-sm border border-stone-100"';
const to =
  'className="inline-flex items-center gap-2 min-h-touch text-base font-semibold text-stone-800 hover:text-black hover:underline"';
const count = s.split(from).length - 1;
s = s.split(from).join(to);
fs.writeFileSync(f, s);
console.log("replacements:", count);