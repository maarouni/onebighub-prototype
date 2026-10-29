"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import PageTemplate from "../components/PageTemplate";
import { Field, Input, Area, MiniCard, Radios } from "../components/Form";
import { Glyph } from "../components/Icons";
import NetworkGraph from "../components/NetworkGraph";
import { getUser } from "../lib/auth";
import { getProfile, saveProfile, getGallery, saveGallery, shrinkImage, GALLERY_MAX } from "../lib/profile";
import { listReferrals } from "../lib/referrals";

// My Profile — Cesar's Oct 21 changes: QR code, elevator pitch, external
// profile links, a gallery (max 5 items), and the 3-level Connections graph
// that will drive revenue sharing. Prototype: saved in this browser.
const SAMPLE = [
  { id: "s1", label: "Sample Vendor", children: [{ id: "s1a", label: "Sample Client", children: [{ id: "s1a1", label: "Sample Lvl 3" }] }, { id: "s1b", label: "Sample Partner" }] },
  { id: "s2", label: "Sample Client", children: [{ id: "s2a", label: "Sample Referral", children: [{ id: "s2a1", label: "Sample Lvl 3" }, { id: "s2a2", label: "Sample Lvl 3" }] }] },
  { id: "s3", label: "Sample Member", children: [{ id: "s3a", label: "Sample Vendor" }] },
];

export default function ProfilePage() {
  const [p, setP] = useState(null);
  const [user, setU] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [qr, setQr] = useState(null);
  const [flash, setFlash] = useState("");
  const [view, setView] = useState("graph");
  const [depth, setDepth] = useState(1);
  const [sample, setSample] = useState(false);
  const [refs, setRefs] = useState([]);

  useEffect(() => {
    const prof = getProfile();
    setP(prof); setU(getUser()); setGallery(getGallery()); setRefs(listReferrals());
    const link = `${window.location.origin}/registration/signup?ref=${encodeURIComponent(prof.username || "guest")}`;
    QRCode.toDataURL(link, { width: 220, margin: 1 }).then(setQr).catch(() => {});
  }, []);

  // Level 1 from your 3-Way Introductions (B and C people you connected).
  // Levels 2 and 3 need other users' data — the database — so they're empty
  // until then (Cesar's note: gray out a level that has nothing in it).
  const real = useMemo(() => {
    const seen = new Map();
    refs.forEach((r) => [r.b, r.c].forEach((x) => { if (x?.name && !seen.has(x.name)) seen.set(x.name, { id: `r-${seen.size}`, label: x.business || x.name, card: x }); }));
    return [...seen.values()];
  }, [refs]);
  const levels = sample ? SAMPLE : real;
  const maxDepth = (list, d = 1) => list.reduce((m, n) => Math.max(m, n.children?.length ? maxDepth(n.children, d + 1) : d), list.length ? 1 : 0);
  const available = maxDepth(levels);
  useEffect(() => { if (depth > Math.max(1, available)) setDepth(Math.max(1, available)); }, [available]);

  if (!p) return null;
  const set = (k) => (v) => setP({ ...p, [k]: v });
  const setLink = (i, k) => (v) => setP({ ...p, links: p.links.map((l, j) => (j === i ? { ...l, [k]: v } : l)) });

  function save() {
    setFlash(saveProfile(p) ? "Saved." : "Couldn't save — browser storage is full.");
    setTimeout(() => setFlash(""), 2000);
  }
  async function addFiles(files) {
    const room = GALLERY_MAX - gallery.length;
    const picked = [...files].slice(0, room);
    const out = [];
    for (const f of picked) {
      try { out.push({ id: `${Date.now()}-${f.name}`, name: f.name, src: await shrinkImage(f) }); }
      catch { setFlash(`${f.name} isn't an image — documents and videos come with the database.`); }
    }
    const next = [...gallery, ...out];
    if (saveGallery(next)) setGallery(next); else setFlash("Couldn't save — browser storage is full. Try smaller images.");
    if (files.length > room) setFlash(`Maximum ${GALLERY_MAX} items — ${files.length - room} not added.`);
  }
  function removeItem(id) { const next = gallery.filter((g) => g.id !== id); saveGallery(next); setGallery(next); }

  const cardLevel1 = levels.map((n) => n.card || { name: n.label });

  return (
    <PageTemplate section={null} title="My Profile" subtitle="Mini-Card · Elevator Pitch · QR Code · Connections" icon="miniCard"
      intro={user ? <>Logged in as <b>{user.name}</b>. Your mini-card shows on referrals, events you join and your connections.</> : <>You&rsquo;re not logged in — <a href="/registration/login">Log In</a> or <a href="/registration/signup">Sign Up</a> so your profile is saved under your name.</>}>

      <div className="eval-grid">
        <div className="box">
          <h2>My Mini-Card</h2>
          <MiniCard p={{ ...p, name: p.name || "Your name" }} />
          <h3>Elevator Pitch</h3>
          <p><b>{p.pitchTitle || "—"}</b></p>
          <p className="nt-hint" style={{ whiteSpace: "pre-wrap" }}>{p.pitch || "A brief, persuasive summary of yourself that takes about 30 to 60 seconds to deliver — roughly the length of a short elevator ride."}</p>
          <h3>Links</h3>
          <ul className="dash-plain-list">
            {p.linkedin && <li><a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
            {p.links.filter((l) => l.url).map((l, i) => <li key={i}><a href={l.url} target="_blank" rel="noreferrer">{l.name || l.url}</a></li>)}
            {!p.linkedin && !p.links.some((l) => l.url) && <li>—</li>}
          </ul>
        </div>
        <div className="box" id="qr" style={{ textAlign: "center" }}>
          <h2><Glyph name="qr" size={18} /> SCAN My QR Code</h2>
          {qr ? <img src={qr} alt="My QR code" style={{ width: 200, height: 200 }} /> : <p>Generating…</p>}
          <p className="nt-hint">Others scan it to connect and sign up with you as their referrer. Created automatically.</p>
          <a href="/refer" className="tpl-action">Invite / Refer others →</a>
        </div>
      </div>

      <div className="box job-form">
        <h2>Edit My Profile</h2>
        <Field label="Name"><Input value={p.name} onChange={set("name")} /></Field>
        <Field label="Title"><Input value={p.title} onChange={set("title")} /></Field>
        <Field label="Business / Organization / Group"><Input value={p.business} onChange={set("business")} /></Field>
        <Field label="Tagline, Product(s) or Service(s)"><Input value={p.tagline} onChange={set("tagline")} /></Field>
        <Field label="Phone"><Input type="tel" value={p.phone} onChange={set("phone")} placeholder="(xxx) xxx-xxxx" /></Field>
        <Field label="Email"><Input type="email" value={p.email} onChange={set("email")} /></Field>
        <Field label="City, State"><Input value={p.city} onChange={set("city")} /></Field>
        <Field label="Elevator Pitch Title" wide><Input value={p.pitchTitle} onChange={set("pitchTitle")} maxLength={90} /></Field>
        <Field label="Elevator Pitch" hint="30 to 60 seconds to say — about 75 to 150 words" wide>
          <Area rows={4} value={p.pitch} onChange={set("pitch")} />
        </Field>
        <p className="nt-hint">{(p.pitch.trim().match(/\S+/g) || []).length} words</p>
        <Field label="LinkedIn" wide><Input type="url" value={p.linkedin} onChange={set("linkedin")} placeholder="https://www.linkedin.com/in/…" /></Field>
        {p.links.map((l, i) => (
          <div key={i} className="ed-cols" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginTop: 10 }}>
            <Field label={`External link #${i + 1} — name`}><Input value={l.name} onChange={setLink(i, "name")} placeholder="Website, Instagram, YouTube…" /></Field>
            <Field label="URL"><Input type="url" value={l.url} onChange={setLink(i, "url")} placeholder="https://" /></Field>
          </div>
        ))}
        <button type="button" className="btn-primary" style={{ marginTop: 12 }} onClick={save}>Save profile</button>
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </div>

      <div className="box">
        <h2>Gallery <i className="nt-hint">Business card, flyer, picture — maximum {GALLERY_MAX} items</i></h2>
        <div className="gallery-grid">
          {gallery.map((g) => (
            <figure key={g.id}><img src={g.src} alt={g.name} /><button type="button" aria-label={`Remove ${g.name}`} onClick={() => removeItem(g.id)}>×</button></figure>
          ))}
          {gallery.length < GALLERY_MAX && (
            <label className="gallery-add" style={{ cursor: "pointer" }}>
              <figure><span>+ Upload</span></figure>
              <input type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </label>
          )}
        </div>
        <p className="nt-hint">{gallery.length} of {GALLERY_MAX}. Images only in the prototype; PDFs and videos need file storage (database).</p>
      </div>

      <div className="box" id="network">
        <h2>My Connections, Introductions, Referrals</h2>
        <div className="send-masoud-actions" style={{ flexWrap: "wrap" }}>
          <Radios name="view" value={view} onChange={setView} options={[{ id: "graph", label: "Graph" }, { id: "cards", label: "Mini-Cards" }, { id: "map", label: "Map" }]} />
        </div>
        <div className="job-type-grid">
          {[1, 2, 3].map((l) => (
            <label key={l} className="fp-option" style={l > Math.max(1, available) ? { opacity: 0.4 } : null}>
              <input type="radio" name="lvl" disabled={l > Math.max(1, available)} checked={depth === l} onChange={() => setDepth(l)} />
              <span className="fp-label">Level {l}{l === 1 ? " — Circle of Influence" : ""}</span>
            </label>
          ))}
        </div>
        <label className="fp-option"><input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} /><span className="fp-label">Show a sample network <em>(placeholder names)</em></span></label>
        {view === "graph" && (levels.length
          ? <NetworkGraph me={p.name || "You"} levels={levels} depth={depth} />
          : <p className="nt-hint">No connections yet. Make a <a href="/referrals">3-Way Introduction</a> and the people you connect appear here as Level 1.</p>)}
        {view === "cards" && <div className="mini-card-list">{cardLevel1.length ? cardLevel1.map((c, i) => <MiniCard key={i} p={c} />) : <p className="nt-hint">No connections yet.</p>}</div>}
        {view === "map" && <p className="nt-hint">Map view needs everyone&rsquo;s locations — it comes with the database.</p>}
        <p className="proto-note">Levels 2 and 3 are other members&rsquo; connections, so they fill in once there&rsquo;s a shared database with real users. Revenue-sharing percentages aren&rsquo;t applied here.</p>
      </div>
    </PageTemplate>
  );
}
