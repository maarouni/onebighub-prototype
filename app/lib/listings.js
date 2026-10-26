// Products, Services, Memberships ("Other Listings") — from Cesar's Figma
// (onebigHUB.com/OtherListings, Rev 261025-261026):
//   list row: Product | Service | Membership · Name of Individual / Biz / Org /
//             Group · City, State · Cost $ - $ · Expires · Posted / Revised
//   premier row adds: one-line description · In-Person / Online · Industry
//   filters:  Type · Date Posted / Revised · Offering $ Referrals ·
//             In-Person / Online · Cost ($ buckets) · Digest · Industries · Regions
// His detail / EDIT templates are still copies of Employment (Position Title,
// Compensation, Job ID), so those pages use product fields instead.
import { REGION_GROUPS } from "./taxonomy";
import { INDUSTRIES } from "./employmentTaxonomy";

export { REGION_GROUPS, INDUSTRIES };

export const LISTING_TYPES = ["Product", "Service", "Membership"];
export const DELIVERY_OPTIONS = ["In-Person", "Online"];
export const REFERRAL_OPTIONS = [{ id: "no", label: "No" }, { id: "yes", label: "Yes" }];
export const COST_UNITS = ["one-time", "per hour", "per month", "per year"];

export const COST_OPTIONS = [
  { id: "free", label: "Free", min: 0, max: 0 },
  { id: "0-15", label: "$ 0 - $ 14.99", min: 0.01, max: 14.99 },
  { id: "15-30", label: "$ 15 - $ 29.99", min: 15, max: 29.99 },
  { id: "30-50", label: "$ 30 - $ 49.99", min: 30, max: 49.99 },
  { id: "50-100", label: "$ 50 - $ 99.99", min: 50, max: 99.99 },
  { id: "100+", label: "$ 100+", min: 100, max: Infinity },
];

export const DATE_POSTED_OPTIONS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "7", label: "Past 7 days" },
  { id: "15", label: "Past 15 days" },
  { id: "30", label: "Past 30+ days" },
  { id: "custom", label: "MM/DD/YY - MM/DD/YY" },
];

export const EMPTY_LISTING_FILTERS = {
  type: [], posted: "all", postedFrom: "", postedTo: "",
  referrals: [], delivery: [], cost: [], industry: [], region: [],
};

// Glyph used in the listing image column, per type.
export const TYPE_GLYPH = { Product: "products", Service: "service", Membership: "membership" };

// Placeholder listings to test the layout — Cesar replaces these.
const LISTINGS = [
  {
    id: "p1", type: "Membership", name: "Tri-Valley Business Alliance — Annual Membership",
    description: "Monthly mixers, member directory and a referral program",
    offeredBy: "Tri-Valley Business Alliance", industry: "Professional Services",
    city: "Pleasanton", state: "CA", region: "Alameda", delivery: ["In-Person", "Online"],
    costMin: 250, costMax: 600, costUnit: "per year", referrals: true,
    expires: "2027-03-31", posted: "2026-10-22", premier: true,
    details: "Three tiers: Individual, Small Business and Corporate. Members get two free expo tables a year.",
    contact: "Membership desk", phone: "(925) 555-0118", email: "", url: "",
  },
  {
    id: "p2", type: "Service", name: "Bookkeeping for small businesses",
    description: "Monthly books, payroll and year-end package for your CPA",
    offeredBy: "Bay Ledger Bookkeeping", industry: "Financial",
    city: "Walnut Creek", state: "CA", region: "Contra Costa", delivery: ["Online"],
    costMin: 300, costMax: 900, costUnit: "per month", referrals: true,
    expires: "2027-01-31", posted: "2026-10-18", premier: true,
    details: "QuickBooks and Xero. Free first-month cleanup for onebigHUB members.",
    contact: "Owner", phone: "", email: "", url: "",
  },
  {
    id: "p3", type: "Product", name: "Custom branded event banners",
    description: "Retractable 33×80 in. stands, 3-day turnaround",
    offeredBy: "Peninsula Print Shop", industry: "Media, Advertising",
    city: "San Mateo", state: "CA", region: "San Mateo", delivery: ["In-Person", "Online"],
    costMin: 129, costMax: 249, costUnit: "one-time", referrals: false,
    expires: "2026-12-31", posted: "2026-10-12", premier: false,
    details: "Includes stand, carry bag and one design revision.",
    contact: "", phone: "", email: "", url: "",
  },
  {
    id: "p4", type: "Service", name: "Notary and loan-signing",
    description: "Mobile notary, evenings and weekends",
    offeredBy: "East Bay Mobile Notary", industry: "Professional Services",
    city: "Oakland", state: "CA", region: "Alameda", delivery: ["In-Person"],
    costMin: 15, costMax: 150, costUnit: "one-time", referrals: true,
    expires: "2027-02-28", posted: "2026-10-08", premier: false,
    details: "$15 per signature at the office; travel fee for mobile appointments.",
    contact: "", phone: "", email: "", url: "",
  },
  {
    id: "p5", type: "Membership", name: "Coworking day pass bundle",
    description: "10 day passes, any weekday",
    offeredBy: "SoMa Commons", industry: "Business",
    city: "San Francisco", state: "CA", region: "San Francisco", delivery: ["In-Person"],
    costMin: 180, costMax: 180, costUnit: "one-time", referrals: false,
    expires: "2026-12-15", posted: "2026-10-02", premier: false,
    details: "Includes coffee, Wi-Fi and one hour of meeting room time per pass.",
    contact: "", phone: "", email: "", url: "",
  },
  {
    id: "p6", type: "Product", name: "Networking starter kit",
    description: "250 business cards, name badge and QR stand",
    offeredBy: "Silicon Valley Print Co.", industry: "Media, Advertising",
    city: "San Jose", state: "CA", region: "Santa Clara", delivery: ["Online"],
    costMin: 0, costMax: 0, costUnit: "one-time", referrals: false,
    expires: "2026-11-30", posted: "2026-09-28", premier: false,
    details: "Free for the first 50 onebigHUB sign-ups; shipping included.",
    contact: "", phone: "", email: "", url: "",
  },
];

const LOCAL_KEY = "mc_submitted_listings_v1";

export function localListings() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; }
}

export function saveLocalListing(l) {
  try {
    const list = localListings().filter((x) => x.id !== l.id);
    list.unshift(l);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {}
}

export async function fetchListings() {
  const ids = new Set(LISTINGS.map((l) => l.id));
  return [...localListings().filter((l) => !ids.has(l.id)), ...LISTINGS];
}

const money = (n) => `$${Number(n).toLocaleString()}`;

// "Free", "$180", "$300 - $900 per month"
export function costLabel(l) {
  const lo = Number(l.costMin) || 0;
  const hi = Number(l.costMax) || lo;
  if (!lo && !hi) return "Free";
  const range = lo === hi || !hi ? money(lo) : `${money(lo)} - ${money(hi)}`;
  return l.costUnit && l.costUnit !== "one-time" ? `${range} ${l.costUnit}` : range;
}

function dayDiff(iso, today) {
  const [y, m, dd] = String(iso || "").split("-").map(Number);
  if (!y) return null;
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  return Math.round((t - new Date(y, m - 1, dd)) / 86400000);
}

const TESTS = {
  type: (l, f) => !f.type.length || f.type.includes(l.type),
  posted: (l, f, today) => {
    if (f.posted === "all") return true;
    if (f.posted === "custom") {
      if (f.postedFrom && l.posted < f.postedFrom) return false;
      if (f.postedTo && l.posted > f.postedTo) return false;
      return true;
    }
    const diff = dayDiff(l.posted, today);
    if (diff === null) return false;
    if (f.posted === "today") return diff === 0;
    if (f.posted === "30") return diff >= 0;
    return diff >= 0 && diff <= Number(f.posted);
  },
  referrals: (l, f) => !f.referrals.length || f.referrals.includes(l.referrals ? "yes" : "no"),
  delivery: (l, f) => !f.delivery.length || (l.delivery || []).some((d) => f.delivery.includes(d)),
  // A listing matches a cost bucket when its range overlaps the bucket.
  cost: (l, f) => !f.cost.length || f.cost.some((id) => {
    const o = COST_OPTIONS.find((x) => x.id === id);
    const lo = Number(l.costMin) || 0;
    const hi = Number(l.costMax) || lo;
    return o && lo <= o.max && hi >= o.min;
  }),
  industry: (l, f) => !f.industry.length || f.industry.includes(l.industry),
  region: (l, f) => !f.region.length || f.region.includes(l.region),
};

export function listingMatches(l, f, today = new Date(), q = "") {
  for (const k of Object.keys(TESTS)) if (!TESTS[k](l, f, today)) return false;
  if (q) {
    const hay = `${l.type} ${l.name} ${l.description} ${l.offeredBy} ${l.city} ${l.industry}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function countListingsFor(list, f, patch, today, q) {
  const trial = { ...f, ...patch };
  return list.filter((l) => listingMatches(l, trial, today, q)).length;
}
