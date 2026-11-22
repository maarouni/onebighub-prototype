"use client";
import { REGION_GROUPS, regionPath } from "../../lib/taxonomy";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import PageTemplate from "../../components/PageTemplate";
import OrgStatusPicker from "../../components/OrgStatusPicker";
import { SectionBar } from "../../components/ConnectKit";
import { ListingTable } from "../../components/ListingTable";
import { profileRow } from "../../components/ConnectionsView";
import { MiniCard } from "../../components/Form";
import { HostAvatar } from "../../components/EventVisuals";
import { Glyph } from "../../components/Icons";
import { PagerRow } from "../../components/PromoKit";
import { fetchOrgs, readMembership, writeMembership, fmtMembers, rosterVisible } from "../../lib/organizations";

// Nov 19 (Cesar's Figma Rev 261119, "Connect View Profiles"): one page for
// Individual and Biz / Org / Group profiles — Profile Details row + pager,
// picture / QR / My Follow-Up Status / My Relationship, the facts list,
// OFFERING, SEEKING, About or Bio, Affiliations, Gallery, Contacts (BOG),
// My Network (Individual), Send a Message, Comments • Reviews • Testimonials.
// Prototype: statuses and messages stay in this browser.
const FU_KEY = "mc_profile_followup_v1";
const REL_KEY = "mc_profile_rel_v1";
const FOLLOW = [["none", "None", "Default"], ["01", "01 Cold", "Doubtful"], ["02", "02 Mild", "Maybe"], ["03", "03 Medium", "Sometime"], ["04", "04 Warm", "Soon"], ["05", "05 HOT !", "Very Soon"]];
const RELS = [["none", "None"], ["referral", "Referral"], ["connection", "Connection"], ["colleague", "Colleague"], ["friend", "Friend"], ["family", "Family"]];
const readJ = (k) => { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; } };
const writeJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const mmddyy = (d) => { const [y, m, dd] = String(d || "").split("-"); return y ? `${m}/${dd}/${y.slice(2)}` : "MM/DD/YY"; };
const isInd = (o) => o.kind === "indPersonal" || o.kind === "indProfessional";

function Facts({ rows }) {
  return (
    <dl className="vp-facts">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="cw-red">{v || "—"}</dd></div>)}
    </dl>
  );
}

export default function ViewProfile() {
  const { id } = useParams();
  const [all, setAll] = useState(null);
  const [qr, setQr] = useState(null);
  const [follow, setFollow] = useState("none");
  const [rel, setRel] = useState([]);
  const [status, setStatusState] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [msg, setMsg] = useState("");
  const [via, setVia] = useState("both");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    fetchOrgs().then(setAll);
    setFollow(readJ(FU_KEY)[id] || "none");
    setRel(readJ(REL_KEY)[id] || []);
    setStatusState(readMembership()[id] || "");
    try { setLoggedIn(!!localStorage.getItem("mc_user_v1")); } catch {}
    QRCode.toDataURL(`${window.location.origin}/connect/${id}`, { width: 200, margin: 1 }).then(setQr).catch(() => {});
  }, [id]);

  const idx = useMemo(() => (all ? all.findIndex((x) => x.id === id) : -1), [all, id]);
  if (!all) return <div className="tpl"><p>Loading…</p></div>;
  const o = all[idx];
  if (!o) return <div className="tpl"><div className="empty-state">Couldn&rsquo;t find that profile. <a href="/connect">Back to Connect Profiles</a></div></div>;

  const ind = isInd(o);
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2200); };
  const pickFollow = (v) => { setFollow(v); writeJ(FU_KEY, { ...readJ(FU_KEY), [id]: v }); };
  const togRel = (v) => {
    const next = v === "none" ? [] : rel.includes(v) ? rel.filter((x) => x !== v) : rel.length < 3 ? [...rel, v] : rel;
    setRel(next); writeJ(REL_KEY, { ...readJ(REL_KEY), [id]: next });
  };
  const go = (n) => { const t = all[(n + all.length) % all.length]; if (t) window.location.href = `/connect/${t.id}`; };
  const affiliations = all.filter((x) => x.id !== o.id && !isInd(x)).slice(0, 3);
  const cats = (o.categories || []).join(" • ");
  const rp = regionPath(o.region);
  const regionRows = REGION_GROUPS.map((g) => [g.group, rp[g.key] || ""]);

  return (
    <PageTemplate section="connections" legend={false} activeAction="view"
      title={<>Connect&nbsp;&nbsp;<i className="pb-sub">View Profiles</i></>}
      intro={<><strong className="cw-red">Get Connected !</strong> <i>Offer before you receive&nbsp;&nbsp;•&nbsp;&nbsp;A little courtesy goes a long way !</i></>}>
      <div className="cw-page vp-page">
        <SectionBar title="Profile Details" hint={ind ? "Individual" : "Biz / Org / Group"}>
          <ListingTable rows={[profileRow(o, { selected: false, onToggle: () => {} })]} />
          <PagerRow i={idx} n={all.length} onGo={go} word="" />
        </SectionBar>

        <div className="vp-top">
          <div className="cw-box vp-pic">{ind ? <HostAvatar name={o.name} size={72} /> : <span className="vp-logo">Logo</span>}</div>
          <div className="cw-box vp-qr">
            {qr ? <img src={qr} alt={`QR code for ${o.name}`} /> : <span>QR</span>}
            <span><b>QR Connected</b><br /><i>Add to My Connect</i></span>
          </div>
          <div className="vp-status">
            <div className="cw-box">
              <b>My Follow-Up Status</b> <span className="cw-red">{FOLLOW.find((f) => f[0] === follow)?.[1]}</span>
              <i className="vp-hint"><b>OR</b> Select one</i>
              {FOLLOW.map(([v, l, h]) => (
                <label key={v} className={`pk-opt ${follow === v ? "on" : ""}`}>
                  <input type="radio" name="vp-follow" checked={follow === v} onChange={() => pickFollow(v)} />
                  <span>{v === "05" ? <>05 <b className="cw-hot">HOT !</b></> : l}</span><i>{h}</i>
                </label>
              ))}
            </div>
            <div className="cw-box">
              <b>My Relationship</b> <span className="cw-red">{rel.length ? rel.map((r) => RELS.find((x) => x[0] === r)?.[1]).join(", ") : "Selection"}</span>
              <i className="vp-hint"><b>OR</b> Select up to 3</i>
              {RELS.map(([v, l]) => (
                <label key={v} className={`pk-opt ${(v === "none" ? !rel.length : rel.includes(v)) ? "on" : ""}`}>
                  <input type="checkbox" checked={v === "none" ? !rel.length : rel.includes(v)} onChange={() => togRel(v)} />
                  <span>{l}</span>
                </label>
              ))}
            </div>
            {!ind && <div className="cw-box"><OrgStatusPicker value={status} onChange={(s) => { writeMembership(id, s); setStatusState(s); }} /></div>}
          </div>
        </div>

        <div className="vp-two">
          {ind ? <MiniCard p={{ name: o.name, title: o.title, business: o.business, phone: o.phone, email: o.email, city: `${o.city}, ${o.state}` }} />
            : <div className="cw-box"><b className="cw-red">Summary / Elevator Pitch</b><p>{o.pitch || o.tagline}</p></div>}
          {ind && <div className="cw-box"><b className="cw-red">{o.pitchTitle || "Elevator Pitch Title"}</b><p>{o.pitch || "A brief, persuasive summary that takes about 30 to 60 seconds to deliver."}</p></div>}
        </div>

        <div className="cw-box">
          <Facts rows={ind
            ? [["Network Level", "Level 1"], ["Ad Type", o.premier ? "Premier" : "Regular"], ["Categories", cats], ["Industries", o.industry], ...regionRows]
            : [["Founded", o.founded || "YYYY"], ["# Employees", o.employees ? Number(o.employees).toLocaleString() : ""], ["# Members", o.members ? fmtMembers(o.members) : ""], ["Ad Type", o.premier ? "Premier" : "Regular"], ["Categories", cats], ["Industries", o.industry], ...regionRows]} />
        </div>

        <SectionBar title="OFFERING" hint="Add selections to My Shopping Cart">
          <p className="nt-hint">No offerings listed yet — events, products and services this profile posts show here.</p>
        </SectionBar>
        {ind && (
          <SectionBar title="SEEKING">
            <div className="cw-box"><b>Listing Selection</b><p className="cw-red">{(o.seeking || []).join(", ") || "Selection(s) / Text"}</p></div>
            <div className="cw-box"><Facts rows={[["Categories", cats], ["Industries", o.industry], ...regionRows]} /></div>
          </SectionBar>
        )}

        {ind ? (
          <SectionBar title="Bio">
            <div className="cw-box"><b>{o.bioTitle || "Tagline / Title"}</b><p>{o.bioText || o.tagline}</p></div>
            <div className="bio-links">{["Business Card", "Flyer", "Resume", "Cover Letter", "LinkedIn"].map((l) => <span key={l} className="bio-pill off">{l}</span>)}</div>
          </SectionBar>
        ) : (
          <SectionBar title="About">
            <div className="cw-box"><b>WHY</b> <i className="vp-hint">Big Picture, Vision, Mission, …</i><p>{o.why || "—"}</p></div>
            <div className="cw-box"><b>BENEFITS</b> <i className="vp-hint">How you help others</i><p>{o.benefits || "—"}</p></div>
            <div className="bio-links">{["LinkedIn", "Blank 1", "Blank 2", "Blank 3", "Blank 4"].map((l) => <span key={l} className="bio-pill off">{l}</span>)}</div>
          </SectionBar>
        )}
        {ind && <SectionBar title="Interesting Things About Me"><p>{o.interesting || "—"}</p></SectionBar>}

        <SectionBar title="Affiliations" hint="Businesses / Organizations / Groups">
          <ListingTable rows={affiliations.map((a) => profileRow(a, { selected: false, onToggle: () => {}, lines: [...profileRow(a).lines, <i key="p" className="vp-hint">My Position / Title • Since MM/DD/YY</i>] }))} />
        </SectionBar>

        <SectionBar title="Gallery">
          <div className="vp-gallery"><Glyph name="idxProduct" size={40} /><span className="nt-hint">Pictures, documents and videos come with file storage (database).</span></div>
          <div className="cw-box"><b>Text / Links</b> <i className="vp-hint">articles, patents, resources, social media, etc.</i><p className="cw-red">Text / URLs</p></div>
        </SectionBar>

        {!ind && (
          <>
            <SectionBar title="Contact(s)">
              <MiniCard p={{ name: o.contactName || "Name, Title", business: o.name, phone: o.phone, email: o.email, city: `${o.city}, ${o.state}` }} />
            </SectionBar>
            <SectionBar title="Leadership • Staff • Members">
              {rosterVisible(o, status, loggedIn)
                ? <p><a href={`/connect/${o.id}/members`}>View Leadership, Staff and Members →</a> <span className="nt-hint">({(o.roster || []).length} listed)</span></p>
                : <p className="nt-hint">This profile keeps its member list private or members-only.</p>}
            </SectionBar>
          </>
        )}

        {ind && (
          <SectionBar title="My Network" right={<span className="cw-bar-link">Display Filters</span>}>
            <table className="vp-net">
              <tbody>
                {[["My Introductions", "Level 1 - Signed up directly with my QR Code OR on my profile"], ["My Connect", "Level 1"], ["My Connect", "Level 2"], ["My Connect", "Level 3"], ["Users Near Me", "Geo-locations must be enabled"], ["My Network", "Levels 1 - 3 My Introductions + My Connect"], ["onebigHUB", "All Levels"]].map(([a, b], i) => (
                  <tr key={i}><td className="cw-red">###,###</td><td><b>{a}</b></td><td><i>{b}</i></td></tr>
                ))}
              </tbody>
            </table>
            <p className="nt-hint">Counts and the network graph fill in once there&rsquo;s a shared database with real users.</p>
          </SectionBar>
        )}

        <SectionBar title="Send a Message" hint={ind ? "" : "Contacts, Leadership, Staff"}>
          <div className="cw-box">
            <b>Message</b> <span className="cw-red">{mmddyy(new Date().toISOString().slice(0, 10))}</span>
            <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Text" />
          </div>
          <div className="cw-box">
            <b>Send Message as</b> <i className="vp-hint">Select one</i>
            {[["both", "Both Email and Text"], ["email", "Email"], ["text", "Text"]].map(([v, l]) => (
              <label key={v} className={`pk-opt ${via === v ? "on" : ""}`}><input type="radio" name="vp-via" checked={via === v} onChange={() => setVia(v)} /><span>{l}</span>{v === "both" && <i>Default</i>}</label>
            ))}
          </div>
          <button type="button" className="cw-submit pk-center" onClick={() => { setMsg(""); say("Prototype: messages are sent once email / text sending is connected."); }}>Submit</button>
          {flash && <p className="nt-hint">{flash}</p>}
        </SectionBar>

        <SectionBar title="Comments • Reviews • Testimonials">
          <p className="nt-hint">No comments yet.</p>
        </SectionBar>

        <div className="vp-foot">
          <span><b>Revised</b> <span className="cw-red">{mmddyy(o.posted)}</span></span>
          <span><b>Created</b> <span className="cw-red">{mmddyy(o.posted)}</span></span>
          <button type="button" className="bio-pill" onClick={() => say("Likes come with the database.")}><Glyph name="like" size={14} /> Like</button>
          <button type="button" className="bio-pill" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => say("Link copied"))}><Glyph name="share" size={14} /> Share</button>
        </div>
      </div>
    </PageTemplate>
  );
}
