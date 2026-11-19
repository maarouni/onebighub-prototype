"use client";

import { usePathname } from "next/navigation";
import PageTemplate from "./PageTemplate";
import { Glyph } from "./Icons";
import { RATE_PAGES, rateValue } from "../lib/adRates";

// Earn with Advertising is split into separate pages (Oct 15 call): the
// calculator, then one page per rate card. This row links them.
export const AD_LINKS = [
  { href: "/advertising/calculate", icon: "calculate", label: "Calculate Advertising Cost" },
  ...RATE_PAGES.map((p) => ({ href: `/advertising/${p.slug}`, icon: p.icon, label: p.title })),
  { href: "/advertising/participation", icon: "expo", label: "Event Participation" },
];

export function AdNav() {
  const path = usePathname() || "";
  return (
    <nav className="ad-nav" aria-label="Earn with Advertising pages">
      {AD_LINKS.map((l) => (
        <a key={l.href} href={l.href} className={`ad-nav-item ${path === l.href ? "active" : ""}`}>
          <Glyph name={l.icon} size={22} strokeWidth={1.5} />
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  );
}

// mode="edit" (Cesar, Nov 17): Event Participation, Private-Labeled Header and
// Barter Approval are gray EDIT pages — gray title bar, upright title, gray page.
export function AdPage({ title, icon = "megaphone", mode = "output", typeIcon, tint, children }) {
  const page = (
    <PageTemplate
      section="earn"
      title={title}
      icon={icon}
      mode={mode}
      typeIcon={typeIcon}
      legend={false}
    >
      {children}
    </PageTemplate>
  );
  // Nov 18 (Rev 261118): Barter Approval is a pale-yellow page.
  if (tint === "pale") return <div className="pe-pale">{page}</div>;
  return mode === "edit" ? <div className="pe-edit">{page}</div> : page;
}

export function RateCard({ slug, children }) {
  const page = RATE_PAGES.find((p) => p.slug === slug);
  return (
    <section className="ad-box">
      <div className="ad-box-head">
        <h2>{page.title}</h2>
        <Glyph name={page.icon} size={34} strokeWidth={1.4} />
      </div>
      <table className="ad-rates">
        <thead><tr><th>Item</th><th>Rate *</th></tr></thead>
        <tbody>
          {page.rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{rateValue(v)}</td></tr>)}
        </tbody>
      </table>
      {children}
      <p className="ad-fine">* Rates subject to change without notice. They do not include credit card fees.</p>
    </section>
  );
}
