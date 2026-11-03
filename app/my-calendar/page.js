"use client";

import { useEffect, useMemo, useState } from "react";
import { ATTENDANCE_STATUSES } from "../lib/taxonomy";
import { fetchEvents } from "../lib/events";
import { fmtTime, fmtDateRange, isoOf } from "../components/EventVisuals";
import { cityCode } from "../lib/cityCodes";
import PageTemplate from "../components/PageTemplate";
import { ResultsHead, ListingTable } from "../components/ListingTable";
import { Box, Option, FilterShell } from "../components/FilterKit";
import { Glyph } from "../components/Icons";

// My Calendar Digest, as in Cesar's Figma: same table as One Big Calendar plus a
// thin status column on the right. Attendance status is shown as a plain symbol
// (no colors).

const STORAGE_KEY = "mc_my_calendar_v1";
const STATUS_KEY = "mc_attendance_status_v2";

const DATE_VIEWS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "all", label: "All dates" },
];

function chrono(a, b) {
  return `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`);
}

function rowImage(e) {
  const cats = [...(e.categories || []), e.category].join(" ").toLowerCase();
  if (cats.includes("dinner")) return "dinner";
  if (cats.includes("workshop") || cats.includes("seminar")) return "workshop";
  return "expo";
}

// Symbol-only status control: the select sits invisibly over the symbol.
function StatusPicker({ value, onChange }) {
  const meta = ATTENDANCE_STATUSES.find((s) => s.id === value) || ATTENDANCE_STATUSES[0];
  return (
    <label className="att-pick" data-tip={meta.label}>
      <span className="att-sym">{meta.icon}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Attendance status">
        {ATTENDANCE_STATUSES.map((s) => (
          <option key={s.id} value={s.id}>{s.icon}  {s.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState({});
  const [status, setStatus] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateView, setDateView] = useState("upcoming");
  const [q, setQ] = useState("");
  const today = useMemo(() => new Date(), []);
  const todayIso = isoOf(today);

  useEffect(() => {
    fetchEvents().then((list) => { setEvents(list); setLoaded(true); });
    try {
      setSelected(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
      setStatus(JSON.parse(localStorage.getItem(STATUS_KEY) || "{}"));
    } catch {}
  }, []);

  function persist(nextSel, nextStatus) {
    try {
      if (nextSel) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSel));
      if (nextStatus) localStorage.setItem(STATUS_KEY, JSON.stringify(nextStatus));
    } catch {}
  }

  function setEventStatus(id, value) {
    const next = { ...status, [id]: value };
    setStatus(next);
    persist(null, next);
  }

  function remove(id) {
    const next = { ...selected, [id]: false };
    setSelected(next);
    persist(next, null);
  }

  // Demo helper: fills the digest with a few upcoming events.
  function loadSample() {
    const picks = events.filter((e) => e.date >= todayIso).sort(chrono).slice(0, 5);
    const sel = { ...selected };
    const st = { ...status };
    const cycle = ["attending", "high", "low", "job", "none"];
    picks.forEach((e, i) => { sel[e.id] = true; st[e.id] = st[e.id] || cycle[i % cycle.length]; });
    setSelected(sel);
    setStatus(st);
    persist(sel, st);
  }

  const mine = useMemo(() => events.filter((e) => selected[e.id]).sort(chrono), [events, selected]);
  const inView = mine.filter((e) =>
    dateView === "all" ? true : dateView === "past" ? e.date < todayIso : e.date >= todayIso
  );
  const counts = useMemo(() => {
    const c = {};
    for (const e of inView) {
      const s = status[e.id] || "none";
      c[s] = (c[s] || 0) + 1;
    }
    return c;
  }, [inView, status]);
  const ql = q.trim().toLowerCase();
  const shown = inView
    .filter((e) => statusFilter === "all" || (status[e.id] || "none") === statusFilter)
    .filter((e) => !ql || `${e.title} ${e.hostedBy} ${e.city}`.toLowerCase().includes(ql));

  return (
    <>
      <PageTemplate section="calendar" title="My Calendar Digest" legend={false} activeAction="digest" />
      <div className="page browse-page">
        <div className="layout-with-sidebar">
          <FilterShell onClear={() => { setStatusFilter("all"); setDateView("upcoming"); }} onDisplay={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>
            <Box title="Dates" hint="Select one">
              {DATE_VIEWS.map((d) => (
                <Option key={d.id} type="radio" name="mc-date" checked={dateView === d.id} onChange={() => setDateView(d.id)} label={d.label} />
              ))}
            </Box>
            <Box title="My Attendance Status" hint="Select one">
              <button type="button" className={`att-row ${statusFilter === "all" ? "on" : ""}`} onClick={() => setStatusFilter("all")}>
                <span className="att-sym">&#x2217;</span><span>All</span><em>{inView.length}</em>
              </button>
              {ATTENDANCE_STATUSES.map((s) => (
                <button key={s.id} type="button" className={`att-row ${statusFilter === s.id ? "on" : ""}`}
                  onClick={() => setStatusFilter(s.id)} disabled={!counts[s.id]}>
                  <span className="att-sym">{s.icon}</span><span>{s.label}</span><em>{counts[s.id] || 0}</em>
                </button>
              ))}
            </Box>
          </FilterShell>

          <div className="timeline-col" id="results">
            <ResultsHead title="My Calendar Digest" q={q} setQ={setQ} showFilters onShowFilters={() => {}} />

            {mine.length > 0 && shown.length === 0 && (
              <div className="empty-state">
                Nothing matches.{" "}
                <button type="button" className="clear-filters-link" onClick={() => { setStatusFilter("all"); setDateView("all"); setQ(""); }}>Show everything</button>
              </div>
            )}

            <ListingTable rows={shown.map((e) => ({
              id: e.id,
              href: `/event/${e.id}`,
              left: [fmtDateRange(e.date, e.endDate), fmtTime(e.time)],
              title: e.title,
              lines: e.premier
                ? [`${cityCode(e)}${e.type !== "Online" && e.region ? `, ${e.region}` : ""}`, <>Hosted by <b>{e.hostedBy}</b></>, e.cost]
                : [`${cityCode(e)}, Hosted by ${e.hostedBy}`],
              premier: e.premier,
              image: rowImage(e),
              selected: false,
              onToggle: () => remove(e.id),
              status: <StatusPicker value={status[e.id] || "none"} onChange={(v) => setEventStatus(e.id, v)} />,
            }))} />
          </div>
        </div>
      </div>
    </>
  );
}
