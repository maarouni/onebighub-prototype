"use client";

import { useEffect, useMemo, useState } from "react";
import { ATTENDANCE_STATUSES, COST_OPTIONS, REGION_GROUPS, CATEGORY_GROUPS, EMPTY_FILTERS, matches, googleCalendarUrl } from "../lib/taxonomy";
import { fetchEvents } from "../lib/events";
import { fmtTime, fmtDateRange, isoOf } from "../components/EventVisuals";
import { cityCode } from "../lib/cityCodes";
import { addToCart } from "../lib/cart";
import PageTemplate from "../components/PageTemplate";
import { ResultsHead, ListingTable, Pager } from "../components/ListingTable";
import { Box, Option, CheckList, GroupedBox, RegionBoxes, FilterShell, DateBox } from "../components/FilterKit";
import { DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, INDUSTRIES } from "../lib/organizations";
import { NextStep } from "../components/Steps";
import { Glyph } from "../components/Icons";
import CollapseArrow from "../components/CollapseArrow";

// My Calendar Digest — Cesar's Figma (Nov 5 rev). Gray mode (the One Big
// Calendar tile and the page's bars are gray on a Digest page).
//   Filters: Sets · Dates · My Attendance Status · Event Costs · Format · Type ·
//            Privacy · Sync with My Calendars · Categories · Regions
//   Results: (3) My Calendar Digest [+][pencil] · SEARCH (<-) · table with the
//            thin status column · pager
//   (4) Select one: View · ADD New · EDIT · Cart · Google · Apple iCal · DELETE
//   I am allowed to VIEW Others' Calendar Digest   (mini-cards)
//   Allow Others to VIEW My Calendar Digest        (search + Submit)

const STORAGE_KEY = "mc_my_calendar_v1";
const STATUS_KEY = "mc_attendance_status_v2";
const SETS_KEY = "mc_digest_filter_sets_v1";
const SHARE_KEY = "mc_digest_share_v1";
const PAGE_SIZE = 10;

const DATE_VIEWS = [
  { id: "upcoming", label: "Upcoming", def: true },
  { id: "past", label: "Past" },
  { id: "all", label: "All dates" },
];
const TYPE_OPTIONS = [
  { id: "regular", label: "Regular", hint: "Free", def: true },
  { id: "premier", label: "Premier" },
  { id: "barter", label: "Premier", hint: "Barter" },
];
const SYNC_OPTIONS = ["Apple", "Calendly", "Google", "Microsoft Outlook"];

// Placeholder people until there are real accounts (Figma uses sample names too).
const SAMPLE_SHARED_WITH_ME = [
  { id: "s1", name: "Angel Claus", org: "NorthPoleTech.com", phone: "1-876-TECHIES", email: "AClaus@NorthPoleTech.com" },
  { id: "s2", name: "Jack Frost", org: "", phone: "1-800-COO-COO", email: "jack@jackfrost.com" },
];

const EMPTY = { ...EMPTY_FILTERS, view: "upcoming", status: [], types: [], privacy: "all", sync: [] };

function chrono(a, b) {
  return `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`);
}

function rowImage(e) {
  const cats = [...(e.categories || []), e.category].join(" ").toLowerCase();
  if (cats.includes("dinner")) return "dinner";
  if (cats.includes("workshop") || cats.includes("seminar")) return "workshop";
  return "expo";
}

const typeOf = (e) => (e.barter ? "barter" : e.premier ? "premier" : "regular");

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}
function writeJson(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// Apple iCal: a standard .ics file the Calendar app opens.
function downloadIcs(list) {
  const stamp = (iso, hm) => `${iso.replace(/-/g, "")}${hm ? `T${hm.replace(":", "").padStart(4, "0")}00` : ""}`;
  const esc = (t) => String(t || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const body = list.map((e) => {
    const m = String(e.time || "").match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    const start = m ? `DTSTART;TZID=America/Los_Angeles:${stamp(e.date, m[1])}` : `DTSTART;VALUE=DATE:${stamp(e.date)}`;
    const end = m ? `DTEND;TZID=America/Los_Angeles:${stamp(e.endDate || e.date, m[2])}` : "";
    return ["BEGIN:VEVENT", `UID:${e.id}@onebighub.com`, start, end, `SUMMARY:${esc(e.title)}`,
      `LOCATION:${esc(e.type === "Online" ? "Online" : e.city)}`, `DESCRIPTION:${esc(e.description)}`, "END:VEVENT"].filter(Boolean).join("\r\n");
  }).join("\r\n");
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//onebigHUB//My Calendar Digest//EN\r\n${body}\r\nEND:VCALENDAR\r\n`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "my-calendar-digest.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
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

function MiniCard({ p, onRemove }) {
  return (
    <div className="dg-card">
      <span className="dg-card-pic" aria-hidden="true">{p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
      <span className="dg-card-txt">
        <b>{p.name}</b>
        {p.org && <span>{p.org}</span>}
        {p.phone && <span>{p.phone}</span>}
        {p.email && <span>{p.email}</span>}
      </span>
      {onRemove && (
        <button type="button" className="dg-icon-btn" data-tip="Remove" aria-label={`Remove ${p.name}`} onClick={onRemove}>
          <Glyph name="delete" size={18} />
        </button>
      )}
    </div>
  );
}

// A results-column box with the same title + collapse circle as the filter boxes.
function SideBox({ title, count, children, tools }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="dg-box">
      <div className="dg-box-head">
        <b>{title}{count != null && <>: <span className="dg-count-n">{count}</span></>}</b>
        <span className="dg-box-tools">
          {tools}
          <CollapseArrow open={open} onClick={() => setOpen((o) => !o)} label={title} />
        </span>
      </div>
      {open && <div className="dg-box-body">{children}</div>}
    </section>
  );
}

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState({});
  const [status, setStatus] = useState({});
  const [picked, setPicked] = useState({});
  const [f, setF] = useState(EMPTY);
  const [setName, setSetName] = useState("none");
  const [sets, setSets] = useState({});
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sharedIdx, setSharedIdx] = useState(0);
  const [share, setShare] = useState({ hideAll: false, people: [] });
  const [shareQ, setShareQ] = useState("");
  const [flash, setFlash] = useState("");
  const today = useMemo(() => new Date(), []);
  const todayIso = isoOf(today);

  useEffect(() => {
    fetchEvents().then(setEvents);
    setSelected(readJson(STORAGE_KEY, {}));
    setStatus(readJson(STATUS_KEY, {}));
    setSets(readJson(SETS_KEY, {}));
    setShare(readJson(SHARE_KEY, { hideAll: false, people: [] }));
  }, []);

  useEffect(() => { setPage(1); }, [f, q]);

  const say = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 2200); };

  // FilterKit pieces expect a filters object + setter.
  const kit = { filters: f, setFilters: setF };
  const toggleIn = (field, v) => setF((x) => ({ ...x, [field]: x[field].includes(v) ? x[field].filter((y) => y !== v) : [...x[field], v] }));

  function setEventStatus(id, value) {
    const next = { ...status, [id]: value };
    setStatus(next);
    writeJson(STATUS_KEY, next);
  }

  function pickSet(name) {
    setSetName(name);
    if (name === "none") setF(EMPTY);
    else if (sets[name]) setF({ ...EMPTY, ...sets[name] });
  }
  function saveSet() {
    if (setName === "none") return;
    const next = { ...sets, [setName]: f };
    setSets(next);
    writeJson(SETS_KEY, next);
    say(`Saved as Filter Set ${setName}`);
  }
  function clearSet(name) {
    const next = { ...sets };
    delete next[name];
    setSets(next);
    writeJson(SETS_KEY, next);
    if (setName === name) pickSet("none");
  }

  const mine = useMemo(() => events.filter((e) => selected[e.id]).sort(chrono), [events, selected]);
  const ql = q.trim().toLowerCase();
  const shown = mine.filter((e) => {
    if (f.view === "past" && e.date >= todayIso) return false;
    if (f.view === "upcoming" && (e.endDate || e.date) < todayIso) return false;
    if (!matches(e, { ...f, date: "all" }, today, null, ql)) return false;
    if (f.status.length && !f.status.includes(status[e.id] || "none")) return false;
    if (f.types.length && !f.types.includes(typeOf(e))) return false;
    if (f.privacy !== "all" && (e.privacy === "Private" ? "private" : "public") !== f.privacy) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = shown.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pickedList = mine.filter((e) => picked[e.id]);
  const targets = pickedList.length ? pickedList : [];
  const needPick = () => { say("Select one or more events first (radio on the right)"); return false; };

  function deletePicked() {
    if (!targets.length) return needPick();
    const next = { ...selected };
    targets.forEach((e) => { next[e.id] = false; });
    setSelected(next);
    writeJson(STORAGE_KEY, next);
    setPicked({});
    say(`Removed ${targets.length} from My Calendar Digest`);
  }
  function cartPicked() {
    if (!targets.length) return needPick();
    targets.forEach((e) => addToCart({ kind: "tickets", refId: e.id, title: e.title, when: fmtDateRange(e.date, e.endDate), price: e.price || 0 }));
    say(`Added ${targets.length} to My Shopping Cart`);
  }
  function googlePicked() {
    if (!targets.length) return needPick();
    targets.slice(0, 5).forEach((e) => window.open(googleCalendarUrl(e), "_blank", "noopener"));
  }
  function applePicked() {
    if (!targets.length) return needPick();
    downloadIcs(targets);
  }

  const firstPicked = targets[0];
  const nextOptions = [
    { id: "view", icon: "eyeView", label: "View Selection(s)", href: firstPicked ? `/event/${firstPicked.id}` : (mine[0] ? `/event/${mine[0].id}` : "/"), def: true },
    { id: "add", icon: "plusBold", label: "ADD New Listing", href: "/submit" },
    { id: "edit", icon: "editMode", label: "EDIT Selection(s)", href: "/submit" },
    { id: "cart", icon: "cartAdd", label: "ADD Selection(s) to My Shopping Cart", onClick: cartPicked },
    { id: "gcal", icon: "gColor", label: "ADD Selection(s) to My Google Calendar", onClick: googlePicked },
    { id: "ical", icon: "iCal", label: "ADD Selection(s) to My Apple iCal Calendar", onClick: applePicked },
    { id: "del", icon: "delete", label: "DELETE Selection(s) from My Calendar Digest", onClick: deletePicked },
  ];

  function saveShare(next) {
    setShare(next);
    writeJson(SHARE_KEY, next);
  }
  function addPerson(e) {
    e.preventDefault();
    const name = shareQ.trim();
    if (!name) return;
    const isEmail = name.includes("@");
    saveShare({ ...share, people: [...share.people, { id: `p${Date.now()}`, name: isEmail ? name.split("@")[0] : name, email: isEmail ? name : "" }] });
    setShareQ("");
    say("Added — they can view your Calendar Digest once accounts are live");
  }

  const shared = SAMPLE_SHARED_WITH_ME;

  return (
    <>
      <PageTemplate section="calendar" title="My Calendar Digest" legend={false} activeAction="digest"
        intro={<><b><i>Save Time !</i></b> Select filters to curate events &bull; Assign <b>My Attendance Status</b> for each event</>} />
      <div className="page browse-page digest-page">
        <div className="layout-with-sidebar">
          <FilterShell onClear={() => { setF(EMPTY); setSetName("none"); }} onDisplay={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>
            <Box title="Sets" hint="Select one">
              <Option type="radio" name="dg-set" checked={setName === "none"} onChange={() => pickSet("none")} label="No Filter Sets" def />
              {["A", "B", "C"].map((n) => (
                <div key={n} className="dg-set-row">
                  <Option type="radio" name="dg-set" checked={setName === n} onChange={() => pickSet(n)} label={`Filter Set ${n}${sets[n] ? "" : " (empty)"}`} />
                  {sets[n] && (
                    <button type="button" className="dg-set-x" data-tip={`Clear Filter Set ${n}`} aria-label={`Clear Filter Set ${n}`} onClick={() => clearSet(n)}>
                      <Glyph name="clearX" size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="fp-submit-pill fp-set-pill" disabled={setName === "none"} onClick={saveSet}
                data-tip={setName === "none" ? "Pick Filter Set A, B or C first" : `Save current filters as Set ${setName}`}>
                <span className="step-badge" aria-hidden="true">2</span> SAVE Filter Set{setName !== "none" && <em> {setName}</em>}
              </button>
            </Box>

            <Box title="Dates" hint="Select one">
              {DATE_VIEWS.map((d) => (
                <Option key={d.id} type="radio" name="dg-date" checked={f.view === d.id} onChange={() => setF((x) => ({ ...x, view: d.id }))} label={d.label} def={d.def} />
              ))}
            </Box>

            <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />

            <Box title="Offering $ Referrals"><CheckList field="referral" options={REFERRAL_OPTIONS} all={false} {...kit} /></Box>

            <Box title="My Attendance Status" hint="Select all that apply">
              <Option type="radio" name="dg-status-all" checked={!f.status.length} onChange={() => setF((x) => ({ ...x, status: [] }))} label="All" def />
              {ATTENDANCE_STATUSES.map((s) => (
                <Option key={s.id} checked={f.status.includes(s.id)} onChange={() => toggleIn("status", s.id)}
                  label={<><b className={`att-sym-inline ${s.red ? "att-red" : ""}`}>{s.icon}</b> {s.label}</>} />
              ))}
            </Box>

            <Box title="Event Costs"><CheckList field="costs" options={COST_OPTIONS} {...kit} /></Box>

            <Box title="Format">
              <CheckList field="formats" options={[{ id: "In-Person", label: "In-Person" }, { id: "Online", label: "Online / Virtual" }]} {...kit} />
            </Box>

            <Box title="Type" hint="Select all that apply">
              {TYPE_OPTIONS.map((t) => (
                <Option key={t.id} checked={f.types.includes(t.id)} onChange={() => toggleIn("types", t.id)}
                  label={<>{t.label}{t.hint && <i> {t.hint}</i>}</>} def={t.def} />
              ))}
            </Box>

            <Box title="Privacy" hint="Select one">
              <Option type="radio" name="dg-priv" checked={f.privacy === "all"} onChange={() => setF((x) => ({ ...x, privacy: "all" }))} label="All" def />
              <Option type="radio" name="dg-priv" checked={f.privacy === "public"} onChange={() => setF((x) => ({ ...x, privacy: "public" }))} label="Public" />
              <Option type="radio" name="dg-priv" checked={f.privacy === "private"} onChange={() => setF((x) => ({ ...x, privacy: "private" }))} label="Private" />
            </Box>

            <Box title="Sync with My Calendars" hint="Select all that apply" note="Two-way sync comes with accounts. For now use ADD to My Google / Apple iCal Calendar below the table.">
              {SYNC_OPTIONS.map((o) => (
                <Option key={o} checked={f.sync.includes(o)} onChange={() => toggleIn("sync", o)} label={o} />
              ))}
            </Box>

            <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
            <Box title="Industries" defaultOpen={f.industry.length > 0}>
              <CheckList field="industry" options={INDUSTRIES} {...kit} />
            </Box>
            <RegionBoxes field="regions" groups={REGION_GROUPS} {...kit} />
          </FilterShell>

          <div className="timeline-col" id="results">
            <ResultsHead step={3} title="My Calendar Digest" q={q} setQ={setQ} showFilters onShowFilters={() => {}} addHref="/submit" editHref="/submit" />
            {flash && <div className="fp-flash fp-flash-block">{flash}</div>}

            {mine.length === 0 && (
              <div className="empty-state">
                Your digest is empty. <a href="/">Browse One Big Calendar</a> and ADD Selection(s) to My Calendar Digest.
              </div>
            )}
            {mine.length > 0 && shown.length === 0 && (
              <div className="empty-state">
                Nothing matches.{" "}
                <button type="button" className="clear-filters-link" onClick={() => { setF({ ...EMPTY, view: "all" }); setQ(""); }}>Show everything</button>
              </div>
            )}

            <ListingTable rows={pageItems.map((e) => ({
              id: e.id,
              href: `/event/${e.id}`,
              left: [fmtDateRange(e.date, e.endDate), fmtTime(e.time)],
              title: e.title,
              lines: e.premier
                ? [`${cityCode(e)}${e.type !== "Online" && e.region ? `, ${e.region}` : ""}`, <>Hosted by <b>{e.hostedBy}</b></>, e.cost]
                : [`${cityCode(e)}, Hosted by ${e.hostedBy}`],
              premier: e.premier,
              image: rowImage(e),
              selected: !!picked[e.id],
              onToggle: () => setPicked((p) => ({ ...p, [e.id]: !p[e.id] })),
              status: <StatusPicker value={status[e.id] || "none"} onChange={(v) => setEventStatus(e.id, v)} />,
            }))} />

            <Pager page={safePage} totalPages={totalPages} onGo={(p) => setPage(Math.min(Math.max(1, p), totalPages))} />

            <NextStep step={4} options={nextOptions} />

            <SideBox title="I am allowed to VIEW Others' Calendar Digests" count={shared.length}>
              <div className="dg-carousel">
                <button type="button" className="obc-pg" aria-label="Previous" disabled={sharedIdx <= 0} onClick={() => setSharedIdx((i) => i - 1)}>
                  <Glyph name="pagePrev" size={24} />
                </button>
                <div className="dg-cards">
                  {shared.slice(sharedIdx, sharedIdx + 2).map((p) => (
                    <a key={p.id} href="/connections" className="dg-card-link"><MiniCard p={p} /></a>
                  ))}
                </div>
                <button type="button" className="obc-pg" aria-label="Next" disabled={sharedIdx + 2 >= shared.length} onClick={() => setSharedIdx((i) => i + 1)}>
                  <Glyph name="pageNext" size={24} />
                </button>
              </div>
              <p className="dg-count"><b>{Math.min(sharedIdx + 2, shared.length)}</b> of <b>{shared.length}</b> <em>(sample names until accounts are live)</em></p>
            </SideBox>

            <SideBox title="Allow Others to VIEW My Calendar Digest" count={share.hideAll ? 0 : share.people.length}>
              {/* Nov 9 (Cesar): the digest is PRIVATE by default; owners pick who may
                  see it. "Hide … to ALL" instantly hides it from everyone, including
                  people already on the list (their access comes back when unticked). */}
              <label className="fp-option dg-opt">
                <input type="checkbox" checked={!!share.hideAll} onChange={() => saveShare({ ...share, hideAll: !share.hideAll })} />
                <span className="fp-label">Hide My Calendar Digest to ALL</span>
              </label>
              {share.hideAll && share.people.length > 0 && <p className="dg-count"><em>Hidden from the {share.people.length} people below until you untick this.</em></p>}
              <form className="dg-share-form" onSubmit={addPerson}>
                <label className="dg-share-label" htmlFor="dg-share-q"><b>SEARCH</b> Individuals: Connections, Name, Email</label>
                <div className="dg-share-row">
                  <input id="dg-share-q" type="text" placeholder="Type text" value={shareQ} onChange={(e) => setShareQ(e.target.value)} />
                  <button type="submit" className="dg-icon-btn" data-tip="Add" aria-label="Add person"><Glyph name="plusBold" size={18} /></button>
                </div>
                <button type="submit" className="dg-submit">Submit</button>
              </form>
              {share.people.length > 0 && (
                <div className="dg-cards dg-cards-list">
                  {share.people.map((p) => (
                    <MiniCard key={p.id} p={p} onRemove={() => saveShare({ ...share, people: share.people.filter((x) => x.id !== p.id) })} />
                  ))}
                </div>
              )}
            </SideBox>
          </div>
        </div>
      </div>
    </>
  );
}
