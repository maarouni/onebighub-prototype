"use client";

import { Box } from "./FilterKit";
import { Glyph } from "./Icons";
import { LISTING_TYPE_MENU } from "../lib/listings";

// Find (Cesar Rev 261118): the first two filter boxes on every Find page.
//   Select one — One Big Table (Default) · My Custom Digest · EDIT My Listings
//   Listings — Select one — Calendar (Default) · Employment · Products · …
// Calendar replaced its own main header; it is now the first listing type.
export const FIND_TYPES = [
  { id: "Calendar", label: "Calendar", img: "/icons/calendar.png", table: "/calendar", digest: "/my-calendar", edit: "/submit" },
  ...LISTING_TYPE_MENU.map((t) => ({
    ...t,
    table: t.href,
    digest: `/listings/digest?type=${encodeURIComponent(t.id)}`,
    edit: t.id === "Careers" ? "/employment/submit" : t.id === "Deals" ? "/discounts/submit" : `/listings/submit?type=${encodeURIComponent(t.id)}`,
  })),
];
const VIEWS = [
  ["table", "One Big Table", "idxListings", true],
  ["digest", "My Custom Digest", "idxDigestImg"],
  ["edit", "EDIT My Listings", "editMode"],
];

function Opt({ href, on, onClick, gap, children }) {
  const inner = (
    <>
      <input type="radio" checked={on} readOnly tabIndex={-1} />
      {children}
    </>
  );
  return onClick
    ? <label className={`fp-option lt-opt ${gap ? "lt-gap" : ""}`} onClick={(e) => { e.preventDefault(); onClick(); }}>{inner}</label>
    : <a href={href} className={`fp-option lt-opt ${gap ? "lt-gap" : ""}`}>{inner}</a>;
}

// `current` = active type id; `view` = table | digest | edit;
// `onPick(id)` switches in-page types on One Big Table / My Custom Digest.
export function FindViewBox({ current = "Calendar", view = "table" }) {
  const t = FIND_TYPES.find((x) => x.id === current) || { table: "/listings", digest: "/listings/digest", edit: "/listings/submit" };
  return (
    <Box hint="Select one" className="find-box">
      {VIEWS.map(([k, label, icon, def]) => (
        <Opt key={k} href={t[k]} on={view === k}>
          <Glyph name={icon} size={15} />
          <span className={`fp-label ${view === k ? "lt-on" : ""}`}>{label}{def && <em className="ns-default"> Default</em>}</span>
        </Opt>
      ))}
    </Box>
  );
}

export default function ListingTypeBox({ current = "Calendar", view = "table", onPick }) {
  return (
    <>
      <FindViewBox current={current} view={view} />
      <Box title="Listings" hint="Select one" className="lt-box">
        {FIND_TYPES.map((t) => {
          const on = current === t.id;
          const inPage = onPick && !["Calendar", "Careers", "Deals", "Notifications"].includes(t.id);
          return (
            <Opt key={t.id} href={view === "digest" ? t.digest : t.table} on={on} gap={t.gap} onClick={inPage ? () => onPick(on ? null : t.id) : null}>
              {t.img ? <img src={t.img} alt="" width="16" height="16" /> : <Glyph name={t.icon} size={15} />}
              <span className={`fp-label ${on ? "lt-on" : ""}`}>{t.label}{t.id === "Calendar" && <em className="ns-default"> Default</em>}</span>
            </Opt>
          );
        })}
      </Box>
    </>
  );
}
