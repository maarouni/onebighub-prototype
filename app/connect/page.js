"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard } from "../components/ConnectKit";
import { Glyph } from "../components/Icons";
import { getProfile } from "../lib/profile";
import { getUser } from "../lib/auth";
import { FOLLOW_UP, MY_RELATIONSHIP, addToNetwork } from "../lib/connect";

// Connect with Me ! — Steps 1-3 (Cesar's Figma Rev 261115, /UserName/ConnectWithMe):
// 1 SCAN My QR Code · 2 Assign My Relationship & Notes (private) · 3a NEW USER.
// Steps 4-6 are on /connect/network.
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
    const l = `${window.location.origin}/connect?u=${encodeURIComponent(p.username || "guest")}`;
    setLink(l);
    QRCode.toDataURL(l, { width: 240, margin: 1 }).then(setQr).catch(() => {});
  }, []);

  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };
  function pickAction(id) {
    setAction(id);
    if (id === "copy") (navigator.clipboard?.writeText(link) || Promise.reject()).then(() => say("Link copied")).catch(() => say(link));
    else if (id === "scan") say("Open your phone camera and point it at their QR code.");
    else if (id === "follow") document.getElementById("new-user")?.scrollIntoView({ behavior: "smooth" });
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
    if (!c.name.trim()) { setErr("Fill in their name in 3a (or have them sign in with Apple / Google)."); document.getElementById("new-user")?.scrollIntoView({ behavior: "smooth" }); return; }
    submitAll();
  }
  function submitAll() {
    if (!c.name.trim()) return setErr("Name is required.");
    if (!c.phone.trim() && !c.email.trim()) return setErr("Enter a mobile / phone or an email.");
    setErr("");
    addToNetwork({ ...c, city: [c.city, c.state].filter(Boolean).join(", "), hide, ...r, level: "intro" });
    say(`${c.name} added to My Network.`);
    setTimeout(() => { window.location.href = "/connect/network#message"; }, 900);
  }
  const preview = { ...c, city: [c.city, c.state].filter(Boolean).join(", "), phone: hide.phone ? "" : c.phone, email: hide.email ? "" : c.email };

  return (
    <ConnectPage>
      <SectionBar n={1} icon="qr" title="SCAN My QR Code" hint="Created Automatically">
        <div className="cw-qr-row">
          <div className="cw-qr">{qr ? <img src={qr} alt="My Connect with Me QR code" width="200" height="200" /> : <div className="cw-qr-wait" />}</div>
          <div className="cw-box cw-actions">
            <span><b>Action</b> <i>Select one at a time</i></span>
            {[["exchange", "Exchange Contact Info", true], ["scan", "SCAN Other's QR Code"], ["follow", "Connect and Follow"], ["copy", "Copy Link"]].map(([id, label, def]) => (
              <label key={id} className="fp-option ct-opt">
                <input type="radio" name="cw-action" checked={action === id} onChange={() => pickAction(id)} />
                <span className="fp-label">{label}{def && <i> Default</i>}</span>
              </label>
            ))}
          </div>
        </div>
        <CardAndPitch p={me} placeholder />
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </SectionBar>

      <span id="relationship" />
      <SectionBar n={2} icon="idxAssign" title="Assign My Relationship & Notes" hint="Private">
        <div className="cw-s2">
          <div className="cw-s2-left">
            <div className="cw-box">
              <span><b>My Relationship</b> <i>Select 2 max</i></span>
              {MY_RELATIONSHIP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="checkbox" checked={r.rels.includes(o.id)} onChange={() => toggleRel(o.id)} /> <span className="fp-label">{o.label}{o.def && <i> Default</i>}</span></label>
              ))}
            </div>
            <div className="cw-box">
              <span><b>Follow-Up Status</b> <i>Select one</i></span>
              {FOLLOW_UP.map((o) => (
                <label key={o.id} className="fp-option ct-opt"><input type="radio" name="cw-fu" checked={r.followUp === o.id} onChange={() => setRel("followUp", o.id)} />
                  <span className="fp-label">{o.hot ? <>05 <b className="cw-hot">HOT !</b></> : o.label} <i>{o.hint}</i></span></label>
              ))}
            </div>
            <label className="cw-box fp-option ct-opt cw-row-opt"><input type="checkbox" checked={r.referral} onChange={(e) => setRel("referral", e.target.checked)} /> <span className="fp-label">ADD to My Referrals</span></label>
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

      <span id="new-user" />
      <SectionBar n="3a" icon="register" title="NEW USER" hint={<>Select one • Sign-Up to Save Relationship Notes <b>AND</b> Create Your Profile</>}>
        <div className="cw-signup">
          <button type="button" className="cw-social" disabled title="Needs Apple sign-in set up"><b></b> Sign in with Apple <i>Auto-fills info</i></button>
          <div className="form-or"><span>OR</span></div>
          <button type="button" className="cw-social" disabled title="Needs Google sign-in set up"><b className="cw-g">G</b> Sign in with Google <i>Auto-fills info</i></button>
          <div className="form-or"><span>OR</span></div>
          <PersonCard p={preview} placeholder />
          <label className="cw-box"><b>Name, Title</b><input value={c.name} onChange={set("name")} placeholder="Submit Here" /></label>
          <label className="cw-box"><b>Business / Organization / Group</b><input value={c.business} onChange={set("business")} placeholder="Submit Here" /></label>
          <label className="cw-box"><span className="cw-label-row"><b>Mobile / Phone</b> <button type="button" className="cw-link" onClick={() => setHide((h) => ({ ...h, phone: !h.phone }))}>{hide.phone ? "Hide" : "Display"}</button></span>
            <input type="tel" value={c.phone} onChange={set("phone")} placeholder="(xxx) xxx-xxxx" /></label>
          <label className="cw-box"><span className="cw-label-row"><b>Email</b> <button type="button" className="cw-link" onClick={() => setHide((h) => ({ ...h, email: !h.email }))}>{hide.email ? "Hide" : "Display"}</button></span>
            <input type="email" value={c.email} onChange={set("email")} placeholder="Submit Here" /></label>
          <div className="cw-citystate2">
            <label className="cw-box"><b>City</b><input value={c.city} onChange={set("city")} placeholder="Submit Here" /></label>
            <label className="cw-box"><b>State</b><input value={c.state} onChange={set("state")} placeholder="CA" maxLength={2} /></label>
          </div>
          {err && <p className="ed-error">{err}</p>}
          <div className="em-center"><button type="button" className="cw-submit" onClick={submitAll}>Submit</button></div>
          {!loggedIn && <p className="nt-hint cw-center">Want your own profile too? <a href="/registration/signup">Sign Up</a></p>}
        </div>
      </SectionBar>

      <div className="cw-devnotes">
        <b className="cw-red">Developer Notes:</b>
        <span><b>Connection Date, Time</b> <i>Auto-fills today&apos;s date and time</i></span>
        <span><b>Connection Event / Location</b> <i>Auto-saves info for next contact at event</i></span>
        <span><b>City</b> <i>Auto-fills when geo-location is enabled</i></span>
      </div>
      <p className="cw-next"><a href="/connect/network">Steps 4-6: View My Network · Send a Message · Next Steps →</a></p>
    </ConnectPage>
  );
}
