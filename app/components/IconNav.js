"use client";

// Main hub tiles — Nov 7 (Cesar's Figma, "main headers" email): the 8 tiles
// are now 3. Every page belongs to one of them:
//   One Big Calendar  — calendar pages
//   Connections       — connections, introductions / referrals, profiles
//   Promote & Earn    — advertising, products & services, deals, careers / jobs, notifications
// Selected tile: gold background, bold burgundy text.

export const HUB_TILES = [
  { key: "calendar", href: "/", img: "calendar", label: "One Big Calendar", tip: "Curate your Calendar Digest" },
  { key: "connections", href: "/connections", img: "connections", label: "Connections", tip: "Connect with me !, introductions, profiles" },
  { key: "promote", href: "/advertising", img: "earn", label: "Promote & Earn", tip: "Ads & events, products & services, deals, careers / jobs, notifications" },
];

// Which main tile each page section belongs to.
export const MAIN_OF = {
  calendar: "calendar",
  connections: "connections",
  introductions: "connections",
  earn: "promote",
  products: "promote",
  discounts: "promote",
  employment: "promote",
  notifications: "promote",
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
