"use client";

import { Glyph } from "./Icons";
import { Box } from "./FilterKit";

// Achieve top (Cesar's Figma, Nov 27): the One Big Table / My Custom Digest /
// EDIT My Listings row, then the Filters grid, then the Profit-Sharing line.
// Replaces the "Select one at a time" menu and the Find / Connect / Achieve tiles
// on the Achieve page only.
export const FILTER_COLUMNS = [
  [["Calendar (Default)", "/calendar", "calendar"], ["Employment", "/employment", "idxBriefcase"], ["Products", "/listings?type=Product", "idxProduct"], ["Services", "/listings?type=Service", "idxService"]],
  [["Classifieds", "/listings?type=Classified", "idxClassified"], ["Deals", "/discounts", "discount"], ["Forums", "/listings?type=Forum", "comments"], ["Hospitality", "/listings?type=Hospitality", "dinner"], ["Investments", "/listings?type=Investment", "idxDeal"]],
  [["Memberships", "/listings?type=Membership", "idxMembership"], ["Notifications", "/notifications", "idxBell"], ["Pay-It-Forward", "/listings?type=Pay-It-Forward", "idxHeart"], ["Subscriptions", "/listings?type=Subscription", "idxSubscription"], ["Surveys", "/listings?type=Survey", "idxSurvey"]],
];

const VIEWS = [
  { label: "One Big Table", def: true, href: "/listings", icon: "idxListings" },
  { label: "My Custom Digest", href: "/listings/digest", icon: "idxDigestImg" },
  { label: "EDIT My Listings", href: "/listings/submit", icon: "editMode" },
];

export function AchieveViews() {
  return (
    <nav className="ach-views" aria-label="Views">
      {VIEWS.map((v) => (
        <a key={v.label} href={v.href} className="ach-view">
          <Glyph name={v.icon} size={16} />
          <span>{v.label}{v.def && <em className="ns-default"> Default</em>}</span>
        </a>
      ))}
    </nav>
  );
}

export function AchieveFilters() {
  return (
    <Box title="Filters" hint="Select one" className="ach-filter-box">
    <div className="pe-chips ach-filters" aria-label="Filters">
      {FILTER_COLUMNS.map((col, ci) => (
        <div key={ci} className="pe-chip-col">
          {col.map(([label, href, icon]) => (
            <label key={label} className={`pe-chip ${label === "Memberships" ? "ach-red" : ""}`}>
              <input type="radio" name="ach-filter" value={label} defaultChecked={label.startsWith("Calendar")} aria-label={label} />
              {icon === "calendar" ? <img src="/icons/calendar.png" alt="" width="18" height="18" /> : <Glyph name={icon} size={18} />}
              <a href={href}>{label}</a>
            </label>
          ))}
        </div>
      ))}
    </div>
    </Box>
  );
}

export default function AchieveTop() {
  return (
    <>
      <AchieveViews />
      <AchieveFilters />
      <p className="hh-box pm-intro">
        <b>onebig<span className="cw-red">HUB</span></b> Profit-Sharing from Advertising, Introductions / Referrals, and Sales<br />
        <b className="cw-red">No-Cost</b> and <b>Premier</b> opportunities to promote your listings, businesses, organizations, and groups
      </p>
    </>
  );
}
