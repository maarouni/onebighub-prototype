"use client";

import { useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Checks, Field, Area } from "../../components/Form";
import { EventPicker, MiniCardPicker } from "../../components/RequestParts";
import { PARTICIPATION, newRequest } from "../../lib/adRequests";

// Cesar's "Event Participation" (Figma Advertising/Event Participation, Rev 261025).
export default function Participation() {
  const [events, setEvents] = useState([]);
  const [roles, setRoles] = useState({});
  const [text, setText] = useState({});
  const [card, setCard] = useState(null);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  function submit() {
    if (!events.length) return setErr("Select at least one event.");
    if (!Object.values(roles).some((r) => r?.length)) return setErr("Pick how you'd like to participate.");
    if (!card?.name?.trim()) return setErr("Select or enter your mini-card.");
    setErr("");
    setDone(newRequest("participation", { events, roles, text, card }));
  }

  if (done) {
    return (
      <AdPage title="Event Participation">
        <section className="ad-box"><h2>Thank you — request submitted</h2>
          <p>Request <b>{done.id}</b> · {done.submitted}. onebigHUB will contact you to confirm details.</p>
          <a href="/advertising" className="tpl-action">Back to Earn with Advertising</a></section>
      </AdPage>
    );
  }

  return (
    <AdPage title="Event Participation">
      <EventPicker value={events} onChange={setEvents} />
      {PARTICIPATION.map((p) => (
        <div key={p.id} className="box job-form">
          <h2>Participate in {p.title} <i className="nt-hint">If applicable · Hosted by onebigHUB + everyCircle</i></h2>
          <Checks name={p.id} options={p.roles} value={roles[p.id] || []} onChange={(v) => setRoles({ ...roles, [p.id]: v })} />
          {(roles[p.id] || []).includes("Other") && <Field label="Other — please describe" wide><Area rows={2} value={text[`${p.id}.other`]} onChange={(v) => setText({ ...text, [`${p.id}.other`]: v })} /></Field>}
          {p.fields.map(([k, label]) => <Field key={k} label={label} wide><Area rows={2} value={text[`${p.id}.${k}`]} onChange={(v) => setText({ ...text, [`${p.id}.${k}`]: v })} /></Field>)}
        </div>
      ))}
      <MiniCardPicker value={card} onChange={setCard} />
      {err && <p className="ed-error">{err}</p>}
      <button type="button" className="btn-primary" onClick={submit}>Submit</button>
    </AdPage>
  );
}
