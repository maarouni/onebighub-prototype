"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import PageTemplate from "./PageTemplate";
import { SectionBar } from "./ConnectKit";
import { ListingTable, mmddyy } from "./ListingTable";
import { PagerRow } from "./PromoKit";
import { MiniCard } from "./Form";
import { Glyph } from "./Icons";
import { FIND_TYPES } from "./ListingTypeBox";

// Nov 19 (Cesar's Figma "Find Listings", Rev 261119): one template for the
// Find ___ Details pages — Employment, Products, Services, Memberships,
// Subscriptions, Surveys, Classifieds, Deals, Hospitality, Investments,
// Pay-It-Forward:
//   title bar "Find  <Type> Details" · Filters bar (Select one / Listings, 3 cols)
//   · "<Type> Details" bar with the listing row + "## of ##" pager · Title box
//   · facts list + Icon / Image / Logo · Full Description + QR Code / Copy Link
//   · Contact · Submitted by · Revised / Created · Like / Share · Comments /
//   Reviews · "Select one" instructions box above the footer (3:52 PM email).
const DIGEST_KEY = "mc_find_digest_v1";
const VENDOR_KEY = "mc_find_vendor_follow_v1";
const readJ = (k) => { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; } };
const writeJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function FindFilters({ typeId }) {
  const [open, setOpen] = useState(true);
  const types = FIND_TYPES;
  const half = Math.max(1, types.findIndex((t) => t.id === "Hospitality")); // Calendar…Deals | Hospitality…Surveys
  const cur = types.find((t) => t.id === typeId) || types[0];
  const Opt = ({ href, on, icon, img, children }) => (
    <a href={href} className={`fp-option lt-opt ${on ? "on" : ""}`}>
      <input type="radio" checked={!!on} readOnly tabIndex={-1} />
      {img ? <img src={img} alt="" /> : <Glyph name={icon} size={16} />}
      <span className="fp-label">{children}</span>
    </a>
  );
  return (
    <section className="fd-filters">
      <div className="fd-filters-bar"><b>Filters</b>
        <button type="button" className="fd-arrow" aria-label={open ? "Collapse filters" : "Expand filters"} onClick={() => setOpen((o) => !o)}>{open ? "⌃" : "⌄"}</button>
      </div>
      {open && (
        <div className="fd-filters-cols">
          <div className="fp-box">
            <i className="fd-hint">Select one</i>
            <Opt href={cur.table} icon="idxListings">One Big Table <i>Default</i></Opt>
            <Opt href={cur.digest} icon="idxDigestImg">My Custom Digest</Opt>
            <Opt href="#" on icon="eyeView"><b>VIEW Listings</b></Opt>
            <Opt href={cur.edit} icon="editMode">EDIT My Listings</Opt>
          </div>
          <div className="fp-box">
            <span className="fd-head"><b>Listings</b> <i>Select one</i></span>
            {types.slice(0, half).map((t) => <Opt key={t.id} href={t.table} on={t.id === typeId} icon={t.icon} img={t.img}>{t.id === typeId ? <b>{t.label}</b> : t.label}{t.id === "Calendar" && <i> Default</i>}</Opt>)}
          </div>
          <div className="fp-box">
            <span className="fd-head">&nbsp;</span>
            {types.slice(half).map((t) => <Opt key={t.id} href={t.table} on={t.id === typeId} icon={t.icon} img={t.img}>{t.id === typeId ? <b>{t.label}</b> : t.label}</Opt>)}
          </div>
        </div>
      )}
    </section>
  );
}

export default function FindDetail({
  typeId, typeLabel, icon, section = "products",
  item, items = [], hrefOf, rowOf,
  title, brief, facts = [], fullDescription, contact, submittedBy, notFound,
}) {
  const [qr, setQr] = useState(null);
  const [inDigest, setInDigest] = useState(false);
  const [vendorOn, setVendorOn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [flash, setFlash] = useState("");
  const vendor = submittedBy?.business || submittedBy?.name || "";

  useEffect(() => {
    if (!item) return;
    QRCode.toDataURL(window.location.href, { width: 200, margin: 1 }).then(setQr).catch(() => {});
    setInDigest(!!readJ(DIGEST_KEY)[`${typeId}:${item.id}`]);
    setVendorOn(!!readJ(VENDOR_KEY)[vendor]);
    try { setLoggedIn(!!localStorage.getItem("mc_user_v1")); } catch {}
  }, [item, typeId, vendor]);

  if (item === undefined) return <div className="tpl"><p>Loading…</p></div>;
  if (!item) return <div className="tpl"><div className="empty-state">{notFound}</div></div>;

  const idx = items.findIndex((x) => x.id === item.id);
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2400); };
  const go = (n) => { const t = items[(n + items.length) % items.length]; if (t) window.location.href = hrefOf(t); };
  const addListing = () => {
    if (!loggedIn) return say("Sign Up / Log In first to ADD listings to your digest.");
    const all = readJ(DIGEST_KEY); const k = `${typeId}:${item.id}`; all[k] = !all[k]; writeJ(DIGEST_KEY, all);
    setInDigest(!!all[k]); say(all[k] ? "Added to My Digest." : "Removed from My Digest.");
  };
  const addVendor = () => {
    if (!loggedIn) return say("Sign Up / Log In first to follow this vendor.");
    const all = readJ(VENDOR_KEY); all[vendor] = !all[vendor]; writeJ(VENDOR_KEY, all);
    setVendorOn(!!all[vendor]); say(all[vendor] ? `Future listings from ${vendor} will be added to My Digest.` : `Stopped following ${vendor}.`);
  };

  return (
    <PageTemplate section={section} legend={false}
      title={<>Find&nbsp;&nbsp;<i className="pb-sub">{typeLabel} Details</i></>} icon={icon} typeIcon={icon}>
      <div className="cw-page fd-page">
        <FindFilters typeId={typeId} />

        <SectionBar title={typeLabel} hint="Details">
          <ListingTable rows={[{ ...rowOf(item), selected: inDigest, onToggle: addListing }]} />
          {items.length > 1 && <PagerRow i={Math.max(0, idx)} n={items.length} onGo={go} word="" />}
        </SectionBar>

        <div className="cw-box fd-title">
          <h2 className="cw-red">{title}</h2>
          {brief && <p className="cw-red">{brief}</p>}
        </div>

        <div className="cw-box fd-facts">
          <dl className="vp-facts">
            {facts.filter(Boolean).map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="cw-red">{v || "—"}</dd></div>)}
          </dl>
          <div className="fd-img"><Glyph name={rowOf(item).imageIcon || "idxProduct"} size={40} /><span>Icon, Image<br />or Logo</span></div>
        </div>

        <div className="cw-box fd-full">
          <div><b>Full Description</b><p>{fullDescription || "—"}</p></div>
          <div className="fd-qr">
            {qr ? <img src={qr} alt="QR code for this listing" /> : null}
            <i>QR Code</i>
            <button type="button" className="bio-pill" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => say("Link copied"))}>Copy Link</button>
          </div>
        </div>

        {contact && (
          <SectionBar title="Contact">
            <MiniCard p={contact} />
          </SectionBar>
        )}
        {submittedBy && (
          <SectionBar title="Submitted by">
            <MiniCard p={submittedBy} />
          </SectionBar>
        )}

        <div className="vp-foot">
          <span><b>Revised</b> <span className="cw-red">{mmddyy(item.posted) || "MM/DD/YY"}</span></span>
          <span><b>Created</b> <span className="cw-red">{mmddyy(item.posted) || "MM/DD/YY"}</span></span>
          <button type="button" className="bio-pill" onClick={() => say("Likes come with the database.")}><Glyph name="like" size={14} /> Like</button>
          <button type="button" className="bio-pill" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => say("Link copied"))}><Glyph name="share" size={14} /> Share</button>
        </div>

        <SectionBar title="Comments / Reviews">
          <p className="nt-hint">No comments yet.</p>
        </SectionBar>

        <div className="pk-gbox ep-final fd-final">
          <span className="pk-label"><i>Select one</i></span>
          <button type="button" className={`pk-opt ${inDigest ? "on" : ""}`} onClick={addListing}><input type="radio" checked={inDigest} readOnly tabIndex={-1} /><Glyph name="plusBold" size={15} /><span>ADD Listing to My Digest</span></button>
          <button type="button" className={`pk-opt ${vendorOn ? "on" : ""}`} onClick={addVendor}><input type="radio" checked={vendorOn} readOnly tabIndex={-1} /><Glyph name="plusBold" size={15} /><span>ADD Future Listings from this Vendor to My Digest</span></button>
          {!loggedIn && <a className="pk-opt" href="/registration/login"><input type="radio" readOnly tabIndex={-1} /><Glyph name="login" size={15} /><span>Sign Up / Log In to ADD Listings</span></a>}
          {flash && <p className="nt-hint">{flash}</p>}
        </div>
      </div>
    </PageTemplate>
  );
}
