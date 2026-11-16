"use client";

import { useEffect, useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Glyph } from "../../components/Icons";
import { UploadBox, GBox, CartBar } from "../../components/PromoKit";
import { RATES } from "../../lib/adRates";
import { addToCart, money } from "../../lib/rsvp";

// Cesar's "Your Private-Labeled Main Header" (Figma, Nov 16): a gray EDIT
// page — live header preview (logo, URL / name, tagline), a small style
// toolbar, the two fields, then ADD Selection to My Shopping Cart.
// Prototype: saved in this browser; nothing is charged.
const KEY = "mc_private_label_v1";
const EMPTY = { logo: "", name: "", tagline: "", bold: true, italic: false, align: "left", color: "#7a1010" };

export default function PrivateLabel() {
  const [h, setH] = useState(EMPTY);
  const [done, setDone] = useState(false);
  useEffect(() => { try { setH({ ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }); } catch {} }, []);
  const set = (patch) => { const n = { ...h, ...patch }; setH(n); setDone(false); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} };

  const [main, ext] = (() => { const m = (h.name || "URL.com").match(/^(.*?)(\.[a-z]{2,})$/i); return m ? [m[1], m[2]] : [h.name, ""]; })();
  const T = ({ on, onClick, label, children }) => <button type="button" className={on ? "on" : ""} onClick={onClick} aria-label={label} title={label}>{children}</button>;

  return (
    <AdPage title={<>Private-Label&nbsp;&nbsp;<i className="pb-sub">Main Header</i></>} icon="megaphone">
      <div className="cw-page pk-page pk-gray">
        <section className="pl-preview" style={{ textAlign: h.align }}>
          <UploadBox value={h.logo} onChange={(logo) => set({ logo })} text={<>Upload<br />Logo<br />Here</>} className="pl-logo" />
          <div className="pl-text" style={{ color: h.color, fontWeight: h.bold ? 700 : 400, fontStyle: h.italic ? "italic" : "normal" }}>
            <span className="pl-url">{main}<small>{ext}</small></span>
            <span className="pl-tag">{h.tagline || "Tagline"}</span>
          </div>
          <span className="pl-icons" aria-hidden="true"><Glyph name="pdf" size={22} /><Glyph name="print" size={22} /><Glyph name="login" size={22} /></span>
        </section>

        <div className="pl-toolbar" role="toolbar" aria-label="Header style">
          <T on={h.bold} onClick={() => set({ bold: !h.bold })} label="Bold"><b>B</b></T>
          <T on={h.italic} onClick={() => set({ italic: !h.italic })} label="Italic"><i>I</i></T>
          <span className="pl-sep" />
          {["left", "center", "right"].map((a) => <T key={a} on={h.align === a} onClick={() => set({ align: a })} label={`Align ${a}`}>{a === "left" ? "⯇≡" : a === "center" ? "≡" : "≡⯈"}</T>)}
          <span className="pl-sep" />
          <label className="pl-color" title="Text color"><span style={{ background: h.color }} /><input type="color" value={h.color} onChange={(e) => set({ color: e.target.value })} aria-label="Text color" /></label>
          {h.logo && <T onClick={() => set({ logo: "" })} label="Remove logo">✕ Logo</T>}
        </div>

        <GBox label="URL, Name of Business, Organization or Group" value={h.name} onChange={(name) => set({ name })} />
        <GBox label="Tagline" hint="If applicable" value={h.tagline} onChange={(tagline) => set({ tagline })} />
        <CartBar onClick={() => { addToCart([{ id: `pl-${Date.now()}`, kind: "privateLabel", eventTitle: "Private-Labeled Main Header", href: "/advertising/private-label", ticket: h.name || "Header", qty: 1, each: RATES.privateLabel, subtotal: RATES.privateLabel }]); setDone(true); }}
          done={done} disabled={!h.name.trim()}>ADD Selection to My Shopping Cart · {money(RATES.privateLabel)}</CartBar>
      </div>
    </AdPage>
  );
}
