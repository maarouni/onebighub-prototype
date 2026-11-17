"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../../components/PageTemplate";
import { Field, Input, PasswordInput, NotRobot, Radios, OrLine } from "../../components/Form";
import { setUser } from "../../lib/auth";
import { MiniCardView, PagerRow } from "../../components/PromoKit";
import { fetchProfiles, matchProfile } from "../../lib/referrals";

// Cesar's "Registration — Sign Up New User" (Figma Rev 261025; Nov 16:
// Username removed, "Who introduced you to onebigHUB.com ?" added so the
// introducer gets referral credit even without their QR code).
// Prototype: no real email sending or password storage. "Verify Email"
// simulates clicking the link in the confirmation email.
const TAKEN = ["jsmith", "johnsmith", "admin", "cesar", "masoud"]; // stand-in until there's a database
const PW_RULE = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

function suggestions(first, last) {
  const f = first.trim().toLowerCase().replace(/[^a-z]/g, "");
  const l = last.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!f && !l) return [];
  const base = [`${f}${l}`, `${f[0] || ""}${l}`, `${f}${l[0] || ""}`, `${f[0] || ""}${l}01`, `${f}${l[0] || ""}01`];
  return [...new Set(base.filter((s) => s.length > 2))];
}

export default function SignUp() {
  const router = useRouter();
  const [f, setF] = useState({ first: "", last: "", email: "", mobile: "", username: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const [ref, setRef] = useState("");
  const [human, setHuman] = useState(false);
  const [people, setPeople] = useState([]);
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [pi, setPi] = useState(0);
  const [intro, setIntro] = useState(null);
  useEffect(() => { fetchProfiles().then(setPeople); }, []);
  const found = applied ? people.filter((p) => matchProfile(p, applied)) : people;
  const pAt = Math.min(pi, Math.max(0, found.length - 1));
  const set = (k) => (v) => setF((c) => ({ ...c, [k]: v }));
  useEffect(() => { setRef(new URLSearchParams(window.location.search).get("ref") || ""); }, []);

  const sugg = useMemo(() => suggestions(f.first, f.last), [f.first, f.last]);
  const auto = sugg[0] || "";
  // Username is no longer asked for; one is made from the name.
  const uname = (f.username || auto).trim().toLowerCase();
  const taken = uname && TAKEN.includes(uname);
  const free = sugg.filter((s) => !TAKEN.includes(s)).slice(0, 4);

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (!f.first.trim()) er.first = "Required";
    if (!f.last.trim()) er.last = "Required";
    if (!f.email.trim() && !f.mobile.trim()) er.email = "Enter an email (or a mobile number below)";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "That doesn't look like an email";
    if (f.mobile && !/^[0-9()+\-\s]{10,}$/.test(f.mobile)) er.mobile = "Use (xxx) xxx-xxxx";
    if (!PW_RULE.test(f.password)) er.password = "At least 8 characters, one uppercase letter and one special character (!@#$%^&*)";
    if (f.confirm !== f.password) er.confirm = "Passwords don't match";
    if (!human) er.robot = "Please tick the box";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent({ email: f.email.trim(), mobile: f.mobile.trim() });
  }

  function verify() {
    setUser({
      name: `${f.first.trim()} ${f.last.trim()}`, first: f.first.trim(), last: f.last.trim(),
      username: uname, identifier: f.email.trim() || f.mobile.trim(), email: f.email.trim(), mobile: f.mobile.trim(),
      method: f.email.trim() ? "email" : "mobile",
      referredBy: intro ? { id: intro.id, name: intro.name } : ref || null, joined: new Date().toISOString(),
    });
    router.push((() => { const n = new URLSearchParams(window.location.search).get("next"); return n && n.startsWith("/") && !n.startsWith("//") ? n : null; })() || "/profile");
  }

  if (sent) {
    return (
      <PageTemplate section={null} title="Registration" subtitle="Sign Up New User" icon="register" narrow tiles={false}>
        <div className="box auth-box">
          <h2>Please confirm your sign up with onebigHUB.com</h2>
          <p>We sent a confirmation {sent.email ? <>email to <b>{sent.email}</b></> : <>text to <b>{sent.mobile}</b></>}.
            Click <b>Verify Email</b> in that message to finish. If you did not create an account, you can safely ignore it.</p>
          <button type="button" className="btn-primary" onClick={verify}>Verify Email</button>
          <p className="proto-note">Prototype: no email is actually sent — this button stands in for the link in the message.</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate section={null} title="Registration" subtitle="Sign Up New User" icon="register" narrow tiles={false}>
      <form className="job-form auth-box su-figma" onSubmit={submit} noValidate>
        <p className="big-q">Welcome !</p>
        <div className="auth-social">
          <button type="button" disabled title="Not wired up in the prototype"><b className="su-g">G</b> Sign in with Google</button>
          <button type="button" disabled title="Not wired up in the prototype"><b className="su-a"></b> Sign in with Apple</button>
        </div>
        <OrLine />
        <Field label="First Name" req error={errors.first}><Input value={f.first} onChange={set("first")} autoComplete="given-name" placeholder="Submit Here" /></Field>
        <Field label="Last Name" req error={errors.last}><Input value={f.last} onChange={set("last")} autoComplete="family-name" placeholder="Submit Here" /></Field>
        <Field label="Email" hint="Required for Verification" error={errors.email}><Input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="Submit Here" /></Field>
        <OrLine />
        <Field label="Mobile" hint="Required for Password Recovery" error={errors.mobile}><Input type="tel" value={f.mobile} onChange={set("mobile")} placeholder="(xxx) xxx-xxxx" autoComplete="tel" /></Field>
        <Field label="Password" req error={errors.password}><PasswordInput value={f.password} onChange={set("password")} autoComplete="new-password" placeholder="Submit Here" /></Field>
        <Field label="Password" hint="Confirm" error={errors.confirm}><PasswordInput value={f.confirm} onChange={set("confirm")} autoComplete="new-password" placeholder="Submit Here" /></Field>
        <p className="nt-hint">Password should be at least 8 characters long and contain at least one special character (!@#$%^&amp;*) and one uppercase letter.</p>
        <div className="cw-bar rg-introbar"><b>Who introduced you to onebig<span className="cw-red">HUB</span>.com ?</b></div>
        {ref && !intro && <p className="nt-hint">Introduced by <b>{ref}</b> (from their QR code)</p>}
        <div className="pk-gbox">
          <span className="pk-label"><b>SEARCH</b> <i>Click on mini-card to select</i></span>
          <input value={q} placeholder="Submit Name Here" onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setApplied(q.trim()); setPi(0); } }} aria-label="Search for who introduced you" />
          <button type="button" className="cw-submit pk-center" onClick={() => { setApplied(q.trim()); setPi(0); }}>Submit</button>
        </div>
        {(found.length
          ? <button type="button" className={`pk-pick ${intro?.id === found[pAt].id ? "on" : ""}`} onClick={() => setIntro(intro?.id === found[pAt].id ? null : found[pAt])} aria-pressed={intro?.id === found[pAt].id}><MiniCardView p={found[pAt]} /></button>
          : <p className="nt-hint">No members match &ldquo;{applied}&rdquo;.</p>)}
        {found.length > 0 && <PagerRow i={pAt} n={found.length} onGo={setPi} word="" />}
        {intro && <p className="nt-hint">Selected: <b>{intro.name}</b> — they&rsquo;ll be credited for introducing you. <button type="button" className="clear-filters-link" onClick={() => setIntro(null)}>Clear</button></p>}
        <NotRobot checked={human} onChange={setHuman} error={errors.robot} />
        {errors.robot && <span className="ed-error">{errors.robot}</span>}
        <button type="submit" className="su-continue">Continue</button>
      </form>
    </PageTemplate>
  );
}
