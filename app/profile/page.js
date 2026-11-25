"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import PageTemplate from "../components/PageTemplate";
import { Field, Input, Area, MiniCard, Radios } from "../components/Form";
import { Glyph } from "../components/Icons";
import NetworkGraph from "../components/NetworkGraph";
import { SectionBar } from "../components/ConnectKit";
import { getUser } from "../lib/auth";
import { BIO_DOCS, getProfile, saveProfile, getGallery, saveGallery, shrinkImage, GALLERY_MAX } from "../lib/profile";
import { listReferrals } from "../lib/referrals";
import { FilterShell, Box, Option, CheckList, GroupedBox, RegionBoxes } from "../components/FilterKit";
import { CATEGORY_GROUPS, INDUSTRIES, REGION_GROUPS } from "../lib/organizations";

// Nov 19 (Cesar, "Connect EDIT My Profiles"): gray EDIT page with a filters
// column — how YOUR profile is listed (Profile Type, My Membership Status,
// Categories, Industries, Regions). Saved with the profile. Nov 24 (Cesar): Ad Types removed.
const LIST_KEY = "mc_profile_listing_v1";
const EMPTY_LISTING = { ptype: "individual", membership: "all", adtype: [], categories: [], industry: [], region: [] };
const P_TYPES = [["individual", "Individual"], ["business", "Business"], ["organization", "Organization"], ["group", "Group"]];
const P_MEMBER = [["all", "All", true], ["na", <><b>N</b>&nbsp;&nbsp;Not a Member</>], ["member", <><b>✓</b>&nbsp;&nbsp;Member</>], ["considering", <><b>&gt;</b>&nbsp;&nbsp;Considering to apply</>]];
function ProfileFilters({ onHide }) {
  const [f, setF] = useState(EMPTY_LISTING);
  useEffect(() => { try { setF({ ...EMPTY_LISTING, ...JSON.parse(localStorage.getItem(LIST_KEY) || "{}") }); } catch {} }, []);
  const setFilters = (fn) => setF((cur) => { const n = typeof fn === "function" ? fn(cur) : fn; try { localStorage.setItem(LIST_KEY, JSON.stringify(n)); } catch {} return n; });
  const kit = { filters: f, setFilters };
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_LISTING)}>
      <Box title="Profile Type" hint="Select one">
        {P_TYPES.map(([id, label]) => <Option key={id} type="radio" name="pf-ptype" checked={f.ptype === id} onChange={() => setFilters((x) => ({ ...x, ptype: id }))} label={label} />)}
      </Box>
      <Box title="My Membership Status" hint="If applicable">
        {P_MEMBER.map(([id, label, def]) => <Option key={id} type="radio" name="pf-member" checked={f.membership === id} onChange={() => setFilters((x) => ({ ...x, membership: id }))} label={label} def={def} />)}
      </Box>
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={false}><CheckList field="industry" options={INDUSTRIES} {...kit} /></Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}

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
  const [showFilters, setShowFilters] = useState(true);

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
  const setDoc = (k, patch) => setP({ ...p, docs: { ...p.docs, [k]: { show: true, ...p.docs[k], ...patch } } });
  function uploadDoc(k, file) {
    if (!file) return;
    if (file.size > 1.5e6) { setDoc(k, { name: file.name, src: "" }); setFlash(`${file.name} is over 1.5 MB — name saved; the file itself needs the database.`); return; }
    const r = new FileReader(); r.onload = () => setDoc(k, { name: file.name, src: r.result }); r.readAsDataURL(file);
  }
  const bioLinks = [...BIO_DOCS.map(([k, label]) => ({ label, href: p.docs[k]?.show !== false ? p.docs[k]?.src : "", name: p.docs[k]?.name })),
    { label: "LinkedIn", href: p.linkedinShow ? p.linkedin : "" }];

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
    <PageTemplate section="connections" activeAction="edit" mode="edit" title={<>Connect&nbsp;&nbsp;<i className="pb-sub">EDIT My Profile</i></>} icon="connections" typeIcon="connections"
      intro={<><strong className="cw-red">Get Connected !</strong> <i>Offer before you receive&nbsp;&nbsp;•&nbsp;&nbsp;A little courtesy goes a long way !</i></>}>
      <div className={`page browse-page ep-page ${showFilters ? "" : "filters-hidden"}`}>
        <div className="layout-with-sidebar">
          {showFilters && <ProfileFilters onHide={() => setShowFilters(false)} />}
          <div className="timeline-col">
      {!showFilters && <button type="button" className="ep-show" onClick={() => setShowFilters(true)}>Display Filters</button>}
      {!user && <p className="nt-hint ep-login">You&rsquo;re not logged in — <a href="/registration/login">Log In</a> or <a href="/registration/signup">Sign Up</a> so your profile is saved under your name.</p>}

      <SectionBar n={1} title="Profile Details" hint="Edit / Submit / Upload all that apply">
      <div className="eval-grid">
        <div className="box">
          <h2>My Mini-Card</h2>
          <MiniCard p={{ ...p, name: p.name || "Your name" }} />
          <h3>Elevator Pitch</h3>
          <p><b>{p.pitchTitle || "—"}</b></p>
          <p className="nt-hint" style={{ whiteSpace: "pre-wrap" }}>{p.pitch || "A brief, persuasive summary of yourself that takes about 30 to 60 seconds to deliver — roughly the length of a short elevator ride."}</p>
          <h3><Glyph name="gem" size={16} /> Interesting Things About Me</h3>
          <p className="nt-hint" style={{ whiteSpace: "pre-wrap" }}>{p.interesting || "—"}</p>
          <h3>Bio</h3>
          <p><b>{p.bioTitle || "Tagline / Title"}</b></p>
          <p className="nt-hint" style={{ whiteSpace: "pre-wrap" }}>{p.bioText || "—"}</p>
          <div className="bio-links">
            {bioLinks.map((l) => l.href
              ? <a key={l.label} className="bio-pill" href={l.href} target="_blank" rel="noreferrer" download={l.name && l.href.startsWith("data:") ? l.name : undefined}>{l.label}</a>
              : <span key={l.label} className="bio-pill off" title="Not added or hidden">{l.label}</span>)}
          </div>
        </div>
        <div className="box" id="qr" style={{ textAlign: "center" }}>
          <h2><Glyph name="qr" size={18} /> SCAN My QR Code</h2>
          {qr ? <img src={qr} alt="My QR code" style={{ width: 200, height: 200 }} /> : <p>Generating…</p>}
          <p className="nt-hint">Others scan it to connect and sign up with you as their referrer. Created automatically.</p>
          <a href="/refer" className="tpl-action">Invite / Refer others →</a>
        </div>
      </div>

      <div className="box job-form">
        <Field label="Name"><Input value={p.name} onChange={set("name")} /></Field>
        <Field label="Title"><Input value={p.title} onChange={set("title")} /></Field>
        <Field label="Business / Organization / Group"><Input value={p.business} onChange={set("business")} /></Field>
        <Field label="Tagline, Product(s) or Service(s)"><Input value={p.tagline} onChange={set("tagline")} /></Field>
        <Field label="Mobile / Phone" hint="Display / Hide">
          <Input type="tel" value={p.phone} onChange={set("phone")} placeholder="(xxx) xxx-xxxx" />
          <Radios name="hide-phone" value={p.hidePhone ? "hide" : "show"} onChange={(v) => setP((x) => ({ ...x, hidePhone: v === "hide" }))}
            options={[{ id: "show", label: "Display Default" }, { id: "hide", label: "Hide" }]} />
        </Field>
        <Field label="Email" hint="Display / Hide">
          <Input type="email" value={p.email} onChange={set("email")} />
          <Radios name="hide-email" value={p.hideEmail ? "hide" : "show"} onChange={(v) => setP((x) => ({ ...x, hideEmail: v === "hide" }))}
            options={[{ id: "show", label: "Display Default" }, { id: "hide", label: "Hide" }]} />
        </Field>
        <Field label="City, State"><Input value={p.city} onChange={set("city")} /></Field>
        <Field label="ZIP Code"><Input value={p.zip} onChange={set("zip")} /></Field>
        <Field label="Country"><Input value={p.country} onChange={set("country")} /></Field>
        <Field label="Elevator Pitch Title" wide><Input value={p.pitchTitle} onChange={set("pitchTitle")} maxLength={90} /></Field>
        <Field label="Elevator Pitch" hint="30 to 60 seconds to say — about 75 to 150 words" wide>
          <Area rows={4} value={p.pitch} onChange={set("pitch")} />
        </Field>
        <p className="nt-hint">{(p.pitch.trim().match(/\S+/g) || []).length} words</p>
        <h3 className="bio-h">Bio <i>Edit / Select / Submit / Upload all that apply</i></h3>
        <Field label="Bio Tagline / Title" wide><Input value={p.bioTitle} onChange={set("bioTitle")} placeholder="Submit Here" /></Field>
        <Field label="Bio Text" wide><Area rows={5} value={p.bioText} onChange={set("bioText")} placeholder="Submit Here" /></Field>
        {BIO_DOCS.map(([k, label, hint]) => {
          const d = p.docs[k] || {};
          return (
            <div key={k} className="bio-row">
              <span className="pk-label"><b>{label}</b>{hint && <i> {hint}</i>}</span>
              <span className="bio-show">
                <label><input type="radio" checked={d.show !== false} onChange={() => setDoc(k, { show: true })} /> Display <i>Default</i></label>
                <label><input type="radio" checked={d.show === false} onChange={() => setDoc(k, { show: false })} /> Hide</label>
              </span>
              <label className="bio-up">{d.name ? <>📎 {d.name}</> : "Upload Here"}<input type="file" hidden accept=".pdf,.doc,.docx,image/*" onChange={(e) => uploadDoc(k, e.target.files?.[0])} /></label>
              {d.name && <button type="button" className="clear-filters-link" onClick={() => setDoc(k, { name: "", src: "" })}>Remove</button>}
            </div>
          );
        })}
        <div className="bio-row">
          <span className="pk-label"><b>LinkedIn Profile</b></span>
          <span className="bio-show">
            <label><input type="radio" checked={p.linkedinShow} onChange={() => setP({ ...p, linkedinShow: true })} /> Display <i>Default</i></label>
            <label><input type="radio" checked={!p.linkedinShow} onChange={() => setP({ ...p, linkedinShow: false })} /> Hide</label>
          </span>
          <Input type="url" value={p.linkedin} onChange={set("linkedin")} placeholder="http://www.linkedin.com/in/…" />
        </div>
        <button type="button" className="cw-submit pk-center" style={{ marginTop: 12 }} onClick={save}>Submit</button>
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </div>
      </SectionBar>

      <SectionBar n={2} title="OFFERING" hint="Select listings to delete • Add listings in their respective sections">
        <p className="ep-dev"><b className="cw-red">Developer Note</b> This section is identical to <b>VIEW Profiles Individual OFFERING</b> — your events, products and services show here once posted.</p>
        <div className="ep-links"><a href="/submit">ADD Event</a><a href="/listings/submit">ADD Listing</a><a href="/employment/submit">ADD Job</a></div>
      </SectionBar>

      <SectionBar n={3} title="SEEKING" hint="Edit / Select / Submit one at a time">
        <div className="box job-form">
          <Field label="Listing Selection" hint="Display Default • Hide" wide><Input value={p.seekingText || ""} onChange={set("seekingText")} placeholder="Submit Brief Description Here" /></Field>
          <Field label="Position Title" wide><Input value={p.seekPosition || ""} onChange={set("seekPosition")} placeholder="Submit Here" /></Field>
          <Field label="Compensation Range" hint="Select / Submit one" wide><Input value={p.seekComp || ""} onChange={set("seekComp")} placeholder="$ xx,xxx per year" /></Field>
          <Field label="Employment Location" hint="within radius from address" wide><Input value={p.seekLocation || ""} onChange={set("seekLocation")} placeholder="Radius ## mi • Address • City • State" /></Field>
          <button type="button" className="cw-submit pk-center" onClick={save}>Submit</button>
        </div>
      </SectionBar>

      <SectionBar n={4} title="Affiliations" hint="Edit / Select / Submit one at a time">
        <div className="box job-form">
          <Field label="SEARCH Business / Organization / Group" hint="Click to Select" wide><Input value={p.affSearch || ""} onChange={set("affSearch")} placeholder="Submit Here" /></Field>
          <Field label="My Position / Title" wide><Input value={p.affTitle || ""} onChange={set("affTitle")} placeholder="Submit Here" /></Field>
          <Field label="Member Since" wide><Input value={p.affSince || ""} onChange={set("affSince")} placeholder="MM/DD/YYYY" /></Field>
          <button type="button" className="cw-submit pk-center" onClick={save}>Submit</button>
        </div>
      </SectionBar>

      <SectionBar n={5} title="Gallery" hint="Edit / Upload all that apply">
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

      </SectionBar>

      <SectionBar n={6} title="Interesting Things About Me">
      <div className="box" id="interesting">
        <h2><Glyph name="gem" size={18} /> Interesting Things About Me</h2>
        <Area rows={4} value={p.interesting} onChange={set("interesting")} placeholder="Submit Here — hobbies, fun facts, causes you support, places you've lived…" />
        <button type="button" className="btn-primary" style={{ marginTop: 10 }} onClick={save}>Submit</button>
      </div>

      </SectionBar>

      <SectionBar n={7} title="My Network" hint="Select one for each item">
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
      </SectionBar>

      <div className="pk-gbox ep-final">
        <span className="pk-label"><i>Select one</i></span>
        <a className="pk-opt" href="/advertising/calculate"><input type="radio" readOnly tabIndex={-1} /><Glyph name="cart" size={15} /><span>SUBMIT as a Premier Listing&nbsp;&nbsp;<i>ADD To My Shopping Cart</i></span></a>
        <a className="pk-opt" href="/advertising/calculate"><input type="radio" readOnly tabIndex={-1} /><Glyph name="calculate" size={15} /><span>Calculate My Advertising Cost</span></a>
        <a className="pk-opt" href="/advertising/rates"><input type="radio" readOnly tabIndex={-1} /><Glyph name="dollarCircle" size={15} /><span>View Advertising Rates</span></a>
        <button type="button" className="pk-opt ep-del" onClick={() => setFlash("Prototype: deleting your listing comes with accounts / the database.")}><input type="radio" readOnly tabIndex={-1} /><Glyph name="delete" size={15} /><span>DELETE Listing</span></button>
      </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
