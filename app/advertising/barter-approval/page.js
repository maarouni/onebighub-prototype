"use client";

import { useEffect, useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Field, Area, Radios, MiniCard } from "../../components/Form";
import { BARTER, PARTICIPATION, listRequests, saveRequest } from "../../lib/adRequests";
import { fetchEvents } from "../../lib/events";
import { fmtWhen } from "../../components/EventVisuals";
import { nowStamp } from "../../lib/auth";

// Cesar's "Barter Approval" (Figma Advertising/BarterApproval — header
// "ONLY for Cesar Plata"). Admin page; real access control needs accounts
// and roles in the database, so the prototype only labels it.
export default function BarterApproval() {
  const [reqs, setReqs] = useState([]);
  const [i, setI] = useState(0);
  const [events, setEvents] = useState({});
  const [decision, setDecision] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState("pending");

  useEffect(() => {
    setReqs(listRequests());
    fetchEvents().then((l) => setEvents(Object.fromEntries(l.map((e) => [e.id, e]))));
  }, []);
  const shown = reqs.filter((r) => show === "all" || r.status === show);
  const r = shown[Math.min(i, shown.length - 1)];
  useEffect(() => { setDecision(r?.decision || ""); setMsg(r?.message || ""); }, [r?.id]);

  function submit() {
    if (!decision) return;
    saveRequest({ ...r, status: decision, decision, message: msg, decided: nowStamp() });
    setReqs(listRequests());
  }

  const sections = r?.kind === "barter" ? BARTER : PARTICIPATION;
  return (
    <AdPage title="Barter Approval">
      <div className="box">
        <p><span className="pill">Admin</span> Only for the site owner. <i>Prototype: shows requests submitted in this browser.</i></p>
        <Radios name="show" value={show} onChange={(v) => { setShow(v); setI(0); }}
          options={[{ id: "pending", label: "Pending" }, { id: "accepted", label: "Accepted" }, { id: "declined", label: "Declined" }, { id: "all", label: "All" }]} />
      </div>
      {!r ? <div className="box">No {show === "all" ? "" : show} requests.</div> : (
        <>
          <div className="box">
            <div className="send-masoud-actions">
              <button type="button" className="btn-ghost btn-sm" disabled={i === 0} onClick={() => setI(i - 1)}>‹ Prev</button>
              <b>Request # {Math.min(i, shown.length - 1) + 1} of {shown.length}</b>
              <button type="button" className="btn-ghost btn-sm" disabled={i >= shown.length - 1} onClick={() => setI(i + 1)}>Next ›</button>
            </div>
            <p className="nt-hint">{r.kind === "barter" ? "Barter" : "Event Participation"} · Request submitted {r.submitted} · <span className={`pill ${r.status}`}>{r.status}</span></p>
            <MiniCard p={r.card} />
            <h3>Event(s)</h3>
            <ul className="dash-plain-list">{(r.events || []).map((id) => <li key={id}>{events[id] ? `${events[id].title} — ${fmtWhen(events[id])}, ${events[id].city}` : id}</li>)}{!(r.events || []).length && <li>—</li>}</ul>
            {sections.map((s) => {
              const sel = r.kind === "barter" ? r.seek?.[s.id] : r.roles?.[s.id];
              if (!sel?.length) return null;
              return (
                <div key={s.id}>
                  <h3>{s.title}</h3>
                  <p><b>{r.kind === "barter" ? "Seeking" : "Participating as"}:</b> {sel.join(", ")}</p>
                  {r.offer?.[s.id] && <p><b>Offering to provide:</b> {r.offer[s.id]}</p>}
                  {Object.entries(r.text || {}).filter(([k]) => k.startsWith(`${s.id}.`)).map(([k, v]) => v && <p key={k}><b>{k.split(".")[1]}:</b> {v}</p>)}
                </div>
              );
            })}
          </div>
          <div className="box job-form">
            <h2>Barter Approval</h2>
            <Radios name="dec" value={decision} onChange={setDecision} options={[{ id: "accepted", label: "Accept" }, { id: "declined", label: "Decline" }]} />
            <Field label="Message" wide><Area rows={3} value={msg} onChange={setMsg} /></Field>
            <button type="button" className="btn-primary" disabled={!decision} onClick={submit}>Submit</button>
            {r.decided && <p className="nt-hint">Decided {r.decided}.</p>}
          </div>
        </>
      )}
    </AdPage>
  );
}
