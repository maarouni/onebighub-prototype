"use client";

import { useEffect, useState } from "react";
import { Field, Input, MiniCard, OrLine } from "./Form";
import { fetchHostedEvents } from "../lib/adRequests";
import { fetchProfiles, matchProfile } from "../lib/referrals";
import { getProfile } from "../lib/profile";
import { fmtWhen } from "./EventVisuals";

// Event(s) — select all that apply (hosted by onebigHUB / everyCircle).
export function EventPicker({ value, onChange }) {
  const [events, setEvents] = useState([]);
  useEffect(() => { fetchHostedEvents().then(setEvents); }, []);
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className="box">
      <h2>Event(s) <i className="nt-hint">Select all that apply</i></h2>
      <div className="mini-card-list">
        {events.map((e) => (
          <label key={e.id} className={`mini-card ${value.includes(e.id) ? "on" : ""}`} style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={value.includes(e.id)} onChange={() => toggle(e.id)} />
            <span className="mini-card-body"><b>{e.title}</b><span className="mini-card-meta">{fmtWhen(e)} · {e.city} · Hosted by {e.hostedBy} · {e.cost || "Free"}</span></span>
          </label>
        ))}
        {!events.length && <p className="nt-hint">No onebigHUB / everyCircle events listed yet.</p>}
      </div>
    </div>
  );
}

// Mini-Card(s): pick yours / search a profile, OR type the details.
export function MiniCardPicker({ value, onChange }) {
  const [profiles, setProfiles] = useState([]);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("search");
  useEffect(() => {
    const me = getProfile();
    fetchProfiles().then((ps) => setProfiles(me.name ? [{ id: "me", ...me }, ...ps] : ps));
  }, []);
  const manual = value?.id === "manual" ? value : { id: "manual", name: "", title: "", business: "", tagline: "", phone: "", email: "", url: "", city: "" };
  const setM = (k) => (v) => onChange({ ...manual, [k]: v });
  return (
    <div className="box">
      <h2>Mini-Card(s) <i className="nt-hint">Select / Submit</i></h2>
      <div className="job-type-grid">
        <label className="fp-option"><input type="radio" checked={mode === "search"} onChange={() => setMode("search")} /><span className="fp-label">Search your mini-card</span></label>
        <label className="fp-option"><input type="radio" checked={mode === "manual"} onChange={() => { setMode("manual"); onChange(manual); }} /><span className="fp-label">Type it in</span></label>
      </div>
      {mode === "search" ? (
        <>
          <input placeholder="SEARCH your mini-card" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%", padding: "8px 10px", margin: "8px 0" }} />
          <div className="mini-card-list">
            {profiles.filter((p) => matchProfile(p, q)).slice(0, 20).map((p) => <MiniCard key={p.id} p={p} selected={value?.id === p.id} onClick={() => onChange(p)} />)}
          </div>
        </>
      ) : (
        <div className="job-form">
          <OrLine />
          <Field label="Name, Title" req><Input value={manual.name} onChange={setM("name")} /></Field>
          <Field label="Business / Organization"><Input value={manual.business} onChange={setM("business")} /></Field>
          <Field label="Tagline, Product(s) or Service(s)"><Input value={manual.tagline} onChange={setM("tagline")} /></Field>
          <Field label="Phone"><Input type="tel" value={manual.phone} onChange={setM("phone")} placeholder="(xxx) xxx-xxxx" /></Field>
          <Field label="Email"><Input type="email" value={manual.email} onChange={setM("email")} /></Field>
          <Field label="URL / Website"><Input type="url" value={manual.url} onChange={setM("url")} placeholder="https://" /></Field>
          <Field label="City, State"><Input value={manual.city} onChange={setM("city")} /></Field>
          <p className="nt-hint">Image / logo upload comes with the database.</p>
        </div>
      )}
    </div>
  );
}
