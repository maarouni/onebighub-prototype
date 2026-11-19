"use client";

import { useEffect, useState } from "react";
import { AdPage } from "../../components/AdPages";
import { Glyph } from "../../components/Icons";
import { UploadBox, GBox } from "../../components/PromoKit";
import { newRequest } from "../../lib/adRequests";
import { getProfile } from "../../lib/profile";
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
  const [done, setDone] = useState("");
  const [pick, setPick] = useState("cart");
  const [err, setErr] = useState("");
  function submit() {
    if (!h.name.trim()) return setErr("Submit the URL or name of your business first.");
    setErr("");
    if (pick === "cart") {
      addToCart([{ id: `pl-${Date.now()}`, kind: "privateLabel", eventTitle: "Private-Labeled Main Header", href: "/advertising/private-label", ticket: h.name, qty: 1, each: RATES.privateLabel, subtotal: RATES.privateLabel }]);
      setDone(<>Added to <a href="/dashboards?open=cart">My Shopping Cart</a>.</>);
    } else {
      const req = newRequest("barter", { events: [], card: getProfile(), data: { privateLabel: { seek: ["Private-Labeled Main Header"], fields: { name: h.name, tagline: h.tagline }, upload: h.logo } } });
      setDone(<>Barter request {req.id} submitted — subject to approval.</>);
    }
  }
  useEffect(() => { try { setH({ ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }); } catch {} }, []);
  const set = (patch) => { const n = { ...h, ...patch }; setH(n); setDone(""); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} };

  const [main, ext] = (() => { const m = (h.name || "URL.com").match(/^(.*?)(\.[a-z]{2,})$/i); return m ? [m[1], m[2]] : [h.name, ""]; })();
  const T = ({ on, onClick, label, children }) => <button type="button" className={on ? "on" : ""} onClick={onClick} aria-label={label} title={label}>{children}</button>;

  return (
    <AdPage title={<>Achieve&nbsp;&nbsp;<i className="pb-sub">Private-Labeled Header</i></>} icon="editMode" mode="edit">
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
        <div className="pk-gbox pk-white">
          <b className="cw-red">Instructions</b>
          <span>After you submit payment, contact your domain provider (ex. GoDaddy.com)<br />and point your domain ({h.name.trim() || "YourURL.com"}) to:&nbsp; <b className="cw-red">{(h.name.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split(".")[0] || "YourURL")}</b><b>.onebigHUB.com</b></span>
        </div>
        {/* Nov 17 (Cesar's Figma): Select one — ADD to cart OR barter — then Submit */}
        <div className="pk-gbox pk-white">
          <span className="pk-label"><i>Select one</i></span>
          <div className="pl-pick">
            {[["cart", <><Glyph name="cart" size={15} /> ADD Selection to My Shopping Cart <i>{money(RATES.privateLabel)}</i></>], ["barter", <><Glyph name="barter" size={15} /> Barter in Exchange for My Private-Labeled Header</>]].map(([k, l]) => (
              <label key={k} className={`pk-opt ${pick === k ? "on" : ""}`}><input type="radio" name="pl-pick" checked={pick === k} onChange={() => { setPick(k); setDone(""); }} /><span>{l}</span></label>
            ))}
          </div>
          {err && <p className="ed-error">{err}</p>}
          {done ? <p className="nt-hint">{done}</p> : <button type="button" className="cw-submit pk-center" onClick={submit}>Submit</button>}
        </div>
      </div>
    </AdPage>
  );
}
