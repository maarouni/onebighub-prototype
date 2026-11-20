"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectPage, SectionBar, CardAndPitch, PersonCard, NetworkGraph } from "../../components/ConnectKit";
import { Box, Option, RefIcon } from "../../components/FilterKit";
import { MiniCard } from "../../components/Form";
import { Glyph } from "../../components/Icons";
import { PagerRow } from "../../components/PromoKit";
import { getProfile } from "../../lib/profile";
import { getNetwork, SAMPLE_NETWORK, relsOf, MESSAGE_TEMPLATES, fillTemplate, saveMessage, addToNetwork } from "../../lib/connect";
import { getUser, setUser } from "../../lib/auth";

const BLANK = { name: "", title: "", business: "", phone: "", email: "", city: "", state: "CA" };

// Connect with Me ! — Steps 4-6 (Cesar's Figma Rev 261120):
// 4 Sign Up / Log In (4a New User, 4b Current User) · 5 Send a Message · 6 Next Steps.
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
  const [offer, setOffer] = useState("both");
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
  // step 4 / 4a / 4b
  const [auth, setAuth] = useState("signup");
  const [user, setUserState] = useState(null);
  const loggedIn = !!user;
  const [c, setC] = useState(BLANK);
  const [hide, setHide] = useState({ phone: true, email: false });
  const [err, setErr] = useState("");
  const [lid, setLid] = useState("");
  const [lpw, setLpw] = useState("");
  const [lerr, setLerr] = useState("");
  const set = (k) => (e) => setC((x) => ({ ...x, [k]: e.target.value }));
  const preview = { ...c, city: [c.city, c.state].filter(Boolean).join(", "), phone: hide.phone ? "" : c.phone, email: hide.email ? "" : c.email };
  function submitAll() {
    if (!c.name.trim()) return setErr("Name is required.");
    if (!c.phone.trim() && !c.email.trim()) return setErr("Enter a mobile / phone or an email.");
    setErr("");
    let rel = {}; try { rel = JSON.parse(localStorage.getItem("mc_pending_relationship_v1") || "{}"); } catch {}
    addToNetwork({ ...c, city: [c.city, c.state].filter(Boolean).join(", "), hide, ...rel, level: "intro" });
    setUser({ name: c.name, identifier: c.email || c.phone, method: c.email ? "email" : "mobile", joined: new Date().toISOString() });
    setUserState(getUser());
    say(`Welcome, ${c.name} — you're signed up.`);
    document.getElementById("message")?.scrollIntoView({ behavior: "smooth" });
  }
  function logIn() {
    if (!lid.trim()) return setLerr("Enter your email or mobile.");
    if (!lpw) return setLerr("Enter your password.");
    setLerr("");
    const name = lid.includes("@") ? lid.split("@")[0] : lid;
    setUser({ name, identifier: lid.trim(), method: lid.includes("@") ? "email" : "mobile", joined: new Date().toISOString() });
    setUserState(getUser());
    say(`Welcome back, ${name}.`);
  }
  useEffect(() => { setUserState(getUser()); setMe(getProfile()); setReal(getNetwork()); setStamp(new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", hour: "numeric", minute: "2-digit" })); }, []);
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
    if (offer === "no" && p.offersReferral) return false;
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
      <span id="signup" />
      {/* Nov 20 (Cesar's Figma Rev 261120): 4 Sign Up / Log In · 4a New User · 4b Current User */}
      <SectionBar n={4} icon="login" title="Sign Up / Log In" hint="Select one, if applicable">
        <div className="cw-box">
          {loggedIn ? <p>You&rsquo;re logged in as <b>{user?.name}</b>. <a href="/connect-with-me">View My Network (Step 3) →</a></p> : (
            <>
              {[["signup", <><b className="cw-red">Sign Up</b> <i>New User • Required to save your notes, create your digests, and much more</i></>], ["login", <>Log In <i>Current User</i></>]].map(([id, l]) => (
                <label key={id} className="fp-option ct-opt"><input type="radio" name="cw-auth" checked={auth === id} onChange={() => setAuth(id)} /> <span className="fp-label">{l}</span></label>
              ))}
              <div className="em-center"><button type="button" className="cw-submit" onClick={() => document.getElementById(auth === "signup" ? "new-user" : "current-user")?.scrollIntoView({ behavior: "smooth" })}>Submit</button></div>
            </>
          )}
        </div>
      </SectionBar>

      <span id="new-user" />
      <SectionBar n="4a" icon="register" title="New User" hint={<>Sign Up • Select one</>}>
        <div className="cw-signup">
          <button type="button" className="cw-social" onClick={() => say("Sign in with Apple needs an Apple developer account — coming with the live version.")}><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="#000" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8s2.3-1.3 3.1-2.5c1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg> <b>Sign in with Apple</b> <i>Auto-fills info</i></button>
          <div className="form-or"><span>OR</span></div>
          <button type="button" className="cw-social" onClick={() => say("Sign in with Google needs Google sign-in set up — coming with the live version.")}><svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13.6 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17z"/><path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.7 2.2-8.7 2.2-6.4 0-11.7-4.1-13.6-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg> <b>Sign in with Google</b> <i>Auto-fills info</i></button>
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
          
        </div>
      </SectionBar>


      <span id="current-user" />
      <SectionBar n="4b" icon="login" title="Current User" hint="Log In">
        <div className="cw-signup">
          <p className="big-q cw-center">Welcome Back !</p>
          <label className="cw-box"><span><b>Email or Mobile</b> <i>Required</i></span><input value={lid} onChange={(e) => setLid(e.target.value)} placeholder="Submit Here  or  (xxx) xxx-xxxx" autoComplete="username" /></label>
          <label className="cw-box"><span><b>Password</b> <i>Required</i></span><input type="password" value={lpw} onChange={(e) => setLpw(e.target.value)} placeholder="Submit Here" autoComplete="current-password" /></label>
          <button type="button" className="cw-link" onClick={() => say("Password reset needs the shared database — not wired up in the prototype yet.")}><i>Forgot Password ?</i></button>
          {lerr && <p className="ed-error">{lerr}</p>}
          <div className="em-center"><button type="button" className="cw-submit cw-continue" onClick={logIn}>Continue</button></div>
          <div className="form-or"><span>OR</span></div>
          <button type="button" className="cw-social cw-social-blue" onClick={() => say("Sign in with Google needs Google sign-in set up — coming with the live version.")}><span className="cw-g-wrap"><svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13.6 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17z"/><path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.6 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.7 2.2-8.7 2.2-6.4 0-11.7-4.1-13.6-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg></span> Sign in with Google</button>
          <p className="cw-center"><b>Don&rsquo;t have an account ?</b> <a href="#new-user">Sign Up</a></p>
        </div>
      </SectionBar>

      <span id="message" />
      <SectionBar n={5} icon="idxMessages" title="Send a Message">
        <div className="cw-box">
          <span><b>SEARCH Individuals</b> <i>Select one at a time</i></span>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Submit Here" onKeyDown={(e) => { if (e.key === "Enter") { setApplied(q); setIdx(0); } }} />
          <div className="em-center"><button type="button" className="cw-submit" onClick={() => { setApplied(q); setIdx(0); }}>Submit</button></div>
        </div>
        {/* Nov 20 (Figma): mini-card centered, "## of ##" pager bar underneath */}
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

      <span id="next" />
      <SectionBar n={6} icon="idxSigns" title="Next Steps" hint="Select one at a time">
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
    </ConnectPage>
  );
}
