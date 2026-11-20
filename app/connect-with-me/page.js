"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard } from "../components/ConnectKit";
import { Glyph } from "../components/Icons";
import { getProfile } from "../lib/profile";
import { getUser } from "../lib/auth";
import { FOLLOW_UP, MY_RELATIONSHIP, addToNetwork } from "../lib/connect";
import NetworkSection from "./NetworkSection";

// Connect with Me ! — Steps 1-3 (Cesar's Figma Rev 261115, /UserName/ConnectWithMe):
// 1 SCAN My QR Code · 2 Assign My Relationship & Notes (private) · 3 View My Network
// (Nov 20 redesign). Steps 4-6 (Sign Up / Log In, Send a Message, Next Steps)
// are on /connect-with-me/network.
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
    const p = getProfile();
    setMe(p);
    setLoggedIn(!!getUser());
    setR((x) => ({ ...x, when: nowLocal() }));
    const l = `${window.location.origin}/connect-with-me?u=${encodeURIComponent(p.username || "guest")}`;
    setLink(l);
    QRCode.toDataURL(l, { width: 240, margin: 1 }).then(setQr).catch(() => {});
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
      if (x.rels.length >= 2) { say("Select 2 max — untick one first."); return x; }
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
      <SectionBar n={1} icon="qr" title="SCAN My QR Code" hint="Created Automatically">
        <div className="cw-qr cw-qr-solo">{qr ? <img src={qr} alt="My Connect with Me QR code" width="200" height="200" /> : <div className="cw-qr-wait" />}</div>
        <CardAndPitch p={me} placeholder />
        <div className="cw-box cw-actions">
            <span><b>Action</b> <i>Select one at a time</i></span>
            {[["exchange", "Exchange Contact Info", true], ["scan", "SCAN Other's QR Code"], ["follow", "Connect and Follow"], ["copy", "Copy Link"]].map(([id, label, def]) => (
              <label key={id} className="fp-option ct-opt">
                <input type="radio" name="cw-action" checked={action === id} onChange={() => pickAction(id)} />
                <span className="fp-label">{label}{def && <i> Default</i>}</span>
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
              <span><b>My Relationship</b> <i>Select 2 max</i></span>
              {MY_RELATIONSHIP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="checkbox" checked={r.rels.includes(o.id)} onChange={() => toggleRel(o.id)} /> <span className="fp-label">{o.label}{o.def && <i> Default</i>}</span></label>
              ))}
            </div>
            <label className="cw-box fp-option ct-opt cw-row-opt"><input type="checkbox" checked={r.referral} onChange={(e) => setRel("referral", e.target.checked)} /> <span className="fp-label">ADD to My Referrals</span></label>
            <div className="cw-box">
              <span><b>Follow-Up Status</b> <i>Select one</i></span>
              {FOLLOW_UP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="radio" name="cw-fu" checked={r.followUp === o.id} onChange={() => setRel("followUp", o.id)} />
                  <span className="fp-label">{o.hot ? <>05 <b className="cw-hot">HOT !</b></> : o.label} <i>{o.hint}</i></span></label>
              ))}
            </div>
          </div>
          <div className="cw-s2-right">
            <label className="cw-box"><span><b>Connection Date, Time</b> <i>EDIT if applicable</i></span>
              <input type="datetime-local" value={r.when} onChange={(e) => setRel("when", e.target.value)} /></label>
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
        <div className="em-center"><button type="button" className="cw-submit" onClick={saveRelationship}>Submit</button></div>
      </SectionBar>

      <NetworkSection step={3} />

      <p className="cw-next"><a href="/connect-with-me/network">Steps 4-6: Sign Up / Log In · Send a Message · Next Steps →</a></p>
    </ConnectPage>
  );
}
