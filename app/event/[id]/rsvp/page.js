"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RsvpShell, useEvent } from "../../../components/RsvpKit";
import { SectionBar } from "../../../components/ConnectKit";
import { Glyph } from "../../../components/Icons";
import {
  getSetup, eachPrice, ccFee, money, costRange, findDiscount, addToCart,
  TICKET_FEE, CC_FEE_PCT, RECIPIENT_FIELDS,
} from "../../../lib/rsvp";

// "RSVP Order Tickets" (Cesar's Figma Rev 261108):
//  1 Ticket Info · 2 TICKET (one at a time) · 3 Ticket Recipient(s) ·
//  4 Question(s) · 5 Ticket Buyer · 6 Checkout · 7 ADD to My Shopping Cart
const KEYS = { "First Name": "first", "Last Name": "last", Email: "email", Mobile: "mobile", City: "city", State: "state", "ZIP Code": "zip", Country: "country" };
const blank = () => ({ first: "", last: "", email: "", mobile: "", city: "", state: "", zip: "", country: "" });

function Box({ label, hint, children, className = "" }) {
  return (
    <label className={`rsvp-box ${className}`}>
      <span className="rsvp-label"><b>{label}</b> {hint && <i>{hint}</i>}</span>
      {children}
    </label>
  );
}

export default function RsvpOrder() {
  const router = useRouter();
  const { id, event } = useEvent();
  const [setup, setSetup] = useState(null);
  const [pick, setPick] = useState("");
  const [qty, setQty] = useState(1);
  const [lines, setLines] = useState([]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(null);
  const [promoErr, setPromoErr] = useState("");
  const [comments, setComments] = useState("");
  const [recNA, setRecNA] = useState(false);
  const [rec, setRec] = useState(blank());
  const [answers, setAnswers] = useState({});
  const [buyerSame, setBuyerSame] = useState(true);
  const [buyer, setBuyer] = useState(blank());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!event) return;
    const s = getSetup(event);
    setSetup(s);
    setPick(s.tickets[0]?.id || "");
    setRecNA(!!s.recipientNA);
  }, [event]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const rows = useMemo(() => lines.map((l) => {
    const t = setup?.tickets.find((x) => x.id === l.tid);
    if (!t) return null;
    let each = eachPrice(t);
    if (discount) each = Math.round(each * (100 - discount.pct)) / 100;
    const fee = ccFee(each);
    return { ...l, t, each, fee, sub: (each + fee) * l.qty };
  }).filter(Boolean), [lines, setup, discount]);
  const total = rows.reduce((n, r) => n + r.sub, 0);

  function addTicket() {
    const n = Math.max(1, Math.floor(Number(qty) || 0));
    const max = setup.maxPerPerson || 99;
    if (count + n > max) { setErrors({ qty: `Maximum ${max} tickets per person` }); return; }
    setErrors({});
    setLines((ls) => {
      const i = ls.findIndex((l) => l.tid === pick);
      if (i >= 0) return ls.map((l, j) => (j === i ? { ...l, qty: l.qty + n } : l));
      return [...ls, { tid: pick, qty: n }];
    });
    setQty(1);
  }

  function applyPromo() {
    if (!promo.trim()) return;
    const d = findDiscount(setup, promo);
    if (d) { setDiscount(d); setPromoErr(""); } else { setDiscount(null); setPromoErr("This is an invalid or expired promo code"); }
  }

  function addToMyCart() {
    const er = {};
    if (!rows.length) er.lines = "Select a ticket and click ADD first";
    if (!recNA) setup.recipientFields.forEach((f) => { if (!rec[KEYS[f]]?.trim()) er[`rec_${KEYS[f]}`] = "Required"; });
    const b = buyerSame && !recNA ? rec : buyer;
    if (!b.first?.trim()) er.b_first = "Required";
    if (!b.last?.trim()) er.b_last = "Required";
    if (!b.email?.trim() && !b.mobile?.trim()) er.b_email = "Email or Mobile required";
    setErrors(er);
    if (Object.keys(er).length) { document.querySelector(".rsvp-err")?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    addToCart(rows.map((r) => ({
      id: `c${Date.now()}${r.tid}`, kind: "ticket", eventId: id, eventTitle: event.title, date: event.date,
      ticket: r.t.type, qty: r.qty, each: r.each, ccFee: r.fee, subtotal: r.sub, promo: discount?.code || "",
      recipient: recNA ? null : rec, buyer: b, answers, comments, added: new Date().toISOString(),
    })));
    router.push("/dashboards?open=cart");
  }

  const err = (k) => errors[k] && <span className="ed-error rsvp-err">{errors[k]}</span>;
  const field = (obj, set, prefix) => (f, req) => (
    <Box key={f} label={f} hint={req ? "Required" : null} className={f === "State" || f === "ZIP Code" || f === "Country" ? "rsvp-third" : ""}>
      <input value={obj[KEYS[f]]} onChange={(e) => set((o) => ({ ...o, [KEYS[f]]: e.target.value }))} placeholder={f === "Mobile" ? "(xxx) xxx-xxxx" : "Submit Here"} />
      {err(`${prefix}_${KEYS[f]}`)}
    </Box>
  );

  return (
    <RsvpShell title="RSVP Order Tickets" event={event}>
      {setup && (
        <div className="cw-page rsvp-form">
          <SectionBar n={1} title="Ticket Info" hint="Select / Submit all that apply">
            <Box label="Ticket Costs Range"><span className="cw-red">{costRange(setup)}</span></Box>
            {setup.externalUrl ? (
              <Box label="External RSVP URL" hint="If applicable">
                <a href={setup.externalUrl} target="_blank" rel="noopener noreferrer" className="cw-blue">{setup.externalUrl}</a>
              </Box>
            ) : null}
            {setup.externalUrl && <div className="form-or"><span>OR</span></div>}
          </SectionBar>

          <SectionBar n={2} title="TICKET" hint="Select / Submit one at a time">
            <div className="rsvp-box">
              <table className="rsvp-table">
                <thead><tr><th>Ticket Type</th><th>Qty</th><th>$ Each*</th><th>Expires</th></tr></thead>
                <tbody>
                  {setup.tickets.map((t) => (
                    <tr key={t.id} className={pick === t.id ? "on" : ""} onClick={() => setPick(t.id)}>
                      <td><label className="fp-option"><input type="radio" name="tkt" checked={pick === t.id} onChange={() => setPick(t.id)} /> <span className="fp-label">{t.type}</span></label>
                        {t.comments && <span className="rsvp-sub">{t.comments}</span>}</td>
                      <td className="cw-red">{t.inventory ?? "—"}</td>
                      <td className="cw-red">{t.mode === "free" ? "Free" : money(eachPrice(t))}</td>
                      <td className="cw-red">{t.expires ? new Date(`${t.expires}T12:00:00`).toLocaleDateString("en-US") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="rsvp-note">* Includes {money(TICKET_FEE)} fee per ticket</p>
              <div className="rsvp-add">
                <label>Qty <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} /></label>
                <button type="button" className="cw-submit" onClick={addTicket}><Glyph name="plusBold" size={12} /> ADD</button>
                {err("qty")}
              </div>
            </div>
            <div className="rsvp-two">
              <Box label="PROMO CODE" hint="If applicable">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Submit Here" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())} />
              </Box>
              <button type="button" className="rsvp-apply" onClick={applyPromo}>Click Here to Apply Promo Code</button>
            </div>
            {promoErr && <div className="rsvp-box rsvp-error"><b>ERROR</b> <i>Promo code</i><p>{promoErr}</p></div>}
            {discount && <p className="nt-hint">Promo <b>{discount.code}</b> applied: {discount.pct} % off.</p>}
            <Box label="Comments / Instructions" hint="If applicable">
              <textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Text" />
            </Box>
          </SectionBar>

          <SectionBar n={3} title="Ticket Recipient(s)" hint="Submit all that apply">
            {setup.recipientNA ? (
              <p className="rsvp-box"><b>Not Applicable / Not Required</b></p>
            ) : (
              <>
                <label className="rsvp-box fp-option"><input type="checkbox" checked={recNA} onChange={(e) => setRecNA(e.target.checked)} /> <span className="fp-label"><b>Not Applicable / Not Required</b> <span className="cw-red">OR Selections:</span></span></label>
                {!recNA && <div className="rsvp-fields">{RECIPIENT_FIELDS.filter((f) => setup.recipientFields.includes(f)).map((f) => field(rec, setRec, "rec")(f, true))}</div>}
              </>
            )}
          </SectionBar>

          {setup.questions.length > 0 && (
            <SectionBar n={4} title="Question(s)" hint="Submit all that apply">
              {setup.questions.map((q, i) => (
                <div key={q.id} className="rsvp-q">
                  <div className="rsvp-box"><b>{String(i + 1).padStart(2, "0")}. {q.text || "Question"}</b></div>
                  <div className="rsvp-box">
                    <span className="rsvp-label"><b>Response</b></span>
                    {q.format === "B"
                      ? q.choices.filter(Boolean).map((c) => (
                          <label key={c} className="fp-option"><input type="radio" name={q.id} checked={answers[q.id] === c} onChange={() => setAnswers((a) => ({ ...a, [q.id]: c }))} /> <span className="fp-label">{c}</span></label>
                        ))
                      : <input value={answers[q.id] || ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} placeholder="Submit Here" />}
                  </div>
                </div>
              ))}
            </SectionBar>
          )}

          <SectionBar n={5} title="Ticket Buyer" hint="Submit all that apply">
            {!recNA && (
              <label className="rsvp-box fp-option"><input type="radio" name="buyer" checked={buyerSame} onChange={() => setBuyerSame(true)} /> <span className="fp-label">Same as Ticket Recipient #1 <em>Default</em></span></label>
            )}
            {!recNA && <div className="form-or"><span>OR</span></div>}
            {!recNA && (
              <label className="rsvp-box fp-option"><input type="radio" name="buyer" checked={!buyerSame} onChange={() => setBuyerSame(false)} /> <span className="fp-label">Someone else is paying</span></label>
            )}
            {(recNA || !buyerSame) && (
              <div className="rsvp-fields">
                {["First Name", "Last Name"].map((f) => field(buyer, setBuyer, "b")(f, true))}
                <Box label="Email" hint="Required for Verification"><input value={buyer.email} onChange={(e) => setBuyer((o) => ({ ...o, email: e.target.value }))} placeholder="Submit Here" />{err("b_email")}</Box>
                <Box label="Mobile" hint="Required for Password Recovery"><input value={buyer.mobile} onChange={(e) => setBuyer((o) => ({ ...o, mobile: e.target.value }))} placeholder="(xxx) xxx-xxxx" /></Box>
                {setup.buyerFields.filter((f) => !["Email", "Mobile"].includes(f)).map((f) => field(buyer, setBuyer, "b")(f, false))}
              </div>
            )}
            {buyerSame && !recNA && (errors.b_first || errors.b_email) && <span className="ed-error rsvp-err">Fill in Ticket Recipient #1 above (name and email or mobile).</span>}
          </SectionBar>

          <SectionBar n={6} title="Checkout">
            <div className="rsvp-box">
              <b>NOTE:</b> <i>{setup.note || `${setup.maxPerPerson || "—"} Maximum tickets allowed per person`}</i>
            </div>
            <div className="rsvp-box">
              <table className="rsvp-table rsvp-checkout">
                <thead><tr><th>#</th><th>Ticket Types</th><th>Qty</th><th>$ Each*</th><th>$ CC Fee**</th><th>$ Subtotals</th><th>Expires</th><th /></tr></thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={8} className="cw-muted">No tickets yet — select one in step 2 and click ADD.</td></tr>}
                  {rows.map((r, i) => (
                    <tr key={r.tid}>
                      <td className="cw-red">{i + 1}</td><td>{r.t.type}</td><td className="cw-red">{r.qty}</td>
                      <td className="cw-red">{money(r.each)}</td><td className="cw-red">{money(r.fee)}</td><td className="cw-red">{money(r.sub)}</td>
                      <td className="cw-red">{r.t.expires ? new Date(`${r.t.expires}T12:00:00`).toLocaleDateString("en-US") : "—"}</td>
                      <td><button type="button" className="rsvp-x" aria-label={`Remove ${r.t.type}`} onClick={() => setLines((ls) => ls.filter((l) => l.tid !== r.tid))}><Glyph name="delete" size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="rsvp-note">* Includes {money(TICKET_FEE)} fee per ticket<br />** Credit Card fee is {CC_FEE_PCT} % of ticket cost</p>
              {err("lines")}
            </div>
            <div className="rsvp-total"><b>$ Total Cost</b><span className="cw-red">{money(total)}</span></div>
          </SectionBar>

          <button type="button" className="cw-bar rsvp-cart" onClick={addToMyCart}>
            <span className="step-badge">7</span><Glyph name="cartAdd" size={16} /> <b>ADD Ticket(s) to My Shopping Cart</b>
          </button>
          <p className="proto-note">Prototype: the cart lives in this browser; paying needs a payment provider (Stripe) once the database is set up.</p>
        </div>
      )}
    </RsvpShell>
  );
}
