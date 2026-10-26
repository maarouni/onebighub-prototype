"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import PageTemplate from "../components/PageTemplate";
import ListingsFilterPanel from "../components/ListingsFilterPanel";
import { NextStep } from "../components/Steps";
import { ResultsHead, ListingTable, Pager, shortYmd } from "../components/ListingTable";
import { cityCode } from "../lib/cityCodes";
import FillInHere from "../components/FillInHere";
import SendToMasoud from "../components/SendToMasoud";
import { EMPTY_LISTING_FILTERS, listingMatches, fetchListings, localListings, costLabel, TYPE_GLYPH } from "../lib/listings";

const SEL_KEY = "mc_listing_selection_v1";
const PAGE_SIZE = 8;

const fmtListing = (l) =>
  `${l.type}: ${l.name} — ${l.offeredBy} (${l.industry})\n   ${l.description}\n   ${l.city}, ${l.region} · ${(l.delivery || []).join(" / ")} · ${costLabel(l)} · Referrals: ${l.referrals ? "Yes" : "No"} · Expires ${l.expires}${l.premier ? " · PREMIER" : ""}`;

function ListingsInner() {
  const [qRaw, setQRaw] = useState("");
  const q = qRaw.trim().toLowerCase();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(EMPTY_LISTING_FILTERS);
  const [selected, setSelected] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    fetchListings().then(setItems);
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
        title="Products, Services, Memberships"
        subtitle="Public"
        legend={false}
        actions={<a href="/listings/submit" className="tpl-action" data-tip="Add New listing">+ Post a Listing</a>}
        intro={<><strong>Get Paid!</strong> Select filters to curate (organize, submit, view) products, services and memberships. No-Cost and Premier listings available.</>}
      />

      <div className={`page browse-page ${showFilters ? "" : "filters-hidden"}`}>
        <div className="layout-with-sidebar">
          {showFilters && (
            <ListingsFilterPanel items={items} filters={filters} setFilters={setFilters} today={today} q={q}
              onHide={() => setShowFilters(false)} onDisplay={scrollToResults} />
          )}

          <div className="timeline-col" id="results">
            <ResultsHead title="Products, Services, Memberships" q={qRaw} setQ={setQRaw}
              showFilters={showFilters} onShowFilters={() => setShowFilters(true)} />

            <FillInHere>
              These 6 listings are placeholders. Click <strong>+ Post a Listing</strong> to enter real ones. They&rsquo;ll
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

            <NextStep noun="Listing" digest="My Other Listings Digest" digestHref="/listings"
              detailsHref={firstSel ? `/listings/${firstSel.id}` : "/listings"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ListingsPage() {
  return <Suspense fallback={null}><ListingsInner /></Suspense>;
}
