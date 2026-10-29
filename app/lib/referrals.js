// 3-Way Introductions / Referrals — Cesar's Figma (Rev 261025-261026):
//   A. Connector (you) introduces B. Vendor (offering or seeking a referral)
//   and C. Potential Client (buyer or seller; internal profile OR external,
//   no profile needed). A, B and C don't have to know each other.
//   Pages: Identify → Message → Status → Evaluations.
// Prototype: referrals live in this browser (localStorage) until the shared
// database exists. No payout logic — "Referral: TBD / $ / %" is a note field.
import { readList, writeList, upsert, nowStamp } from "./auth";
import { fetchOrgs } from "./organizations";
import { fetchListings } from "./listings";
import { fetchDiscounts } from "./discounts";

export const REF_KEY = "mc_referrals_v1";

export const listReferrals = () => readList(REF_KEY);
export const getReferral = (id) => listReferrals().find((r) => r.id === id) || null;
export const saveReferral = (r) => upsert(REF_KEY, { ...r, updated: new Date().toISOString() });

// Referral number like onebigHUB.com/Referrals/UserName/261024/001
export function newReferralId(username = "guest") {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const n = listReferrals().filter((r) => r.ymd === ymd).length + 1;
  return { id: `${username}-${ymd}-${String(n).padStart(3, "0")}`, ymd, num: String(n).padStart(3, "0") };
}

// Searchable profiles: Connections, Products/Services/Memberships and
// Discount offerers — every internal "profile" the prototype has today.
export async function fetchProfiles() {
  const [orgs, listings, discounts] = await Promise.all([fetchOrgs(), fetchListings(), fetchDiscounts()]);
  const out = [];
  const seen = new Set();
  const add = (p) => { const k = p.business.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(p); } };
  orgs.forEach((o) => add({ id: `org-${o.id}`, category: "organization", name: o.contactName || o.name, title: o.contactName ? "Contact" : "", business: o.name, pitchTitle: o.tagline, phone: o.phone, email: o.email, city: `${o.city}, ${o.state || "CA"}` }));
  listings.forEach((l) => add({ id: `lst-${l.id}`, category: "business", name: l.contact || l.offeredBy, title: "", business: l.offeredBy, pitchTitle: l.description, phone: l.phone, email: l.email, city: `${l.city}, ${l.state || "CA"}` }));
  discounts.forEach((d) => add({ id: `dsc-${d.id}`, category: "business", name: d.contact || d.company, title: "", business: d.company, pitchTitle: d.about, phone: d.phone, email: d.email || "", city: `${d.city}, ${d.state || "CA"}` }));
  return out;
}

// Oct 27 meeting: referrals are picked from ONE category at a time
// (Individual, Business, Organization or Group) so the list never mixes them.
export const REFERRAL_CATEGORIES = [
  { id: "individual", label: "Individual" },
  { id: "business", label: "Business" },
  { id: "organization", label: "Organization" },
  { id: "group", label: "Group" },
];

export function matchProfile(p, q) {
  if (!q) return true;
  return `${p.name} ${p.title} ${p.business} ${p.city} ${p.pitchTitle}`.toLowerCase().includes(q.toLowerCase());
}

export const CONTACT_TYPES = [
  { id: "Em", label: "Sent email" }, { id: "Txt", label: "Left text message" }, { id: "Vm", label: "Left voicemail" },
  { id: "Sw", label: "Spoke with" }, { id: "Cor", label: "Corresponded with by email and/or text" },
];

export const TRANSACTION_STATUSES = [
  "Not Interested", "In Progress", "Completed / Conducting Business / Membership",
  "Canceled Transaction", "Received Payment", "Received Referral Fee",
];

export const REMINDER_DAYS = [5, 10, 20];

// Evaluation criteria (0 = Low, 10 = High; "N/A" = Not Applicable / No Response).
export const AV_SCALE = "01 Complete Stranger · 05 Acquaintance · 09 Colleague, Customer, Friend · 10 Family";
export const CV_SCALE = "01 Cold · 05 Contact when possible · 10 HOT! Contact immediately";
export const CRITERIA = [
  { id: "AV", label: "My Acquaintance Value", scale: AV_SCALE },
  { id: "CV", label: "Suggested Contact / Follow-Up Value", scale: CV_SCALE },
  { id: "A", label: "Appealing" }, { id: "B", label: "Creative" }, { id: "C", label: "Informative" },
  { id: "D", label: "Price Value" }, { id: "E", label: "Quality" }, { id: "F", label: "General Satisfaction, Met Expectations" },
  { id: "G", label: "Professionalism" }, { id: "H", label: "Responsiveness" },
];

function avg(scores, ids) {
  const v = ids.map((k) => scores?.[k]).filter((x) => x !== undefined && x !== "" && x !== "na").map(Number);
  return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : "—";
}
// Products = (A..F) / 6, Services = (A..H) / 8 — N/A answers are left out.
export const avgProducts = (s) => avg(s, ["A", "B", "C", "D", "E", "F"]);
export const avgServices = (s) => avg(s, ["A", "B", "C", "D", "E", "F", "G", "H"]);

export const INTRO_TEMPLATE = (r) =>
  `Got Business? I would like to introduce you to each other.\n\n` +
  `${r.b?.name || "B"}${r.b?.business ? ` (${r.b.business})` : ""} — meet ${r.c?.name || "C"}${r.c?.business ? ` (${r.c.business})` : ""}.\n\n` +
  `I believe you could possibly collaborate and/or do business together.\n` +
  `I am using the onebigHUB.com 3-Way Introductions feature to automatically track our messages and referral status.\n` +
  `Please click on the link below to view the online profiles, evaluations, and other details of this potential connection.\n\n` +
  `${typeof window !== "undefined" ? window.location.origin : "https://onebigHUB.vercel.app"}/referrals/status?id=${encodeURIComponent(r.id)}\n\n` +
  `${r.a?.name || ""}`;

export function logEvent(r, entry) {
  const log = [...(r.log || []), { at: nowStamp(), ...entry }];
  return saveReferral({ ...r, log });
}

export { nowStamp, writeList };
