"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard, UpcomingSteps } from "../../components/ConnectKit";
import { Field, Input, Area } from "../../components/Form";
import { Glyph } from "../../components/Icons";
import { getProfile, shrinkImage } from "../../lib/profile";
import { getUser } from "../../lib/auth";
import { PENDING_KEY, PROFESSIONAL, PERSONAL, FOLLOW_UP, addToNetwork } from "../../lib/connect";

// Connect with Me ! — Individual Mini-Card / Submit Info (Figma
// /UserName/ConnectWithMe/SubmitInfo): 3 My Mini-Card (submit / upload all
// that apply) · 4 Assign My Relationship & Notes (private) · Join / Add.
const today = () => {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)}T${d.toTimeString().slice(0, 5)}`;
};

export default function ConnectSubmit() {
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [c, setC] = useState({ name: "", title: "", business: "", phone: "", email: "", city: "" });
  const [hide, setHide] = useState({ phone: false, email: false });
  const [pic, setPic] = useState("");
  const [qr, setQr] = useState("");
  const [r, setR] = useState({ professional: "connection", personal: "connection", followUp: "01", remind: false, notes: "", introducedBy: "", when: today(), event: "", city: "", state: "CA" });
  const [gallery, setGallery] = useState([]);
  const [gi, setGi] = useState(0);
  const [err, setErr] = useState("");
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    setOwner(getProfile());
    setIsNew(!getUser());
    try {
      const p = JSON.parse(localStorage.getItem(PENDING_KEY) || "{}");
      setC((x) => ({ ...x, phone: p.phone || "", email: p.email || "" }));
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const card = [c.name, c.title, c.business, c.phone, c.email].filter(Boolean).join(" | ");
      if (!card) return setQr("");
      QRCode.toDataURL(`${window.location.origin}/connect?card=${encodeURIComponent(card)}`, { width: 140, margin: 1 }).then(setQr).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [c]);

  const set = (k) => (v) => setC((x) => ({ ...x, [k]: v }));
  const setRel = (k, v) => setR((x) => ({ ...x, [k]: v }));
  const preview = { ...c, phone: hide.phone ? "" : c.phone, email: hide.email ? "" : c.email };

  async function addPic(e) {
    const f = e.target.files?.[0];
    if (f) try { setPic(await shrinkImage(f, 400)); } catch { setErr("That file isn't an image."); }
  }
  async function addGallery(e) {
    const files = [...(e.target.files || [])].slice(0, 5 - gallery.length);
    const out = [];
    for (const f of files) {
      if (f.type.startsWith("image/")) try { out.push({ type: "image", src: await shrinkImage(f, 700), name: f.name }); } catch {}
      else out.push({ type: f.type.startsWith("video/") ? "video" : "file", name: f.name });
    }
    setGallery((g) => [...g, ...out].slice(0, 5));
  }

  function save(mode) {
    if (!c.name.trim()) return setErr("Name is required.");
    if (!c.phone.trim() && !c.email.trim()) return setErr("Enter a mobile / phone or an email.");
    addToNetwork({ ...c, picture: pic, hide, ...r, level: "intro", gallery: gallery.filter((g) => g.type === "image").map((g) => g.src) });
    try { localStorage.removeItem(PENDING_KEY); } catch {}
    router.push(mode === "join" ? "/registration/signup" : "/connect/messages");
  }

  const radio = (name, list, key) => list.map((o) => (
    <label key={o.id} className="fp-option">
      <input type="radio" name={name} checked={r[key] === o.id} onChange={() => setRel(key, o.id)} />
      <span className="fp-label">{o.hot ? <>05 <b className="cw-hot">HOT !</b></> : o.label} {o.hint && o.hint !== "Default" && <i>{o.hint}</i>}{o.def && <em> Default</em>}</span>
    </label>
  ));

  return (
    <ConnectPage subtitle="Submit Info">
      <CardAndPitch p={owner} placeholder />

      <SectionBar n={3} icon="idxMiniCard" title="New Users - Create My Mini-Card" hint="Submit / Upload all that apply">
        <div className="cw-mc">
          <div className="cw-mc-left">
            <PersonCard p={preview} picture={pic} placeholder label="Picture" />
            <Field label="Name, Title" req><Input value={c.name} onChange={set("name")} placeholder="Name" /></Field>
            <Field label="Title"><Input value={c.title} onChange={set("title")} placeholder="Submit Here" /></Field>
            <Field label="Business / Organization / Group"><Input value={c.business} onChange={set("business")} placeholder="Submit Here" /></Field>
            <label className="ed-field">
              <span className="ed-label cw-label-row">Mobile / Phone <button type="button" className="cw-link" onClick={() => setHide((h) => ({ ...h, phone: !h.phone }))}>{hide.phone ? "Display" : "Hide"}</button></span>
              <input type="tel" value={c.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="(xxx) xxx-xxxx" />
            </label>
            <label className="ed-field">
              <span className="ed-label cw-label-row">Email <button type="button" className="cw-link" onClick={() => setHide((h) => ({ ...h, email: !h.email }))}>{hide.email ? "Display" : "Hide"}</button></span>
              <input type="email" value={c.email} onChange={(e) => set("email")(e.target.value)} placeholder="Submit Here" />
            </label>
            <Field label="City, State"><Input value={c.city} onChange={set("city")} placeholder="Submit Here" /></Field>
          </div>
          <span className="cw-or">OR</span>
          <div className="cw-mc-right">
            <PersonCard p={preview} placeholder />
            <div className="cw-upload-row">
              <label className="cw-upload">
                {pic ? <img src={pic} alt="" /> : <><span>Upload Here<br />Picture</span><Glyph name="user" size={26} /></>}
                <input type="file" accept="image/*" onChange={addPic} hidden />
              </label>
              <div className="cw-qr-small">
                {qr ? <img src={qr} alt="My mini-card QR code" /> : <Glyph name="qr" size={46} />}
                <span>QR Code<br /><i>Created Automatically</i></span>
              </div>
            </div>
            <p className="cw-note"><b>NOTE: Google / Apple auto-fills info and picture</b></p>
          </div>
        </div>
      </SectionBar>

      <span id="relationship" />
      <SectionBar n={4} icon="idxAssign" title="Assign My Relationship & Notes" hint="Private">
        <div className="cw-rel">
          <div className="cw-relbox"><b>Professional</b> <i>Select one</i>{radio("cw-pro", PROFESSIONAL, "professional")}</div>
          <div className="cw-relbox"><b>Personal</b> <i>Select one</i>{radio("cw-per", PERSONAL, "personal")}</div>
          <div className="cw-relbox"><b>Follow-Up Status</b> <i>Select one</i>{radio("cw-fu", FOLLOW_UP, "followUp")}
            <label className="cw-switch"><span>⏰ Remind me to follow up</span>
              <input type="checkbox" checked={r.remind} onChange={(e) => setRel("remind", e.target.checked)} />
            </label>
          </div>
        </div>
        <Field label="My Notes" hint="Private" wide><Area rows={4} value={r.notes} onChange={(v) => setRel("notes", v)} placeholder="Submit Here" /></Field>
        <Field label="Introduced by" wide><Input value={r.introducedBy} onChange={(v) => setRel("introducedBy", v)} placeholder="Submit Name" /></Field>
        <Field label="Date, Time" hint="EDIT if applicable • Auto-fills today's date and time" wide><input type="datetime-local" value={r.when} onChange={(e) => setRel("when", e.target.value)} /></Field>
        <Field label="Event / Location" hint="EDIT if applicable • Auto-saves info for next contact at event" wide><Input value={r.event} onChange={(v) => setRel("event", v)} placeholder="Submit Here" /></Field>
        <div className="cw-two cw-citystate">
          <Field label="City" hint="EDIT if applicable • Auto-fills when geo-location is enabled"><Input value={r.city} onChange={(v) => setRel("city", v)} placeholder="Submit Here" /></Field>
          <Field label="State"><Input value={r.state} onChange={(v) => setRel("state", v)} /></Field>
        </div>
        <div className="cw-gallery">
          <div className="cw-gallery-head"><b>Gallery</b> <i>Business Card, Flyer, Picture, Video • Maximum 5 Items</i>
            <span className="cw-bar-right">
              <label className="cw-icon-btn" data-tip="Add"><Glyph name="plusBold" size={16} /><input type="file" multiple accept="image/*,video/*,application/pdf" onChange={addGallery} hidden /></label>
              <button type="button" className="cw-icon-btn" data-tip="Delete" onClick={() => { setGallery((g) => g.filter((_, i) => i !== gi)); setGi(0); }}><Glyph name="delete" size={16} /></button>
            </span>
          </div>
          <div className="cw-gallery-body">
            <button type="button" className="cw-pg" disabled={gi <= 0} onClick={() => setGi((i) => i - 1)} aria-label="Previous"><Glyph name="pagePrev" size={20} /></button>
            <div className="cw-gallery-slot">
              {gallery[gi] ? (gallery[gi].src ? <img src={gallery[gi].src} alt={gallery[gi].name} /> : <span>{gallery[gi].name}</span>)
                : <span>Upload Here<br /><i>Maximum xxx KB each</i></span>}
            </div>
            <button type="button" className="cw-pg" disabled={gi >= gallery.length - 1} onClick={() => setGi((i) => i + 1)} aria-label="Next"><Glyph name="pageNext" size={20} /></button>
          </div>
          <p className="cw-muted cw-center">{gallery.length ? `${gi + 1} of ${gallery.length}` : "0 of 5"}</p>
        </div>
        {err && <p className="ed-error">{err}</p>}
        <div className="cw-final">
          {isNew && <button type="button" className="cw-submit cw-wide" onClick={() => save("join")}>Join Network <i>(first-time user)</i></button>}
          {isNew && <span className="cw-orline">OR</span>}
          <button type="button" className="cw-submit cw-wide" onClick={() => save("add")}>Add to Network</button>
        </div>
      </SectionBar>
      <UpcomingSteps from={5} />
    </ConnectPage>
  );
}
