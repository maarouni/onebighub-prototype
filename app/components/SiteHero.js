"use client";

import { useState } from "react";
import IconNav from "./IconNav";
import { Glyph } from "./Icons";
import CollapseArrow from "./CollapseArrow";

// The top of EVERY page, from Cesar's Oct 19 revisions ("most pages are
// templates — change the library and all similar pages follow"):
//
//   (<) [icon] Page Title (>)          yellow bar; gray on EDIT pages
//   ┌ Innovative, Results-Based … ┐    white box, collapsible
//   [5 section tiles]                   row 1
//   [4 section action boxes]            row 2 (EDIT box turns gray on edit pages)
//   [ ⇄ Connect with me ! ]             yellow bar
//
// Change it here once and every page follows.

const EARN = { key: "earn", icon: "megaphone", label: "Earn with Advertising", href: "/advertising" };

export const SECTION_ACTIONS = {
  calendar: [
    { key: "details", icon: "viewMode", label: "Event Details", href: "/#results" },
    { key: "digest", icon: "calendar", label: "My Calendar Digest", href: "/my-calendar" },
    { key: "edit", icon: "editMode", label: "EDIT My Event Details", href: "/submit", dark: true },
    EARN,
  ],
  discounts: [
    { key: "details", icon: "viewMode", label: "Discount / Gift Certificate Details", href: "/discounts#results" },
    { key: "digest", icon: "discount", label: "My Disc. / Gift Certificates Digest", href: "/discounts" },
    { key: "edit", icon: "editMode", label: "EDIT My Discount / Gift Certificates", href: "/discounts/submit", dark: true },
    EARN,
  ],
  connections: [
    { key: "details", icon: "viewMode", label: "Connections Details", href: "/connections#results" },
    { key: "digest", icon: "connections", label: "My Connections Digest", href: "/connections" },
    { key: "edit", icon: "editMode", label: "EDIT My Connections Details", href: "/connections/submit", dark: true },
    EARN,
  ],
  employment: [
    { key: "details", icon: "viewMode", label: "Employment Details", href: "/employment#results" },
    { key: "digest", icon: "employment", label: "My Employment Digest", href: "/employment" },
    { key: "edit", icon: "editMode", label: "EDIT My Employment Listings", href: "/employment/submit", dark: true },
    EARN,
  ],
  products: [
    { key: "details", icon: "viewMode", label: "Listing Details", href: "/listings#results" },
    { key: "digest", icon: "products", label: "My Other Listings Digest", href: "/listings" },
    { key: "edit", icon: "editMode", label: "EDIT My Other Listings", href: "/listings/submit", dark: true },
    EARN,
  ],
  notifications: [
    { key: "details", icon: "viewMode", label: "Notification Details", href: "/notifications" },
    { key: "digest", icon: "notifications", label: "My Notifications & Subscriptions", href: "/notifications" },
    { key: "edit", icon: "editMode", label: "EDIT My Notifications", href: "/notifications", dark: true },
    EARN,
  ],
};

// Second line(s) of the white hero box, per section and page mode.
const HERO_LINES = {
  default: [<><b>Curate</b> specific listings by selecting sets of filters</>, <>Includes several <b><i>innovative</i></b> custom features</>],
  edit: {
    calendar: ["What is your Cost of Acquisition of a new attendee / guest ?", <>Promote your <b>Events</b> here !</>],
    discounts: ["What is your Cost of Acquisition of a new client / customer ?", <>Promote your <b>Discount / Gift Certificates</b> here !</>],
    connections: ["What is your Cost of Acquisition of a new client / customer / member ?", <>Manage and promote your <b>Connections</b> here !</>],
    employment: ["What is your Cost of Acquisition of a new hire ?", <>Promote your <b>Employment Listings</b> here !</>],
    products: ["What is your Cost of Acquisition of a new client / customer / member ?", <>Promote your <b>Products, Services, Memberships</b> here !</>],
    notifications: ["Avoid costly email blast services", <>Promote your <b>Notifications</b> here !</>],
  },
};

// (<) and (>) step through the sections in tile order (Oct 26 Figma), wrapping
// around: One Big Calendar → Connections → Discount / Gift Certificates →
// Employment Listings → Products, Services, Memberships → Notifications.
const SECTION_ORDER = [
  { key: "calendar", href: "/", label: "One Big Calendar" },
  { key: "connections", href: "/connections", label: "Connections" },
  { key: "discounts", href: "/discounts", label: "Discount / Gift Certificates" },
  { key: "employment", href: "/employment", label: "Employment Listings" },
  { key: "products", href: "/listings", label: "Products, Services, Memberships" },
  { key: "notifications", href: "/notifications", label: "Notifications" },
];

function PageBar({ title, icon, mode, section }) {
  const i = Math.max(0, SECTION_ORDER.findIndex((x) => x.key === section));
  const prev = SECTION_ORDER[(i + SECTION_ORDER.length - 1) % SECTION_ORDER.length];
  const next = SECTION_ORDER[(i + 1) % SECTION_ORDER.length];
  return (
    <div className={`page-bar page-bar-${mode}`}>
      <a href={prev.href} className="pb-nav" aria-label={`Previous: ${prev.label}`} data-tip={prev.label}>
        <Glyph name="prev" size={14} strokeWidth={2.2} />
      </a>
      <span className={`pb-icon ${mode === "edit" ? "pb-icon-dark" : ""}`}><Glyph name={icon} size={mode === "edit" ? 20 : 26} /></span>
      <h1>{title}</h1>
      <a href={next.href} className="pb-nav" aria-label={`Next: ${next.label}`} data-tip={next.label}>
        <Glyph name="next" size={14} strokeWidth={2.2} />
      </a>
    </div>
  );
}

export function ConnectWithMe() {
  return (
    <a href="/connections" className="connect-me" data-tip="Connect with me ! — Killer Feature">
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
  const [open, setOpen] = useState(true);
  const key = SECTION_ACTIONS[section] ? section : "calendar";
  const lines = mode === "edit" ? HERO_LINES.edit[key] || HERO_LINES.default : HERO_LINES.default;
  const actions = SECTION_ACTIONS[key].map((a) => (a.key === "details" && detailsHref ? { ...a, href: detailsHref } : a));
  const current = activeAction || (mode === "edit" ? "edit" : null);
  const barIcon = icon || (mode === "edit" ? "editMode" : "smiley");

  return (
    <div className="site-hero">
      <PageBar title={title} icon={barIcon} mode={mode} section={section} />

      <section className="hh-box hh-intro">
        <div className="hh-arrow">
          <CollapseArrow open={open} onClick={() => setOpen((o) => !o)} label="introduction" />
        </div>
        <h2 className="hh-head">
          <i>Innovative,</i> Results-Based Marketing <br className="hh-br" />and Revenue-Sharing System
        </h2>
        {open && (
          <>
            <p className="hh-tag">Connect • Promote • Earn</p>
            {lines.map((l, i) => <p key={i} className="hh-line">{l}</p>)}
          </>
        )}
      </section>

      <IconNav active={section} mode="tiles" />

      {secondRow || (
        <nav className="hh-actions" aria-label="Section pages">
          {actions.map((a) => (
            <a key={a.key} href={a.href} aria-current={current === a.key ? "page" : undefined}
              className={`hh-box hh-action ${a.dark ? "hh-action-dark" : ""} ${current === a.key ? "hh-action-on" : ""}`}>
              <span className="hh-action-icon"><Glyph name={a.icon} size={20} /></span>
              <span>{a.label}</span>
            </a>
          ))}
        </nav>
      )}

      <ConnectWithMe />
    </div>
  );
}
