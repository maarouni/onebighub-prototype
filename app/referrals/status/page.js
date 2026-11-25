"use client";

import { useState } from "react";
import { ReferralShell, ReferralPicker, Parties, useReferralPicker } from "../../components/ReferralShell";
import { Field, Area } from "../../components/Form";
import { CONTACT_TYPES, TRANSACTION_STATUSES, REMINDER_DAYS, logEvent, saveReferral, nowStamp } from "../../lib/referrals";

// Step 4 — Submit Referral Status: the 8-item timeline from Cesar's Figma.
const ROLES = [{ id: "A", label: "Connector (A)" }, { id: "B", label: "Participant (B)" }, { id: "C", label: "Participant (C)" }];

function addDays(iso, n) {
  const d = new Date(iso); d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
}

export default function Status() {
  const { list, id, setId, current, refresh } = useReferralPicker();
  const [by, setBy] = useState("A");
  const [ctype, setCtype] = useState("Em");
  const [toWho, setToWho] = useState(["B", "C"]);
  const [note, setNote] = useState("");
  const [tStatus, setTStatus] = useState(TRANSACTION_STATUSES[1]);
  const [tNote, setTNote] = useState("");

  if (!list.length || !current) {
    return <ReferralShell><ReferralPicker list={list} id={id} setId={setId} /></ReferralShell>;
  }

  const log = current.log || [];
  const intro = log.find((e) => e.kind === "intro");
  const contacts = log.filter((e) => e.kind === "contact");
  const reminders = log.filter((e) => e.kind === "reminder");
  const byRole = (rows, role) => rows.filter((e) => e.by === role);

  function addContact() {
    if (!toWho.length) return;
    logEvent(current, { kind: "contact", by, type: ctype, to: toWho.join(", "), note: note.trim() });
    setNote(""); refresh();
  }
  function addTransaction() {
    const t = [...(current.transaction || []), { at: nowStamp(), by, status: tStatus, note: tNote.trim() }];
    saveReferral({ ...current, transaction: t });
    setTNote(""); refresh();
  }

  const cell = (rows) => rows.length
    ? <ul className="status-log">{rows.map((e, i) => <li key={i}>{e.at} {e.type ? <b>{e.type}</b> : null} {e.to ? `to ${e.to}` : ""}{e.note ? ` — ${e.note}` : ""}</li>)}</ul>
    : "—";

  const evals = current.evaluations || {};
  const evalCell = (role) => Object.keys(evals).filter((k) => k.startsWith(`${role}>`)).map((k) => `${evals[k].at} → ${k.split(">")[1]}`).join("; ") || "—";
  const tx = current.transaction || [];

  return (
    <ReferralShell>
      <ReferralPicker list={list} id={id} setId={setId} />
      <Parties r={current} />

      <div className="box" style={{ marginTop: 14, overflowX: "auto" }}>
        <div className="cw-bar"><span className="step-badge">4</span><b>Submit Referral Status</b> <em>Log In to Select / Submit all that apply</em></div>
        <p className="nt-hint">Suggestion: to maintain transparency and open communication, please correspond with all participants.</p>
        <table className="status-table">
          <thead><tr><th>Item</th>{ROLES.map((r) => <th key={r.id}>{r.label}</th>)}</tr></thead>
          <tbody>
            <tr><td>01. Sent Intro Message <i>email and/or text</i></td><td>{intro ? intro.at : <a href={`/referrals/message?id=${encodeURIComponent(current.id)}`}>Not sent — send now</a>}</td><td>N/A</td><td>N/A</td></tr>
            <tr><td>02. Contact / Notes</td>{ROLES.map((r) => <td key={r.id}>{cell(byRole(contacts, r.id).slice(0, 3))}</td>)}</tr>
            {REMINDER_DAYS.map((d, i) => (
              <tr key={d}><td>0{i + 3}. Auto-Reminder Msg {d} days <i>if applicable</i></td>
                <td>{intro ? <>{reminders[i] ? reminders[i].at : `Due ${addDays(current.created, d)}`}</> : "—"}</td><td>N/A</td><td>N/A</td></tr>
            ))}
            <tr><td>06. Contact / Notes</td>{ROLES.map((r) => <td key={r.id}>{cell(byRole(contacts, r.id).slice(3))}</td>)}</tr>
            <tr><td>07. Transaction Status</td>{ROLES.map((r) => <td key={r.id}>{tx.filter((t) => t.by === r.id).map((t, i) => <div key={i}>{t.at} <b>{t.status}</b>{t.note ? ` — ${t.note}` : ""}</div>)}{!tx.some((t) => t.by === r.id) && "—"}</td>)}</tr>
            <tr><td>08. Submitted Evaluations</td>{ROLES.map((r) => <td key={r.id}>{evalCell(r.id)}</td>)}</tr>
          </tbody>
        </table>
        <p className="nt-hint">Em Sent email · Txt Left text message · Vm Left voicemail · Sw Spoke with · Cor Corresponded by email and/or text</p>
      </div>

      <a className="cw-box ref-cart" href="/dashboards?open=cart"><span className="step-badge">5</span> <b className="cw-blue">o Completed Transaction</b> <i>Submit to My Shopping Cart and Create Invoice</i></a>

      <div className="eval-grid">
        <div className="box job-form">
          <h2>Submit Referral Status</h2>
          <span className="ed-label">Submitting as</span>
          <select value={by} onChange={(e) => setBy(e.target.value)} style={{ padding: 8 }}>{ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
          <h3>Contact / Notes</h3>
          <select value={ctype} onChange={(e) => setCtype(e.target.value)} style={{ padding: 8 }}>
            {CONTACT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.label}</option>)}
          </select>
          <div className="job-type-grid">
            {ROLES.filter((r) => r.id !== by).map((r) => (
              <label key={r.id} className="fp-option">
                <input type="checkbox" checked={toWho.includes(r.id)} onChange={() => setToWho(toWho.includes(r.id) ? toWho.filter((x) => x !== r.id) : [...toWho, r.id])} />
                <span className="fp-label">to {r.id}</span>
              </label>
            ))}
          </div>
          <Field label="Notes" wide><Area rows={2} value={note} onChange={setNote} /></Field>
          <button type="button" className="btn-primary" onClick={addContact}>Add contact note</button>
        </div>
        <div className="box job-form">
          <h2>07. Transaction Status</h2>
          <span className="ed-label">Select one at a time</span>
          <select value={tStatus} onChange={(e) => setTStatus(e.target.value)} style={{ padding: 8 }}>{TRANSACTION_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <Field label="Comments / Notes" wide><Area rows={2} value={tNote} onChange={setTNote} /></Field>
          <button type="button" className="btn-primary btn-submit" onClick={addTransaction}>Submit status</button>
          <a className="tpl-action" href={`/referrals/final?id=${encodeURIComponent(current.id)}`}>5. Submit Final Evaluations →</a>
        </div>
      </div>
    </ReferralShell>
  );
}
