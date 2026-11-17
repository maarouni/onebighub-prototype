"use client";

import { useEffect, useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Glyph } from "../../components/Icons";
import { Bar, EventRow, MiniCardView, PagerRow, optKey } from "../../components/PromoKit";
import { ALL_SECTIONS, SEEKING, listRequests, saveRequest } from "../../lib/adRequests";
import { hasData } from "../../components/PartForm";
import { fetchEvents } from "../../lib/events";
import { nowStamp } from "../../lib/auth";

// Cesar's "Barter Approval" (Figma, Nov 16 — header ONLY for Cesar Plata).
// Event, Request Submitted / Request # x of y, the requester's two
// mini-cards, Accept / Decline + Message, then what they selected in each
// section (read-only). Real access control needs accounts and roles in the
// database, so the prototype only labels it.
const label = (opts, key) => {
  const o = opts.find((x) => optKey(x) === key);
  if (!o) return key;
  return Array.isArray(o) ? <>{o[0]} <i>{o[1]}</i></> : o;
};
const Sel = ({ opts, keys }) => (keys?.length
  ? <ul className="ba-sel">{keys.map((k) => <li key={k}>{label(opts, k)}</li>)}</ul>
  : <span className="ba-none">—</span>);

function ReadOnly({ s, v }) {
  return (
    <div className="pk-part ba-ro">
      <div className="pk-part-side">{s.icon === "megaphone" ? <img className="pk-ico3d" src="/icons/earn.png" alt="" /> : <Glyph name={s.icon} size={s.icon === "expo" ? 96 : 52} />}{v.upload && <img className="ba-up" src={v.upload} alt="Uploaded" />}</div>
      <div className="pk-part-main">
        {s.barter && <><span className="pk-label"><b>Seeking</b> <i className="cw-red">Barter is subject to approval</i></span><Sel opts={SEEKING} keys={v.seek} /></>}
        <span className="pk-label pk-gap"><b>{s.barter ? "Offering to Provide" : "Selection(s)"}</b></span>
        {v.offerText && <p className="ba-text">{v.offerText}</p>}
        {s.groups.map((g, i) => {
          const keys = (v.roles || []).filter((k) => g.options.some((o) => optKey(o) === k));
          return (g.title || keys.length || s.groups.length === 1) ? <div key={i} className="pk-group">{g.title && <b>{g.title}</b>}<Sel opts={g.options} keys={keys} /></div> : null;
        })}
        {v.other && <p className="ba-text"><b>Other:</b> {v.other}</p>}
        {s.fields.map(([k, l, h]) => v.fields?.[k] ? <div key={k}><b>{l}</b>{h && <i> {h}</i>}<p className="ba-text">{v.fields[k]}</p></div> : null)}
      </div>
    </div>
  );
}

export default function BarterApproval() {
  const [reqs, setReqs] = useState([]);
  const [i, setI] = useState(0);
  const [events, setEvents] = useState({});
  const [decision, setDecision] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState("pending");
  const [si, setSi] = useState(0);

  useEffect(() => {
    setReqs(listRequests());
    fetchEvents().then((l) => setEvents(Object.fromEntries(l.map((e) => [e.id, e]))));
  }, []);
  const shown = reqs.filter((r) => show === "all" || r.status === show);
  const at = Math.min(i, Math.max(0, shown.length - 1));
  const r = shown[at];
  useEffect(() => { setDecision(r?.decision || ""); setMsg(r?.message || ""); }, [r?.id]);

  function submit() {
    if (!decision) return;
    saveRequest({ ...r, status: decision, decision, message: msg, decided: nowStamp() });
    setReqs(listRequests());
  }

  const barter = r?.kind === "barter";
  const data = r?.data || {};
  const secs = ALL_SECTIONS.filter((x) => hasData(data[x.id]));
  const sAt = Math.min(si, Math.max(0, secs.length - 1));
  const sec = secs[sAt];
  return (
    <AdPage title={<>Barter Approval&nbsp;&nbsp;<i className="pb-sub">ONLY for Cesar Plata</i></>} icon="barter" mode="edit">
      <div className="cw-page pk-page">
        <div className="ba-admin">
          <span className="pill">Only for Cesar Plata</span>
          {["pending", "accepted", "declined", "all"].map((k) => (
            <label key={k} className={`pk-opt ${show === k ? "on" : ""}`}><input type="radio" name="show" checked={show === k} onChange={() => { setShow(k); setI(0); setSi(0); }} /><span>{k[0].toUpperCase() + k.slice(1)}</span></label>
          ))}
        </div>
        {/* Nov 17 (Cesar's Figma): 1 Request to Barter · 2 Barter Selection · decision box */}
        <Bar n={1} title="Request to Barter" hint="Select one at a time">
          {!r ? <div className="pk-gbox pk-white">No {show === "all" ? "" : show} requests yet. <i className="cw-muted">Prototype: shows requests submitted in this browser from <a href="/advertising/participation">Event Participation</a>, <a href="/advertising/rates#barter">Rates</a> and <a href="/advertising/private-label">Your Private-Labeled Header</a>.</i></div> : (
            <div className="ba-req">
              <div className="ba-reqbox">
                <span><b>Request #</b>&nbsp; <span className="cw-red">{at + 1}</span> of <span className="cw-red">{shown.length}</span> &nbsp;<span className={`pill ${r.status}`}>{r.status}</span></span>
                <span><b>Submitted</b>&nbsp; <span className="cw-red">{r.submitted}</span></span>
              </div>
              <MiniCardView p={r.card} />
              {r.events?.[0] && events[r.events[0]] && <EventRow e={events[r.events[0]]} />}
              <PagerRow i={at} n={shown.length} onGo={(n) => { setI(n); setSi(0); }} word="" />
            </div>
          )}
        </Bar>
        {r && (
          <>
            <Bar n="2" title={<>Barter <i className="cw-red">Selection</i></>}>
              {sec ? (
                <>
                  <div className="ba-sec-title"><b>{sec.title}</b></div>
                  <ReadOnly s={sec} v={data[sec.id]} />
                  <PagerRow i={sAt} n={secs.length} onGo={setSi} word="" />
                </>
              ) : <p className="cw-muted">No selections in this request.</p>}
              {r.payment?.length > 0 && <div className="pk-gbox pk-white"><b>Payment</b><span>{r.payment.join(", ")}</span></div>}
            </Bar>
            <div className="pk-gbox pk-white">
              <span className="cw-red">{r.decided || nowStamp()}</span>
              <span className="pk-label pk-gap"><b>Barter Approval</b></span>
              <div className="pk-opts">
                {[["accepted", "Accept"], ["declined", "Decline"]].map(([k, t]) => (
                  <label key={k} className={`pk-opt ${decision === k ? "on" : ""}`}><input type="radio" name="dec" checked={decision === k} onChange={() => setDecision(k)} /><span>{t}</span></label>
                ))}
              </div>
              <span className="pk-label pk-gap"><b>Message</b></span>
              <textarea className="pk-inline" rows={3} placeholder="Submit Here" value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Message" />
              <button type="button" className="cw-submit pk-center" disabled={!decision} onClick={submit}>Submit</button>
              {r.decided && <span className="nt-hint">Decided {r.decided} — {r.status}.</span>}
            </div>
          </>
        )}
      </div>
    </AdPage>
  );
}
