"use client";

import { useEffect, useState } from "react";
import { ReferralShell, ReferralPicker, useReferralPicker } from "../../components/ReferralShell";
import { Field, Area, Input, MiniCard } from "../../components/Form";
import { CRITERIA, avgProducts, avgServices, saveReferral, nowStamp } from "../../lib/referrals";

// Step 4 — Evaluations. The Connector (A) evaluates B and C; B and C
// evaluate each other (and A). Criteria 0 = Low, 10 = High; N/A is left out
// of the averages: Products = (A..F) / 6, Services = (A..H) / 8.
const ROLE_NAMES = { A: "Connector (A)", B: "Vendor (B)", C: "Potential Client (C)" };
const TARGETS = { A: ["B", "C"], B: ["C", "A"], C: ["B", "A"] };
const party = (r, k) => (k === "A" ? r.a : k === "B" ? r.b : r.c);

function Scores({ value, onChange }) {
  return (
    <>
      {CRITERIA.map((c) => (
        <div key={c.id} className="eval-row">
          <span><b>{c.id}.</b> {c.label}{c.scale && <><br /><i className="nt-hint">{c.scale}</i></>}</span>
          <select value={value[c.id] ?? "na"} onChange={(e) => onChange({ ...value, [c.id]: e.target.value })} aria-label={c.label}>
            <option value="na">N/A</option>
            {Array.from({ length: 11 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
          </select>
        </div>
      ))}
    </>
  );
}

export default function Evaluations() {
  const { list, id, setId, current, refresh } = useReferralPicker();
  const [as, setAs] = useState("A");
  const [draft, setDraft] = useState({});
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!current) return;
    const d = {};
    TARGETS[as].forEach((t) => { d[t] = current.evaluations?.[`${as}>${t}`] || { scores: {}, comment: "", referral: "" }; });
    setDraft(d);
  }, [current?.id, as]);

  if (!list.length || !current) return <ReferralShell subtitle="Evaluations"><ReferralPicker list={list} id={id} setId={setId} /></ReferralShell>;

  function submit() {
    const ev = { ...(current.evaluations || {}) };
    TARGETS[as].forEach((t) => { ev[`${as}>${t}`] = { ...draft[t], at: nowStamp() }; });
    saveReferral({ ...current, evaluations: ev });
    refresh();
    setFlash("Evaluations saved — they show on the Status page under 08.");
  }

  return (
    <ReferralShell subtitle="Evaluations">
      <ReferralPicker list={list} id={id} setId={setId} />
      <div className="box">
        <span className="ed-label">Submitting evaluations as</span>{" "}
        <select value={as} onChange={(e) => setAs(e.target.value)} style={{ padding: 8 }}>
          {Object.entries(ROLE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <p className="nt-hint">* A little courtesy &amp; kindness goes a long way! Please submit your comments / reviews as praise OR constructive criticism.</p>
      </div>
      <div className="eval-grid">
        {TARGETS[as].map((t) => {
          const d = draft[t] || { scores: {}, comment: "", referral: "" };
          const set = (patch) => setDraft({ ...draft, [t]: { ...d, ...patch } });
          return (
            <div key={t} className="box job-form">
              <h2>{ROLE_NAMES[t]}</h2>
              <MiniCard p={party(current, t)} />
              {t !== "A" && <Field label="Referral" hint="TBD / $ xx,xxx / xx %"><Input value={d.referral} onChange={(v) => set({ referral: v })} placeholder="TBD" /></Field>}
              <Field label={`My Comments About ${ROLE_NAMES[t]}`} wide><Area rows={3} value={d.comment} onChange={(v) => set({ comment: v })} /></Field>
              <h3>Criteria <i className="nt-hint">0 = Low, 10 = High</i></h3>
              <Scores value={d.scores || {}} onChange={(scores) => set({ scores })} />
              <p className="eval-avg">Avg rating for Products = {avgProducts(d.scores)} (A–F) / 6 · Services = {avgServices(d.scores)} (A–H) / 8</p>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn-primary" onClick={submit}>Submit Evaluations</button>
      {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
    </ReferralShell>
  );
}
