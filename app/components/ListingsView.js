"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import PageTemplate from "./PageTemplate";
import ListingsFilterPanel from "./ListingsFilterPanel";
import { NextStep } from "./Steps";
import { ResultsHead, ListingTable, Pager, shortYmd } from "./ListingTable";
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
  const scrollToResults = () => document.getElementById("results")?.scrollIntoView({ block: "start", behavior: "smooth" });

  return (
    <>
      <PageTemplate
        section="products"
        activeAction={digest ? "digest" : null}
        title={<>Promote &amp; Earn&nbsp;&nbsp;<i className="pb-sub">{digest ? "My Digest" : "One Big Table"}</i></>}
        icon={digest ? "idxProduct" : "idxProduct"}
        legend={false}
      />

      <div className={`page browse-page ${showFilters ? "" : "filters-hidden"}`}>
        <div className="layout-with-sidebar">
          {showFilters && (
            <ListingsFilterPanel items={items} filters={filters} setFilters={setFilters} today={today} q={q}
              onHide={() => setShowFilters(false)} onDisplay={scrollToResults} digestMode={digestMode} setDigestMode={setDigestMode} />
          )}

          <div className="timeline-col" id="results">
            <ResultsHead step={digest ? 3 : 2} title={digest ? "My Custom Digest - Listings" : "One Big Table of Listings"} q={qRaw} setQ={setQRaw}
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
              left: [l.type, costLabel(l), `Exp ${shortYmd(l.expires)}`],
              title: l.name,
              lines: l.premier
                ? [l.description, <>{cityCode({ city: l.city })}, <b>{l.offeredBy}</b> · {l.industry}</>, `${(l.delivery || []).join(" / ")}${l.referrals ? " · $ Referrals" : ""}`]
                : [`${cityCode({ city: l.city })}, ${l.offeredBy}`],
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
