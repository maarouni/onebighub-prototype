"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard, NextLink } from "../../components/ConnectKit";
import { Glyph } from "../../components/Icons";
import { getProfile } from "../../lib/profile";
import { getNetwork, SAMPLE_NETWORK, MESSAGE_TEMPLATES, fillTemplate, getMessages, saveMessage, clearMessages } from "../../lib/connect";

// Connect with Me ! — Messages (Figma /UserName/ConnectWithMe/Messages):
// 5a Send Messages · 5b My Messages (Archives).
const MSG_OPTIONS = [["none", "No Message", true], ["a", "Message A"], ["b", "Message B"], ["c", "Message C"]];
const SEND_OPTIONS = [["none", "No Message", true], ["both", "Send Both"], ["email", "Send Email"], ["text", "Send Text"]];
const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" });
};

export default function ConnectMessages() {
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState([]);
  const [sample, setSample] = useState(false);
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [idx, setIdx] = useState(0);
  const [tpl, setTpl] = useState("none");
  const [send, setSend] = useState("none");
  const [text, setText] = useState("");
  const [archive, setArchive] = useState([]);
  const [aq, setAq] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setMe(getProfile());
    const n = getNetwork();
    setSample(n.length === 0);
    setPeople(n.length ? n : SAMPLE_NETWORK);
    setArchive(getMessages());
  }, []);

  const matches = useMemo(() => {
    const s = applied.trim().toLowerCase();
    return s ? people.filter((p) => `${p.name} ${p.business} ${p.email}`.toLowerCase().includes(s)) : people;
  }, [people, applied]);
  const to = matches[Math.min(idx, matches.length - 1)] || null;

  useEffect(() => {
    setText(fillTemplate(MESSAGE_TEMPLATES[tpl], { date: fmtDate(to?.when), event: to?.event }));
  }, [tpl, to?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };

  function submit() {
    if (!to) return say("Search and pick someone first.");
    if (tpl === "none" || !text.trim()) return say("Pick Message A, B or C (or write one).");
    if (send === "none") return say("Pick how to send it: Send Both, Send Email or Send Text.");
    const m = saveMessage({ to: { name: to.name, title: to.title, phone: to.phone, email: to.email }, text, via: send });
    setArchive(getMessages());
    const sig = `\n\n${[me?.name, me?.title, me?.business, me?.phone, me?.email].filter(Boolean).join(" · ")}`;
    if ((send === "email" || send === "both") && to.email) window.open(`mailto:${to.email}?subject=${encodeURIComponent("Let's network together")}&body=${encodeURIComponent(text + sig)}`, "_blank");
    if ((send === "text" || send === "both") && to.phone) window.open(`sms:${to.phone}?&body=${encodeURIComponent(text)}`, "_blank");
    say(`Saved to My Messages${to.sample ? " (sample contact — nothing was sent)" : ""}.`);
    return m;
  }

  const shownArchive = archive.filter((m) => !aq.trim() || `${m.to?.name} ${m.text}`.toLowerCase().includes(aq.trim().toLowerCase()));
  const radios = (name, list, val, set) => list.map(([id, label, def]) => (
    <label key={id} className="fp-option">
      <input type="radio" name={name} checked={val === id} onChange={() => set(id)} />
      <span className="fp-label">{label}{def && <em> Default</em>}</span>
    </label>
  ));

  return (
    <ConnectPage subtitle="Messages">
      <SectionBar n="5a" title="Send Messages">
        <div className="cw-box">
          <span className="ed-label"><b>SEARCH Individuals</b> <i>Select one at a time</i></span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Submit Here"
            onKeyDown={(e) => { if (e.key === "Enter") { setApplied(q); setIdx(0); } }} />
          <button type="button" className="cw-submit" onClick={() => { setApplied(q); setIdx(0); }}>Submit</button>
          <div className="cw-carousel">
            <button type="button" className="cw-pg" disabled={idx <= 0} onClick={() => setIdx((i) => i - 1)} aria-label="Previous"><Glyph name="pagePrev" size={22} /></button>
            {to ? <PersonCard p={to} /> : <p className="cw-muted">Nobody matches “{applied}”.</p>}
            <button type="button" className="cw-pg" disabled={idx >= matches.length - 1} onClick={() => setIdx((i) => i + 1)} aria-label="Next"><Glyph name="pageNext" size={22} /></button>
          </div>
          <p className="cw-center"><b className="cw-red">{matches.length ? Math.min(idx, matches.length - 1) + 1 : 0}</b> of <b className="cw-red">{matches.length}</b>{sample && <i className="cw-muted"> (sample names)</i>}</p>
        </div>
        <div className="cw-two cw-two-narrow">
          <div className="cw-box"><b>Messages</b> <i>Edit / Select one</i>{radios("cw-tpl", MSG_OPTIONS, tpl, setTpl)}</div>
          <div className="cw-box"><b>Send Message</b> <i>Select one</i>{radios("cw-send", SEND_OPTIONS, send, setSend)}</div>
        </div>
        <label className="cw-box cw-msg">
          <span className="ed-label"><b>Message</b> <span className="cw-red">{fmtDate(new Date().toISOString())}</span> • <i>EDIT if applicable</i></span>
          <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Pick Message A, B or C above, then edit here." />
        </label>
        <CardAndPitch p={me} placeholder />
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
        <p className="cw-center"><button type="button" className="cw-submit" onClick={submit}>Submit</button></p>
      </SectionBar>

      <SectionBar n="5b" title="My Messages" hint="Archives"
        right={<button type="button" className="cw-icon-btn" data-tip="Delete all" onClick={() => setConfirmClear(true)}><Glyph name="delete" size={16} /></button>}>
        {confirmClear && (
          <div className="cw-confirm">
            Delete all {archive.length} saved messages? This can&apos;t be undone.
            <button type="button" className="cw-submit" onClick={() => { clearMessages(); setArchive([]); setConfirmClear(false); }}>Delete</button>
            <button type="button" className="cw-chip" onClick={() => setConfirmClear(false)}>Cancel</button>
          </div>
        )}
        <div className="obc-search-row">
          <label className="obc-search"><Glyph name="search" size={16} /><input type="text" placeholder="SEARCH" value={aq} onChange={(e) => setAq(e.target.value)} /></label>
          <button type="button" className="obc-return" aria-label="Return" onClick={() => history.back()}><Glyph name="figBack" size={26} /></button>
        </div>
        {shownArchive.length === 0 && <p className="cw-muted">No messages yet.</p>}
        {shownArchive.map((m) => (
          <div key={m.id} className="cw-box cw-archive">
            <span><b className="cw-blue">{m.sent}</b> • {[m.to?.name, m.to?.title, m.to?.phone, m.to?.email].filter(Boolean).join(", ")}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </SectionBar>
      <NextLink href="/connect/next">Next: Next Steps</NextLink>
    </ConnectPage>
  );
}
