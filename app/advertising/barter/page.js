"use client";

import { useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Checks, Field, Area } from "../../components/Form";
import { EventPicker, MiniCardPicker } from "../../components/RequestParts";
import { BARTER, EXHIBITOR_INSTRUCTIONS, newRequest } from "../../lib/adRequests";

// Cesar's "Barter" (Figma Advertising/Barter, Rev 261025). Seeking barter is
// subject to approval (Advertising/BarterApproval).
export default function Barter() {
  const [events, setEvents] = useState([]);
  const [seek, setSeek] = useState({});
  const [offer, setOffer] = useState({});
  const [text, setText] = useState({});
  const [card, setCard] = useState(null);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  function submit() {
    const any = BARTER.some((b) => (seek[b.id] || []).length);
    if (!any) return setErr("Select what you're seeking in at least one barter section.");
    const missing = BARTER.find((b) => (seek[b.id] || []).length && !(offer[b.id] || "").trim());
    if (missing) return setErr(`Describe what you're offering to provide in "${missing.title}".`);
    if (!card?.name?.trim()) return setErr("Select or enter your mini-card.");
    setErr("");
    setDone(newRequest("barter", { events, seek, offer, text, card }));
  }

  if (done) {
    return (
      <AdPage title="Barter">
        <section className="ad-box"><h2>Barter request submitted</h2>
          <p>Request <b>{done.id}</b> · {done.submitted}. Barter is subject to approval — you&rsquo;ll hear back after review.</p>
          <a href="/advertising" className="tpl-action">Back to Earn with Advertising</a></section>
      </AdPage>
    );
  }

  return (
    <AdPage title="Barter">
      <EventPicker value={events} onChange={setEvents} />
      {BARTER.map((b) => (
        <div key={b.id} className="box job-form">
          <h2>{b.title}</h2>
          <p className="nt-hint">If applicable, select / submit all that apply. Seeking barter is subject to approval.</p>
          <span className="ed-label">Seeking</span>
          <Checks name={`seek-${b.id}`} options={b.seeking} value={seek[b.id] || []} onChange={(v) => setSeek({ ...seek, [b.id]: v })} />
          <Field label="Offering to Provide" hint={b.hint} wide><Area rows={2} value={offer[b.id]} onChange={(v) => setOffer({ ...offer, [b.id]: v })} /></Field>
          {b.fields.map(([k, label]) => <Field key={k} label={label} wide><Area rows={2} value={text[`${b.id}.${k}`]} onChange={(v) => setText({ ...text, [`${b.id}.${k}`]: v })} /></Field>)}
        </div>
      ))}
      <div className="box">
        <h2>Instructions / Request for All Exhibitors and Participants</h2>
        <ul className="dash-plain-list">{EXHIBITOR_INSTRUCTIONS.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <MiniCardPicker value={card} onChange={setCard} />
      {err && <p className="ed-error">{err}</p>}
      <button type="button" className="btn-primary" onClick={submit}>Submit</button>
      <p className="nt-hint" style={{ marginTop: 12 }}>Admin: <a href="/advertising/barter-approval">Barter Approval</a></p>
    </AdPage>
  );
}
