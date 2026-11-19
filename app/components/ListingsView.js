"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import PageTemplate from "./PageTemplate";
import ListingsFilterPanel from "./ListingsFilterPanel";
import { FIND_TYPES } from "./ListingTypeBox";
import { NextStep } from "./Steps";
import { ResultsHead, ListingTable, Pager, shortYmd, mmddyy } from "./ListingTable";
import { Glyph } from "./Icons";
import { cityCode } from "../lib/cityCodes";
import FillInHere from "./FillInHere";
import SendToMasoud from "./SendToMasoud";
import { EMPTY_LISTING_FILTERS, listingMatches, fetchListings, localListings, costLabel, TYPE_GLYPH } from "../lib/listings";

const SEL_KEY = "mc_listing_selection_v1";
const PAGE_SIZE = 8;

const fmtListing = (l) =>
  `${l.type}: ${l.name} — ${l.offeredBy} (${l.industry})\n   ${l.description}\n   ${l.city}, ${l.region} · ${(l.delivery || []).join(" / ")} · ${costLabel(l)} · Referrals: ${l.referrals ? "Yes" : "No"} · Expires ${l.expires}${l.premier ? " · PREMIER" : ""}`;

function ListingsInner({ digest = false }) {
  const [qRaw, setQRaw] = useState("");
  const q = qRaw.trim().toLowerCase();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(EMPTY_LISTING_FILTERS);
  const [selected, setSelected] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [digestMode, setDigestMode] = useState("manual");
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    fetchListings().then(setItems);
    // Nov 7 Figma: Products / Services / Memberships … boxes link here with ?type=
    try {
      const t = new URLSearchParams(window.location.search).get("type");
      if (t) setFilters((f) => ({ ...f, type: [t] }));
    } catch {}
    try { setSelected(JSON.parse(localStorage.getItem(SEL_KEY) || "{}")); } catch {}
  }, []);
  useEffect(() => { setPage(1); }, [filters, q]);

  const visible = useMemo(() => {
    const list = items.filter((l) => listingMatches(l, filters, today, q));
    return list.sort((a, b) => (!!b.premier - !!a.premier) || String(b.posted).localeCompare(String(a.posted)));
  }, [items, filters, today, q]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstSel = items.find((l) => selected[l.id]);

  function toggle(id) {
    const next = { ...selected, [id]: !selected[id] };
    setSelected(next);
    try { localStorage.setItem(SEL_KEY, JSON.stringify(next)); } catch {}
  }
  // Nov 18 (Cesar, "Find One Big Table headers"): title bar = view + italic
  // type with the type's icon; results bar = "view - Type".
  const curType = FIND_TYPES.find((t) => t.id === filters.type?.[0]);
  const typeLabel = curType ? curType.label : digest ? "Other Listings" : "Listings";
  const viewName = digest ? "My Custom Digest" : "One Big Table";
  const scrollToResults = () => document.getElementById("results")?.scrollIntoView({ block: "start", behavior: "smooth" });

  return (
    <>
      <PageTemplate
        section="products"
        activeAction={digest ? "digest" : null}
        title={<>{viewName}&nbsp;&nbsp;<i className="pb-sub">{curType ? curType.label : digest ? "Listing" : "Listings"}</i></>}
        icon={curType?.icon || "idxProduct"}
        typeIcon={curType?.icon || "idxProduct"}
        legend={false}
      />

      <div className={`page browse-page ${showFilters ? "" : "filters-hidden"}`}>
        <div className="layout-with-sidebar">
          {showFilters && (
            <ListingsFilterPanel items={items} filters={filters} setFilters={setFilters} today={today} q={q}
              onHide={() => setShowFilters(false)} onDisplay={scrollToResults} digestMode={digestMode} setDigestMode={setDigestMode} view={digest ? "digest" : "table"} />
          )}

          <div className="timeline-col" id="results">
            <ResultsHead step={digest ? 3 : 2} title={`${viewName} - ${typeLabel}`} q={qRaw} setQ={setQRaw}
              addHref={digest ? "/listings/submit" : undefined} editHref={digest ? "/listings/submit" : undefined}
              showFilters={showFilters} onShowFilters={() => setShowFilters(true)} />

            <FillInHere>
              These listings are placeholders. Click <strong>+ Post a Listing</strong> to enter real ones. They&rsquo;ll
              appear on your screen right away. When you&rsquo;re done, click <strong>Send my listings to Masoud</strong> so I can
              make them permanent for everyone. <em>(Until we set up the database, what you post is only visible on your computer.)</em>
            </FillInHere>
            <SendToMasoud load={localListings} noun="listings" format={fmtListing} subject="onebigHUB - my products, services, memberships" />

            {pageItems.length === 0 && (
              <div className="empty-state">
                Nothing matches yet.{" "}
                <button type="button" className="clear-filters-link" onClick={() => setFilters(EMPTY_LISTING_FILTERS)}>Clear filters</button>
              </div>
            )}

            <ListingTable rows={pageItems.map((l) => ({
              id: l.id,
              href: `/listings/${l.id}`,
              // Nov 19 (Cesar's Find Figma): "Product • Title" rows, no date column,
              // "Posted / Revised MM/DD/YY" bottom right.
              left: null,
              title: <>{l.type} • {l.name}</>,
              lines: l.premier
                ? [<i key="d">{l.description}</i>, <b key="o">{l.offeredBy}</b>, [(l.delivery || []).join(" / "), (l.categories || []).join(", "), l.industry].filter(Boolean).join(" • "), cityCode({ city: l.city }), `${costLabel(l)} • Expires ${mmddyy(l.expires)}`]
                : [l.offeredBy, cityCode({ city: l.city }), <>{costLabel(l)} • Expires {mmddyy(l.expires)}{l.referrals && <span className="obc-ref"> • <Glyph name="referral" size={15} className="ref-ico" /></span>}</>],
              posted: `Posted / Revised ${mmddyy(l.posted)}`,
              premier: l.premier,
              image: TYPE_GLYPH[l.type] || "products",
              selected: !!selected[l.id],
              onToggle: () => toggle(l.id),
            }))} />

            <Pager page={safePage} totalPages={totalPages} onGo={(p) => setPage(Math.min(Math.max(1, p), totalPages))} />

            <NextStep step={digest ? 4 : 3} noun="Listing" digest="My Other Listings Digest" digestHref="/listings/digest"
              detailsHref={firstSel ? `/listings/${firstSel.id}` : "/listings"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ListingsView({ digest = false }) {
  return <Suspense fallback={null}><ListingsInner digest={digest} /></Suspense>;
}
