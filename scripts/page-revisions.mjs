// Writes app/lib/pageRevisions.json: route -> when that page was last revised.
// Footer line 2 shows it (Cesar, Nov 6: "the date and time the specific page
// was last revised"; later, by the user). A page counts as revised when its own
// route folder changes (home page: app/page.js only). Uncommitted changes count
// as "now", so run this right before committing: npm run revisions
// On a shallow clone (Vercel builds) git history is incomplete, so the
// committed file is kept as-is.
import { execSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const sh = (c) => execSync(c, { encoding: "utf8" }).trim();
let shallow = true;
try { shallow = sh("git rev-parse --is-shallow-repository") === "true"; } catch {}
if (shallow) { console.log("page-revisions: shallow or no git history, keeping committed file"); process.exit(0); }

function pages(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...pages(p));
    else if (n === "page.js") out.push(p);
  }
  return out;
}

const now = new Date().toISOString();
const map = {};
for (const file of pages("app")) {
  const dir = file.replace(/\/page\.js$/, "");
  const route = "/" + relative("app", dir).replace(/\\/g, "/");
  // home page: its own file only, not every route folder beneath it
  const target = route === "/" ? file : dir;
  const dirty = sh(`git status --porcelain -- "${target}"`);
  const iso = dirty ? now : sh(`git log -1 --format=%cI -- "${target}"`) || now;
  map[route === "/." ? "/" : route] = new Date(iso).toISOString();
}
const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync("app/lib/pageRevisions.json", JSON.stringify(sorted, null, 2) + "\n");
console.log(`page-revisions: ${Object.keys(sorted).length} routes`);
