// Employment filter taxonomy — mirrors Cesar's "Employment / Display Filters" wireframe.
import { REGION_GROUPS, regionMatch } from "./taxonomy";

export { REGION_GROUPS };

export const COMP_OPTIONS = [
  { id: "none", label: "No Response" },
  { id: "volunteer", label: "Volunteer" },
  { id: "hourly", label: "$ per hour" },
  { id: "monthly", label: "$ per month" },
  { id: "yearly", label: "$ per year" },
];

export const SORT_OPTIONS = [
  { id: "comp", label: "Min. Compensation / Salary" },
  { id: "posted", label: "Date Posted" },
  { id: "company", label: "Company" },
  { id: "title", label: "Position Title" },
  { id: "level", label: "Employment Level" },
  { id: "type", label: "Employment Type" },
  { id: "industry", label: "Industry" },
  { id: "city", label: "City" },
  { id: "region", label: "Region" },
];

export const DATE_POSTED_OPTIONS = [
  { id: "all", label: "All", def: false },
  { id: "today", label: "Today" },
  { id: "7", label: "Past 7 days", def: true },
  { id: "15", label: "Past 15 days" },
  { id: "30", label: "Past 30+ days" },
  { id: "custom", label: "MM/DD/YY - MM/DD/YY" },
];

export const EMPLOYMENT_LEVELS = [
  "Founder, Owner", "C-Level Executive", "Executive", "Management", "Staff",
];

export const EMPLOYMENT_TYPES = [
  "Hybrid", "In-Person", "Remote", "Contract", "Fixed Term", "Focus Study", "FT Full-Time",
  "PT Part-Time", "Affiliate", "Consultant", "Contractor", "Employee",
  "Entrepreneur", "Freelance", "Intern", "Volunteer",
];

export const INDUSTRIES = [
  "Advocacy, Political", "Automotive", "Beauty", "Business", "Community",
  "Construction", "Consumer Services", "Diversity", "Education", "Entertainment",
  "Fashion", "Financial", "Food & Beverage", "Government", "Healthcare",
  "Hospitality", "Information", "Insurance", "Manufacturing", "Media, Advertising",
  "Natural Resources, Mining", "Non Profit", "Professional Services", "Retail",
  "Science", "Technology", "Trades", "Transportation", "Utilities", "Other",
];

// Nov 20 (Cesar, "Classifieds" email — Employment): Format split out of Type.
export const FORMAT_OPTIONS = ["Hybrid", "In-Person", "Remote"];
export const TYPE_OPTIONS = [
  "Contract", "Focus Study",
  { id: "FT Full-Time", label: <>F/T <i>Full-Time</i></> }, { id: "PT Part-Time", label: <>P/T <i>Part-Time</i></> },
  "Affiliate", "Consultant", "Contractor", "Employee", "Entrepreneur", { id: "Freelance", label: "Freelancer" }, "Intern", "Volunteer",
];
export const LEVEL_OPTIONS = [
  { id: "Founder, Owner", label: "Founder / Owner" }, "C-Level Executive", "Executive", "Management", "Staff",
];
export const REFERRAL_OPTIONS = [{ id: "no", label: "No" }, { id: "yes", label: "Yes" }];

export const EMPTY_JOB_FILTERS = {
  referrals: [], format: [], categories: [],
  adtype: [],
  comp: [],
  level: [],
  type: [],
  region: [],
  industry: [],
  posted: "7",
  sort: "posted",
};

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function postedDate(j) {
  const [y, m, d] = String(j.posted || "").split("-").map(Number);
  if (!y) return null;
  return new Date(y, m - 1, d);
}

const SECTION_TESTS = {
  adtype: (j, f) => !f.adtype?.length || f.adtype.includes(j.premier ? "premier" : "regular"),
  referrals: (j, f) => !f.referrals?.length || f.referrals.includes(j.referral ? "yes" : "no"),
  format: (j, f) => !f.format?.length || (j.types || []).some((t) => f.format.includes(t)),
  categories: (j, f) => !f.categories?.length || (j.categories || []).some((c) => f.categories.includes(c)),
  comp: (j, f) => !f.comp.length || f.comp.includes(j.compType),
  level: (j, f) => !f.level.length || f.level.includes(j.level),
  type: (j, f) => !f.type.length || (j.types || []).some((t) => f.type.includes(t)),
  region: (j, f) => regionMatch(f.region, j.region),
  industry: (j, f) => !f.industry.length || f.industry.includes(j.industry),
  posted: (j, f, today) => {
    if (f.posted === "all") return true;
    const d = postedDate(j);
    if (!d) return false;
    if (f.posted === "custom") {
      if (f.postedFrom && j.posted < f.postedFrom) return false;
      if (f.postedTo && j.posted > f.postedTo) return false;
      return true;
    }
    const t = startOfDay(today);
    const diff = Math.round((t - d) / 86400000);
    if (f.posted === "today") return diff === 0;
    if (f.posted === "30") return diff >= 0;
    return diff >= 0 && diff <= Number(f.posted);
  },
};

export function jobMatches(j, f, today = new Date(), except = null, q = "") {
  for (const key of Object.keys(SECTION_TESTS)) {
    if (key === except) continue;
    if (!SECTION_TESTS[key](j, f, today)) return false;
  }
  if (q) {
    const hay = `${j.title} ${j.company} ${j.city} ${j.industry}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function countJobsFor(jobs, f, section, patch, today, q) {
  const trial = { ...f, ...patch };
  return jobs.filter((j) => jobMatches(j, trial, today, null, q)).length;
}

const SORTERS = {
  comp: (a, b) => (b.compMax || 0) - (a.compMax || 0),
  posted: (a, b) => String(b.posted).localeCompare(String(a.posted)),
  company: (a, b) => (a.company || "").localeCompare(b.company || ""),
  title: (a, b) => (a.title || "").localeCompare(b.title || ""),
  level: (a, b) => (a.level || "").localeCompare(b.level || ""),
  type: (a, b) => (a.types?.[0] || "").localeCompare(b.types?.[0] || ""),
  industry: (a, b) => (a.industry || "").localeCompare(b.industry || ""),
  city: (a, b) => (a.city || "").localeCompare(b.city || ""),
  region: (a, b) => (a.region || "").localeCompare(b.region || ""),
};

export function sortJobs(list, sortId) {
  const fn = SORTERS[sortId] || SORTERS.posted;
  return [...list].sort(fn);
}
