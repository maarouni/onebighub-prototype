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

// Nov 16 (Cesar, "Promote & Earn One Big Table" Rev 261116): one table, Listing Type
// (select one). Careers / Jobs, Deals and Notifications keep their own pages.
export const LISTING_TYPES = ["Product", "Service", "Classified", "Hospitality", "Investment", "Pay-It-Forward", "Membership", "Subscription", "Survey"];
export const LISTING_TYPE_MENU = [
  { id: "Careers", label: "Careers / Jobs", icon: "idxBriefcase", href: "/employment" },
  { id: "Product", label: "Products", icon: "idxProduct" },
  { id: "Service", label: "Services", icon: "idxService" },
  { gap: true, id: "Classified", label: "Classifieds", icon: "idxClassified" },
  { id: "Deals", label: "Deals", icon: "discount", href: "/discounts" },
  { id: "Hospitality", label: "Hospitality", icon: "dinner" },
  { id: "Investment", label: "Investments", icon: "idxDeal" },
  { id: "Pay-It-Forward", label: "Pay-It-Forward", icon: "idxHeart" },
  { gap: true, id: "Membership", label: "Memberships", icon: "idxMembership" },
  { id: "Notifications", label: "Notifications", icon: "idxBell", href: "/notifications" },
  { id: "Subscription", label: "Subscriptions", icon: "idxSubscription" },
  { id: "Survey", label: "Surveys", icon: "idxSurvey" },
].map((t) => ({ ...t, href: t.href || `/listings?type=${encodeURIComponent(t.id)}` }));

// Type-specific filter boxes (Figma). Matched against a listing's `tags`.
export const TYPE_BOXES = {
  Classified: [
    { title: "Announcements", options: ["Birthdays", "Business Opening, Launch", "Careers", "Missed Connect", "Obituaries", "Press Releases", "Public Notices", "Ride-Sharing", "Weddings", "Other"] },
    { title: <>Classifieds <i>Items</i></>, options: ["Antiques", "Appliances, Household", "Arts, Crafts, Decorations", "Beauty", "Books, CDs, DVDs, VHS", "Clothing, Accessories", "Collectibles", "Computers", "Electronics", "Furniture", "Garden", "Health", "Jewelry", "Materials, Supplies", "Musical Instruments", "Recreation, Sports", "Tools", "Toys, Games", "Other"] },
    { title: <>Classifieds <i>Real Estate</i></>, options: ["Apartments, Condos", "Commercial", "Homes", "Parking, Storage", "Rooms", "Vacation", "Other"] },
    { title: <>Classifieds <i>Vehicles, Parts</i></>, options: ["Autos", "Aviation", "Bicycles", "Boats", "Construction", "Motorcycles", "Recreational", "Scooters", "Tractors", "Trailers", "Trucks", "Other"] },
  ],
  Hospitality: [
    { title: <>Hospitality <i>Event Type</i></>, options: ["Business: Career Fair", "Business: Conference", "Business: Mixer, Networking", "Business: Expo, Trade Show", "Celebration: Anniversary", "Celebration: Birthday", "Celebration: Gala", "Celebration: Holiday", "Celebration: Wedding", "Entertainment: Concert", "Entertainment: Festival", "Entertainment: Sports", "Other"] },
    { title: <>Hospitality <i>Services</i></>, options: ["Audio / Visual", "Bar", "Catering, Kitchen", "Décor, Furniture", "Event Staffing", "Entertainment: DJs", "Entertainment: Live Bands", "Lodging: Hotels, Inns", "Lodging: AirBNB", "Transportation: Buses, Limos", "Other"] },
    { title: <>Hospitality <i>Venues</i></>, options: ["Ballroom", "Banquet Hall", "Brewery", "Business Center", "Conference Room", "Convention Center", "Estate, Mansion", "Hotel", "Park", "Restaurant", "Theater", "Winery", "Other"] },
  ],
  Investment: [
    { title: <>Investment <i>Opportunities</i></>, options: ["Annuities", "Bonds", "CDs", "Collectibles", "Commodities", "Cryptocurrencies", "Exchange-Traded Funds", "Franchise", "Precious Metals", "Product / Service", "Real Estate", "Social Venture", "Other"] },
    { title: <>Investment <i>Startups</i></>, options: ["Angel Investment", "Venture Capital", "Pre-Seed: Research / Concept / Idea", "Pre-Seed: Prototype / MVP", "Seed: Completed MVP", "Seed: Market Research / Testing", "Post-Seed: Developing Traction", "Post-Seed: Growth", "Post-Seed: Expansion", "Post-Seed: Maturity / Exit"] },
  ],
  "Pay-It-Forward": [
    { title: "Format", options: ["Offering", "Seeking"] },
    { title: <>Donation <i>Money</i></>, options: ["Animals", "Arts", "Children", "Community", "Senior", "Sports", "Youth", "Other"] },
    { title: <>Donation <i>Products</i></>, options: ["Arts", "Music", "Books", "Clothing", "Computers", "Equipment", "Food", "Furniture", "Toys", "Other"] },
    { title: <>Volunteer <i>Ideas &amp; Talent</i></>, options: ["Consulting", "Mentoring", "Public Speaking", "Board of Directors", "Other"] },
    { title: <>Volunteer <i>Time</i></>, options: ["Animals", "Arts", "Children", "Community", "Senior", "Sports", "Youth", "Other"] },
  ],
};
export const DELIVERY_OPTIONS = ["In-Person", "Online"];
export const REFERRAL_OPTIONS = [{ id: "no", label: "No" }, { id: "yes", label: "Yes" }];
export const COST_UNITS = ["one-time", "per hour", "per month", "per year"];

export const COST_OPTIONS = [
  { id: "free", label: "Free", min: 0, max: 0 },
  { id: "0-25", label: "$ 0 - $ 24.99", min: 0.01, max: 24.99 },
  { id: "25-50", label: "$ 25 - $ 49.99", min: 25, max: 49.99 },
  { id: "50-100", label: "$ 50 - $ 99.99", min: 50, max: 99.99 },
  { id: "100-250", label: "$ 100 - $ 249.99", min: 100, max: 249.99 },
  { id: "250-500", label: "$ 250 - $ 499.99", min: 250, max: 499.99 },
  { id: "500-1000", label: "$ 500 - $ 999.99", min: 500, max: 999.99 },
  { id: "1000+", label: "$ 1000+", min: 1000, max: Infinity },
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
  referrals: [], delivery: [], cost: [], industry: [], region: [], tags: [], categories: [],
};

// Glyph used in the listing image column, per type.
export const TYPE_GLYPH = { Product: "idxProduct", Service: "idxService", Membership: "idxMembership", Classified: "idxClassified", Hospitality: "dinner", Investment: "idxDeal", "Pay-It-Forward": "idxHeart", Subscription: "idxSubscription", Survey: "idxSurvey" };

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
  // Nov 16 sample listings for the new types (placeholders, like the ones above)
  { id: "p7", type: "Classified", name: "Vintage oak desk — like new", description: "Solid oak, 5 drawers; pick up in Pleasanton",
    offeredBy: "Private seller", industry: "Retail", city: "Pleasanton", state: "CA", region: "Alameda", delivery: ["In-Person"],
    costMin: 180, costMax: 180, costUnit: "one-time", referrals: false, expires: "2026-12-15", posted: "2026-11-12", premier: false,
    tags: ["Furniture"], details: "", contact: "", phone: "", email: "", url: "" },
  { id: "p8", type: "Hospitality", name: "Garden terrace for mixers (up to 80)", description: "Covered terrace with bar and A/V",
    offeredBy: "Livermore Valley Winery", industry: "Hospitality", city: "Livermore", state: "CA", region: "Alameda", delivery: ["In-Person"],
    costMin: 500, costMax: 1500, costUnit: "one-time", referrals: true, expires: "2027-03-31", posted: "2026-11-10", premier: true,
    tags: ["Winery", "Business: Mixer, Networking", "Bar"], details: "", contact: "", phone: "", email: "", url: "" },
  { id: "p9", type: "Investment", name: "Seed round — local food-delivery startup", description: "Raising $250K SAFE; MVP live in 3 cities",
    offeredBy: "Bay Bites Inc.", industry: "Food, Beverage", city: "Oakland", state: "CA", region: "Alameda", delivery: ["Online", "In-Person"],
    costMin: 10000, costMax: 50000, costUnit: "one-time", referrals: true, expires: "2027-01-31", posted: "2026-11-08", premier: false,
    tags: ["Seed: Completed MVP", "Angel Investment"], details: "", contact: "", phone: "", email: "", url: "" },
  { id: "p10", type: "Pay-It-Forward", name: "Volunteers needed — holiday food drive", description: "Sort and pack boxes, Dec 12-14",
    offeredBy: "Tri-Valley Haven", industry: "Non-Profit", city: "Dublin", state: "CA", region: "Alameda", delivery: ["In-Person"],
    costMin: 0, costMax: 0, costUnit: "one-time", referrals: false, expires: "2026-12-14", posted: "2026-11-14", premier: true,
    tags: ["Seeking", "Community"], details: "", contact: "", phone: "", email: "", url: "" },
  { id: "p11", type: "Subscription", name: "Bay Area Business Weekly — newsletter", description: "Local deals, openings and events every Monday",
    offeredBy: "BABW Media", industry: "Media, Advertising", city: "San Francisco", state: "CA", region: "San Francisco", delivery: ["Online"],
    costMin: 0, costMax: 0, costUnit: "per month", referrals: false, expires: "2027-06-30", posted: "2026-11-05", premier: false,
    details: "", contact: "", phone: "", email: "", url: "" },
  { id: "p12", type: "Survey", name: "Small-business owner survey (5 min)", description: "Help shape onebigHUB features — enter a $50 gift card drawing",
    offeredBy: "onebigHUB", industry: "Technology", city: "San Jose", state: "CA", region: "Santa Clara", delivery: ["Online"],
    costMin: 0, costMax: 0, costUnit: "one-time", referrals: false, expires: "2026-12-31", posted: "2026-11-15", premier: false,
    details: "", contact: "", phone: "", email: "", url: "" },
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
  tags: (l, f) => !f.tags?.length || (l.tags || []).some((t) => f.tags.includes(t)),
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
