"use client";

import { Glyph } from "./Icons";
import { Options, GBox, UploadBox, optKey } from "./PromoKit";
import { SEEKING } from "../lib/adRequests";
import { RATES } from "../lib/adRates";
import { addToCart, money } from "../lib/rsvp";

// Event Participation / Barter form parts (Cesar's Figma, Nov 16 7:52 AM).
const SectionIcon = ({ icon }) => (icon === "megaphone"
  ? <img className="pk-ico3d" src="/icons/earn.png" alt="" />
  : <Glyph name={icon} size={icon === "expo" ? 96 : 52} />);

// White info card: red headings + bullets, section picture top-right.
export function InfoCard({ s }) {
  return (
    <div className="pk-infocard">
      <span className="pk-infocard-ico"><SectionIcon icon={s.icon} /></span>
      {s.info.map((b, i) => (
        <div key={i}>
          <b className="pk-info-h">{b.h}</b>
          <ul>{b.li.map((t, j) => <li key={j}>{t}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

// Gray select / submit box. v = { seek, offerText, roles, other, fields, upload }
export function SectionForm({ s, v = {}, onChange, upload = true, picture = false }) {
  const set = (patch) => onChange({ ...v, ...patch });
  const roles = v.roles || [];
  const f = v.fields || {};
  return (
    <div className="pk-part">
      <div className="pk-part-side">
        {picture && <SectionIcon icon={s.icon} />}
        {upload && <UploadBox value={v.upload} onChange={(u) => set({ upload: u })} />}
      </div>
      <div className="pk-part-main">
        <p className="pk-hosted"><i>{s.selectHint || "If applicable, select / submit all that apply"}</i></p>
        {s.barter && (
          <>
            <span className="pk-label"><b>Seeking</b> <i className="cw-red">Barter is subject to approval</i></span>
            <Options options={SEEKING} value={v.seek || []} onChange={(seek) => set({ seek })} />
            <span className="pk-label pk-gap"><b>Offering to Provide</b> <i>{s.offerHint}</i></span>
            {s.offerText && <textarea className="pk-inline" rows={3} placeholder="Submit Here" value={v.offerText || ""} onChange={(e) => set({ offerText: e.target.value })} aria-label="Offering to provide" />}
          </>
        )}
        {s.groups.map((g, gi) => (
          <div key={gi} className="pk-group">
            {g.title && <b>{g.title}</b>}
            {g.note && <span className="pk-group-note">{g.note}</span>}
            <Options options={g.options} value={roles} onChange={(r) => set({ roles: r })} />
          </div>
        ))}
        {roles.includes("Other") && <input className="pk-inline" placeholder="Submit Here" value={v.other || ""} onChange={(e) => set({ other: e.target.value })} aria-label="Other" />}
        {s.fields.map(([k, label, hint]) => (
          <GBox key={k} label={label} hint={hint} rows={4} value={f[k]} onChange={(x) => set({ fields: { ...f, [k]: x } })} white />
        ))}
      </div>
    </div>
  );
}

export const hasData = (v) => !!v && !!(v.seek?.length || v.roles?.length || (v.offerText || "").trim() || (v.other || "").trim() || Object.values(v.fields || {}).some((x) => (x || "").trim()));

// Payment (If applicable): sponsorships are priced per deal (TBD).
export const PAYMENTS = [
  ["Expo Sponsorship", null], ["Mixer Sponsorship", null],
  ["Expo Exhibitor", RATES.expoExhibitor], ["Mixer Exhibitor", RATES.mixerExhibitor],
];
const priceLabel = (p) => (p == null ? "$ TBD" : money(p));
const keyOf = ([k, p]) => `${priceLabel(p)} ${k}`;

export function PaymentBox({ value, onChange }) {
  return (
    <div className="pk-gbox">
      <span className="pk-label"><b>Payment</b> <i>If applicable</i></span>
      <Options options={PAYMENTS.map(([k, p]) => [priceLabel(p), k])} value={PAYMENTS.filter(([k]) => value.includes(k)).map(keyOf)}
        onChange={(v) => onChange(PAYMENTS.filter((x) => v.includes(keyOf(x))).map(([k]) => k))} />
    </div>
  );
}

export function cartPayments(pay, ev, kind) {
  const lines = PAYMENTS.filter(([k]) => pay.includes(k)).map(([k, p]) => ({
    id: `${kind}-${Date.now()}-${k}`, kind, eventId: ev?.id, eventTitle: ev?.title || "onebigHUB event", date: ev?.date,
    ticket: p == null ? `${k} — price TBD, onebigHUB will contact you` : k, qty: 1, each: p || 0, subtotal: p || 0,
  }));
  if (lines.length) addToCart(lines);
  return lines.length;
}

export const labelOf = (opts, key) => {
  const o = opts.find((x) => optKey(x) === key);
  return o ? (Array.isArray(o) ? o : [o]) : [key];
};
