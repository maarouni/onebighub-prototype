"use client";

import { useEffect, useState } from "react";
import { Glyph } from "./Icons";
import { SectionBar } from "./ConnectKit";
import { StepBadge } from "./Steps";
import { fetchHostedEvents } from "../lib/adRequests";
import { fetchProfiles, matchProfile } from "../lib/referrals";
import { getProfile } from "../lib/profile";
import { fmtDateRange, fmtTime } from "./EventVisuals";

// Shared parts of Cesar's Promote & Earn forms (Figma, Nov 16): Calculate
// Advertising Cost, Private-Label Header, Event Participation, Barter and
// Barter Approval. Yellow numbered bars, gray "Submit Here" boxes, blue
// option circles, the event carousel, the Mini-Card(s) step and the maroon
// "ADD … to My Shopping Cart" bar.

export const Bar = SectionBar;

export const eventIcon = (e) => (/dinner/i.test(e?.title) ? "dinner" : /workshop|seminar/i.test(e?.title) ? "workshop" : "expo");

// Pager row: (‹)  Page ## of ##  (›)
export function PagerRow({ i, n, onGo, word = "Page" }) {
  return (
    <div className="pk-pager">
      <button type="button" onClick={() => onGo(i - 1)} disabled={i <= 0} aria-label="Previous"><Glyph name="pagePrev" size={22} /></button>
      <span>{word ? `${word} ` : ""}<b className="cw-red">{n ? i + 1 : 0}</b> of <b className="cw-red">{n}</b></span>
      <button type="button" onClick={() => onGo(i + 1)} disabled={i >= n - 1} aria-label="Next"><Glyph name="pageNext" size={22} /></button>
    </div>
  );
}

// 1 Event(s) — select one at a time (events hosted by onebigHUB).
export function useHostedEvents() {
  const [events, setEvents] = useState([]);
  useEffect(() => { fetchHostedEvents().then(setEvents); }, []);
  return events;
}

export function EventCard({ e }) {
  if (!e) return <div className="pk-event pk-event-empty">No events hosted by onebigHUB are listed yet.</div>;
  return (
    <a className="pk-event" href={`/event/${e.id}`}>
      <span className="pk-event-when"><span>{fmtDateRange(e.date, e.endDate)}</span><span>{fmtTime(e.time)}</span></span>
      <span className="pk-event-main"><b>{e.title}</b><span>{e.city}{e.location ? `, ${e.location}` : ""}</span><span>Hosted by <b>{e.hostedBy}</b></span><span>{e.cost || "Free"}</span></span>
      <span className="pk-event-img"><Glyph name={eventIcon(e)} size={44} /></span>
    </a>
  );
}

export function EventCarousel({ events, index, onIndex }) {
  const i = Math.min(index, Math.max(0, events.length - 1));
  return (
    <div className="pk-carousel">
      <button type="button" onClick={() => onIndex(i - 1)} disabled={i <= 0} aria-label="Previous event"><Glyph name="pagePrev" size={22} /></button>
      <EventCard e={events[i]} />
      <button type="button" onClick={() => onIndex(i + 1)} disabled={i >= events.length - 1} aria-label="Next event"><Glyph name="pageNext" size={22} /></button>
    </div>
  );
}

export const optKey = (x) => (Array.isArray(x) ? x.filter(Boolean).join(" ") : x);

// Blue option circles ("o Venue"); multi-select. options: [label, hint?].
export function Options({ options, value = [], onChange, single = false }) {
  const toggle = (o) => onChange(single ? [o] : value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <div className="pk-opts">
      {options.map((x) => {
        const [label, hint] = Array.isArray(x) ? x : [x];
        const o = optKey(x);
        return (
          <label key={o} className={`pk-opt ${value.includes(o) ? "on" : ""}`}>
            <input type={single ? "radio" : "checkbox"} checked={value.includes(o)} onChange={() => toggle(o)} />
            <span>{label}</span>{hint && <i>{hint}</i>}
          </label>
        );
      })}
    </div>
  );
}

// Gray box: bold label + italic hint, "Submit Here" field.
export function GBox({ label, hint, value, onChange, rows = 1, placeholder = "Submit Here", type = "text", white = false }) {
  return (
    <label className={`pk-gbox ${white ? "pk-white" : ""}`}>
      <span className="pk-label"><b>{label}</b>{hint && <i> {hint}</i>}</span>
      {rows > 1
        ? <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

// "Upload Here — Icon, Image or Logo" (preview stays in this browser).
export function UploadBox({ value, onChange, text = <>Upload Here<br />Icon, Image<br />or Logo</>, className = "" }) {
  return (
    <label className={`pk-upload ${className}`}>
      {value ? <img src={value} alt="" /> : <span>{text}</span>}
      <input type="file" accept="image/*" hidden onChange={(e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader(); r.onload = () => onChange(r.result); r.readAsDataURL(f);
      }} />
    </label>
  );
}

// Mini-card in Cesar's layout: name, title / business · picture · phone, email, city.
export function MiniCardView({ p, placeholder = false, logo = false }) {
  const ph = placeholder || !p;
  const v = (x, d) => (ph ? d : x || "");
  return (
    <div className={`pk-mini ${ph ? "ph" : ""}`}>
      <b className={ph ? "cw-red" : ""}>{logo ? v(p?.business, "Business / Organization") : v(p?.name, "Name") + (p?.title ? `, ${p.title}` : ph ? ", Title" : "")}</b>
      <span className={ph ? "cw-red" : "cw-blue"}>{logo ? <i>{v(p?.tagline || p?.pitchTitle, "Tagline, Product(s) or Service(s)")}</i> : v(p?.business, "Business / Organization")}</span>
      <span className="pk-mini-row">
        <span className="pk-mini-av">{p?.image ? <img src={p.image} alt="" /> : logo ? "Logo" : "Image"}</span>
        <span className="pk-mini-meta">
          <span className={ph ? "cw-red" : ""}>{v(logo ? p?.bizPhone || p?.phone : p?.phone, "(xxx) xxx-xxxx")}</span>
          <span className="cw-blue">{v(logo ? p?.url : p?.email, logo ? "URL / Website" : "Email")}</span>
          <span className={ph ? "cw-red" : ""}>{v(logo ? p?.bizCity || p?.city : p?.city, "City, State")}</span>
        </span>
      </span>
    </div>
  );
}

const MC_FIELDS = [
  [["name", "Name, Title"], ["phone", "Mobile / Phone", "(xxx) xxx-xxxx"], ["email", "Email"], ["city", "City, State"]],
  [["business", "Business / Organization"], ["tagline", "Biz / Org Tagline, Product(s) or Service(s)"], ["bizPhone", "Biz / Org Phone", "(xxx) xxx-xxxx"], ["url", "Biz / Org URL / Website"], ["bizCity", "City, State"]],
  [["locName", "Expo, Dinner, or Workshop Location Name", "", "If applicable"], ["locAddress", "Location Address"], ["locCity", "City, State"]],
];

// 3 Mini-Card(s): SEARCH for your mini-card, pick one, OR submit the fields.
export function MiniCardStep({ value, onChange, location = true }) {
  const [profiles, setProfiles] = useState([]);
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    const me = getProfile();
    fetchProfiles().then((ps) => setProfiles(me?.name ? [{ id: "me", ...me }, ...ps] : ps));
  }, []);
  const found = profiles.filter((p) => matchProfile(p, applied));
  const cur = found[Math.min(i, Math.max(0, found.length - 1))];
  const m = value || {};
  const set = (k) => (v) => onChange({ ...m, id: "manual", [k]: v });
  const groups = location ? MC_FIELDS : MC_FIELDS.slice(0, 2);
  return (
    <>
      <div className="pk-gbox pk-search">
        <span className="pk-label"><b>SEARCH for Your Mini-Card</b></span>
        <input value={q} placeholder="Submit Here" onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setApplied(q); setI(0); } }} />
        <button type="button" className="cw-submit" onClick={() => { setApplied(q); setI(0); }}>Submit</button>
      </div>
      {cur && (
        <button type="button" className={`pk-pick ${m.id === cur.id ? "on" : ""}`} onClick={() => onChange({ ...cur })} aria-label={`Select ${cur.name}`}>
          <MiniCardView p={cur} />
        </button>
      )}
      <PagerRow i={Math.min(i, Math.max(0, found.length - 1))} n={found.length} onGo={setI} word="" />
      <div className="pk-or"><span>OR</span></div>
      <MiniCardView p={m.id === "manual" ? m : m.name ? m : null} placeholder={!m.name} />
      {groups.map((g, gi) => (
        <div key={gi} className="pk-fields">
          {g.map(([k, label, ph, hint]) => <GBox key={k} label={label} hint={hint} value={m[k]} onChange={set(k)} placeholder={ph || "Submit Here"} />)}
        </div>
      ))}
    </>
  );
}

export function ContactUs() {
  return (
    <div className="pk-gbox pk-white">
      <b className="cw-blue pk-contact">Contact Us</b>
      <span>Cesar Plata, Co-Founder onebig<b className="cw-red">HUB</b>.com, <a href="tel:4082399006">408 239-9006</a>, <a href="mailto:cplata@everyCircle.com">cplata@everyCircle.com</a></span>
    </div>
  );
}

// Maroon pill: (n) ADD … to My Shopping Cart
export function CartBar({ n, children = "ADD Selection to My Shopping Cart", onClick, done, disabled }) {
  return (
    <div className="pk-cartwrap">
      <button type="button" className="pk-cart" onClick={onClick} disabled={disabled || done}>
        {n != null && <StepBadge n={n} />}
        <span>{done ? "✓ Added to My Shopping Cart" : children}</span>
      </button>
      {done && <a href="/dashboards?open=cart" className="pk-cartlink">View My Shopping Cart</a>}
    </div>
  );
}

// "OPTION Click here to BARTER …"
export function BarterOption() {
  return (
    <a className="pk-barter" href="/advertising/rates#barter">
      <Glyph name="barter" size={30} />
      <span><b className="cw-red">OPTION</b> Click here to <b className="cw-red">BARTER</b> in exchange for<br />advertising or participation in events hosted by <b>onebig<span className="cw-red">HUB</span></b></span>
    </a>
  );
}

export function HostedBy() {
  return <p className="pk-hosted"><i>If applicable</i> • Hosted by <b>onebig<span className="cw-red">HUB</span></b></p>;
}
