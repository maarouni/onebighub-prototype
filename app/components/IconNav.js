"use client";

// Main hub tiles — Oct 28 (Cesar's Figma Rev 261028 + "colorized main icons"
// email, icons colorized by Tarek). Eight tiles in two rows of four:
//   One Big Calendar · Connections · Introductions · EARN with Advertising
//   Products, Services ... · Deals · Careers / Jobs · Custom Notifications
// Memberships are no longer part of the main hub (Oct 27 meeting) so nobody
// mistakes onebigHUB for a membership site.
// Selected tile (option A in Cesar's email): gold background, bold burgundy text.

export const HUB_TILES = [
  { key: "calendar", href: "/", img: "calendar", label: "One Big Calendar", tip: "Curate your Calendar Digest" },
  { key: "connections", href: "/connections", img: "connections", label: "Connections", tip: "Individuals, businesses, organizations and groups — select your criteria and geographical radius" },
  { key: "introductions", href: "/referrals", img: "introductions", label: "Introductions", tip: "Get paid for introductions / referrals that convert" },
  { key: "earn", href: "/advertising", img: "earn", label: "EARN with Advertising", tip: "Rates, advertising cost, event participation, barter", earn: true },
  { key: "products", href: "/listings", img: "products", label: "Products, Services ...", tip: "Promote and find products and services" },
  { key: "discounts", href: "/discounts", img: "deals", label: "Deals", tip: "Discount / Gift Certificates" },
  { key: "employment", href: "/employment", img: "careers", label: "Careers / Jobs", tip: "Employment listings — browse or post" },
  { key: "notifications", href: "/notifications", img: "notifications", label: "Custom Notifications", tip: "Subscribe to alerts and newsletters" },
];

export default function IconNav({ active, mode = "output" }) {
  return (
    <nav className={`hub-tiles hub-tiles-${mode}`} aria-label="Site sections">
      {HUB_TILES.map((t) => (
        <a
          key={t.key}
          href={t.href}
          className={`hub-tile ${t.earn ? "hub-tile-earn" : ""} ${active === t.key ? "active" : ""}`}
          data-tip={t.tip}
          aria-current={active === t.key ? "page" : undefined}
        >
          <img src={`/icons/${t.img}.png`} alt="" width="45" height="45" className="hub-tile-img" />
          <span className="hub-tile-label">{t.label}</span>
          {t.sub && <span className="hub-tile-sub">{t.sub}</span>}
        </a>
      ))}
    </nav>
  );
}
