"use client";

// Shared section icon row — Oct 26 (Cesar's Figma Rev 261026 + onebigHUB flyer):
// One Big Calendar · Connections · Discount / Gift Certificates ·
// Employment Listings · Products, Services, Memberships · Notifications. Icons redrawn to match his set:
// calendar + globe, networked globe, percent badge, toolbox, cube, bell.

const SVG = (children) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const ITEMS = [
  {
    key: "calendar",
    href: "/",
    label: "One Big Calendar",
    tip: "Curate your Calendar Digest",
    icon: SVG(<>
      <path d="M10 20H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
      <path d="M7 13h1.5M10.5 13H12M7 16.5h1.5" />
      <circle cx="16.5" cy="17" r="4.5" />
      <path d="M12 17h9M16.5 12.5c1.6 1.4 1.6 7.6 0 9M16.5 12.5c-1.6 1.4-1.6 7.6 0 9" />
    </>),
  },
  {
    key: "connections",
    href: "/connections",
    label: "Connections",
    tip: "Select your criteria and geographical radius",
    icon: SVG(<>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="8" cy="8" r="1.6" /><circle cx="16.5" cy="7.5" r="1.6" />
      <circle cx="12" cy="13" r="1.6" /><circle cx="6.5" cy="15.5" r="1.6" /><circle cx="17" cy="16" r="1.6" />
      <path d="M9.4 8.9l1.6 2.7M15.4 8.7l-2.4 3M10.5 13.6l-2.6 1.2M13.5 13.6l2.1 1.6M9.6 7.8h5.3M7.7 9.6l-.9 4.3" />
    </>),
  },
  {
    key: "discounts",
    href: "/discounts",
    label: "Discount / Gift Certificates",
    tip: "Discounts and gift certificates",
    icon: SVG(<>
      <path d="M12 2.5l2.2 1.6 2.7-.2.9 2.6 2.3 1.4-.7 2.6 1.1 2.5-2.1 1.7-.3 2.7-2.7.4-1.7 2.1-2.5-1.1-2.5 1.1-1.7-2.1-2.7-.4-.3-2.7-2.1-1.7 1.1-2.5-.7-2.6 2.3-1.4.9-2.6 2.7.2Z" />
      <path d="M14.8 9.2l-5.6 5.6" />
      <circle cx="9.4" cy="9.4" r="1.2" /><circle cx="14.6" cy="14.6" r="1.2" />
    </>),
  },
  {
    key: "employment",
    href: "/employment",
    label: "Employment Listings",
    tip: "Careers / jobs — browse or post",
    icon: SVG(<>
      <rect x="2.5" y="8" width="19" height="12.5" rx="2" />
      <path d="M8.5 8V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V8" />
      <path d="M2.5 13.5h7M14.5 13.5h7" />
      <rect x="9.5" y="12" width="5" height="3.5" rx=".8" />
    </>),
  },
  {
    key: "products",
    href: "/listings",
    label: "Products, Services, Memberships",
    tip: "Promote and find products, services and memberships",
    icon: SVG(<>
      <path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5Z" />
      <path d="M3.5 7.25 12 12l8.5-4.75M12 12v9.5" />
    </>),
  },
  {
    key: "notifications",
    href: "/notifications",
    label: "Notifications",
    tip: "Subscribe to alerts and newsletters",
    icon: SVG(<>
      <path d="M18 9a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15.5 18 9Z" />
      <path d="M10.2 20.5a2 2 0 0 0 3.6 0M12 3V2" />
    </>),
  },
];

// mode="edit" gives the active icon a dark background (Cesar: view pages use
// the standard icon, edit pages the dark one, so you always know where you are).
// Every icon carries a hover tooltip.
export default function IconNav({ active, mode = "output" }) {
  return (
    <nav className={`icon-nav icon-nav-${mode}`} aria-label="Site sections">
      {ITEMS.map((it) => (
        <a
          key={it.key}
          href={it.href}
          className={`icon-nav-item ${active === it.key ? "active" : ""}`}
          data-tip={it.tip}
          aria-current={active === it.key ? "page" : undefined}
        >
          <span className="icon-nav-glyph">{it.icon}</span>
          <span className="icon-nav-label">{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
