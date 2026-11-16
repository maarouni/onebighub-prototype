"use client";

import { Glyph } from "./Icons";
import { Options, GBox, UploadBox, optKey, Bar } from "./PromoKit";
import { SEEKING, EXHIBITORS_INFO } from "../lib/adRequests";
import { RATES } from "../lib/adRates";
import { addToCart, money } from "../lib/rsvp";

// One "Participate in … / Barter in Exchange …" gray box: options on the
// left, the section picture + Upload Here on the right, then the fields.
// v = { roles: [], other, offerText, fields: {}, upload, seek: [] }
export function PartBox({ icon, v = {}, onChange, children, upload = true }) {
  const set = (patch) => onChange({ ...v, ...patch });
  return (
    <div className="pk-part">
      <div className="pk-part-side">
        {icon === "megaphone" ? <img className="pk-ico3d" src="/icons/earn.png" alt="" /> : <Glyph name={icon} size={icon === "expo" ? 96 : 52} />}
        {upload && <UploadBox value={v.upload} onChange={(upload) => set({ upload })} />}
      </div>
      <div className="pk-part-main">{children(set)}</div>
    </div>
  );
}

export function RoleOptions({ options, v, set }) {
  const roles = v.roles || [];
  return (
    <>
      <Options options={options} value={roles} onChange={(roles) => set({ roles })} />
      {roles.includes("Other") && <input className="pk-inline" placeholder="Submit Here" value={v.other || ""} onChange={(e) => set({ other: e.target.value })} aria-label="Other" />}
    </>
  );
}

export function Fields({ fields, v, set }) {
  const f = v.fields || {};
  return fields.map(([k, label, hint]) => (
    <GBox key={k} label={label} hint={hint} rows={4} value={f[k]} onChange={(x) => set({ fields: { ...f, [k]: x } })} white />
  ));
}

export const labelOf = (options, key) => {
  const o = options.find((x) => optKey(x) === key);
  return o ? (Array.isArray(o) ? o : [o]) : [key];
};

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

export function BarterSection({ b, v = {}, set }) {
  return (
    <>
      <p className="pk-hosted"><i>If applicable, select / submit all that apply</i></p>
      <span className="pk-label"><b>Seeking</b> <i className="cw-red">Barter is subject to approval</i></span>
      <Options options={SEEKING} value={v.seek || []} onChange={(seek) => set({ seek })} />
      <span className="pk-label pk-gap"><b>Offering to Provide</b> <i>{b.offerHint}</i></span>
      {b.offerText && <textarea className="pk-inline" rows={3} placeholder="Submit Here" value={v.offerText || ""} onChange={(e) => set({ offerText: e.target.value })} aria-label="Offering to provide" />}
      {b.groups.map((g, gi) => (
        <div key={gi} className="pk-group">
          {g.title && <b>{g.title}</b>}
          <Options options={g.options} value={v.roles || []} onChange={(roles) => set({ roles })} />
        </div>
      ))}
      {(v.roles || []).includes("Other") && <input className="pk-inline" placeholder="Submit Here" value={v.other || ""} onChange={(e) => set({ other: e.target.value })} aria-label="Other" />}
      <Fields fields={b.fields} v={v} set={set} />
    </>
  );
}

export function ExhibitorsBox() {
  return (
    <Bar title="Exhibitors and Participants" hint="Connect • Pay-It-Forward • Invite Others" defaultOpen>
      <div className="pk-info">
        {EXHIBITORS_INFO.map((s, i) => (
          <div key={i}>{s.h && <b>{s.h}</b>}{s.p.map((t, j) => <p key={j}>{t}</p>)}</div>
        ))}
      </div>
    </Bar>
  );
}

