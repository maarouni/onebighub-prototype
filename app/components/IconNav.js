"use client";

// Main hub tiles — Nov 7 (Cesar's Figma, "main headers" email): the 8 tiles
// are now 3. Every page belongs to one of them:
//   One Big Calendar  — calendar pages
//   Connections       — connections, introductions / referrals, profiles
//   Promote & Earn    — advertising, products & services, deals, careers / jobs, notifications
// Selected tile: gold background, bold burgundy text.

// Nov 18 (Cesar Rev 261118, tagline Find • Connect • Achieve): the three main
// headers are now Find (calendar + every listing type), Connect and Achieve
// (was Promote & Earn).
export const HUB_TILES = [
  { key: "calendar", href: "/", img: "find", label: "Find", tip: "Calendar, careers / jobs, products, services, deals … — One Big Table and My Custom Digest" },
  { key: "connections", href: "/connect", img: "connections", label: "Connect", tip: "Connect with me !, introductions, profiles" },
  { key: "promote", href: "/advertising", img: "achieve", label: "Achieve", tip: "Performance-based marketing, advertising cost, rates, events, private-labeled header" },
];

// Which main tile each page section belongs to.
export const MAIN_OF = {
  calendar: "calendar",
  connections: "connections",
  introductions: "connections",
  earn: "promote",
  // Listing tables moved from Promote & Earn to Find (Nov 18).
  products: "calendar",
  discounts: "calendar",
  employment: "calendar",
  notifications: "calendar",
};

export default function IconNav({ active, mode = "output" }) {
  const main = MAIN_OF[active] || null;
  return (
    <nav className={`hub-tiles hub-tiles-3 hub-tiles-${mode}`} aria-label="Site sections">
      {HUB_TILES.map((t) => (
        <a
          key={t.key}
          href={t.href}
          className={`hub-tile ${main === t.key ? "active" : ""}`}
          aria-current={main === t.key ? "page" : undefined}
          data-tip={t.tip}
        >
          <img src={`/icons/${t.img}.png`} alt="" width="45" height="45" className="hub-tile-img" />
          <span className="hub-tile-label">{t.label}</span>
        </a>
      ))}
    </nav>
  );
}
