"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import IconNav, { MAIN_OF } from "./IconNav";
import { FIND_TYPES } from "./ListingTypeBox";
import HubLogo from "./HubLogo";
import { Glyph } from "./Icons";
import { RATE_PAGES } from "../lib/adRates";

// The top of EVERY page — Nov 7–8 (Cesar's Figma, "main headers, EDIT mode"):
//
//   (<) [icon] Page Title (>)          yellow bar; gray on EDIT and Digest pages
//   ( One-Stop • Results-Based Marketing • Revenue-Sharing System )
//   [3 main tiles]                     One Big Calendar · Connections · Promote & Earn
//   [sub-header row(s)]                that tile's pages; selected = gold + burgundy
//   ( intro line )                     e.g. "Get Connected ! Select filters …"
// "Connect with me !" also sits in the footer of every page.
//
// Change it here once and every page follows.

// ---- sub-header rows -------------------------------------------------------
// item: { key, label, sub?, href, icon? (Glyph) | img? (png in /public), connect? }

const CAL_ROW = [
  { key: "digest", label: "My Digest - Events", href: "/my-calendar", icon: "figDigest" },
  { key: "edit", label: "EDIT My Events", href: "/submit", icon: "figEdit" },
];

// Nov 9 (Cesar, "Revise sub-headers again"): VIEW Profiles first.
// Nov 15 (Cesar, Rev 261115): VIEW Profiles dropped — the Connections tile
// itself opens the profiles table.
const CONN_ROW = [
  // Nov 19 (Cesar, "Connect Headers"): white Connect with Me !, line icons, "My Digest  Connections"
  // Nov 20 (Cesar, mobile Figma): 2 x 2 — Connect with Me ! | My Digest / Introductions | EDIT My Profiles, larger text
  { key: "connect", label: "Connect with Me !", href: "/connect-with-me", icon: "figConnect", connect: true },
  { key: "digest", label: <>My Digest&nbsp;&nbsp;<i className="hsub-it">Connections</i></>, href: "/connect/digest", icon: "nodeGraph" },
  { key: "introductions", label: "Introductions", href: "/referrals", icon: "idxIntro" },
  { key: "edit", label: "EDIT My Profiles", href: "/profile", icon: "figEditProfile" },
];

const INTRO_ROW = [
  { key: "a", label: "A  ID Participants", href: "/referrals" },
  { key: "b", label: "B  Messages", href: "/referrals/message" },
  { key: "c", label: "C  First Evaluations", href: "/referrals/evaluations" },
  { key: "d", label: "D  Referral Status", href: "/referrals/status" },
  { key: "e", label: "E  Final Evaluations", href: "/referrals/evaluations#final" },
];

const PROFILE_ROW = [
  { key: "individual", label: "Individual Profiles", href: "/connect?type=individual", img: "/icons/fig/type-individual.png" },
  { key: "business", label: "Biz Profiles", href: "/connect?type=business", img: "/icons/fig/type-biz.png" },
  { key: "org", label: "Org Profiles", href: "/connect?type=org", img: "/icons/fig/type-org.png" },
  { key: "group", label: "Group Profiles", href: "/connect?type=group", img: "/icons/fig/type-group.png" },
];

const PROMO_ROW = [
  { key: "earn", label: <>onebig<b className="hh-hub">HUB</b></>, sub: "Ads, Events", href: "/advertising", img: "/icons/earn.png" },
  { key: "products", label: "Products,", sub: "Services ...", href: "/listings", img: "/icons/products.png" },
  { key: "discounts", label: "Deals", href: "/discounts", img: "/icons/deals.png" },
  { key: "employment", label: "Careers / Jobs", href: "/employment", img: "/icons/careers.png" },
  { key: "notifications", label: "Notifications", href: "/notifications", img: "/icons/notifications.png" },
];

const ADS_ROW = [
  { key: "/advertising/calculate", label: "Calculate", sub: "Ad Cost", href: "/advertising/calculate", icon: "calculate" },
  { key: "rates", label: "Rates", href: "/advertising/listings", icon: "discount" },
  { key: "/advertising/private-label", label: "Private-Label", sub: "Header", href: "/advertising/private-label", icon: "document" },
  { key: "/advertising/participation", label: "Event", sub: "Participation", href: "/advertising/participation", icon: "expo" },
];
const RATE_ROW = RATE_PAGES.map((p) => ({ key: `/advertising/${p.slug}`, label: p.title, href: `/advertising/${p.slug}`, icon: p.icon }));

// Nov 9 (Cesar, "Promote & Earn"): + Classifieds and Announcements.
const PRODUCT_TYPES = [
  { key: "Product", label: "Products", icon: "idxProduct" },
  { key: "Service", label: "Services", icon: "idxService" },
  { key: "Classified", label: "Classifieds", icon: "idxClassified" },
  { key: "Membership", label: "Memberships", icon: "idxMembership" },
  { key: "Subscription", label: "Subscriptions", icon: "idxSubscription" },
].map((t) => ({ ...t, href: `/listings?type=${t.key}` }));
const PRODUCT_ROW3 = [
  { key: "Survey", label: "Surveys", icon: "idxSurvey", href: "/listings?type=Survey" },
  { key: "Announcement", label: "Announcements", icon: "idxAnnounce", href: "/listings?type=Announcement" },
  { key: "digest", label: "My Digest", icon: "idxProduct", href: "/listings", wide: true },
  { key: "edit", label: "EDIT My Items", icon: "idxProductEdit", href: "/listings/submit", wide: true },
];

// Promote & Earn (Cesar Rev 261116): intro box + "Select one at a time" menu
// replaces the old sub-header rows on every Promote & Earn page.
// Nov 18 (Rev 261118): Achieve replaces Promote & Earn; One Big Table / My
// Custom Digest / EDIT My Listings moved to Find's filter column.
const PROMO_MENU = [
  [
    { key: "system", label: "Performance-Based Marketing System", href: "/advertising", icon: "megaphone" },
    { key: "calculate", label: "Calculate Advertising Cost", href: "/advertising/calculate", icon: "calculate" },
  ],
  [
    { key: "rates", label: <>Rates <i>Win-Win Opportunities</i></>, href: "/advertising/rates", icon: "dollarCircle" },
    { key: "events", label: <>Participate in onebig<span className="cw-red">HUB</span> Events</>, href: "/advertising/participation", icon: "idxSparkle" },
    { key: "private", label: "Your Private-Labeled Main Header", href: "/advertising/private-label", icon: "editMode" },
  ],
];
function promoKey(section, action, path) {
  if (path.startsWith("/advertising/calculate")) return "calculate";
  if (path.startsWith("/advertising/barter")) return "events";
  if (path.startsWith("/advertising/private-label")) return "private";
  if (["/advertising/participation", "/advertising/expos", "/advertising/dinners", "/advertising/workshops"].some((x) => path.startsWith(x))) return "events";
  if (path.startsWith("/advertising/") ) return "rates";
  if (path === "/advertising") return "system";
  if (path.startsWith("/listings/digest") || action === "digest") return "digest";
  if (path.endsWith("/submit") || action === "edit") return "edit";
  return "table";
}
function PromoMenu({ on }) {
  return (
    <>
      <nav className="pm-menu" aria-label="Achieve">
        {PROMO_MENU.map((col, ci) => (
          <div key={ci} className="pm-col">
            <i className="pm-hint">{ci === 0 ? "Select one at a time" : "\u00a0"}</i>
            {col.map((it) => (
              <a key={it.key} href={it.href} className={`pm-item ${on === it.key ? "on" : ""}`} aria-current={on === it.key ? "page" : undefined}>
                <span className="pm-o">{on === it.key ? "●" : "o"}</span><Glyph name={it.icon} size={16} /><span>{it.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
      {/* Nov 19 (Cesar, Achieve): the Profit-Sharing box sits BELOW the two menu boxes */}
      <p className="hh-box pm-intro">
        <b>onebig<span className="cw-red">HUB</span></b> Profit-Sharing from Advertising, Introductions / Referrals, and Sales<br />
        <b className="cw-red">No-Cost</b> and <b>Premier</b> opportunities to promote your listings, businesses, organizations, and groups
      </p>
    </>
  );
}

// Find pages without a filter column (Event Details, RSVP, EDIT pages) get the
// same two choices the filter column shows on One Big Table / My Custom Digest.
const FIND_FILTER_PAGES = ["/calendar", "/my-calendar", "/listings", "/listings/digest", "/employment", "/discounts", "/notifications"];
function FindMenu({ path, query }) {
  const typeId = path.startsWith("/employment") ? "Careers" : path.startsWith("/discounts") ? "Deals"
    : path.startsWith("/listings") ? query.type || null : "Calendar";
  const t = FIND_TYPES.find((x) => x.id === typeId) || { table: "/listings", digest: "/listings/digest", edit: "/listings/submit" };
  const view = path.endsWith("/submit") || path.endsWith("/edit") ? "edit" : path.includes("digest") || path === "/my-calendar" ? "digest" : "table";
  const views = [["table", "One Big Table", "idxListings"], ["digest", "My Custom Digest", "idxDigestImg"], ["edit", "EDIT My Listings", "editMode"]];
  return (
    <nav className="pm-menu find-menu" aria-label="Find">
      <div className="pm-col">
        <i className="pm-hint">Select one</i>
        {views.map(([k, label, icon]) => (
          <a key={k} href={t[k]} className={`pm-item ${view === k ? "on" : ""}`}><span className="pm-o">{view === k ? "●" : "o"}</span><Glyph name={icon} size={16} /><span>{label}</span></a>
        ))}
      </div>
      <div className="pm-col find-types">
        <i className="pm-hint"><b>Listings</b> Select one</i>
        <div className="find-types-grid">
          {FIND_TYPES.map((x) => (
            <a key={x.id} href={x.table} className={`pm-item ${typeId === x.id ? "on" : ""}`}><span className="pm-o">{typeId === x.id ? "●" : "o"}</span>
              {x.img ? <img src={x.img} alt="" width="16" height="16" /> : <Glyph name={x.icon} size={16} />}<span>{x.label}</span></a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Info (Nov 9 Figma): Index, Icons · About Us · Contact Us · Legal Docs.
const INFO_ROW = [
  { key: "index", label: "Index, Icons", href: "/info", icon: "idxMenu" },
  { key: "about", label: "About Us", href: "/info/about", icon: "idxStore" },
  { key: "contact", label: "Contact Us", href: "/info/contact", icon: "idxPhone" },
  { key: "legal", label: "Legal Docs", href: "/info/legal", icon: "idxScale" },
];
const LEGAL_ROW = [
  { key: "/info/terms", label: "Terms and Conditions", href: "/info/terms", icon: "idxTerms" },
  { key: "/info/privacy", label: "Privacy Policy", href: "/info/privacy", icon: "idxPrivacy" },
  { key: "/info/child-safety", label: "Child Safety Policy", href: "/info/child-safety", icon: "idxShield" },
];

const pair = (digestLabel, digestSub, digestHref, editLabel, editSub, editHref) => [
  { key: "digest", label: digestLabel, sub: digestSub, href: digestHref, icon: "figDigest", inline: true },
  { key: "edit", label: editLabel, sub: editSub, href: editHref, icon: "figEdit", inline: true },
];

// Intro line under the rows: [red italic lead, rest].
const LINES = {
  "calendar:digest": ["Save Time !", "Select filters to curate events • Assign My Attendance Status for each event"],
  "connections:": ["Get Connected !", <i key="c">Select filters to curate listings</i>],
  "connections:connect": ["Get Connected !", <i key="c">Offer before you receive • A little courtesy goes a long way !</i>],
  "connections:digest": ["Get Connected !", <i key="c">Select filters to curate listings&nbsp;&nbsp;•&nbsp;&nbsp;Assign My Membership Status for each org / group</i>],
  "introductions:": ["Get Paid", "for Introductions / Referrals that convert to business and/or a beneficial connection"],
  "products:": ["Get Paid !", "Promote your items here • No-Cost and Premier Listings Available"],
  "discounts:": ["Everyone loves a good deal !", "Distribute certificates as gifts, incentives, raffle prizes, and rewards !"],
  "employment:": ["Get Hired !", "Select filters to curate listings • Assign My Application Status for each listing"],
  "notifications:": ["Get Noticed !", "Promote your events, products, services • No-Cost and Premier Listings Available"],
};

function SubRow({ items, on, cols, variant = "" }) {
  return (
    <nav className={`hsub hsub-${cols || items.length} ${variant}`} aria-label="Section pages">
      {items.map((it) => {
        const active = on === it.key;
        return (
          <a key={it.key} href={it.href} aria-current={active ? "page" : undefined}
            className={`hsub-item ${active ? "on" : ""} ${it.connect ? "hsub-connect" : ""} ${it.inline ? "hsub-inline" : ""} ${it.wide ? "hsub-wide" : ""}`}>
            {it.img ? <img src={it.img} alt="" width="20" height="20" />
              : it.icon ? <Glyph name={it.icon} size={18} /> : null}
            <span className="hsub-text">
              <span className="hsub-label">{it.label}</span>
              {it.sub && <span className="hsub-sub">{it.sub}</span>}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

// Page-bar icon per section (Tarek's colorized set).
const SECTION_IMG = {
  calendar: "calendar", connections: "connections", introductions: "introductions", earn: "achieve",
  products: "products", discounts: "deals", employment: "careers", notifications: "notifications",
};
const PB_IMG = {
  calendar: "calendar", connections: "connections", connectMe: "introductions", megaphone: "achieve",
  products: "products", discount: "deals", employment: "careers", notifications: "notifications",
};

// (<) and (>) step through the sections, wrapping around.
const SECTION_ORDER = [
  { key: "calendar", href: "/calendar" },
  { key: "connections", href: "/connect" },
  { key: "introductions", href: "/referrals" },
  { key: "earn", href: "/advertising" },
  { key: "products", href: "/listings" },
  { key: "discounts", href: "/discounts" },
  { key: "employment", href: "/employment" },
  { key: "notifications", href: "/notifications" },
];

function PageBar({ title, icon, mode, section, gray, typeIcon }) {
  const i = Math.max(0, SECTION_ORDER.findIndex((x) => x.key === section));
  const prev = SECTION_ORDER[(i + SECTION_ORDER.length - 1) % SECTION_ORDER.length];
  const next = SECTION_ORDER[(i + 1) % SECTION_ORDER.length];
  return (
    <div className={`page-bar page-bar-${mode} ${gray ? "page-bar-gray" : ""}`}>
      <a href={prev.href} className="pb-nav" aria-label="Previous" data-tip="Previous">
        <Glyph name="pagePrev" size={30} />
      </a>
      <span className={`pb-icon ${mode === "edit" ? "pb-icon-dark" : ""}`}>
        {typeIcon
          ? (PB_IMG[typeIcon] ? <img src={`/icons/${PB_IMG[typeIcon]}.png`} alt="" width="48" height="48" /> : <Glyph name={typeIcon} size={44} />)
          : String(icon).startsWith("fig")
          ? <Glyph name={icon} size={40} />
          : mode !== "edit" && SECTION_IMG[section]
          ? <img src={`/icons/${SECTION_IMG[section]}.png`} alt="" width="48" height="48" />
          : icon === "hub"
          ? <HubLogo size={mode === "edit" ? 34 : 48} />
          : mode !== "edit" && PB_IMG[icon]
          ? <img src={`/icons/${PB_IMG[icon]}.png`} alt="" width="48" height="48" />
          : <Glyph name={icon} size={mode === "edit" ? 34 : 44} />}
      </span>
      <h1>{title}</h1>
      <a href={next.href} className="pb-nav" aria-label="Next" data-tip="Next">
        <Glyph name="pageNext" size={30} />
      </a>
    </div>
  );
}

// Bright yellow "Connect with me !" button (footer of every page, and first
// box in the Connections row).
export function ConnectWithMe() {
  return (
    <a href="/connect-with-me" className="connect-me" data-tip="Connect with me ! — scan my QR code, mini-card, messages">
      <Glyph name="figConnect" size={26} />
      <b><i>Connect with me !</i></b>
    </a>
  );
}

// Which rows + line a page shows. Pages pass `section` and `activeAction`.
function rowsFor(section, action, path, query) {
  const rows = [];
  let line = null;
  const lineKey = (s, a) => LINES[`${s}:${a || ""}`] || null;

  if (section === "info") {
    const sub = path.startsWith("/info/about") ? "about" : path.startsWith("/info/contact") ? "contact"
      : ["/info/legal", "/info/terms", "/info/privacy", "/info/child-safety"].some((p) => path.startsWith(p)) ? "legal" : "index";
    rows.push(<SubRow key="info" items={INFO_ROW} on={sub} />);
    if (sub === "legal") rows.push(<SubRow key="legal" items={LEGAL_ROW} on={path === "/info/legal" ? "/info/terms" : path} cols={3} />);
    return { rows, line };
  }

  switch (MAIN_OF[section]) {
    case "calendar":
      // Find (Nov 18): the One Big Table / My Custom Digest / EDIT and Listings
      // choices live in the filter column; other Find pages show them here.
      // Nov 19: details pages (/listings/x, /employment/x, /discounts/x) carry their own Filters bar
      const isDetail = /^\/(listings|employment|discounts)\/(?!submit|digest)[^/]+$/.test(path);
      if (!FIND_FILTER_PAGES.includes(path) && !isDetail) rows.push(<FindMenu key="find" path={path} query={query} />);
      break;
    case "connections": {
      const on = section === "introductions" ? "introductions" : action;
      rows.push(<SubRow key="conn" items={CONN_ROW} on={on} cols={2} variant="hsub-conn2" />);
      if (section === "introductions") {
        // Nov 15 (Rev 261115): no A–E row — the steps list sits in the page.
        line = lineKey("introductions");
      } else if (action === "connect") {
        line = lineKey("connections", "connect");
      } else {
        if (action === "details") rows.push(<SubRow key="prof" items={PROFILE_ROW} on={query.type} variant="hsub-gold" />);
        if (action !== "edit" && action !== "view") line = lineKey("connections", action === "digest" ? "digest" : "");
      }
      break;
    }
    case "promote":
      rows.push(<PromoMenu key="pm" on={promoKey(section, action, path)} />);
      line = null;
      break;
    default:
      break;
  }
  return { rows, line };
}

export default function SiteHero({
  section,              // page section: calendar | connections | introductions | earn | products | discounts | employment | notifications | null
  mode = "output",      // "output" | "edit"
  title,
  icon,
  activeAction,         // which sub box is the current page ("details" | "digest" | "edit")
  intro,                // intro line for pages without one of Cesar's default lines
  noLine = false,       // hide the intro line
  tiles = true,         // false: title bar + tagline only (Registration pages)
  typeIcon,             // Find listing-type icon; wins over the section image
}) {
  const path = usePathname() || "/";
  const [query, setQuery] = useState({});
  useEffect(() => {
    try { setQuery(Object.fromEntries(new URLSearchParams(window.location.search))); } catch {}
  }, [path]);
  const current = activeAction || (mode === "edit" ? "edit" : null);
  const barIcon = icon || (mode === "edit" ? "editMode" : "hub");
  const { rows, line } = rowsFor(section, current, path, query);

  return (
    <div className={`site-hero site-hero-${mode}`}>
      <PageBar title={title} icon={barIcon} mode={mode} section={section} gray={current === "digest"} typeIcon={typeIcon} />

      <p className="hh-box hh-intro hh-oneline">
        {/* Nov 9 (Cesar, flyer): new tagline. Old: One-Stop • Results-Based Marketing • Revenue-Sharing System */}
        <b className="hh-rb">Your Performance-Based</b> <b className="hh-rs">Marketing System</b>
      </p>

      {tiles && <IconNav active={section} mode={mode} />}

      {tiles && rows}

      {tiles && !noLine && (line || intro) && (
        <p className="hh-box hsub-line">
          {line ? <><b className="hsub-lead"><i>{line[0]}</i></b>{" "}{line[1]}</> : intro}
        </p>
      )}
    </div>
  );
}

// Small copy of the tiles + rows for one section — used on "Next Steps" to
// show where each next step lives (Cesar's Figma, Connect with Me !).
// Single rows for the Connect with Me ! Next Steps page (Figma Nov 9).
export function PreviewRow({ kind }) {
  if (kind === "profiles") return <SubRow items={PROFILE_ROW} variant="hsub-plain" />;
  if (kind === "connectIntro") return <div className="hsub-center"><SubRow items={CONN_ROW.filter((r) => r.key === "connect" || r.key === "introductions")} on="connect" /></div>;
  if (kind === "promo") return <><SubRow items={PROMO_ROW} on="earn" /><SubRow items={ADS_ROW} /></>;
  return null;
}

export function HubPreview({ section, action, path = "", line: showLine = true }) {
  const { rows, line } = rowsFor(section, action, path, {});
  return (
    <div className="hub-preview">
      <IconNav active={section} />
      {rows}
      {showLine && line && <p className="hh-box hsub-line"><b className="hsub-lead"><i>{line[0]}</i></b>{" "}{line[1]}</p>}
    </div>
  );
}
