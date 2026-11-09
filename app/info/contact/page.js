"use client";

import { useState } from "react";
import { InfoShell } from "../../components/InfoKit";
import { NotRobot } from "../../components/Form";
import CollapseArrow from "../../components/CollapseArrow";

// Info · Contact Us (Cesar's Figma, Nov 9). Prototype: Submit opens the
// visitor's email app addressed to Cesar — there's no mail server yet.
const TO = "cplata@everyCircle.com";
const SUBJECTS = [
  { group: null, items: ["Advertising / Sales / Pricing Inquiry", "Billing / Invoice"] },
  { group: null, items: ["Comment", "Complaint", "Suggestion", "Technical Support"] },
  { group: "Networking Expo, Mixer", items: [["Venue"], ["Participation", "Sponsor"], ["Participation", "Exhibitor"], ["Participation", "Caterer"], ["Participation", "Beverage Provider (Spirits, Wine)"], ["Participation", "Entertainment"], ["Participation", "Event Staff"]] },
  { group: "Networking Dinner, Workshop", items: [["Venue", "- Conference Room"], ["Venue", "- Restaurant"], ["Participation", "Workshop Presenter"]] },
];
const label = (it) => (Array.isArray(it) ? it.join(" ") : it);

function Field({ title, hint, children, collapsible }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="ct-box">
      <div className="ct-head"><span><b>{title}</b>{hint && <i> {hint}</i>}</span>{collapsible && <CollapseArrow open={open} onClick={() => setOpen((o) => !o)} label={title} />}</div>
      {open && children}
    </section>
  );
}

export default function Contact() {
  const [f, setF] = useState({ subject: "", topic: "", message: "", name: "", biz: "", email: "", mobile: "", city: "" });
  const [human, setHuman] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!f.message.trim() || !f.name.trim() || !(f.email.trim() || f.mobile.trim())) { setErr("Please fill in Message, Name and Email or Mobile."); return; }
    if (!human) { setErr("Please tick “I'm not a robot”."); return; }
    setErr("");
    const subj = [f.topic, f.subject].filter(Boolean).join(" — ") || "onebigHUB inquiry";
    const body = `${f.message}\n\n${f.name}${f.biz ? `, ${f.biz}` : ""}\n${f.email}\n${f.mobile}\n${f.city}`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <InfoShell title="Contact Us" icon="idxPhone">
      <form className="ct-form" onSubmit={submit} noValidate>
        <Field collapsible title={<i className="ct-lead">We appreciate your comments and suggestions. We will respond as soon as possible.</i>}>
          <div className="ct-sub"><b>Subject</b> <i>Email / Text</i></div>
          <input className="ct-input" value={f.subject} onChange={set("subject")} placeholder="Submit Here" />
          {SUBJECTS.map((g, gi) => (
            <div key={gi} className="ct-group">
              {g.group && <b>{g.group}</b>}
              {g.items.map((it) => (
                <label key={label(it)} className="fp-option ct-opt">
                  <input type="radio" name="ct-topic" checked={f.topic === `${g.group ? `${g.group}: ` : ""}${label(it)}`} onChange={() => setF((x) => ({ ...x, topic: `${g.group ? `${g.group}: ` : ""}${label(it)}` }))} />
                  <span className="fp-label">{Array.isArray(it) ? <>{it[0]} {it[1] && <i>{it[1]}</i>}</> : it}</span>
                </label>
              ))}
            </div>
          ))}
        </Field>
        <Field collapsible title="Message"><textarea className="ct-input" rows={6} value={f.message} onChange={set("message")} placeholder="Submit Here" /></Field>
        <Field title="Name"><input className="ct-input" value={f.name} onChange={set("name")} placeholder="Submit Here" /></Field>
        <Field title="Business / Organization" hint="if applicable"><input className="ct-input" value={f.biz} onChange={set("biz")} placeholder="Submit Here" /></Field>
        <Field title="Email"><input className="ct-input" type="email" value={f.email} onChange={set("email")} placeholder="Submit Here" /></Field>
        <Field title="Mobile"><input className="ct-input" type="tel" value={f.mobile} onChange={set("mobile")} placeholder="(xxx) xxx-xxxx" /></Field>
        <Field title="City"><input className="ct-input" value={f.city} onChange={set("city")} placeholder="Submit Here" /></Field>
        <div className="ct-center"><NotRobot checked={human} onChange={setHuman} /></div>
        {err && <p className="ed-error ct-center">{err}</p>}
        <div className="ct-center"><button type="submit" className="cw-submit">Submit</button></div>
        <section className="ct-box ct-card">
          <b>Contact Us</b>
          <span>Cesar Plata • Founder onebig<b className="cw-red">HUB</b>.com</span>
          <span>408 239-9006 • cplata@onebigHUB.com</span>
          <span>San Jose, CA 95122</span>
          <span>Since 1998, formerly <i>muy</i>Bueno.net, <i>info</i>BayArea.com, everyCircle.com</span>
        </section>
      </form>
    </InfoShell>
  );
}
