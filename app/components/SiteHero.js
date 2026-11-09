"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import IconNav, { MAIN_OF } from "./IconNav";
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

const CONN_ROW = [
  { key: "connect", label: "Connect with me !", href: "/connect", icon: "figConnect", connect: true },
  { key: "introductions", label: "Introductions", href: "/referrals", img: "/icons/introductions.png" },
  { key: "digest", label: "My Digest - Connections", href: "/connections/digest", icon: "figConnDigest" },
  { key: "details", label: "VIEW Profiles", href: "/connections", icon: "figViewProfile" },
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
  { key: "individual", label: "Individual Profiles", href: "/connections?type=individual", img: "/icons/fig/type-individual.png" },
  { key: "business", label: "Biz Profiles", href: "/connections?type=business", img: "/icons/fig/type-biz.png" },
  { key: "org", label: "Org Profiles", href: "/connections?type=org", img: "/icons/fig/type-org.png" },
  { key: "group", label: "Group Profiles", href: "/connections?type=group", img: "/icons/fig/type-group.png" },
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
  { key: "/advertising/barter", label: "Barter", href: "/advertising/barter", icon: "barter" },
];
const RATE_ROW = RATE_PAGES.map((p) => ({ key: `/advertising/${p.slug}`, label: p.title, href: `/advertising/${p.slug}`, icon: p.icon }));

const PRODUCT_TYPES = [
  { key: "Product", label: "Products", icon: "products" },
  { key: "Service", label: "Services", icon: "service" },
  { key: "Membership", label: "Memberships", icon: "membership" },
  { key: "Subscription", label: "Subscriptions", icon: "user" },
  { key: "Survey", label: "Surveys", icon: "document" },
].map((t) => ({ ...t, href: `/listings?type=${t.key}` }));

const pair = (digestLabel, digestSub, digestHref, editLabel, editSub, editHref) => [
  { key: "digest", label: digestLabel, sub: digestSub, href: digestHref, icon: "figDigest", inline: true },
  { key: "edit", label: editLabel, sub: editSub, href: editHref, icon: "figEdit", inline: true },
];

// Intro line under the rows: [red italic lead, rest].
const LINES = {
  "calendar:digest": ["Save Time !", "Select filters to curate events • Assign My Attendance Status for each event"],
  "connections:": ["Get Connected !", "Select filters to curate listings"],
  "connections:digest": ["Get Connected !", "Select filters to curate listings • Assign My Membership Status for each org / group"],
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
            className={`hsub-item ${active ? "on" : ""} ${it.connect ? "hsub-connect" : ""} ${it.inline ? "hsub-inline" : ""}`}>
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
  calendar: "calendar", connections: "connections", introductions: "introductions", earn: "earn",
  products: "products", discounts: "deals", employment: "careers", notifications: "notifications",
};
const PB_IMG = {
  calendar: "calendar", connections: "connections", connectMe: "introductions", megaphone: "earn",
  products: "products", discount: "deals", employment: "careers", notifications: "notifications",
};

// (<) and (>) step through the sections, wrapping around.
const SECTION_ORDER = [
  { key: "calendar", href: "/" },
  { key: "connections", href: "/connections" },
  { key: "introductions", href: "/referrals" },
  { key: "earn", href: "/advertising" },
  { key: "products", href: "/listings" },
  { key: "discounts", href: "/discounts" },
  { key: "employment", href: "/employment" },
  { key: "notifications", href: "/notifications" },
];

function PageBar({ title, icon, mode, section, gray }) {
  const i = Math.max(0, SECTION_ORDER.findIndex((x) => x.key === section));
  const prev = SECTION_ORDER[(i + SECTION_ORDER.length - 1) % SECTION_ORDER.length];
  const next = SECTION_ORDER[(i + 1) % SECTION_ORDER.length];
  return (
    <div className={`page-bar page-bar-${mode} ${gray ? "page-bar-gray" : ""}`}>
      <a href={prev.href} className="pb-nav" aria-label="Previous" data-tip="Previous">
        <Glyph name="pagePrev" size={30} />
      </a>
      <span className={`pb-icon ${mode === "edit" ? "pb-icon-dark" : ""}`}>
        {String(icon).startsWith("fig")
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
    <a href="/connect" className="connect-me" data-tip="Connect with me ! — scan my QR code, mini-card, messages">
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

  switch (MAIN_OF[section]) {
    case "calendar":
      rows.push(<SubRow key="cal" items={CAL_ROW} on={action} />);
      line = lineKey("calendar", action);
      break;
    case "connections": {
      const on = section === "introductions" ? "introductions" : action;
      rows.push(<SubRow key="conn" items={CONN_ROW} on={on} />);
      if (section === "introductions") {
        const cur = INTRO_ROW.find((r) => r.href === path)?.key;
        rows.push(<SubRow key="intro" items={INTRO_ROW} on={cur} variant="hsub-plain" />);
        line = lineKey("introductions");
      } else if (action === "connect") {
        // Connect with Me ! pages: row only, no intro line
      } else {
        if (action === "details" || action === "edit") rows.push(<SubRow key="prof" items={PROFILE_ROW} on={query.type} variant="hsub-gold" />);
        if (action !== "edit") line = lineKey("connections", action === "digest" ? "digest" : "");
      }
      break;
    }
    case "promote":
      rows.push(<SubRow key="promo" items={PROMO_ROW} on={section} />);
      if (section === "earn") {
        const isRate = RATE_ROW.some((r) => r.key === path);
        rows.push(<SubRow key="ads" items={ADS_ROW} on={isRate ? "rates" : path} />);
        if (isRate) rows.push(<SubRow key="rates" items={RATE_ROW} on={path} cols={4} variant="hsub-plain" />);
      } else if (section === "products") {
        rows.push(<SubRow key="types" items={PRODUCT_TYPES} on={query.type} />);
        rows.push(<SubRow key="pde" items={pair("My Digest", null, "/listings", "EDIT My Items", null, "/listings/submit")} on={action} cols={2} />);
        line = lineKey("products");
      } else if (section === "discounts") {
        rows.push(<SubRow key="dde" items={pair("My Digest - Deals", "Discount / Gift Certificates", "/discounts", "EDIT My Deals", "Discount / Gift Certificates", "/discounts/submit")} on={action} cols={2} />);
        line = lineKey("discounts");
      } else if (section === "employment") {
        rows.push(<SubRow key="ede" items={pair("My Digest - Careers / Jobs", null, "/employment", "EDIT My Employment Listings", null, "/employment/submit")} on={action} cols={2} />);
        line = lineKey("employment");
      } else if (section === "notifications") {
        rows.push(<SubRow key="nde" items={pair("My Digest - Notifications", null, "/notifications", "EDIT My Notifications", null, "/notifications#edit")} on={action} cols={2} />);
        line = lineKey("notifications");
      }
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
      <PageBar title={title} icon={barIcon} mode={mode} section={section} gray={current === "digest"} />

      <p className="hh-box hh-intro hh-oneline">
        <b className="hh-os">One-Stop</b> • <b className="hh-rb">Results-Based Marketing</b> • <b className="hh-rs">Revenue-Sharing System</b>
      </p>

      {tiles && <IconNav active={section} mode={mode} />}

      {tiles && rows}

      {tiles && !noLine && (line || intro) && (
        <p className="hh-box hsub-line">
          {line ? <><b><i>{line[0]}</i></b> {line[1]}</> : intro}
        </p>
      )}
    </div>
  );
}

// Small copy of the tiles + rows for one section — used on "Next Steps" to
// show where each next step lives (Cesar's Figma, Connect with Me !).
export function HubPreview({ section, action, path = "", line: showLine = true }) {
  const { rows, line } = rowsFor(section, action, path, {});
  return (
    <div className="hub-preview">
      <IconNav active={section} />
      {rows}
      {showLine && line && <p className="hh-box hsub-line"><b><i>{line[0]}</i></b> {line[1]}</p>}
    </div>
  );
}
