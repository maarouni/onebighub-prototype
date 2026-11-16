"use client";

import { Box } from "./FilterKit";
import { Glyph } from "./Icons";
import { LISTING_TYPE_MENU } from "../lib/listings";

// "Listing Type — Select one" (Cesar's One Big Table, Rev 261116). Shared by
// One Big Table (products…surveys), Careers / Jobs, Deals and Notifications.
// `current` = active type id; `onPick(id)` handles in-page types, others link.
export default function ListingTypeBox({ current, onPick }) {
  return (
    <Box title="Listing Type" hint="Select one">
      {LISTING_TYPE_MENU.map((t) => {
        const on = current === t.id;
        const inPage = onPick && !["Careers", "Deals", "Notifications"].includes(t.id);
        const inner = (
          <>
            <input type="radio" name="listing-type" checked={on} readOnly tabIndex={-1} />
            <Glyph name={t.icon} size={15} />
            <span className={`fp-label ${on ? "lt-on" : ""}`}>{t.label}</span>
          </>
        );
        return inPage
          ? <label key={t.id} className={`fp-option lt-opt ${t.gap ? "lt-gap" : ""}`} onClick={(e) => { e.preventDefault(); onPick(on ? null : t.id); }}>{inner}</label>
          : <a key={t.id} href={t.href} className={`fp-option lt-opt ${t.gap ? "lt-gap" : ""}`}>{inner}</a>;
      })}
    </Box>
  );
}
