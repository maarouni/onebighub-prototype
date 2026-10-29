"use client";

import IconNav from "./IconNav";
import HubLogo from "./HubLogo";
import { Glyph } from "./Icons";

// The top of EVERY page, from Cesar's Oct 19 revisions ("most pages are
// templates — change the library and all similar pages follow"):
//
//   (<) [icon] Page Title (>)          yellow bar; gray on EDIT pages
//   ( Results-Based • One-Stop … )      one-line white box
//   [8 hub tiles, 4 × 2]                Calendar … Custom Notifications
//   [section action boxes]              Digest / EDIT (EDIT box turns gray on edit pages)
// "Connect with me !" sits in the footer at the bottom of every page.
//
// Change it here once and every page follows.

// Oct 28 (Cesar's Figma Rev 261028): Introductions and EARN with Advertising
// are now main tiles, so each section's action row is just its own pages.
export const SECTION_ACTIONS = {
  calendar: [
    { key: "digest", icon: "calendar", label: "My Calendar Digest", href: "/my-calendar" },
    { key: "edit", icon: "editMode", label: "EDIT My Events", href: "/submit", dark: true },
  ],
  discounts: [
    { key: "digest", icon: "discount", label: "My Certificates Digest", href: "/discounts" },
    { key: "edit", icon: "editMode", label: "EDIT My Certificates", href: "/discounts/submit", dark: true },
  ],
  connections: [
    { key: "digest", icon: "connections", label: "My Connections Digest", href: "/connections" },
    { key: "details", icon: "viewMode", label: "VIEW Profile(s)", href: "/connections#results" },
    { key: "edit", icon: "editMode", label: "EDIT My Profile(s)", href: "/profile", dark: true },
  ],
  employment: [
    { key: "digest", icon: "employment", label: "My Employment Digest", href: "/employment" },
    { key: "edit", icon: "editMode", label: "EDIT My Employment Listings", href: "/employment/submit", dark: true },
  ],
  products: [
    { key: "digest", icon: "products", label: "My Other Listings Digest", href: "/listings" },
    { key: "edit", icon: "editMode", label: "EDIT My Other Listings", href: "/listings/submit", dark: true },
  ],
  notifications: [
    { key: "digest", icon: "notifications", label: "My Notifications Digest", href: "/notifications" },
    { key: "edit", icon: "editMode", label: "EDIT My Notifications", href: "/notifications", dark: true },
  ],
};

// (<) and (>) step through the sections in tile order (Oct 28 Figma), wrapping around.
const SECTION_ORDER = [
  { key: "calendar", href: "/", label: "One Big Calendar" },
  { key: "connections", href: "/connections", label: "Connections" },
  { key: "introductions", href: "/referrals", label: "Introductions" },
  { key: "earn", href: "/advertising", label: "EARN with Advertising" },
  { key: "products", href: "/listings", label: "Products, Services ..." },
  { key: "discounts", href: "/discounts", label: "Deals" },
  { key: "employment", href: "/employment", label: "Careers / Jobs" },
  { key: "notifications", href: "/notifications", label: "Custom Notifications" },
];

// Page-bar icons use Tarek's colorized set where one exists (Cesar, Oct 28).
const PB_IMG = {
  calendar: "calendar", connections: "connections", connectMe: "introductions", megaphone: "earn",
  products: "products", discount: "deals", employment: "careers", notifications: "notifications",
};

function PageBar({ title, icon, mode, section }) {
  const i = Math.max(0, SECTION_ORDER.findIndex((x) => x.key === section));
  const prev = SECTION_ORDER[(i + SECTION_ORDER.length - 1) % SECTION_ORDER.length];
  const next = SECTION_ORDER[(i + 1) % SECTION_ORDER.length];
  return (
    <div className={`page-bar page-bar-${mode}`}>
      <a href={prev.href} className="pb-nav" aria-label={`Previous: ${prev.label}`} data-tip={prev.label}>
        <Glyph name="prev" size={14} strokeWidth={2.2} />
      </a>
      <span className={`pb-icon ${mode === "edit" ? "pb-icon-dark" : ""}`}>
        {icon === "hub"
          ? <HubLogo size={mode === "edit" ? 34 : 48} />
          : mode !== "edit" && PB_IMG[icon]
          ? <img src={`/icons/${PB_IMG[icon]}.png`} alt="" width="48" height="48" />
          : <Glyph name={icon} size={mode === "edit" ? 34 : 44} />}
      </span>
      <h1>{title}</h1>
      <a href={next.href} className="pb-nav" aria-label={`Next: ${next.label}`} data-tip={next.label}>
        <Glyph name="next" size={14} strokeWidth={2.2} />
      </a>
    </div>
  );
}

// Oct 27 meeting: a bright yellow "Connect with me !" button at the bottom of
// every page (it lives in the site footer, so it's on all pages).
export function ConnectWithMe() {
  return (
    <a href="/profile#qr" className="connect-me" data-tip="Connect with me ! — mini-card, elevator pitch, QR code">
      <Glyph name="connectMe" size={20} />
      <b><i>Connect with me !</i></b>
    </a>
  );
}

export default function SiteHero({
  section,              // "calendar" | "discounts" | "connections" | "employment" | "notifications" | null
  mode = "output",      // "output" | "edit"
  title,
  icon,
  activeAction,         // which action box is the current page ("details" | "digest" | "edit")
  detailsHref,          // overrides the Details box link (e.g. first selected listing)
  secondRow,            // replaces the action row (e.g. the advertising pages' own row)
}) {
  const key = SECTION_ACTIONS[section] ? section : null;
  const actions = key ? SECTION_ACTIONS[key].map((a) => (a.key === "details" && detailsHref ? { ...a, href: detailsHref } : a)) : [];
  const current = activeAction || (mode === "edit" ? "edit" : null);
  const barIcon = icon || (mode === "edit" ? "editMode" : "hub");

  return (
    <div className="site-hero">
      <PageBar title={title} icon={barIcon} mode={mode} section={section} />

      <p className="hh-box hh-intro hh-oneline">
        <b className="hh-rb">Results-Based</b> • One-Stop Marketing &amp; Revenue-Sharing System
      </p>

      <IconNav active={section} mode={mode} />

      {secondRow || (actions.length > 0 && (
        <nav className={`hh-actions hh-actions-${actions.length}`} aria-label="Section pages">
          {actions.map((a) => (
            <a key={a.key} href={a.href} aria-current={current === a.key ? "page" : undefined}
              className={`hh-box hh-action ${a.dark ? "hh-action-dark" : ""} ${current === a.key ? "hh-action-on" : ""}`}>
              <span className="hh-action-icon"><Glyph name={a.icon} size={30} /></span>
              <span>{a.label}</span>
            </a>
          ))}
        </nav>
      ))}
    </div>
  );
}
