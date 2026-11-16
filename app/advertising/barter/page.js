"use client";

import { useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Bar, EventCarousel, useHostedEvents, MiniCardStep, ContactUs, CartBar } from "../../components/PromoKit";
import { PartBox, PaymentBox, cartPayments, BarterSection, ExhibitorsBox } from "../../components/PartForm";
import { BARTER, newRequest } from "../../lib/adRequests";

// Cesar's "Barter with onebigHUB" (Figma, Nov 16): 1 Event(s) · 2a–2d barter
// sections (Seeking — subject to approval, Offering to Provide) · the
// Exhibitors and Participants box · 3 Mini-Card(s), Contact Us, Payment ·
// 4 ADD Selection to My Shopping Cart. Reviewed on Barter Approval.
export default function Barter() {
  const events = useHostedEvents();
  const [ei, setEi] = useState(0);
  const [data, setData] = useState({});
  const [card, setCard] = useState(null);
  const [pay, setPay] = useState([]);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  function submit() {
    const sections = BARTER.filter((b) => data[b.id]?.seek?.length);
    if (!sections.length) return setErr("Select what you're Seeking in at least one barter section (2a–2d).");
    const missing = sections.find((b) => !data[b.id]?.roles?.length && !(data[b.id]?.offerText || "").trim());
    if (missing) return setErr(`Tell us what you're Offering to Provide in "${missing.title}".`);
    if (!card?.name?.trim()) return setErr("Select or submit your mini-card (3).");
    setErr("");
    const ev = events[Math.min(ei, events.length - 1)];
    const req = newRequest("barter", { events: ev ? [ev.id] : [], data, card, payment: pay });
    setDone({ ...req, carted: cartPayments(pay, ev, "barter") });
  }

  return (
    <AdPage title={<>Barter&nbsp;&nbsp;<i className="pb-sub">with onebigHUB</i></>} icon="barter">
      <div className="cw-page pk-page pk-gray">
        <Bar n={1} title="Event(s)" hint="Select one at a time"><EventCarousel events={events} index={ei} onIndex={setEi} /></Bar>
        {BARTER.map((b) => (
          <div key={b.id} className="cw-section">
            <Bar n={b.n} title={b.title}>
              <PartBox icon={b.icon} upload={!!b.upload} v={data[b.id]} onChange={(v) => setData({ ...data, [b.id]: v })}>
                {(set) => <BarterSection b={b} v={data[b.id] || {}} set={set} />}
              </PartBox>
            </Bar>
            {b.id === "expos" && <ExhibitorsBox />}
          </div>
        ))}
        <Bar n={3} title="Mini-Card(s)" hint="Select / Submit all that apply">
          <MiniCardStep value={card} onChange={setCard} />
          <ContactUs />
          <PaymentBox value={pay} onChange={setPay} />
        </Bar>
        {err && <p className="ed-error">{err}</p>}
        {done ? (
          <div className="pk-done"><b>Barter request submitted.</b> Request {done.id} · {done.submitted}. Barter is subject to approval — you&rsquo;ll hear back after review.{done.carted ? <> {done.carted} item(s) added to <a href="/dashboards?open=cart">My Shopping Cart</a>.</> : null}</div>
        ) : <CartBar n={4} onClick={submit} />}
        <p className="nt-hint">Admin: <a href="/advertising/barter-approval">Barter Approval</a></p>
      </div>
    </AdPage>
  );
}
