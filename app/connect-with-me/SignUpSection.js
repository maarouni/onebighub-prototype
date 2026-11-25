"use client";

import { useEffect, useState } from "react";
import { SectionBar, PersonCard } from "../components/ConnectKit";
import { addToNetwork } from "../lib/connect";
import { getUser, setUser, keepKnownName } from "../lib/auth";

// Connect with Me ! — Section 3 (Cesar's Figma, Nov 25 email):
// 3 Sign Up / Log In (New User form) · 3a Log In (Current User).
const BLANK = { name: "", title: "", business: "", phone: "", email: "", city: "", state: "CA" };

export default function SignUpSection({ step = 3 }) {
  const [auth, setAuth] = useState("signup");
  const [user, setUserState] = useState(null);
  const loggedIn = !!user;
  const [c, setC] = useState(BLANK);
  const [hide, setHide] = useState({ phone: true, email: false });
  const [err, setErr] = useState("");
  const [lid, setLid] = useState("");
  const [lpw, setLpw] = useState("");
  const [lerr, setLerr] = useState("");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const sync = () => setUserState(getUser());
    sync();
    window.addEventListener("mc-auth-changed", sync);
    return () => window.removeEventListener("mc-auth-changed", sync);
  }, []);

  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };
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
    setUser(keepKnownName({ name, identifier: lid.trim(), method: lid.includes("@") ? "email" : "mobile", joined: new Date().toISOString() }));
    setUserState(getUser());
    say(`Welcome back, ${name}.`);
  }

  return (
    <>
      <span id="signup" />
      <SectionBar n={`${step}b`} icon="login" title="Sign Up / Log In" hint="Select one, if applicable">
        <div className="cw-box">
          {loggedIn ? <p>You&rsquo;re logged in as <b>{user?.name}</b>.</p> : (
            <>
              {[["signup", <><b className="cw-red">Sign Up</b> <i>New User • Required to save your notes, create your digests, and much more</i></>], ["login", <>Log In <i>Current User</i></>]].map(([id, l]) => (
                <label key={id} className="fp-option ct-opt"><input type="radio" name="cw-auth" checked={auth === id} onChange={() => setAuth(id)} /> <span className="fp-label">{l}</span></label>
              ))}
              <div className="em-center"><button type="button" className="cw-submit" onClick={() => document.getElementById(auth === "signup" ? "new-user" : "current-user")?.scrollIntoView({ behavior: "smooth" })}>Submit</button></div>
            </>
          )}
        </div>
        {!loggedIn && (
          <div className="cw-signup" id="new-user">
            <p><b>Sign Up</b> <i>New User • Select one</i></p>
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
        )}
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </SectionBar>

      {!loggedIn && (
        <>
          <span id="current-user" />
          <SectionBar n={`${step}c`} icon="login" title="Current User" hint="Log In">
            <div className="cw-signup">
              <p className="big-q cw-center">Welcome Back !</p>
              <label className="cw-box"><span><b>Email or Mobile</b> <i>Required</i></span><input value={lid} onChange={(e) => setLid(e.target.value)} placeholder="Submit Here  or  (xxx) xxx-xxxx" autoComplete="username" /></label>
              <label className="cw-box"><span><b>Password</b> <i>Required</i></span><input type="password" value={lpw} onChange={(e) => setLpw(e.target.value)} placeholder="Submit Here" autoComplete="current-password" /></label>
              <button type="button" className="cw-link" onClick={() => say("Password reset needs the shared database — not wired up in the prototype yet.")}><i>Forgot Password ?</i></button>
              {lerr && <p className="ed-error">{lerr}</p>}
              <div className="em-center"><button type="button" className="cw-submit cw-continue" onClick={logIn}>Continue</button></div>
              {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
            </div>
          </SectionBar>
        </>
      )}
    </>
  );
}
