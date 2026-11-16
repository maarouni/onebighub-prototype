"use client";

import { useEffect, useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Glyph } from "../../components/Icons";
import { StepBadge } from "../../components/Steps";
import { PagerRow, CartBar, BarterOption } from "../../components/PromoKit";
import { fetchListings, costLabel, TYPE_GLYPH } from "../../lib/listings";
import { shortYmd } from "../../components/ListingTable";
import { RATES } from "../../lib/adRates";
import { addToCart } from "../../lib/rsvp";

// Cesar's "Premier Listing: Calculate My Advertising Cost" (Figma, Nov 16).
//   1 Listing(s) one at a time · 2 dates + views/clicks per section
//   3 A · B · C · D = A × B × C · 4 pick Views or Clicks · 5 payment (D)
//   6 ADD Listing to My Shopping Cart (or barter)
// Rates come from lib/adRates. Prototype: reach per section is a placeholder
// until view/click tracking exists; nothing is charged.
const SECTIONS = [
  ["One Big Calendar", "Events", 4200, 180], ["My Calendars", "Events", 1800, 90], ["Discount / Gift Certificates", "", 1500, 60],
  ["Organizations", "", 1200, 50], ["Employment", "Careers / Jobs", 900, 40], ["Notifications", "", 2600, 140],
];
const iso = (d) => d.toISOString().slice(0, 10);
const plus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const weeks = (a, b) => { const ms = new Date(b) - new Date(a); return ms > 0 ? Math.max(1, Math.ceil(ms / 6048e5)) : 1; };
const $ = (n) => `$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (v) => Number(String(v).replace(/[^\d.]/g, "")) || 0;

function Box({ n, children, className = "" }) {
  return <section className={`pk-box ${className}`}>{n != null && <span className="pk-box-n"><StepBadge n={n} /></span>}<div className="pk-box-body">{children}</div></section>;
}

export default function CalculatePage() {
  const [list, setList] = useState([]);
  const [i, setI] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sel, setSel] = useState(SECTIONS.map(() => true));
  const [A, setA] = useState({ views: "", clicks: "" });
  const [format, setFormat] = useState("views");
  const [done, setDone] = useState(false);

  useEffect(() => { fetchListings().then(setList); setStart(plus(0)); setEnd(plus(14)); }, []);
  const l = list[Math.min(i, Math.max(0, list.length - 1))];
  // Expiry of the listing caps the end date by default.
  useEffect(() => { if (l?.expires) setEnd((e) => (l.expires < e ? l.expires : e)); setDone(false); }, [l?.id]);

  const sums = SECTIONS.reduce((o, s, k) => (sel[k] ? { views: o.views + s[2], clicks: o.clicks + s[3] } : o), { views: 0, clicks: 0 });
  const a = { views: A.views === "" ? sums.views : num(A.views), clicks: A.clicks === "" ? sums.clicks : num(A.clicks) };
  const B = start && end ? weeks(start, end) : 1;
  const C = { views: RATES.premierPerView, clicks: RATES.premierPerClick };
  const D = { views: a.views * B * C.views, clicks: a.clicks * B * C.clicks };

  function addCart() {
    addToCart([{ id: `prem-${Date.now()}`, kind: "premier", eventTitle: `Premier Listing: ${l?.name || "Listing"}`, href: "/listings",
      ticket: `${format === "views" ? `${a.views.toLocaleString()} views` : `${a.clicks.toLocaleString()} clicks`} / wk × ${B} wk · ${start} – ${end}`,
      date: start, qty: 1, each: D[format], subtotal: D[format] }]);
    setDone(true);
  }

  return (
    <AdPage title="Calculate Advertising Cost" icon="calculate">
      <div className="cw-page pk-page">
        <section className="pk-head">
          <div><b><span className="cw-red">Performance-Based</span> Marketing System</b><b>Premier Listing:&nbsp; Calculate My Advertising Cost</b></div>
          <span className="pk-calc-ico" aria-hidden="true"><span>+</span><span>−</span><span>×</span><span>=</span></span>
        </section>

        <div className="cw-bar pk-bar-white"><StepBadge n={1} /><b>Listing(s)</b><em>Select one at a time</em></div>
        {l ? (
          <a className="pk-listing" href="/listings">
            <span><b>{l.type} • {l.name}</b><i>{l.description}</i><b>{l.offeredBy}</b>
              <span>{[(l.delivery || []).join(" / "), l.categories?.join(", "), l.industry].filter(Boolean).join(" • ")}</span>
              <span>{l.city}, {l.state || "CA"}</span>
              <span>{costLabel(l)} • Expires {shortYmd(l.expires)}</span></span>
            <span className="pk-listing-side"><Glyph name={TYPE_GLYPH[l.type] || "idxProduct"} size={30} /><small>Posted / Revised {shortYmd(l.posted)}</small></span>
          </a>
        ) : <p className="cw-muted">Loading listings…</p>}
        <PagerRow i={Math.min(i, Math.max(0, list.length - 1))} n={list.length} onGo={setI} />

        <Box n={2}>
          <div className="pk-dates">
            <input type="date" aria-label="Start date" value={start} onChange={(e) => { setStart(e.target.value); setDone(false); }} />
            <input type="date" aria-label="End date" value={end} min={start} onChange={(e) => { setEnd(e.target.value); setDone(false); }} />
            <span><b>SUBMIT Start and End Dates to Advertise</b><br /><i>If applicable, edit these automatically-submitted dates</i></span>
          </div>
          <table className="pk-calc">
            <thead><tr><th>Views/Wk</th><th>Clicks / Week</th><th>Sections <i>if applicable</i></th></tr></thead>
            <tbody>{SECTIONS.map(([t, h, v, c], k) => (
              <tr key={t} className={sel[k] ? "" : "off"}>
                <td className="cw-red">{v.toLocaleString()}</td><td className="cw-red">{c.toLocaleString()}</td>
                <td><label className="pk-opt on-plain"><input type="checkbox" checked={sel[k]} onChange={() => { setSel(sel.map((x, j) => (j === k ? !x : x))); setDone(false); }} /><span>{t}</span>{h && <i>{h}</i>}</label></td>
              </tr>
            ))}</tbody>
          </table>
        </Box>

        <Box n={3}>
          <table className="pk-calc pk-abcd">
            <tbody>
              <tr>
                <td><input className="pk-pill" inputMode="numeric" value={A.views === "" ? a.views.toLocaleString() : A.views} onChange={(e) => { setA({ ...A, views: e.target.value }); setDone(false); }} aria-label="Total views per week" /></td>
                <td><input className="pk-pill" inputMode="numeric" value={A.clicks === "" ? a.clicks.toLocaleString() : A.clicks} onChange={(e) => { setA({ ...A, clicks: e.target.value }); setDone(false); }} aria-label="Total clicks per week" /></td>
                <td><b>A. SUBMIT <span className="cw-red">My Estimated TOTAL Allotment</span> for ALL Locations</b></td>
              </tr>
              <tr><td className="cw-red c">{B}</td><td className="cw-red c">{B}</td><td><b>B. Advertise for # Weeks</b> <i>Rounded up</i></td></tr>
              <tr><td>$ <b className="cw-red">{C.views}</b></td><td>$ <b className="cw-red">{C.clicks.toFixed(2)}</b></td><td><b>C. Advertising Rates</b> <i>per View and per Click</i></td></tr>
              <tr className="pk-d"><td className={format === "views" ? "on" : ""}>{$(D.views)}</td><td className={format === "clicks" ? "on" : ""}>{$(D.clicks)}</td><td><b>D. Total:</b> <i>D = A x B x C</i></td></tr>
            </tbody>
          </table>
        </Box>

        <Box n={4}>
          <b>Compare Results (D) and <span className="cw-red">SELECT ONE</span> Advertising Format:</b>
          <div className="pk-opts">
            {[["views", "# Views of the listing"], ["clicks", "# Clicks from the Listing to the Listing Details Pages"]].map(([k, t]) => (
              <label key={k} className={`pk-opt ${format === k ? "on" : ""}`}><input type="radio" name="fmt" checked={format === k} onChange={() => { setFormat(k); setDone(false); }} /><span>{t}</span></label>
            ))}
          </div>
        </Box>

        <Box n={5}>
          <b>Total Advertising Cost per Week for this Premier Listing</b>
          <span>SUBMIT the corresponding payment (<b>D</b>):</span>
          <span className="pk-gold">{$(D[format])}</span>
        </Box>

        <Box className="pk-last">
          <CartBar n={6} onClick={addCart} done={done} disabled={!l}>ADD Listing to My Shopping Cart</CartBar>
          <BarterOption />
          <div className="pk-note">
            <b className="cw-red">NOTE:</b>
            <ul>
              <li>Your Premier Listing is displayed until it expires <b className="cw-red">OR</b> its {format === "views" ? "views" : "clicks"} per week allotment is depleted.<br />It will then be automatically converted into a Regular listing.<br />Any remaining budget will be retained in your account.</li>
              <li>Your advertising rates are locked when you submit payment.<br />Advertising rates are subject to change without notice. Rates do not include credit card fees.</li>
              <li>To be fair and transparent, clicks and views are <b className="cw-red">NOT COUNTED</b><br />towards Premier Listings advertised as a BARTER (<Glyph name="barter" size={13} />)</li>
            </ul>
          </div>
        </Box>
      </div>
    </AdPage>
  );
}
