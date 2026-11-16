"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard, NetworkGraph } from "../../components/ConnectKit";
import { Box, Option } from "../../components/FilterKit";
import { MiniCard } from "../../components/Form";
import { Glyph } from "../../components/Icons";
import { getProfile } from "../../lib/profile";
import { getNetwork, SAMPLE_NETWORK, FOLLOW_UP, relsOf, MESSAGE_TEMPLATES, fillTemplate, saveMessage } from "../../lib/connect";

// Connect with Me ! — Steps 4-6 (Cesar's Figma Rev 261115):
// 4 View My Network (Display / Hide Filters) · 5 Send a Message · 6 Next Steps.
const MSG_OPTIONS = [["a", "A - Blank Message", true], ["b", <>B - Short Message <i>We recently met …</i></>], ["c", <>C - Invitation to visit onebig<b className="cw-red">HUB</b></>], ["d", <>D - Welcome to onebig<b className="cw-red">HUB</b></>], ["e", "E - Custom Message"]];
const SEND_AS = [["both", "Both Email and Text", true], ["email", "Email"], ["text", "Text"]];
const REL_OPTS = [["referrals", "Referrals"], ["connection", "Connections"], ["colleague", "Colleagues"], ["friend", "Friends"], ["family", "Family"]];
const LEVEL_OPTS = [["intro", <>My Introductions <i>Level 1</i></>], ["1", <>My Connections <i>Level 1</i></>], ["2", <>My Connections <i>Level 2</i></>], ["3", <>My Connections <i>Level 3</i></>]];
const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }); };

export default function ConnectSteps46() {
  const [me, setMe] = useState(null);
  const [real, setReal] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [view, setView] = useState("graph");
  const [follow, setFollow] = useState("all");
  const [rel, setRel] = useState([]);
  const [relNone, setRelNone] = useState(false);
  const [lvl, setLvl] = useState([]);
  const [lvlNone, setLvlNone] = useState(false);
  const [offer, setOffer] = useState("no");
  // messages
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [idx, setIdx] = useState(0);
  const [tpl, setTpl] = useState("a");
  const [send, setSend] = useState("both");
  const [text, setText] = useState("");
  const [flash, setFlash] = useState("");
  const [next, setNext] = useState("");

  const [stamp, setStamp] = useState("");
  useEffect(() => { setMe(getProfile()); setReal(getNetwork()); setStamp(new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", hour: "numeric", minute: "2-digit" })); }, []);
  const sample = real.length === 0;
  const people = sample ? SAMPLE_NETWORK : real;
  const tog = (list, set, v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const shown = useMemo(() => people.filter((p) => {
    if (follow === "none") return false;
    if (follow !== "all" && (p.followUp || "01") !== follow) return false;
    if (relNone || lvlNone) return false;
    if (rel.length) { const s = relsOf(p); if (!rel.some((k) => (k === "referrals" ? p.professional === "referral" || p.referral : s.has(k)))) return false; }
    if (lvl.length && !lvl.includes(p.level || "1")) return false;
    if (offer === "yes" && !p.offersReferral) return false;
    return true;
  }), [people, follow, rel, relNone, lvl, lvlNone, offer]);
  const n = (f) => people.filter(f).length;

  const matches = useMemo(() => {
    const s = applied.trim().toLowerCase();
    return s ? people.filter((p) => `${p.name} ${p.business} ${p.email}`.toLowerCase().includes(s)) : people;
  }, [people, applied]);
  const to = matches[Math.min(idx, matches.length - 1)] || null;
  useEffect(() => { setText(fillTemplate(MESSAGE_TEMPLATES[tpl], { date: fmtDate(to?.when), event: to?.event })); }, [tpl, to?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };
  function submitMsg() {
    if (!to) return say("Search and pick someone first.");
    if (!text.trim()) return say("Write a message, or pick template B, C or D.");
    saveMessage({ to: { name: to.name, title: to.title, phone: to.phone, email: to.email }, text, via: send });
    const sig = `\n\n${[me?.name, me?.title, me?.business, me?.phone, me?.email].filter(Boolean).join(" · ")}`;
    if (send !== "text" && to.email) window.open(`mailto:${to.email}?subject=${encodeURIComponent("Let's network together")}&body=${encodeURIComponent(text + sig)}`, "_blank");
    if (send !== "email" && to.phone) window.open(`sms:${to.phone}?&body=${encodeURIComponent(text)}`, "_blank");
    say(`Saved to My Messages (Dashboards)${to.sample ? " — sample contact, nothing was sent" : ""}.`);
  }

  const toggleBtn = <button type="button" className="cw-dispf" onClick={() => setShowFilters((v) => !v)}>{showFilters ? "Hide Filters" : "Display Filters"}</button>;

  return (
    <ConnectPage>
      <SectionBar n={4} icon="figViewProfile" title="View My Network" right={toggleBtn}>
        <PersonCard p={me} placeholder />
        <div className={`cw-net ${showFilters ? "" : "cw-net-full"}`}>
          {showFilters && (
            <div className="cw-filters">
              <div className="cw-mini-bar"><b>Filters</b><button type="button" onClick={() => setShowFilters(false)}>Hide</button></div>
              <Box title="View as" hint="Select one">
                <Option type="radio" name="cw-view" checked={view === "graph"} onChange={() => setView("graph")} label="Graph" def />
                <Option type="radio" name="cw-view" checked={view === "list"} onChange={() => setView("list")} label="List" />
              </Box>
              <Box title={<>My Follow-Up Status <i>Private</i></>} hint="Select one">
                <Option type="radio" name="cw-fu" checked={follow === "all"} onChange={() => setFollow("all")} label="All" def />
                <Option type="radio" name="cw-fu" checked={follow === "none"} onChange={() => setFollow("none")} label="None" />
                {FOLLOW_UP.map((f) => (
                  <Option key={f.id} type="radio" name="cw-fu" checked={follow === f.id} onChange={() => setFollow(f.id)}
                    label={<>{f.hot ? <>05 <b className="cw-hot">HOT !</b></> : f.label.replace(" / None", "")} <i>{({ "01": "Doubtful", "02": "Maybe", "03": "Sometime", "04": "Soon", "05": "Very Soon" })[f.id]}</i></>} />
                ))}
              </Box>
              <Box title="My Relationships" hint="Select all that apply">
                <Option checked={!rel.length && !relNone} onChange={() => { setRel([]); setRelNone(false); }} label="All" def />
                <Option checked={relNone} onChange={() => { setRelNone((v) => !v); setRel([]); }} label="None" />
                {REL_OPTS.map(([id, l]) => <Option key={id} checked={rel.includes(id)} onChange={() => { setRelNone(false); tog(rel, setRel, id); }} label={l} />)}
              </Box>
              <Box title="Levels" hint="Select all that apply">
                <Option checked={!lvl.length && !lvlNone} onChange={() => { setLvl([]); setLvlNone(false); }} label="All" def />
                <Option checked={lvlNone} onChange={() => { setLvlNone((v) => !v); setLvl([]); }} label="None" />
                {LEVEL_OPTS.map(([id, l]) => <Option key={id} checked={lvl.includes(id)} onChange={() => { setLvlNone(false); tog(lvl, setLvl, id); }} label={l} />)}
              </Box>
              <Box title="Offering $ Referrals">
                <Option type="radio" name="cw-offer" checked={offer === "no"} onChange={() => setOffer("no")} label="No" def />
                <Option type="radio" name="cw-offer" checked={offer === "yes"} onChange={() => setOffer("yes")} label="Yes" />
              </Box>
            </div>
          )}
          <div className="cw-netmain">
            {!showFilters && (
              <div className="cw-mini-bar"><b>View as</b>
                <label><input type="radio" name="cw-view2" checked={view === "graph"} onChange={() => setView("graph")} /> Graph <i>Default</i></label>
                <label><input type="radio" name="cw-view2" checked={view === "list"} onChange={() => setView("list")} /> List</label>
              </div>
            )}
            <div className="cw-netbox">
              {view === "graph" ? <NetworkGraph me={me} people={shown} />
                : <div className="cw-list">{shown.map((p) => <MiniCard key={p.id} p={p} />)}{!shown.length && <p className="cw-muted">Nobody matches these filters.</p>}</div>}
              {sample && <p className="cw-muted cw-sample">Sample names until people join through your QR code.</p>}
            </div>
          </div>
        </div>
        <div className="cw-counts">
          <span><b className="cw-red">{n((p) => p.level === "intro")}</b> <b>My Introductions</b> <i>Level 1 - Signed up directly with my QR Code OR on my profile</i></span>
          {["1", "2", "3"].map((l) => <span key={l}><b className="cw-red">{n((p) => p.level === l)}</b> <b>My Connections</b> <i>Level {l}</i></span>)}
          <span><b className="cw-red">xxx,xxx</b> <b>Users Near Me</b> <i>Geo-locations must be enabled</i></span>
          <span><b className="cw-red">{people.length}</b> <b>My Network</b> <i>Levels 1 - 3 My Introductions + My Connections</i></span>
          <span><b className="cw-red">xxx,xxx</b> <b>onebig<span className="cw-red">HUB</span></b> <i>All Levels</i></span>
        </div>
      </SectionBar>

      <span id="message" />
      <SectionBar n={5} icon="idxMessages" title="Send a Message">
        <div className="cw-box">
          <span><b>SEARCH Individuals</b> <i>Select one at a time</i></span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Submit Here" onKeyDown={(e) => { if (e.key === "Enter") { setApplied(q); setIdx(0); } }} />
          <div className="em-center"><button type="button" className="cw-submit" onClick={() => { setApplied(q); setIdx(0); }}>Submit</button></div>
        </div>
        <div className="cw-carousel">
          <button type="button" className="cw-pg" disabled={idx <= 0} onClick={() => setIdx((i) => i - 1)} aria-label="Previous"><Glyph name="pagePrev" size={22} /></button>
          {to ? <PersonCard p={to} /> : <p className="cw-muted">Nobody matches “{applied}”.</p>}
          <button type="button" className="cw-pg" disabled={idx >= matches.length - 1} onClick={() => setIdx((i) => i + 1)} aria-label="Next"><Glyph name="pageNext" size={22} /></button>
        </div>
        <p className="cw-center"><b className="cw-red">{matches.length ? Math.min(idx, matches.length - 1) + 1 : 0}</b> of <b className="cw-red">{matches.length}</b>{sample && <i className="cw-muted"> (sample names)</i>}</p>
        <div className="cw-box">
          <span><b>Message</b> <i>Select one template •</i> <b>Edit in Dashboards</b> <i>- My Custom Marketing Collateral</i></span>
          {MSG_OPTIONS.map(([id, l, def]) => (
            <label key={id} className="fp-option ct-opt"><input type="radio" name="cw-tpl" checked={tpl === id} onChange={() => setTpl(id)} /> <span className="fp-label">{l}{def && <i> Default</i>}</span></label>
          ))}
        </div>
        <label className="cw-box cw-msg">
          <span><b>Message</b> <span className="cw-red">{stamp}</span></span>
          <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your message, or pick a template above." />
        </label>
        <CardAndPitch p={me} placeholder />
        <div className="cw-box">
          <span><b>Send Message as</b> <i>Select one</i></span>
          {SEND_AS.map(([id, l, def]) => (
            <label key={id} className="fp-option ct-opt"><input type="radio" name="cw-send" checked={send === id} onChange={() => setSend(id)} /> <span className="fp-label">{l}{def && <i> Default</i>}</span></label>
          ))}
          <div className="em-center"><button type="button" className="cw-submit" onClick={submitMsg}>Submit</button></div>
        </div>
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </SectionBar>

      <span id="next" />
      <SectionBar n={6} icon="idxSigns" title="Next Steps" hint="Select one at a time">
        <div className="cw-box cw-nextlist">
          {[
            ["a", "/profile", "A - Connections", "Create My No-Cost Profiles: Individual / Business(es) / Organization(s) / Group(s)"],
            ["b", "/connect", <i key="b">B - Connect with Me !</i>, "Invite others with My Custom QR Code"],
            ["c", "/advertising", "C - Promote & Earn !", <>Create My Listings (Regular or Premier)<br />AND share profits from ads and sales fees with your network (3 Levels of Introductions)</>],
            ["d", "/dashboards", "D - Manage My Dashboards & Settings", null],
            ["e", "/info/contact", <b key="e"><i>How may we be of help to you ?</i></b>, <>Please <a href="/info/contact">contact us</a> with your comments and questions</>],
          ].map(([id, href, label, sub]) => (
            <label key={id} className="fp-option ct-opt cw-next-opt">
              <input type="radio" name="cw-next" checked={next === id} onChange={() => { setNext(id); window.location.href = href; }} />
              <span className="fp-label">{label}{sub && <span className="cw-next-sub">{sub}</span>}</span>
            </label>
          ))}
        </div>
      </SectionBar>
      <p className="cw-next"><a href="/connect">← Steps 1-3: SCAN My QR Code · Relationship &amp; Notes · New User</a></p>
    </ConnectPage>
  );
}
