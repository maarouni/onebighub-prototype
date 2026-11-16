"use client";

import { useEffect, useState } from "react";
import { ReferralPicker, useReferralPicker } from "./ReferralShell";
import { MiniCard } from "./Form";
import { CRITERIA, AV_LEGEND, CV_LEGEND, avgProducts, avgServices, saveReferral, nowStamp } from "../lib/referrals";

// Evaluation columns (Figma Rev 261115): per participant — Referral $ / %,
// Criteria table (AV CV A–H, 0 = Low, 10 = High), averages, then one slider
// per criterion with "Not Applicable / No Response" as the default.
const NAMES = { A: "Connector (A)", B: "Participant (B)", C: "Participant (C)" };
const party = (r, k) => (k === "A" ? r.a : k === "B" ? r.b : r.c);
const show = (v) => (v === undefined || v === "na" || v === "" ? "##" : String(v).padStart(2, "0"));

function Slider({ c, value, onChange }) {
  const na = value === undefined || value === "na" || value === "";
  return (
    <div className="ev-slider">
      <b>{c.id}. {c.label}</b>
      <label className="fp-option"><input type="checkbox" checked={na} onChange={(e) => onChange(e.target.checked ? "na" : 5)} /> <span className="fp-label">Not Applicable / No Response <i>Default</i></span></label>
      <div className="ev-range">
        <span>0</span>
        <input type="range" min="0" max="10" step="1" value={na ? 5 : value} disabled={na} onChange={(e) => onChange(Number(e.target.value))} aria-label={c.label} />
        <span>10</span>
        <output className={na ? "cw-muted" : "cw-red"}>{na ? "–" : value}</output>
      </div>
      {c.id === "AV" && <ul className="ev-legend">{AV_LEGEND.map(([n, t]) => <li key={n}><b>{n}</b> {t}</li>)}</ul>}
      {c.id === "CV" && <ul className="ev-legend">{CV_LEGEND.map(([n, t, h]) => <li key={n}><b>{n}</b> {n === "5" ? <b className="cw-red">{t}</b> : t} <i>{h}</i></li>)}</ul>}
    </div>
  );
}

function Column({ r, target, d, set }) {
  const s = d.scores || {};
  return (
    <div className="ev-col">
      <div className="cw-bar"><b>{NAMES[target]}</b></div>
      <MiniCard p={party(r, target)} />
      {target !== "A" && (
        <div className="cw-box ev-ref">
          <b>Referral:</b> $ <input className="rsvp-num" type="number" min="0" value={d.refAmt || ""} onChange={(e) => set({ refAmt: e.target.value })} placeholder="xx,xxx" />
          or <input className="rsvp-num" type="number" min="0" max="100" value={d.refPct || ""} onChange={(e) => set({ refPct: e.target.value })} placeholder="xx" /> <b>% of Gross Sale</b>
        </div>
      )}
      <div className="cw-box">
        <span><b>Criteria</b> * <i>0 = Low, 10 = High</i></span>
        <table className="ev-table"><thead><tr>{CRITERIA.map((c) => <th key={c.id} className={c.id.length > 1 ? "ev-hi" : ""}>{c.id}</th>)}</tr></thead>
          <tbody><tr>{CRITERIA.map((c) => <td key={c.id} className={`cw-red ${c.id.length > 1 ? "ev-hi" : ""}`}>{show(s[c.id])}</td>)}</tr></tbody></table>
        <p className="ev-avg"><b>Avg Rating for Products = <span className="cw-red">{avgProducts(s)}</span></b><br /><small>(A+B+C+D+E+F) / 6</small></p>
        <p className="ev-avg"><b>Avg Rating for Services = <span className="cw-red">{avgServices(s)}</span></b><br /><small>(A+B+C+D+E+F+G+H) / 8</small></p>
      </div>
      <div className="cw-box ev-keys">
        {CRITERIA.map((c) => <span key={c.id}><b>{c.id}</b> {c.label}</span>)}
        <p><i>* A little courtesy &amp; kindness goes a long way !</i><br />Please submit your comments / reviews as praise OR constructive criticism</p>
      </div>
      <Slider c={CRITERIA[0]} value={s.AV} onChange={(v) => set({ scores: { ...s, AV: v } })} />
      <div className="cw-box">
        <span><b>My Comments About {NAMES[target]}</b> <i>Public</i></span>
        <textarea rows={4} value={d.comment || ""} onChange={(e) => set({ comment: e.target.value })} placeholder="Submit Here" />
      </div>
      <Slider c={CRITERIA[1]} value={s.CV} onChange={(v) => set({ scores: { ...s, CV: v } })} />
      <p className="ev-group"><i>Select one for each about product or service</i></p>
      {CRITERIA.slice(2, 8).map((c) => <Slider key={c.id} c={c} value={s[c.id]} onChange={(v) => set({ scores: { ...s, [c.id]: v } })} />)}
      <p className="ev-group"><i>Select one for each about participant</i></p>
      {CRITERIA.slice(8).map((c) => <Slider key={c.id} c={c} value={s[c.id]} onChange={(v) => set({ scores: { ...s, [c.id]: v } })} />)}
    </div>
  );
}

// pairs: [[evaluator, target], …]
export default function EvalForm({ pairs, title, n }) {
  const { list, id, setId, current, refresh } = useReferralPicker();
  const [draft, setDraft] = useState({});
  const [flash, setFlash] = useState("");
  useEffect(() => {
    if (!current) return;
    const d = {};
    pairs.forEach(([a, t]) => { d[`${a}>${t}`] = current.evaluations?.[`${a}>${t}`] || { scores: {} }; });
    setDraft(d);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function submit() {
    const ev = { ...(current.evaluations || {}) };
    pairs.forEach(([a, t]) => { ev[`${a}>${t}`] = { ...draft[`${a}>${t}`], at: nowStamp() }; });
    saveReferral({ ...current, evaluations: ev });
    refresh();
    setFlash("Evaluations saved — they show on Submit Referral Status under 08.");
  }

  return (
    <>
      <ReferralPicker list={list} id={id} setId={setId} />
      {current && (
        <>
          <div className="cw-bar"><span className="step-badge">{n}</span><b>{title}</b> <em>Select / Submit all that apply</em></div>
          <div className="ev-grid">
            {pairs.map(([a, t]) => {
              const k = `${a}>${t}`;
              const d = draft[k] || { scores: {} };
              return (
                <div key={k}>
                  {a !== "A" && <p className="ev-by"><i>{NAMES[a]} evaluates</i></p>}
                  <Column r={current} target={t} d={d} set={(patch) => setDraft((x) => ({ ...x, [k]: { ...d, ...patch } }))} />
                </div>
              );
            })}
          </div>
          <div className="em-center"><button type="button" className="cw-submit" onClick={submit}>Submit</button></div>
          {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
        </>
      )}
    </>
  );
}
