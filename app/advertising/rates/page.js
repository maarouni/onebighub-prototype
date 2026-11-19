"use client";

import { AdPage } from "../../components/AdPages";
import { Glyph } from "../../components/Icons";
import { RATES } from "../../lib/adRates";
import { useState } from "react";
import { Bar } from "../../components/PromoKit";
import { SectionForm, hasData } from "../../components/PartForm";
import { BARTER_AD, newRequest } from "../../lib/adRequests";
import { getProfile } from "../../lib/profile";

// Promote & Earn — Rates (Cesar's Figma Rev 261116): one table of all rates.
// Advertising / ticket numbers come from lib/adRates so they change in one place.
const $ = (n) => `$ ${n < 1 ? n.toFixed(n < 0.01 ? 3 : 2) : n}`;
const CARDS = [
  { icon: "idxIntro", title: <>Profit-Share Distribution<br />Introductions / Referrals</>, rows: [["Connector (A)", "70 %"], [<>onebig<span className="cw-red">HUB</span>.com</>, "30 %"]],
    note: <><b className="cw-red">Note:</b> The Connector (A) can also earn from Participants (B, C) when both offer referrals</> },
  { icon: "moneyBag", title: <>Profit-Share Distribution<br />Advertising, Sales &amp; Ticket Fees</>, rows: [["Profile - 1 Level away from Vendor", "5 %"], ["Profile - 2 Levels away from Vendor", "3 %"], ["Profile - 3 Levels away from Vendor", "2 %"], [<>onebig<span className="cw-red">HUB</span>.com</>, "90 %"]] },
  { icon: "megaphone", title: "Advertising - Listings", href: "/advertising/calculate", rows: [["Regular Listing", "$ Free"], ["Premier Listing, per view", $(RATES.premierPerView)], ["Premier Listing, per click", $(RATES.premierPerClick)], [<><Glyph name="barter" size={14} /> Barter for Premier Listing <i className="rt-sub">Subject to approval</i></>, "$ TBD"]] },
  { icon: "idxProduct", title: "Sales", rows: [["Item Sales Fee", "3 %"], ["Free Events - Per Ticket Fee", "$ Free"], ["Paid Events - Per Ticket Fee", $(RATES.ticketFeePaid)], [<>Private-Label <i>Main Header</i></>, `$ ${RATES.privateLabel}`]] },
  { icon: "expo", title: <>onebig<span className="cw-red">HUB</span> Networking Expos</>, href: "/advertising/expos", rows: [["Ticket with RSVP", "$ Free"], ["Ticket at Door", "$ 10"], ["Exhibitor - 6 ft or 8 ft table with linen", "$ 250"], ["Exhibitor - round cocktail table w/linen", "$ 100"], ["Sponsor - Package Deal", "$ TBD"], [<><Glyph name="barter" size={14} /> Barter for Participation <i className="rt-sub">Subject to approval</i></>, "$ TBD"]],
    note: <>Caterer, Beverage Provider (Spirits, Wine)<br />Entertainment, Location<br />Non-Profits, Organizations</> },
  { icon: "dinner", title: <>onebig<span className="cw-red">HUB</span> Networking Dinners</>, href: "/advertising/dinners", rows: [["Ticket w/RSVP", "$ 25"], ["Ticket at Door", "$ 35"], ["Per Ticket Fee", $(RATES.ticketFeePaid)], [<>Restaurant Host <i>Share Revenue</i></>, "$ TBD"]] },
  { icon: "workshop", title: <>onebig<span className="cw-red">HUB</span> Workshops</>, href: "/advertising/workshops", rows: [["Ticket w/RSVP", "$ 10"], ["Ticket at Door", "$ 20"], ["Per Ticket Fee", $(RATES.ticketFeePaid)], [<>Presenter <i>Subject to Approval</i></>, "$ Free"]] },
];

export default function Rates() {
  const [v, setV] = useState({});
  const [msg, setMsg] = useState("");
  function submitBarter() {
    if (!v.seek?.length) return setMsg("Select what you're Seeking.");
    if (!hasData({ ...v, seek: [] })) return setMsg("Tell us what you're Offering to Provide.");
    const card = getProfile();
    const r = newRequest("barter", { events: [], data: { advertising: v }, card });
    setMsg(`Barter request ${r.id} submitted — subject to approval.${card.name ? "" : " Add your mini-card on EDIT My Profile so we can reach you."}`);
    setV({});
  }
  return (
    <AdPage title={<>Achieve&nbsp;&nbsp;<i className="pb-sub">Rates</i></>} icon="dollarCircle" typeIcon="dollarCircle">
      <div className="rt-head"><b>Title</b><b>Brief Descriptions</b><b>Rates <span className="cw-red">*</span></b></div>
      {CARDS.map((c, i) => (
        <section key={i} className="ad-box rt-card">
          <span className="rt-icon">{c.img ? <img src={c.img} alt="" width="56" height="56" /> : <Glyph name={c.icon} size={52} strokeWidth={1.3} />}</span>
          <div className="rt-body">
            <h3>{c.href ? <a href={c.href}>{c.title}</a> : c.title}</h3>
            <table className="rt-table"><tbody>{c.rows.map(([k, v], j) => <tr key={j}><td>{k}</td><td className="cw-red">{v}</td></tr>)}</tbody></table>
            {c.note && <p className="rt-note">{c.note}</p>}
          </div>
        </section>
      ))}
      <div className="rt-foot"><span className="cw-red">*</span> <b>Rates</b>&nbsp; <i>Subject to change without notice.&nbsp; Rates do not include credit card fees.</i></div>
      <div id="barter" className="rt-barter">
        <Bar title={BARTER_AD.title}>
          <SectionForm s={BARTER_AD} v={v} onChange={(x) => { setV(x); setMsg(""); }} upload={false} picture />
          <button type="button" className="cw-submit pk-center" onClick={submitBarter}>Submit</button>
          {msg && <p className="nt-hint">{msg}</p>}
        </Bar>
      </div>
      <p className="nt-hint">Details: <a href="/advertising/expos">Networking Expos</a> · <a href="/advertising/dinners">Networking Dinners</a> · <a href="/advertising/workshops">Workshops</a> · <a href="/advertising/participation">Event Participation</a></p>
    </AdPage>
  );
}
