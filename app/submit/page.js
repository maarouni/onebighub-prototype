"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { REGION_GROUPS, CATEGORY_GROUPS, ATTENDANCE_STATUSES } from "../lib/taxonomy";
import { INDUSTRIES } from "../lib/employmentTaxonomy";
import { getUser } from "../lib/auth";
import { addToCart } from "../lib/rsvp";
import { saveLocalEvent } from "../lib/events";
import { HostAvatar, Icon, fmtTime, fmtDateRange, startTime, shortDate, isoOf, parseDate } from "../components/EventVisuals";
import { Glyph } from "../components/Icons";
import { cityCode } from "../lib/cityCodes";
import { RATES } from "../lib/adRates";
import SiteHero from "../components/SiteHero";
import StateSelect from "../components/StateSelect";

// Cesar's "EDIT My Events" (Figma Rev 261108): listing box on top; left
// "Filters" (1 Select all that apply); right "2 Submit Event" — Submit
// Minimal Listing, then Submit Complete Listing (description, gallery,
// contact, submitted by, RSVP Order Tickets, Allow Others to Promote);
// "3 Select one": SUBMIT as Premier · Calculate · Rates · DELETE.

// Rates come from the one shared table (app/lib/adRates.js).
const RATE_VIEW = RATES.premierPerView;
const RATE_CLICK = RATES.premierPerClick;
const BIG_COUNTIES = new Set(["Santa Clara", "San Francisco", "Alameda"]);
const MAX_DESC = 1250;
const MAX_EXTRA_DATES = 6;

const EMPTY = {
  premier: false,
  privacy: "Public",
  type: "In Person",
  region: "Alameda",
  categories: ["Networking"],
  title: "",
  tagline: "",
  date: "",
  endDate: "",
  startT: "18:00",
  endT: "21:00",
  extraDates: [],
  venue: "",
  address: "",
  city: "",
  state: "CA",
  zip: "",
  country: "USA",
  hostedBy: "",
  url: "",
  price: 0,
  description: "",
  display: { qr: true, rsvpCount: true, rsvpList: false },
  contact: { name: "", biz: "", url: "", phone: "", email: "", place: "" },
  attendance: "none",
  barter: false,
  industries: [],
  dateFormat: "single",
  referral: { mode: "none", amount: "", pct: "", desc: "" },
  priceMax: "",
  rsvpUrl: "",
  promoteAs: "na",
  promoteOther: "",
  promoteWho: "anyone",
  promoteNames: "",
  adStart: "",
  adEnd: "",
  adFormat: "views",
};

function money(n) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Prototype reach estimate — stands in for the real "matching filters" count.
function estimateReach(f) {
  const base = 900 + 140 * Math.min(f.categories.length, 6);
  const mult = f.type === "Online" ? 1.5 : BIG_COUNTIES.has(f.region) ? 1.3 : 1;
  const big = Math.round(base * mult);
  const mine = Math.round(big * 0.18);
  const notif = Math.round(big * 0.6);
  const views = big + mine + notif;
  return { big, mine, notif, views, clicks: Math.round(views * 0.025) };
}

function weeksBetween(a, b) {
  const s = parseDate(a), e = parseDate(b);
  if (!s || !e || e < s) return 1;
  return Math.max(1, Math.ceil((Math.round((e - s) / 86400000) + 1) / 7));
}

function Field({ label, hint, required, error, children, wide }) {
  return (
    <label className={`ed-field ${wide ? "wide" : ""} ${error ? "has-error" : ""}`}>
      <span className="ed-label">
        {label}
        {required && <em>Required</em>}
        {hint && <i>{hint}</i>}
      </span>
      {children}
      {error && <span className="ed-error">{error}</span>}
    </label>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" className={`ed-toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="ed-toggle-dot" />
      {label}: <b>{on ? "Display" : "Hide"}</b>
    </button>
  );
}

const Pill = ({ children }) => <div className="em-pill">{children}</div>;
const R = ({ name, checked, onChange, children }) => (
  <label className="fp-option"><input type="radio" name={name} checked={checked} onChange={onChange} /> <span className="fp-label">{children}</span></label>
);
const Fold = ({ title, children, open }) => (
  <details className="em-box em-fold" open={open}><summary><b>{title}</b></summary>{children}</details>
);
const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });


export default function SubmitEvent() {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const today = useMemo(() => isoOf(new Date()), []);
  const [me, setMe] = useState(null);
  const [showCalc, setShowCalc] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [gi, setGi] = useState(0);
  const [created] = useState(() => new Date());
  useEffect(() => { setMe(getUser()); }, []);
  function toggleIn(k, v) { setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] })); }
  function addFiles(list) {
    const files = [...list].slice(0, 10 - gallery.length);
    files.forEach((file) => {
      const r = new FileReader();
      r.onload = () => setGallery((g) => [...g, { name: file.name, type: file.type, src: r.result }].slice(0, 10));
      r.readAsDataURL(file);
    });
  }

  const clearError = (k) =>
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });
  const set = (k, v) => {
    setF((x) => ({ ...x, [k]: v }));
    clearError(k);
  };
  const setIn = (k, sub, v) => setF((x) => ({ ...x, [k]: { ...x[k], [sub]: v } }));

  function toggleCat(c) {
    clearError("categories");
    setF((x) => ({
      ...x,
      categories: x.categories.includes(c) ? x.categories.filter((y) => y !== c) : [...x.categories, c],
    }));
  }

  const cost = f.price > 0 ? (Number(f.priceMax) > f.price ? `$${f.price} - $${f.priceMax}` : `$${f.price}`) : (Number(f.priceMax) > 0 ? `Free - $${f.priceMax}` : "Free");
  const time = f.startT && f.endT ? `${f.startT}-${f.endT}` : "";
  const preview = {
    id: "preview",
    title: f.title || "Your event title",
    hostedBy: f.hostedBy || "Your business",
    date: f.date || today,
    time,
    city: f.city || "City",
    region: f.type === "Online" ? "" : f.region,
    type: f.type,
    category: f.categories[0] || "Networking",
    categories: f.categories,
    cost,
    premier: f.premier,
  };

  const reach = estimateReach(f);
  const adStart = f.adStart || today;
  const adEnd = f.adEnd || f.date || today;
  const weeks = weeksBetween(adStart, adEnd);
  const totalViews = reach.views * weeks * RATE_VIEW;
  const totalClicks = reach.clicks * weeks * RATE_CLICK;
  const budget = f.adFormat === "views" ? totalViews : totalClicks;

  function validate() {
    const e = {};
    if (!f.title.trim()) e.title = "Give your event a title.";
    if (!f.date) e.date = "Pick the event date.";
    if (f.endDate && f.date && f.endDate < f.date) e.endDate = "End date is before the start date.";
    if (!f.hostedBy.trim()) e.hostedBy = "Who is hosting?";
    if (f.type !== "Online" && !f.city.trim()) e.city = "Which city?";
    if (!f.categories.length) e.categories = "Pick at least one category.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector(".has-error, .ed-cat-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return !Object.keys(e).length;
  }

  async function submit(ev, asPremier) {
    ev?.preventDefault?.();
    if (asPremier && !f.premier) setF((x) => ({ ...x, premier: true }));
    if (!validate()) return;
    setBusy(true);
    const payload = {
      ...f,
      time,
      cost,
      category: f.categories[0],
      premier: asPremier || f.premier,
      industry: f.industries[0] || "",
      referral: f.referral.mode === "none" ? "" : f.referral.mode === "tbd" ? "TBD — To Be Discussed" : f.referral.mode === "amount" ? `$${f.referral.amount}${f.referral.desc ? ` — ${f.referral.desc}` : ""}` : `${f.referral.pct} %${f.referral.desc ? ` — ${f.referral.desc}` : ""}`,
      contactName: f.contact.name, contactPhone: f.contact.phone, contactEmail: f.contact.email,
      submittedBy: me?.name || "", posted: today, created: today,
      extraDates: f.extraDates.filter(Boolean),
      city: f.type === "Online" ? "" : f.city,
      adBudget: (asPremier || f.premier)
        ? { start: adStart, end: adEnd, weeks, format: f.adFormat, estViewsPerWeek: reach.views, estClicksPerWeek: reach.clicks, total: Number(budget.toFixed(2)) }
        : null,
    };
    let saved;
    try {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      saved = await r.json();
    } catch {
      saved = { ...payload, id: String(Date.now()) };
    }
    saveLocalEvent(saved);
    if (asPremier || f.premier) {
      addToCart([{ id: `c${Date.now()}`, kind: "premier", eventId: saved.id, eventTitle: saved.title, date: saved.date, ticket: "Premier Listing (advertising budget)", qty: 1, each: Number(budget.toFixed(2)), ccFee: 0, subtotal: Number(budget.toFixed(2)), added: new Date().toISOString() }]);
    }
    setBusy(false);
    setDone(saved);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="page ed-page">
        <div className="ed-done">
          <div className="ed-done-circle"><Icon name="check" /></div>
          <h1>{done.premier ? "Submitted as a Premier listing" : "Your event is listed"}</h1>
          <p>
            {done.premier
              ? `Premier listing, ${money(done.adBudget?.total || 0)} advertising budget — added to My Shopping Cart. Payment comes with the next build; for this demo it's live on One Big Calendar as Premier.`
              : "It's on One Big Calendar now, as a free Regular listing."}
          </p>
          <p className="nt-hint">Until the shared database is set up, this event only shows on this computer — use
            <b> Send my events to Masoud</b> on One Big Calendar to make it permanent for everyone.</p>
          <div className="ed-done-actions">
            <a className="btn-primary" href="/#results">See it on One Big Calendar</a>
            {done.premier && <a className="btn-ghost" href="/dashboards?open=cart">My Shopping Cart</a>}
            <a className="btn-ghost" href={`/event/${done.id}/rsvp/edit`}>Set up RSVP Order Tickets</a>
            <button type="button" className="btn-ghost" onClick={() => { setF(EMPTY); setDone(null); }}>Add another event</button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <form className="page ed-page em-page" onSubmit={(e) => submit(e, false)} noValidate>
      <SiteHero section="calendar" mode="edit" title="EDIT My Events" />

      {/* Listing box: click a row to choose Regular or Premier. */}
      <section className="ed-preview">
        {[false, true].map((prem) => (
          <button key={String(prem)} type="button" className={`pv-pick ${f.premier === prem ? "chosen" : ""}`}
            onClick={() => set("premier", prem)} aria-pressed={f.premier === prem}>
            <span className="pv-label">{prem ? "Premier Listing" : "Regular Listing"}<em>{prem ? "(Advertisement)" : "(Free)"}</em></span>
            <span className={`obc-row ${prem ? "premier" : "regular"}`}>
              <span className="obc-cell obc-when">
                <span>{fmtDateRange(preview.date, preview.endDate)}</span>
                <span>{fmtTime(preview.time)}</span>
              </span>
              <span className="obc-cell obc-main">
                <span className="obc-title">{preview.title}</span>
                {prem ? (
                  <>
                    <span>{preview.type === "Online" ? "Online" : `${cityCode(preview)}${preview.region ? `, ${preview.region}` : ""}`}</span>
                    <span>Hosted by <b>{preview.hostedBy}</b></span>
                    <span className="obc-price">{preview.cost}</span>
                  </>
                ) : (
                  <span>{preview.type === "Online" ? "Online" : cityCode(preview)}, Hosted by {preview.hostedBy}, <span className="obc-price">{preview.cost}</span></span>
                )}
              </span>
              {prem && <span className="obc-cell obc-img">{gallery[0]?.type?.startsWith("image") ? <img src={gallery[0].src} alt="" /> : <><Glyph name="gallery" size={30} strokeWidth={1.4} /><small>Icon, Image or Logo</small></>}</span>}
            </span>
          </button>
        ))}
      </section>

      <div className="ed-grid em-grid">
        {/* Left: Filters — these decide who sees the event. */}
        <aside className="em-filters">
          <div className="em-bar em-bar-plain"><b>Filters</b></div>
          <div className="em-bar"><span className="step-badge">1</span><i>Select all that apply</i></div>

          <div className="em-box">
            <b>My Attendance</b> Status
            {ATTENDANCE_STATUSES.map((a) => (
              <R key={a.id} name="att" checked={f.attendance === a.id} onChange={() => set("attendance", a.id)}>
                <span className={`em-att ${a.red ? "cw-red" : ""}`}>{a.icon}</span> {a.label}{a.id === "none" && <em> Default</em>}
              </R>
            ))}
          </div>
          <div className="em-box">
            <b>Format</b>
            {[["In Person", "In-Person"], ["Online", "Online / Virtual"]].map(([v, l]) => <R key={v} name="fmt" checked={f.type === v} onChange={() => set("type", v)}>{l}</R>)}
          </div>
          <div className="em-box">
            <b>Type</b> <i>Select one</i>
            <R name="typ" checked={!f.premier} onChange={() => setF((x) => ({ ...x, premier: false, barter: false }))}>Regular <i>Free</i> <em>Default</em></R>
            <R name="typ" checked={f.premier && !f.barter} onChange={() => setF((x) => ({ ...x, premier: true, barter: false }))}>Premier</R>
            <R name="typ" checked={f.premier && f.barter} onChange={() => setF((x) => ({ ...x, premier: true, barter: true }))}>Premier <i>Barter</i></R>
          </div>
          <div className="em-box">
            <b>Privacy</b> <i>Select one</i>
            <R name="prv" checked={f.privacy === "Public"} onChange={() => set("privacy", "Public")}>Public <em>Default</em></R>
            <R name="prv" checked={f.privacy === "Private"} onChange={() => set("privacy", "Private")}>Private</R>
          </div>
          <Fold title={<>Categories <i className="em-count">{f.categories.length}</i></>} open={!!errors.categories}>
            {errors.categories && <span className="ed-error ed-cat-error">{errors.categories}</span>}
            {CATEGORY_GROUPS.map((g) => (
              <div key={g.group} className="em-sub">
                <i>{g.group}</i>
                {g.options.map((o) => (
                  <label key={o} className="fp-option"><input type="checkbox" checked={f.categories.includes(o)} onChange={() => toggleCat(o)} /> <span className="fp-label">{o}</span></label>
                ))}
              </div>
            ))}
          </Fold>
          <Fold title={<>Industries <i className="em-count">{f.industries.length || ""}</i></>}>
            {INDUSTRIES.map((o) => (
              <label key={o} className="fp-option"><input type="checkbox" checked={f.industries.includes(o)} onChange={() => toggleIn("industries", o)} /> <span className="fp-label">{o}</span></label>
            ))}
          </Fold>
          {f.type !== "Online" && REGION_GROUPS.map((g) => (
            <Fold key={g.group} title={g.group} open={g.options.includes(f.region) && g.group.includes("Bay")}>
              {g.options.map((o) => <R key={o} name="rgn" checked={f.region === o} onChange={() => set("region", o)}>{o}</R>)}
            </Fold>
          ))}
        </aside>

        {/* Right: 2 Submit Event */}
        <section className="em-form">
          <div className="em-bar em-bar-big">
            <span className="step-badge">2</span><b>Submit Event</b> <i>Select / Submit all that apply</i>
            <button type="button" className="em-x" aria-label="Clear the form" title="Clear the form" onClick={() => { setF(EMPTY); setErrors({}); setGallery([]); }}><Glyph name="clearAll" size={18} /></button>
          </div>

          <Pill><b>Submit Minimal Listing</b> <i>ex. Regular Listing (Free)</i></Pill>
          <Field label="Event Title" required error={errors.title} wide>
            <input type="text" maxLength={140} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Submit Here" />
          </Field>
          <div className="em-two">
            <div className={`ed-field ${errors.date ? "has-error" : ""}`}>
              <span className="ed-label">Date(s) <i>Select one format</i></span>
              <R name="df" checked={f.dateFormat === "single"} onChange={() => setF((x) => ({ ...x, dateFormat: "single", endDate: "" }))}>Single day <i>Mon Mar 09 &rsquo;26</i></R>
              <R name="df" checked={f.dateFormat === "range"} onChange={() => set("dateFormat", "range")}>Date range <i>Jun 15-17 &rsquo;26</i></R>
              <input type="date" value={f.date} min={today} onChange={(e) => set("date", e.target.value)} aria-label="Start date" />
              {f.dateFormat === "range" && <input type="date" value={f.endDate} min={f.date || today} onChange={(e) => set("endDate", e.target.value)} aria-label="End date" />}
              {(errors.date || errors.endDate) && <span className="ed-error">{errors.date || errors.endDate}</span>}
            </div>
            <div className="ed-field">
              <span className="ed-label">Time(s) <i>Select one format</i></span>
              <label className="em-inline">Starts <input type="time" value={f.startT} onChange={(e) => set("startT", e.target.value)} /></label>
              <label className="em-inline">Ends <input type="time" value={f.endT} onChange={(e) => set("endT", e.target.value)} /></label>
            </div>
          </div>
          {f.type !== "Online" ? (
            <Field label="City" required error={errors.city} wide>
              <input type="text" value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Submit Here" />
            </Field>
          ) : (
            <Field label="Online link" hint="shared with people who RSVP" wide>
              <input type="url" value={f.url} onChange={(e) => set("url", e.target.value)} placeholder="https://" />
            </Field>
          )}
          <Field label="Hosted by" required error={errors.hostedBy} wide>
            <input type="text" value={f.hostedBy} onChange={(e) => set("hostedBy", e.target.value)} placeholder="Submit Here" />
          </Field>
          <div className="ed-field wide">
            <span className="ed-label">Offering Referral <i>If applicable • Select / Submit one</i></span>
            <R name="ref" checked={f.referral.mode === "none"} onChange={() => setIn("referral", "mode", "none")}>Not Applicable <em>Default</em></R>
            <R name="ref" checked={f.referral.mode === "tbd"} onChange={() => setIn("referral", "mode", "tbd")}>TBD <i>To Be Discussed</i></R>
            <R name="ref" checked={f.referral.mode === "amount"} onChange={() => setIn("referral", "mode", "amount")}>$ <input className="rsvp-num" type="number" min="0" value={f.referral.amount} onFocus={() => setIn("referral", "mode", "amount")} onChange={(e) => setIn("referral", "amount", e.target.value)} placeholder="xx,xxx" /></R>
            <R name="ref" checked={f.referral.mode === "pct"} onChange={() => setIn("referral", "mode", "pct")}><input className="rsvp-num" type="number" min="0" max="100" value={f.referral.pct} onFocus={() => setIn("referral", "mode", "pct")} onChange={(e) => setIn("referral", "pct", e.target.value)} placeholder="xx" /> %</R>
            {f.referral.mode !== "none" && <label className="em-inline"><b>Brief Description</b> <input value={f.referral.desc} onChange={(e) => setIn("referral", "desc", e.target.value)} placeholder="Submit Here" /></label>}
          </div>
          <div className="ed-field wide">
            <span className="ed-label">Ticket Costs</span>
            <span className="em-inline">$ <input className="rsvp-num" type="number" min="0" value={f.price} onChange={(e) => set("price", Math.max(0, Number(e.target.value)))} placeholder="x,xxx.xx" /> - $ <input className="rsvp-num" type="number" min="0" value={f.priceMax} onChange={(e) => set("priceMax", e.target.value)} placeholder="x,xxx.xx" /></span>
          </div>
          <Field label="External RSVP URL" hint="If applicable, embedded in Ticket Cost" wide>
            <input type="url" value={f.rsvpUrl} onChange={(e) => set("rsvpUrl", e.target.value)} placeholder="https://www.xyz.com" />
          </Field>
          <div className="em-center"><button type="submit" className="cw-submit" disabled={busy}>{busy ? "Saving…" : "Submit"}</button></div>

          <Pill><b>Submit Complete Listing</b></Pill>
          <Field label="Tagline or One-Line Description" wide>
            <input type="text" maxLength={140} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Submit Here" />
          </Field>
          {f.type !== "Online" && (
            <>
              <Field label="Venue / Location" wide><input type="text" value={f.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Submit Here" /></Field>
              <Field label="Address" wide><input type="text" value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Submit Here" /></Field>
              <div className="em-three">
                <Field label="State"><StateSelect bare value={f.state} onChange={(v) => set("state", v)} /></Field>
                <Field label="ZIP Code"><input type="text" inputMode="numeric" maxLength={10} value={f.zip} onChange={(e) => set("zip", e.target.value)} placeholder="Submit Here" /></Field>
                <Field label="Country"><input type="text" value={f.country} onChange={(e) => set("country", e.target.value)} placeholder="Submit Here" /></Field>
              </div>
            </>
          )}
          <div className="ed-field wide">
            <span className="ed-label">Recurring Event <i>Submit up to {MAX_EXTRA_DATES} additional dates</i>
              <span className="rsvp-tools">
                {f.extraDates.length < MAX_EXTRA_DATES && <button type="button" className="rsvp-tool" aria-label="Add a date" title="Add a date" onClick={() => set("extraDates", [...f.extraDates, ""])}><Glyph name="plusBold" size={18} /></button>}
                {f.extraDates.length > 0 && <button type="button" className="rsvp-tool" aria-label="Remove all dates" title="Remove all dates" onClick={() => set("extraDates", [])}><Glyph name="delete" size={17} /></button>}
              </span>
            </span>
            {f.extraDates.length === 0 && <span className="cw-muted">Not Applicable <em>Default</em></span>}
            <div className="ed-dates">
              {f.extraDates.map((d, i) => (
                <span key={i} className="ed-date-pill">
                  <input type="date" value={d} min={f.date || today} onChange={(e) => set("extraDates", f.extraDates.map((x, j) => (j === i ? e.target.value : x)))} />
                  <button type="button" aria-label="Remove date" onClick={() => set("extraDates", f.extraDates.filter((_, j) => j !== i))}>✕</button>
                </span>
              ))}
            </div>
          </div>
          <Field label="Full Description" hint={`${MAX_DESC} maximum characters • Details, instructions, refund, warranty, …`} wide>
            <textarea rows={8} maxLength={MAX_DESC} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Submit Here" />
            <span className="ed-count">{f.description.length} / {MAX_DESC}</span>
          </Field>
          <div className="em-box em-toggles">
            <Toggle label="Event QR Code" on={f.display.qr} onChange={(v) => setIn("display", "qr", v)} />
            <Toggle label="# RSVPs" on={f.display.rsvpCount} onChange={(v) => setIn("display", "rsvpCount", v)} />
            <Toggle label="List of RSVPs" on={f.display.rsvpList} onChange={(v) => setIn("display", "rsvpList", v)} />
          </div>

          <div className="em-box">
            <span className="ed-label"><b>Gallery</b>
              <span className="rsvp-tools">
                <label className="rsvp-tool" title="Upload" aria-label="Upload to gallery"><Glyph name="plusBold" size={18} /><input type="file" accept="image/*,video/*,.pdf" multiple hidden onChange={(e) => addFiles(e.target.files)} /></label>
                {gallery.length > 0 && <button type="button" className="rsvp-tool" aria-label="Delete this item" title="Delete this item" onClick={() => { setGallery((g) => g.filter((_, j) => j !== gi)); setGi(0); }}><Glyph name="delete" size={17} /></button>}
              </span>
            </span>
            <div className="evd-gal-stage">
              <button type="button" className="evd-gal-nav" aria-label="Previous item" disabled={gallery.length < 2} onClick={() => setGi((g) => (g + gallery.length - 1) % gallery.length)}><Glyph name="pagePrev" size={20} /></button>
              <label className="em-drop">
                {gallery[gi] ? (gallery[gi].type.startsWith("image") ? <img src={gallery[gi].src} alt={gallery[gi].name} /> : gallery[gi].type.startsWith("video") ? <video src={gallery[gi].src} controls /> : <span>{gallery[gi].name}</span>)
                  : <span className="cw-muted">Upload Here<br /><b>Document · Icon · Image or Video</b><br /><i>Maximum 10 items</i></span>}
                {!gallery[gi] && <input type="file" accept="image/*,video/*,.pdf" multiple hidden onChange={(e) => addFiles(e.target.files)} />}
              </label>
              <button type="button" className="evd-gal-nav" aria-label="Next item" disabled={gallery.length < 2} onClick={() => setGi((g) => (g + 1) % gallery.length)}><Glyph name="pageNext" size={20} /></button>
            </div>
            <p className="evd-count"><b>{gallery.length ? gi + 1 : 0}</b> of <b>{gallery.length}</b> <span className="cw-muted">· shown in this browser only until storage is set up</span></p>
          </div>

          <div className="em-box em-contact">
            <span className="ed-label"><b>Contact</b></span>
            {[["name", "Name, Title"], ["biz", "Name of Biz / Org"], ["url", "URL of Biz / Org", "https://"], ["phone", "Phone"], ["email", "Email"], ["place", "City, State, Country"]].map(([k, l, ph]) => (
              <label key={k} className="em-row"><b>{l}</b><input value={f.contact[k] || ""} onChange={(e) => setIn("contact", k, e.target.value)} placeholder={ph || "Submit Here"} /></label>
            ))}
            <p className="em-row"><b>OR SEARCH Individuals</b> <a href="/connect">Create / Edit Mini-Card</a></p>
          </div>

          <div className="em-box">
            <span className="ed-label"><b>Submitted by</b> <a href="/profile">Create / Edit Mini-Card</a></span>
            <div className="cw-card evd-mini">
              <div className="cw-card-name"><b>{me?.name || "Your name"}</b><span className="cw-blue">{me?.business || "Your Business / Organization"}</span></div>
              <div className="cw-card-row"><span className="cw-av">{(me?.name || "Me").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
                <span className="cw-card-meta"><span>{me?.mobile || "(xxx) xxx-xxxx"}</span><span className="cw-blue">{me?.email || me?.identifier || "Email"}</span><span>{me?.city || "City, State"}</span></span></div>
            </div>
            {!me && <p className="nt-hint"><a href="/registration">Log In</a> to fill this in automatically.</p>}
          </div>
          <div className="evd-pill evd-stamps"><span><b>Revised</b> <i>{fmtDate(new Date())}</i></span><span><b>Created</b> <i>{fmtDate(created)}</i></span></div>
          <div className="evd-likes">
            <span className="evd-pill"><Glyph name="thumbUp" size={16} /> <b>Like</b> <i>0</i></span>
            <span className="evd-pill"><Glyph name="share" size={16} /> <b>Share</b> <i>0</i></span>
          </div>
          <div className="em-box evd-rsvp-link">
            <Glyph name="ticket" size={40} strokeWidth={1.4} />
            <span>
              <b><span className="cw-red">RSVP</span> Order Tickets</b>
              <span className="cw-red">onebigHUB.com/event/&lt;id&gt;/rsvp — set up tickets after you submit</span>
              <label className="em-inline"><b>OR External URL</b> <i>If applicable</i> <input type="url" value={f.rsvpUrl} onChange={(e) => set("rsvpUrl", e.target.value)} placeholder="Submit Here" /></label>
            </span>
          </div>

          <div className="em-bar em-bar-y"><b>Allow Others to Promote This Event</b> <i>Optional</i></div>
          <details className="em-box" open>
            <summary><b>Benefits / How It Works</b></summary>
            <ul className="em-bullets">
              <li>It&rsquo;s nice to be appreciated / compensated for helping others</li>
              <li>You decide who is allowed to promote your event and get top billing (displayed in Event Details, below Hosted by)</li>
              <li>The system automatically creates and posts their custom event QR code and tracks tickets purchased with it</li>
              <li>Others could promote the event automatically internally in their Notifications and Public Calendar Digests, or externally (email)</li>
              <li>Others will grow their networks when they RSVP and sign up</li>
              <li>Others who RSVP and already have profiles with onebigHUB could also join their networks</li>
              <li>You can compensate others (offline) for their efforts — ex. If they help sell xx tickets, you will offer them xyz, …</li>
            </ul>
          </details>
          <div className="em-box">
            <b>Selection</b> <i>Select one</i>
            <R name="pa" checked={f.promoteAs === "na"} onChange={() => set("promoteAs", "na")}>N/A, Not Applicable <em>Default</em> <i>— do NOT display this whole section</i></R>
            {["Co-Host", "In Collaboration with", "In Partnership with", "Sponsored by"].map((o) => <R key={o} name="pa" checked={f.promoteAs === o} onChange={() => set("promoteAs", o)}>{o}</R>)}
            <R name="pa" checked={f.promoteAs === "other"} onChange={() => set("promoteAs", "other")}>Other <input value={f.promoteOther} onFocus={() => set("promoteAs", "other")} onChange={(e) => set("promoteOther", e.target.value)} placeholder="Submit Here" /></R>
          </div>
          {f.promoteAs !== "na" && (
            <div className="em-box">
              <b>Allow to promote this event</b> <i>Select / Submit one</i>
              <R name="pw" checked={f.promoteWho === "anyone"} onChange={() => set("promoteWho", "anyone")}>Anyone <em>Default</em></R>
              <R name="pw" checked={f.promoteWho === "some"} onChange={() => set("promoteWho", "some")}><b>OR SEARCH and Select Individuals</b></R>
              {f.promoteWho === "some" && <input value={f.promoteNames} onChange={(e) => set("promoteNames", e.target.value)} placeholder="Names or emails, comma separated" />}
            </div>
          )}

          {showCalc && f.premier && (
            <section className="ed-card ed-budget">
              <div className="ed-section-title">Calculate My Advertising Cost</div>
              <p className="ed-budget-pitch"><strong>Results-based marketing.</strong> You pay for the people your listing actually reaches — not a flat fee.</p>
              <div className="ed-cols">
                <Field label="Advertise from"><input type="date" value={adStart} min={today} onChange={(e) => set("adStart", e.target.value)} /></Field>
                <Field label="Until"><input type="date" value={adEnd} min={adStart} onChange={(e) => set("adEnd", e.target.value)} /></Field>
              </div>
              <table className="ed-calc">
                <thead><tr><th>Where it shows</th><th>Views / week</th><th>Clicks / week</th></tr></thead>
                <tbody>
                  <tr><td>One Big Calendar</td><td>{reach.big.toLocaleString()}</td><td /></tr>
                  <tr><td>My Calendars</td><td>{reach.mine.toLocaleString()}</td><td /></tr>
                  <tr><td>Notifications</td><td>{reach.notif.toLocaleString()}</td><td /></tr>
                  <tr className="ed-calc-sum"><td><b>A</b> Estimated weekly reach</td><td>{reach.views.toLocaleString()}</td><td>{reach.clicks.toLocaleString()}</td></tr>
                  <tr><td><b>B</b> Weeks advertised</td><td colSpan={2}>{weeks}</td></tr>
                  <tr><td><b>C</b> Rate</td><td>${RATE_VIEW} / view</td><td>{money(RATE_CLICK)} / click</td></tr>
                  <tr className="ed-calc-total"><td><b>D</b> Total = A × B × C</td><td>{money(totalViews)}</td><td>{money(totalClicks)}</td></tr>
                </tbody>
              </table>
              <div className="ed-seg ed-pay">
                <button type="button" className={f.adFormat === "views" ? "on" : ""} onClick={() => set("adFormat", "views")}>Pay per view · {money(totalViews)}</button>
                <button type="button" className={f.adFormat === "clicks" ? "on" : ""} onClick={() => set("adFormat", "clicks")}>Pay per click · {money(totalClicks)}</button>
              </div>
              <p className="ed-note">Your Premier listing runs until the end date or until the budget is used up, then becomes a Regular listing. Reach numbers are prototype estimates.</p>
            </section>
          )}

          <div className="next-step-box em-select">
            <div className="step-head"><span className="step-badge">3</span><em className="next-step-title">Select one</em></div>
            <ul className="next-step-list">
              <li><button type="button" className="next-step-link" onClick={(e) => submit(e, true)}><span className="ns-dot" /><Glyph name="cartAdd" size={14} /><span>SUBMIT as a Premier Listing <i>ADD To My Shopping Cart</i>{(f.premier || showCalc) ? ` · ${money(budget)}` : ""}</span></button></li>
              <li><button type="button" className="next-step-link" onClick={() => { setF((x) => ({ ...x, premier: true })); setShowCalc((v) => !v); }}><span className="ns-dot" /><Glyph name="calculate" size={14} /><span>Calculate My Advertising Cost</span></button></li>
              <li><a href="/advertising/listings" className="next-step-link"><span className="ns-dot" /><Glyph name="eyeView" size={14} /><span>View Advertising Rates</span></a></li>
              <li>
                {confirmDel ? (
                  <span className="next-step-link em-confirm">Delete this listing draft ? <button type="button" className="cw-submit" onClick={() => { setF(EMPTY); setGallery([]); setErrors({}); setConfirmDel(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Yes, DELETE</button> <button type="button" className="clear-filters-link" onClick={() => setConfirmDel(false)}>Cancel</button></span>
                ) : (
                  <button type="button" className="next-step-link" onClick={() => setConfirmDel(true)}><span className="ns-dot" /><Glyph name="delete" size={14} /><span>DELETE Listing</span></button>
                )}
              </li>
            </ul>
          </div>
        </section>
      </div>
    </form>
  );
}
