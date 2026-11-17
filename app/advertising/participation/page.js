"use client";

import { useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Bar, EventCarousel, useHostedEvents, MiniCardStep, ContactUs, CartBar } from "../../components/PromoKit";
import { InfoCard, SectionForm, PaymentBox, cartPayments, hasData } from "../../components/PartForm";
import { PART_SECTIONS, newRequest } from "../../lib/adRequests";

// Cesar's "Event Participation" (Figma Rev 261116 7:45am) — participating and
// bartering combined on one page:
// 1 Event(s) · 2a Participate in Expos · 2b Barter to Participate in Expos ·
// 3 Dinners · 4 Workshops · 5 Submit Your Contact Information (mini-card,
// Contact Us, Payment) · 6 ADD Selection to My Shopping Cart.
// Barter requests go to Barter Approval.
export default function Participation() {
  const events = useHostedEvents();
  const [ei, setEi] = useState(0);
  const [data, setData] = useState({});
  const [card, setCard] = useState(null);
  const [pay, setPay] = useState([]);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  function submit() {
    const used = PART_SECTIONS.filter((s) => hasData(data[s.id]));
    if (!used.length && !pay.length) return setErr("Select how you'd like to participate (2a – 4).");
    const noSeek = used.find((s) => s.barter && !data[s.id]?.seek?.length && s.id === "exposBarter");
    if (noSeek) return setErr("In 2b, select what you're Seeking in exchange.");
    if (!card?.name?.trim()) return setErr("Select or submit your contact information (5).");
    setErr("");
    const ev = events[Math.min(ei, events.length - 1)];
    const barter = used.some((s) => s.barter && data[s.id]?.seek?.length);
    const req = newRequest(barter ? "barter" : "participation", { events: ev ? [ev.id] : [], data, card, payment: pay });
    setDone({ ...req, barter, carted: cartPayments(pay, ev, "participation") });
  }

  return (
    <AdPage title="Event Participation" icon="idxSparkle" mode="edit">
      <div className="cw-page pk-page pk-gray">
        <Bar n={1} title="Event(s)" hint="Select one at a time"><EventCarousel events={events} index={ei} onIndex={setEi} /></Bar>
        {PART_SECTIONS.map((s) => (
          <Bar key={s.id} n={s.n} title={s.title}>
            <InfoCard s={s} />
            <SectionForm s={s} v={data[s.id]} onChange={(v) => setData({ ...data, [s.id]: v })} />
          </Bar>
        ))}
        <Bar n={5} title="Submit Your Contact Information" hint="Select / Submit all that apply">
          <MiniCardStep value={card} onChange={setCard} />
          <ContactUs />
          <PaymentBox value={pay} onChange={setPay} />
        </Bar>
        {err && <p className="ed-error">{err}</p>}
        {done ? (
          <div className="pk-done"><b>Thank you — request submitted.</b> Request {done.id} · {done.submitted}.{done.barter ? " Barter is subject to approval." : ""}{done.carted ? <> {done.carted} item(s) added to <a href="/dashboards?open=cart">My Shopping Cart</a>.</> : null} onebigHUB will contact you to confirm details.</div>
        ) : <CartBar n={6} onClick={submit} />}
        <p className="nt-hint">Admin: <a href="/advertising/barter-approval">Barter Approval</a></p>
      </div>
    </AdPage>
  );
}
