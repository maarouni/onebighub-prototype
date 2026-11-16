"use client";

import { useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Bar, EventCarousel, useHostedEvents, MiniCardStep, ContactUs, CartBar, HostedBy } from "../../components/PromoKit";
import { PartBox, RoleOptions, Fields, PaymentBox, cartPayments } from "../../components/PartForm";
import { PARTICIPATION, newRequest } from "../../lib/adRequests";

// Cesar's "Participate in onebigHUB Events" (Figma, Nov 16):
// 1 Event(s) · 2a Expos, Mixers · 2b Dinners · 2c Workshops · 3 Mini-Card(s),
// Contact Us, Payment · 4 ADD Selection to My Shopping Cart.
export default function Participation() {
  const events = useHostedEvents();
  const [ei, setEi] = useState(0);
  const [data, setData] = useState({});
  const [card, setCard] = useState(null);
  const [pay, setPay] = useState([]);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  function submit() {
    if (!Object.values(data).some((d) => d?.roles?.length)) return setErr("Select how you'd like to participate (2a, 2b or 2c).");
    if (!card?.name?.trim()) return setErr("Select or submit your mini-card (3).");
    setErr("");
    const ev = events[Math.min(ei, events.length - 1)];
    const req = newRequest("participation", { events: ev ? [ev.id] : [], data, card, payment: pay });
    const carted = cartPayments(pay, ev, "participation");
    setDone({ ...req, carted });
  }

  return (
    <AdPage title={<>Participate&nbsp;&nbsp;<i className="pb-sub">onebigHUB Events</i></>} icon="expo">
      <div className="cw-page pk-page pk-gray">
        <Bar n={1} title="Event(s)" hint="Select one at a time"><EventCarousel events={events} index={ei} onIndex={setEi} /></Bar>
        {PARTICIPATION.map((p) => (
          <Bar key={p.id} n={p.n} title={p.title}>
            <PartBox icon={p.icon} v={data[p.id]} onChange={(v) => setData({ ...data, [p.id]: v })}>
              {(set) => (
                <>
                  <HostedBy />
                  <RoleOptions options={p.roles} v={data[p.id] || {}} set={set} />
                  <Fields fields={p.fields} v={data[p.id] || {}} set={set} />
                </>
              )}
            </PartBox>
          </Bar>
        ))}
        <Bar n={3} title="Mini-Card(s)" hint="Select / Submit all that apply">
          <MiniCardStep value={card} onChange={setCard} />
          <ContactUs />
          <PaymentBox value={pay} onChange={setPay} />
        </Bar>
        {err && <p className="ed-error">{err}</p>}
        {done ? (
          <div className="pk-done"><b>Thank you — request submitted.</b> Request {done.id} · {done.submitted}.{done.carted ? <> {done.carted} item(s) added to <a href="/dashboards?open=cart">My Shopping Cart</a>.</> : null} onebigHUB will contact you to confirm details.</div>
        ) : <CartBar n={4} onClick={submit} />}
      </div>
    </AdPage>
  );
}
