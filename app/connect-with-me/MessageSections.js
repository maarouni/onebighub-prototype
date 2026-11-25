"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionBar, CardAndPitch, PersonCard } from "../components/ConnectKit";
import { PagerRow } from "../components/PromoKit";
import { getProfile } from "../lib/profile";
import { getNetwork, SAMPLE_NETWORK, saveMessage, MESSAGE_TEMPLATES, fillTemplate } from "../lib/connect";

// Connect with Me ! — Steps 5 (Send a Message) and 6 (Next Steps), per Cesar's
// Figma (Nov 25 email). Rendered on /connect-with-me after Step 4 View My Network.
const MSG_OPTIONS = [["a", "A - Blank Message", true], ["b", <>B - Short Message <i>We recently met …</i></>], ["c", <>C - Invitation to visit onebig<b className="cw-red">HUB</b></>], ["d", <>D - Welcome to onebig<b className="cw-red">HUB</b></>], ["e", "E - Custom Message"]];
const SEND_AS = [["both", "Both Email and Text", true], ["email", "Email"], ["text", "Text"]];
const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }); };

export function MessageSection({ step = 5 }) {
  const [me, setMe] = useState(null);
  const [real, setReal] = useState([]);
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [idx, setIdx] = useState(0);
  const [tpl, setTpl] = useState("a");
  const [send, setSend] = useState("both");
  const [text, setText] = useState("");
  const [flash, setFlash] = useState("");
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setMe(getProfile());
    setReal(getNetwork());
    setStamp(new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", hour: "numeric", minute: "2-digit" }));
  }, []);

  const people = real.length === 0 ? SAMPLE_NETWORK : real;
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

  return (
    <>
      <span id="message" />
      <SectionBar n={step} icon="idxMessages" title="Send a Message">
        <div className="cw-box">
          <span><b>SEARCH Individuals</b> <i>Select one at a time</i></span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Submit Here" onKeyDown={(e) => { if (e.key === "Enter") { setApplied(q); setIdx(0); } }} />
          <div className="em-center"><button type="button" className="cw-submit" onClick={() => { setApplied(q); setIdx(0); }}>Submit</button></div>
        </div>
        <div className="cw-card-center">{to ? <PersonCard p={to} /> : <p className="cw-muted">Nobody matches “{applied}”.</p>}</div>
        <PagerRow i={Math.min(idx, Math.max(0, matches.length - 1))} n={matches.length} onGo={(n) => setIdx(Math.min(Math.max(0, n), matches.length - 1))} word="" />
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
    </>
  );
}

export function NextSection({ step = 6 }) {
  const [next, setNext] = useState("");
  return (
    <>
      <span id="next" />
      <SectionBar n={step} icon="idxSigns" title="Next Steps" hint="Select one at a time">
        <div className="cw-box cw-nextlist">
          {[
            ["a", "/profile", "A - Connect", "Create My No-Cost Profiles: Individual / Business(es) / Organization(s) / Group(s)"],
            ["b", "/connect-with-me", <i key="b">B - Connect with Me !</i>, "Invite others with My Custom QR Code"],
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
    </>
  );
}
