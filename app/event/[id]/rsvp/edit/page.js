"use client";

import { useEffect, useState } from "react";
import { RsvpShell, useEvent } from "../../../../components/RsvpKit";
import { SectionBar } from "../../../../components/ConnectKit";
import { Glyph } from "../../../../components/Icons";
import {
  getSetup, saveSetup, resetSetup, eachPrice, ccFee, money, costRange,
  TICKET_FEE, CC_FEE_PCT, RECIPIENT_FIELDS, BUYER_FIELDS, MAX_QUESTIONS,
} from "../../../../lib/rsvp";

// "EDIT RSVP Order Tickets" (Cesar's Figma Rev 261108) — the host sets up
// tickets, discounts, the recipient / question / buyer forms, the seller and
// the checkout note. Saved per event in this browser.
const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function Box({ label, hint, children, tools, className = "" }) {
  return (
    <div className={`rsvp-box ${className}`}>
      <span className="rsvp-label"><b>{label}</b> {hint && <i>{hint}</i>}{tools && <span className="rsvp-tools">{tools}</span>}</span>
      {children}
    </div>
  );
}
const Tool = ({ icon, label, onClick }) => (
  <button type="button" className="rsvp-tool" onClick={onClick} aria-label={label} title={label}><Glyph name={icon} size={icon === "plusBold" ? 18 : 17} /></button>
);
const Toggle = ({ on, onChange, label, def }) => (
  <label className={`rsvp-pick ${on ? "on" : ""}`}><input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} /> {label}{def && <em> Default</em>}</label>
);

export default function RsvpEdit() {
  const { id, event } = useEvent();
  const [s, setS] = useState(null);
  const [saved, setSaved] = useState("");
  useEffect(() => { if (event) setS(getSetup(event)); }, [event]);
  const up = (patch) => setS((o) => ({ ...o, ...patch }));
  const upList = (key, i, patch) => setS((o) => ({ ...o, [key]: o[key].map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const delList = (key, i) => setS((o) => ({ ...o, [key]: o[key].filter((_, j) => j !== i) }));
  const toggleIn = (key, f, on) => setS((o) => ({ ...o, [key]: on ? [...new Set([...o[key], f])] : o[key].filter((x) => x !== f) }));

  function save() {
    saveSetup(id, s);
    setSaved("Saved ✓");
    setTimeout(() => setSaved(""), 2500);
  }

  return (
    <RsvpShell title="EDIT RSVP Order Tickets" edit event={event}>
      {s && (
        <div className="cw-page rsvp-form">
          <SectionBar n={1} title="Ticket Info" hint="Select / Submit all that apply">
            <Box label="Ticket Costs"><span className="cw-red">{costRange(s)}</span> <i className="cw-muted">— worked out from the tickets below</i></Box>
            <Box label="External RSVP URL" hint="If applicable">
              <input value={s.externalUrl} onChange={(e) => up({ externalUrl: e.target.value })} placeholder="https://www.xyz.com" />
            </Box>
            <div className="form-or"><span>OR</span></div>
          </SectionBar>

          <SectionBar n={2} title="TICKET" hint="Select / Submit one at a time"
            right={<Tool icon="plusBold" label="Add ticket" onClick={() => up({ tickets: [...s.tickets, { id: uid("t"), type: "", mode: "include", price: "", inventory: "", expires: event.date, comments: "" }] })} />}>
            {s.tickets.map((t, i) => (
              <Box key={t.id} label={`Ticket ${i + 1}`} tools={<Tool icon="delete" label="Delete ticket" onClick={() => delList("tickets", i)} />}>
                <span className="rsvp-label"><b>Type</b> <i>ex. Early Bird, Regular, Door, Discount, etc.</i></span>
                <input value={t.type} onChange={(e) => upList("tickets", i, { type: e.target.value })} placeholder="Submit Here" />
                <span className="rsvp-label"><b>Cost</b> <i>Select / Submit one</i></span>
                <label className="fp-option"><input type="radio" name={`m${t.id}`} checked={t.mode === "free"} onChange={() => upList("tickets", i, { mode: "free", price: 0 })} /> <span className="fp-label">Free</span></label>
                <label className="fp-option"><input type="radio" name={`m${t.id}`} checked={t.mode === "include"} onChange={() => upList("tickets", i, { mode: "include" })} /> <span className="fp-label">$ <input className="rsvp-num" type="number" min="0" step="0.01" value={t.mode === "include" ? t.price : ""} onChange={(e) => upList("tickets", i, { mode: "include", price: e.target.value })} placeholder="x,xxx.xx" /> <i>Includes {money(TICKET_FEE)} fee per ticket sold</i></span></label>
                <label className="fp-option"><input type="radio" name={`m${t.id}`} checked={t.mode === "add"} onChange={() => upList("tickets", i, { mode: "add" })} /> <span className="fp-label">$ <input className="rsvp-num" type="number" min="0" step="0.01" value={t.mode === "add" ? t.price : ""} onChange={(e) => upList("tickets", i, { mode: "add", price: e.target.value })} placeholder="x,xxx.xx" /> <i>Add {money(TICKET_FEE)} fee per ticket sold to buyer&rsquo;s total cost</i></span></label>
                <div className="rsvp-two">
                  <label><span className="rsvp-label"><b>Inventory</b> <i># Available Tickets</i></span><input type="number" min="0" value={t.inventory} onChange={(e) => upList("tickets", i, { inventory: e.target.value })} placeholder="###,###" /></label>
                  <label><span className="rsvp-label"><b>Expires</b></span><input type="date" value={t.expires || ""} onChange={(e) => upList("tickets", i, { expires: e.target.value })} /></label>
                </div>
                <span className="rsvp-label"><b>Comments / Instructions</b> <i>Not Applicable / No Response if blank</i></span>
                <textarea rows={2} value={t.comments} onChange={(e) => upList("tickets", i, { comments: e.target.value })} placeholder="Submit Here" />
              </Box>
            ))}
            {s.tickets.length === 0 && <p className="cw-muted">No tickets — add one with ＋.</p>}

            <Box label="DISCOUNT / OFFER" hint="If applicable"
              tools={<Tool icon="plusBold" label="Add discount" onClick={() => up({ discounts: [...s.discounts, { id: uid("d"), code: "", pct: "", from: "", to: event.date, comments: "" }] })} />}>
              {s.discounts.length === 0 && <span className="cw-muted">Not Applicable / No Response <em>Default</em></span>}
              {s.discounts.map((d, i) => (
                <div key={d.id} className="rsvp-disc">
                  <label><span className="rsvp-label"><b>Promo Code</b></span><input value={d.code} onChange={(e) => upList("discounts", i, { code: e.target.value.toUpperCase() })} placeholder="Submit Here" /></label>
                  <label><span className="rsvp-label"><b>% Discount</b></span><input className="rsvp-num" type="number" min="0" max="100" value={d.pct} onChange={(e) => upList("discounts", i, { pct: e.target.value })} placeholder="xxx" /></label>
                  <label><span className="rsvp-label"><b>Available</b></span><input type="date" value={d.from} onChange={(e) => upList("discounts", i, { from: e.target.value })} /></label>
                  <label><span className="rsvp-label"><b>Expires</b></span><input type="date" value={d.to} onChange={(e) => upList("discounts", i, { to: e.target.value })} /></label>
                  <Tool icon="delete" label="Delete discount" onClick={() => delList("discounts", i)} />
                  <label className="rsvp-disc-c"><span className="rsvp-label"><b>Comments / Instructions</b></span><input value={d.comments} onChange={(e) => upList("discounts", i, { comments: e.target.value })} placeholder="Submit Here" /></label>
                </div>
              ))}
            </Box>
          </SectionBar>

          <SectionBar n={3} title="Ticket Recipient Form" hint="Select all that apply">
            <Toggle on={s.recipientNA} onChange={(v) => up({ recipientNA: v })} label="Not Applicable / Not Required" def />
            {!s.recipientNA && (
              <div className="rsvp-picks">
                {RECIPIENT_FIELDS.map((f) => <Toggle key={f} on={s.recipientFields.includes(f)} onChange={(v) => toggleIn("recipientFields", f, v)} label={f} />)}
              </div>
            )}
          </SectionBar>

          <SectionBar n={4} title="Question(s) Form" hint={`Select / Submit all that apply • ${MAX_QUESTIONS} Maximum`}
            right={s.questions.length < MAX_QUESTIONS && <Tool icon="plusBold" label="Add question" onClick={() => up({ questions: [...s.questions, { id: uid("q"), text: "", format: "A", choices: [] }] })} />}>
            {s.questions.length === 0 && <p className="cw-muted">Not Applicable / No Response <em>Default</em></p>}
            {s.questions.map((q, i) => (
              <Box key={q.id} label={`${String(i + 1).padStart(2, "0")}.`} tools={<Tool icon="delete" label="Delete question" onClick={() => delList("questions", i)} />}>
                <input value={q.text} onChange={(e) => upList("questions", i, { text: e.target.value })} placeholder="Submit Question Here" />
                <label className="fp-option"><input type="radio" name={`f${q.id}`} checked={q.format === "A"} onChange={() => upList("questions", i, { format: "A" })} /> <span className="fp-label">Response Format A <i>Text — buyer submits here</i></span></label>
                <label className="fp-option"><input type="radio" name={`f${q.id}`} checked={q.format === "B"} onChange={() => upList("questions", i, { format: "B", choices: q.choices.length ? q.choices : [""] })} /> <span className="fp-label">Response Format B <i>Multiple Choice</i></span></label>
                {q.format === "B" && (
                  <div className="rsvp-choices">
                    {q.choices.map((c, k) => (
                      <span key={k} className="rsvp-choice">
                        <span className="cw-red">{String(k + 1).padStart(2, "0")}.</span>
                        <input value={c} onChange={(e) => upList("questions", i, { choices: q.choices.map((x, j) => (j === k ? e.target.value : x)) })} placeholder="Submit Response Here" />
                        <Tool icon="delete" label="Delete choice" onClick={() => upList("questions", i, { choices: q.choices.filter((_, j) => j !== k) })} />
                      </span>
                    ))}
                    <button type="button" className="clear-filters-link" onClick={() => upList("questions", i, { choices: [...q.choices, ""] })}>＋ Add choice</button>
                  </div>
                )}
              </Box>
            ))}
          </SectionBar>

          <SectionBar n="5a" title="Ticket Buyer Form" hint="Select all that apply">
            <div className="rsvp-picks">
              <Toggle on label="First and Last Name — Required" onChange={() => {}} />
              {BUYER_FIELDS.map((f) => <Toggle key={f} on={s.buyerFields.includes(f)} onChange={(v) => toggleIn("buyerFields", f, v)}
                label={f === "Email" ? "Email — Required for Verification" : f === "Mobile" ? "Mobile — Required for Password Recovery" : f} />)}
            </div>
            <p className="rsvp-note">Buyers give an Email OR a Mobile.</p>
          </SectionBar>

          <SectionBar n="5b" title="Ticket Seller Form" hint="Submit all that apply">
            <div className="rsvp-fields">
              {[["first", "First Name", "Required"], ["last", "Last Name", "Required"], ["email", "Email", "Required for Verification"], ["mobile", "Mobile", "Required for Password Recovery"], ["city", "City"], ["state", "State"], ["zip", "ZIP Code"], ["country", "Country"]].map(([k, l, h]) => (
                <label key={k} className={`rsvp-box ${["state", "zip", "country"].includes(k) ? "rsvp-third" : ""}`}>
                  <span className="rsvp-label"><b>{l}</b> {h && <i>{h}</i>}</span>
                  <input value={s.seller[k] || ""} onChange={(e) => up({ seller: { ...s.seller, [k]: e.target.value } })} placeholder={k === "mobile" ? "(xxx) xxx-xxxx" : "Submit Here"} />
                </label>
              ))}
            </div>
          </SectionBar>

          <SectionBar n={6} title="Checkout">
            <Box label="NOTE:" hint="If applicable">
              <div className="rsvp-two">
                <label><span className="rsvp-label"><b>Maximum tickets per person</b></span><input type="number" min="1" value={s.maxPerPerson} onChange={(e) => up({ maxPerPerson: Number(e.target.value) || "" })} /></label>
                <label><span className="rsvp-label"><b>Note to buyers</b></span><input value={s.note} onChange={(e) => up({ note: e.target.value })} placeholder="Not Applicable / No Response" /></label>
              </div>
            </Box>
            <div className="rsvp-box">
              <span className="rsvp-label"><b>Preview</b> <i>what buyers see</i></span>
              <table className="rsvp-table rsvp-checkout">
                <thead><tr><th>#</th><th>Ticket Types</th><th>Qty</th><th>$ Each*</th><th>$ CC Fee**</th><th>Expires</th></tr></thead>
                <tbody>{s.tickets.map((t, i) => (
                  <tr key={t.id}><td className="cw-red">{i + 1}</td><td>{t.type || "—"}</td><td className="cw-red">{t.inventory || "—"}</td>
                    <td className="cw-red">{money(eachPrice(t))}</td><td className="cw-red">{money(ccFee(eachPrice(t)))}</td>
                    <td className="cw-red">{t.expires ? new Date(`${t.expires}T12:00:00`).toLocaleDateString("en-US") : "—"}</td></tr>
                ))}</tbody>
              </table>
              <p className="rsvp-note">* Includes {money(TICKET_FEE)} fee per ticket<br />** Credit Card fee is {CC_FEE_PCT} % of ticket cost</p>
            </div>
          </SectionBar>

          <div className="rsvp-actions">
            <button type="button" className="cw-submit" onClick={save}>Submit</button>
            {saved && <span className="nt-hint">{saved}</span>}
            <a href={`/event/${id}/rsvp`} className="clear-filters-link">View RSVP Order Tickets page →</a>
            <button type="button" className="clear-filters-link" onClick={() => { resetSetup(id); setS(getSetup(event)); }}>Reset to default</button>
          </div>
        </div>
      )}
    </RsvpShell>
  );
}
