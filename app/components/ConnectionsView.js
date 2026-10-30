"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import PageTemplate from "./PageTemplate";
import OrgFilterPanel from "./OrgFilterPanel";
import { NextStep } from "./Steps";
import { ResultsHead, ListingTable, Pager, shortYmd } from "./ListingTable";
import { cityCode } from "../lib/cityCodes";
import FillInHere from "./FillInHere";
import SendToMasoud from "./SendToMasoud";
import OrgStatusPicker from "./OrgStatusPicker";
import {
  EMPTY_ORG_FILTERS, orgMatches, fetchOrgs, localOrgs, readMembership, writeMembership, fmtMembers, fmtDues,
} from "../lib/organizations";

// Oct 30 (Cesar's Figma Rev 261030): Connections and My Connections Digest are
// TWO pages that share one layout.
//   /connections         browse everyone, tick rows, "ADD Selection(s) to My Connections Digest"
//   /connections/digest  your digest: Sets, My Membership Status (thin gray column on the right),
//                        "ADD New Listing / EDIT / DELETE Selection(s) from My Connections Digest"

const SEL_KEY = "mc_org_selection_v1";
const DIGEST_KEY = "mc_conn_digest_v1";       // ids added to My Connections Digest (absent = demo: show all)
const SETS_KEY = "mc_conn_filter_sets_v1";    // { A: filters, B: filters, C: filters }
const PAGE_SIZE = 8;

const fmtOrg = (o) =>
  `${o.name}${o.premier ? " (PREMIER)" : ""}\n   ${o.tagline}\n   ${(o.formats || []).join(" / ")} · ${(o.categories || []).join(", ")} · ${o.industry}\n   ${o.city}, ${o.state || "CA"} (${o.region}) · ${fmtMembers(o.members)} · ${fmtDues(o.dues)}`;

const readJson = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const writeJson = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function Inner({ digest }) {
  const [qRaw, setQRaw] = useState("");
  const q = qRaw.trim().toLowerCase();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(EMPTY_ORG_FILTERS);
  const [selected, setSelected] = useState({});
  const [digestIds, setDigestIds] = useState(null);
  const [sets, setSets] = useState({});
  const [setName, setSetName] = useState("none");
  const [membership, setMembership] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const today = useMemo(() => new Date(), []);
  const ctx = useMemo(() => ({ today, membership, q }), [today, membership, q]);

  useEffect(() => {
    fetchOrgs().then(setItems);
    setMembership(readMembership());
    setSelected(readJson(SEL_KEY, {}));
    setDigestIds(readJson(DIGEST_KEY, null));
    setSets(readJson(SETS_KEY, {}));
  }, []);
  useEffect(() => { setPage(1); }, [filters, q]);

  const pool = useMemo(
    () => (digest && digestIds ? items.filter((o) => digestIds.includes(o.id)) : items),
    [items, digest, digestIds]
  );
  const visible = useMemo(() => {
    const list = pool.filter((o) => orgMatches(o, filters, ctx));
    // Premier first, then newest posted / revised.
    return list.sort((a, b) => (!!b.premier - !!a.premier) || String(b.posted).localeCompare(String(a.posted)));
  }, [pool, filters, ctx]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstSel = items.find((o) => selected[o.id]);
  const selIds = items.filter((o) => selected[o.id]).map((o) => o.id);

  function toggle(id) {
    const next = { ...selected, [id]: !selected[id] };
    setSelected(next);
    writeJson(SEL_KEY, next);
  }
  const setStatus = (id, s) => setMembership({ ...writeMembership(id, s) });
  const scrollToResults = () => document.getElementById("results")?.scrollIntoView({ block: "start", behavior: "smooth" });

  // Filter Sets A / B / C — "Save Filter Set" stores the current filters.
  function pickSet(name) {
    setSetName(name);
    if (name === "none") setFilters(EMPTY_ORG_FILTERS);
    else if (sets[name]) setFilters({ ...EMPTY_ORG_FILTERS, ...sets[name] });
  }
  function saveSet() {
    if (setName === "none") return;
    const next = { ...sets, [setName]: filters };
    setSets(next);
    writeJson(SETS_KEY, next);
  }

  function addToDigest() {
    const base = digestIds || [];
    writeJson(DIGEST_KEY, [...new Set([...base, ...selIds])]);
    window.location.href = "/connections/digest";
  }
  function deleteFromDigest() {
    const base = digestIds || items.map((o) => o.id);
    const next = base.filter((id) => !selected[id]);
    setDigestIds(next); writeJson(DIGEST_KEY, next);
    setSelected({}); writeJson(SEL_KEY, {});
  }

  const nextOptions = digest
    ? [
        { id: "details", icon: "viewMode", label: "View Selection(s)", href: firstSel ? `/connections/${firstSel.id}` : "/connections/digest", def: true },
        { id: "add", icon: "addNew", label: "ADD New Listing", href: "/connections/submit" },
        { id: "edit", icon: "editMode", label: "EDIT Selection(s)", href: firstSel ? `/connections/submit?id=${firstSel.id}` : "/connections/submit" },
        { id: "del", icon: "delete", label: "DELETE Selection(s) from My Connections Digest", onClick: deleteFromDigest },
      ]
    : [
        { id: "details", icon: "viewMode", label: "View Selection(s)", href: firstSel ? `/connections/${firstSel.id}` : "/connections", def: true },
        { id: "digest", icon: "connections", label: "ADD Selection(s) to My Connections Digest", onClick: addToDigest },
        { id: "signup", icon: "login", label: "Sign Up / Log In to ADD Listings to My Connections Digest", href: "/registration" },
      ];

  return (
    <>
      <PageTemplate
        section="connections"
        title={digest ? "My Connections Digest" : "Connections"}
        legend={false}
        activeAction={digest ? "digest" : "details"}
        actions={<a href="/connections/submit" className="tpl-action" data-tip="Add New organization">+ Add a Connection</a>}
        intro={digest
          ? <><strong>Get Connected!</strong> Select filters to curate listings &bull; Assign <strong>My Membership Status</strong> for each org / group</>
          : <><strong>Get Connected!</strong> Select filters to curate organizations, and ADD them to <strong>My Connections Digest</strong>. What is your cost of acquisition of a new member? Manage and promote your organization here!</>}
      />

      <div className={`page browse-page ${showFilters ? "" : "filters-hidden"}`}>
        <div className="layout-with-sidebar">
          {showFilters && (
            <OrgFilterPanel items={pool} filters={filters} setFilters={setFilters} ctx={ctx} digest={digest}
              setName={setName} onPickSet={pickSet} onSaveSet={saveSet} sets={sets}
              onHide={() => setShowFilters(false)} onDisplay={scrollToResults} />
          )}

          <div className="timeline-col" id="results">
            <ResultsHead title={digest ? "My Connections Digest" : "Connections"} q={qRaw} setQ={setQRaw}
              showFilters={showFilters} onShowFilters={() => setShowFilters(true)} />

            <FillInHere>
              These 6 organizations are placeholders. Click <strong>+ Add a Connection</strong> to enter real ones. They&rsquo;ll
              appear on your screen right away. When you&rsquo;re done, click <strong>Send my organizations to Masoud</strong> so I can
              make them permanent for everyone. <em>(Until we set up the database, what you post is only visible on your computer.)</em>
            </FillInHere>
            <SendToMasoud load={localOrgs} noun="organizations" format={fmtOrg} subject="onebigHUB - my organizations" />

            {pageItems.length === 0 && (
              <div className="empty-state">
                {digest && digestIds && digestIds.length === 0
                  ? <>Your digest is empty. <a href="/connections">Browse Connections</a> and ADD Selection(s).</>
                  : <>Nothing matches yet.{" "}
                    <button type="button" className="clear-filters-link" onClick={() => setFilters(EMPTY_ORG_FILTERS)}>Clear filters</button></>}
              </div>
            )}

            <ListingTable rows={pageItems.map((o) => ({
              id: o.id,
              href: `/connections/${o.id}`,
              left: [`Revised ${shortYmd(o.posted)}`, o.premier ? fmtMembers(o.members) : null],
              title: o.name,
              lines: o.premier
                ? [<i key="t">{o.tagline}</i>, `${cityCode({ city: o.city })}, ${(o.formats || []).join(" / ")}`, `${(o.categories || []).join(" • ")} • ${o.industry}`, fmtDues(o.dues)]
                : [`${cityCode({ city: o.city })}, ${o.tagline}`],
              premier: o.premier,
              image: "organizations",
              selected: !!selected[o.id],
              onToggle: () => toggle(o.id),
              status: digest ? <OrgStatusPicker value={membership[o.id] || ""} onChange={(st) => setStatus(o.id, st)} compact /> : null,
            }))} />

            <Pager page={safePage} totalPages={totalPages} onGo={(p) => setPage(Math.min(Math.max(1, p), totalPages))} />

            <NextStep options={nextOptions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ConnectionsView({ digest = false }) {
  return <Suspense fallback={null}><Inner digest={digest} /></Suspense>;
}
