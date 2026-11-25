"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard } from "../components/ConnectKit";
import { Glyph } from "../components/Icons";
import { getProfile } from "../lib/profile";
import { getUser } from "../lib/auth";
import { FOLLOW_UP, MY_RELATIONSHIP, addToNetwork } from "../lib/connect";
import NetworkSection from "./NetworkSection";
import { MessageSection, NextSection } from "./MessageSections";
import SignUpSection from "./SignUpSection";

// Connect with Me ! — Cesar's Figma (Nov 25 email, /UserName/ConnectWithMe):
// 1 SCAN My QR Code · 2 Assign My Relationship & Notes (private) · 3 Sign Up / Log In
// · 4 View My Network · 5 Send a Message · 6 Next Steps.
// Connection Date, Time shows xx-xx-xx until a date is picked (MM-DD-YY, then the time).
const fmtWhen = (v) => {
  const [d, t] = v.split("T"); const [y, m, dd] = d.split("-");
  let time = "";
  if (t) { let [h, mi] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; time = `\u00a0\u00a0${h}:${String(mi).padStart(2, "0")} ${ap}`; }
  return `${m}-${dd}-${y.slice(2)}${time}`;
};
const nowLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const BLANK = { name: "", title: "", business: "", phone: "", email: "", city: "", state: "CA" };

export default function ConnectSteps13() {
  const [me, setMe] = useState(null);
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");
  const [action, setAction] = useState("exchange");
  const [flash, setFlash] = useState("");
  // step 2
  const [r, setR] = useState({ rels: ["connection"], followUp: "01", referral: false, when: "", event: "", city: "", state: "CA", introducedBy: "", notes: "" });
  // step 3a
  const [c, setC] = useState(BLANK);
  const [hide, setHide] = useState({ phone: true, email: false });
  const [err, setErr] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Cesar (Nov 25): the QR follows whoever is logged in; rebuild on login / logout.
    const build = () => {
      const p = getProfile();
      const u = getUser();
      setMe(p);
      setLoggedIn(!!u);
      const handle = u?.username || p.username || "guest";
      const l = `${window.location.origin}/connect-with-me?u=${encodeURIComponent(handle)}`;
      setLink(l);
      QRCode.toDataURL(l, { width: 240, margin: 1 }).then(setQr).catch(() => {});
    };
    setR((x) => ({ ...x, when: nowLocal() }));
    build();
    window.addEventListener("mc-auth-changed", build);
    return () => window.removeEventListener("mc-auth-changed", build);
  }, []);

  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };
  function pickAction(id) {
    setAction(id);
    if (id === "copy") (navigator.clipboard?.writeText(link) || Promise.reject()).then(() => say("Link copied")).catch(() => say(link));
    else if (id === "scan") say("Open your phone camera and point it at their QR code.");
    else if (id === "follow") window.location.href = "/connect-with-me/network#signup";
    else document.getElementById("relationship")?.scrollIntoView({ behavior: "smooth" });
  }
  const setRel = (k, v) => setR((x) => ({ ...x, [k]: v }));
  function toggleRel(id) {
    setR((x) => {
      if (x.rels.includes(id)) return { ...x, rels: x.rels.filter((y) => y !== id) };
      if (x.rels.length >= 2) { say("Select 2 maximum — untick one first."); return x; }
      return { ...x, rels: [...x.rels, id] };
    });
  }

  const set = (k) => (e) => setC((x) => ({ ...x, [k]: e.target.value }));

  function saveRelationship() {
    try { localStorage.setItem("mc_pending_relationship_v1", JSON.stringify(r)); } catch {}
    say("Relationship & notes saved — next, Sign Up / Log In (Step 4).");
    setTimeout(() => { window.location.href = "/connect-with-me/network#signup"; }, 900);
  }
  function submitAll() {
    if (!c.name.trim()) return setErr("Name is required.");
    if (!c.phone.trim() && !c.email.trim()) return setErr("Enter a mobile / phone or an email.");
    setErr("");
    addToNetwork({ ...c, city: [c.city, c.state].filter(Boolean).join(", "), hide, ...r, level: "intro" });
    say(`${c.name} added to My Network.`);
    setTimeout(() => { window.location.href = "/connect-with-me/network#message"; }, 900);
  }
  const preview = { ...c, city: [c.city, c.state].filter(Boolean).join(", "), phone: hide.phone ? "" : c.phone, email: hide.email ? "" : c.email };

  return (
    <ConnectPage>
      <SectionBar n={1} icon="qr" title="SCAN My QR Code" hint="Created Automatically" className="cw-sec-stack">
        <div className="cw-qr cw-qr-solo">{loggedIn && qr ? <img src={qr} alt="My Connect with Me QR code" width="200" height="200" />
          : loggedIn ? <div className="cw-qr-wait" />
          : <div className="cw-qr-placeholder" aria-label="Your Custom QR Code Here">Your Custom QR Code Here</div>}</div>
        <CardAndPitch p={me} placeholder />
        <div className="cw-box cw-actions">
            <span className="cw-action-hint"><i>Select one at a time</i></span>
            {[["exchange", "Exchange Contact Info", true], ["scan", "SCAN Other's QR Code"], ["follow", "Connect and Follow"], ["copy", "Copy Link"]].map(([id, label, def]) => (
              <label key={id} className="fp-option ct-opt">
                <input type="radio" name="cw-action" checked={action === id} onChange={() => pickAction(id)} />
                <span className={`fp-label${id === "exchange" ? " cw-exchange-label" : ""}`}>{label}{def && <i> Default</i>}</span>
              </label>
            ))}
          </div>
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </SectionBar>

      <span id="relationship" />
      <SectionBar n={2} icon="idxAssign" title="Assign My Relationship & Notes" hint="Private" className="cw-sec-gray">
        <div className="cw-s2">
          <div className="cw-s2-left">
            <div className="cw-box">
              <span><b>My Relationship</b> <i>Select 2 maximum</i></span>
              {MY_RELATIONSHIP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="checkbox" checked={r.rels.includes(o.id)} onChange={() => toggleRel(o.id)} /> <span className="fp-label">{o.label}{o.def && <i> Default</i>}</span></label>
              ))}
            </div>
            <label className="cw-box fp-option ct-opt cw-row-opt"><input type="checkbox" checked={r.referral} onChange={(e) => setRel("referral", e.target.checked)} /> <span className="fp-label">ADD to My Referrals</span></label>
            <div className="cw-box">
              <span><b>Follow-Up Status</b> <i>Select one</i></span>
              {FOLLOW_UP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="radio" name="cw-followup" checked={r.followUp === o.id} onChange={() => setRel("followUp", o.id)} />
                  <span className="fp-label">{o.hot ? <>05&nbsp;&nbsp;<b className="cw-hot">HOT !</b></> : o.label.replace(" ", "\u00a0\u00a0")} <i>{o.hint}</i></span></label>
              ))}
            </div>
          </div>
          <div className="cw-s2-right">
            <label className="cw-box"><span><b>Connection Date, Time</b> <i>EDIT if applicable</i></span>
              <div className="cw-when">
                <span className="cw-when-text">{r.when ? fmtWhen(r.when) : <span className="cw-muted">xx-xx-xx</span>}</span>
                <button type="button" className="cw-cal" aria-label="Pick date and time" onClick={() => { const i = document.getElementById("cw-when-input"); i?.showPicker ? i.showPicker() : i?.focus(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                </button>
                <input id="cw-when-input" type="datetime-local" tabIndex={-1} aria-hidden="true" className="cw-when-hidden" value={r.when} onChange={(e) => setRel("when", e.target.value)} />
              </div></label>
            <label className="cw-box"><span><b>Connection Event / Location</b> <i>EDIT if applicable</i></span>
              <i className="cw-muted">Auto-saves info for next contact at event</i>
              <input value={r.event} onChange={(e) => setRel("event", e.target.value)} placeholder="Submit Here" /></label>
            <div className="cw-citystate2">
              <label className="cw-box"><span><b>City</b> <i>EDIT if applicable</i></span><input value={r.city} onChange={(e) => setRel("city", e.target.value)} placeholder="Submit Name" /></label>
              <label className="cw-box"><b>State</b><input value={r.state} onChange={(e) => setRel("state", e.target.value)} placeholder="CA" maxLength={2} /></label>
            </div>
            <label className="cw-box"><b>Introduced by</b><input value={r.introducedBy} onChange={(e) => setRel("introducedBy", e.target.value)} placeholder="Submit Name" /></label>
          </div>
        </div>
        <label className="cw-box"><span><b>My Notes</b> <i>Private</i></span><textarea rows={4} value={r.notes} onChange={(e) => setRel("notes", e.target.value)} placeholder="Submit Here" /></label>
        {/* Cesar (Nov 25): Section 2 has no Submit button */}
      </SectionBar>

      <SignUpSection step={3} />

      <NetworkSection step={4} />

      <MessageSection step={5} />

      <NextSection step={6} />

    </ConnectPage>
  );
}
