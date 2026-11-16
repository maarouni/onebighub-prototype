"use client";

import { useEffect, useState } from "react";
import { ReferralShell, ReferralPicker, Parties, useReferralPicker } from "./ReferralShell";
import { INTRO_TEMPLATE, REMINDER_TEMPLATE, REMINDER_DAYS, logEvent } from "../lib/referrals";

// 2a Send Message / 2b Send Auto-Reminder Message(s) (Figma Rev 261115).
// Send opens your email / text app; it's logged on Submit Referral Status.
const fmt = (d) => d.toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function MessageStep({ kind }) {
  const reminder = kind === "reminder";
  const { list, id, setId, current, refresh } = useReferralPicker();
  const [subject, setSubject] = useState("Referral Introduction");
  const [body, setBody] = useState("");
  const [via, setVia] = useState("both");
  const [flash, setFlash] = useState("");
  useEffect(() => { if (current) setBody((reminder ? REMINDER_TEMPLATE : INTRO_TEMPLATE)(current)); }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const log = current?.log || [];
  const intro = log.find((e) => e.kind === "intro");
  const sentReminders = log.filter((e) => e.kind === "reminder");
  const emails = current ? [current.b?.email, current.c?.email].filter(Boolean) : [];
  const phones = current ? [current.b?.phone, current.c?.phone].filter(Boolean) : [];

  function send() {
    if (!current) return;
    const s = reminder ? `Reminder: ${subject}` : subject;
    if (via !== "text") window.location.href = `mailto:${emails.join(",")}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(body)}`;
    else window.location.href = `sms:${phones.join(",")}?&body=${encodeURIComponent(body)}`;
    logEvent(current, { kind, item: reminder ? "Auto-Reminder Msg" : "01. Sent Intro Message", by: "A", to: "B, C", type: via === "text" ? "Txt" : "Em" });
    refresh();
    setFlash(reminder ? "Reminder logged on Submit Referral Status." : "Logged on Submit Referral Status as 01. Sent Intro Message.");
  }

  const due = intro ? REMINDER_DAYS.map((d, i) => {
    const t = new Date(intro.atIso || current.created); t.setDate(t.getDate() + d);
    return { d, at: t, sent: sentReminders[i] };
  }) : [];

  return (
    <ReferralShell>
      <ReferralPicker list={list} id={id} setId={setId} />
      {current && (
        <>
          <div className="cw-bar"><span className="step-badge">{reminder ? "2b" : "2a"}</span>
            <b>{reminder ? "Send Auto-Reminder Message(s)" : "Send Message"}</b>
            <em>{reminder ? "from Connector (A)" : "Connector (A) Introduces Participants (B, C) to Each Other"}</em></div>
          <p className="ref-sub"><i>Edit / Select / Submit all that apply</i></p>
          {reminder && (
            <div className="cw-box">
              <b>Reminder schedule</b> <i>after 5, 10 and 20 days</i>
              {!intro ? <span className="cw-muted">Send the introduction first (step 2a).</span>
                : due.map((r) => <span key={r.d}>{r.d} days — {r.sent ? <>sent {r.sent.at}</> : <>due {fmt(r.at)}</>}</span>)}
            </div>
          )}
          <div className="ref-head">
            <div className="cw-box">
              <span className="cw-red">{fmt(new Date())}</span>
              <span><b>From:</b> <span className="cw-red">{current.a?.name || "Connector (A)"}</span></span>
              <span><b>To:</b> <span className="cw-red">{current.b?.name || "Vendor (B)"}, {current.c?.name || "Potential Client (C)"}</span></span>
              <label className="ref-subj"><b>Subject:</b> <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="ex. Referral Introduction" /></label>
            </div>
            <div className="cw-box">
              <span><b>Contact by</b> <i>Select one</i></span>
              {[["both", "Both", true], ["email", "Email"], ["text", "Text"]].map(([v, l, def]) => (
                <label key={v} className="fp-option ct-opt"><input type="radio" name="ref-via" checked={via === v} onChange={() => setVia(v)} /> <span className="fp-label">{l}{def && <i> Default</i>}</span></label>
              ))}
            </div>
          </div>
          <div className="cw-box"><textarea rows={14} value={body} onChange={(e) => setBody(e.target.value)} /></div>
          {(via !== "text" && !emails.length) && <p className="nt-hint">No email on file for B or C — add it in your email app.</p>}
          <div className="em-center"><button type="button" className="cw-submit" onClick={send} disabled={reminder && !intro}>Submit</button></div>
          {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
          <Parties r={current} />
          <p className="proto-note">Prototype: Submit opens your email (or text) app. Automatic reminders need the database and a mail service.</p>
        </>
      )}
    </ReferralShell>
  );
}
