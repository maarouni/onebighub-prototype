"use client";

import { useEffect, useState } from "react";
import { ReferralShell, ReferralPicker, Parties, useReferralPicker } from "../../components/ReferralShell";
import { Field, Input, Area } from "../../components/Form";
import { INTRO_TEMPLATE, logEvent } from "../../lib/referrals";

// Step 2 — Connector (A) introduces B and C to each other. Sending opens your
// own email app with B and C as recipients, and logs it on the Status page.
export default function Message() {
  const { list, id, setId, current, refresh } = useReferralPicker();
  const [subject, setSubject] = useState("Referral Introduction");
  const [body, setBody] = useState("");
  const [flash, setFlash] = useState("");
  useEffect(() => { if (current) setBody(INTRO_TEMPLATE(current)); }, [current?.id]);

  const to = current ? [current.b?.email, current.c?.email].filter(Boolean) : [];
  const sentCount = (current?.log || []).filter((e) => e.kind === "intro").length;

  function send(kind) {
    if (!current) return;
    const s = kind === "reminder" ? `Reminder: ${subject}` : subject;
    window.location.href = `mailto:${to.join(",")}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(body)}`;
    logEvent(current, { kind, item: kind === "intro" ? "01. Sent Intro Message" : "Reminder Message", by: "A", to: "B, C" });
    refresh();
    setFlash(kind === "intro" ? "Logged on the Status page as 01. Sent Intro Message." : "Reminder logged.");
  }

  return (
    <ReferralShell subtitle="Send Message">
      <ReferralPicker list={list} id={id} setId={setId} />
      {current && (
        <>
          <Parties r={current} />
          <div className="box job-form" style={{ marginTop: 14 }}>
            <h2>Send Message: Connector (A) Introduces Participants (B, C) to Each Other</h2>
            <p className="nt-hint">From: {current.a?.name} · To: {current.b?.name}, {current.c?.name}{!to.length && " — no email on file for B or C yet; add one in your email app."}</p>
            <Field label="Subject" wide><Input value={subject} onChange={setSubject} /></Field>
            <Field label="Message" wide hint="Edit as you like"><Area rows={12} value={body} onChange={setBody} /></Field>
            <div className="send-masoud-actions">
              <button type="button" className="btn-primary" onClick={() => send("intro")}>{sentCount ? "Send Again" : "Send Introduction"}</button>
              <button type="button" className="btn-ghost" disabled={!sentCount} onClick={() => send("reminder")}>Send Reminder Message</button>
              <a className="tpl-action" href={`/referrals/status?id=${encodeURIComponent(current.id)}`}>Go to Status →</a>
            </div>
            {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
            <p className="proto-note">Prototype: Send opens your email app; automatic 5 / 10 / 20-day reminders need the database and a mail service.</p>
          </div>
        </>
      )}
    </ReferralShell>
  );
}
