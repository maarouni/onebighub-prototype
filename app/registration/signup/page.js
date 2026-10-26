"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../../components/PageTemplate";
import { Field, Input, Radios, OrLine } from "../../components/Form";
import { setUser } from "../../lib/auth";

// Cesar's "Registration — Sign Up New User" (Figma Rev 261025).
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
  const set = (k) => (v) => setF((c) => ({ ...c, [k]: v }));
  useEffect(() => { setRef(new URLSearchParams(window.location.search).get("ref") || ""); }, []);

  const sugg = useMemo(() => suggestions(f.first, f.last), [f.first, f.last]);
  const auto = sugg[0] || "";
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
    if (taken) er.username = "Username is already in use — pick one below";
    if (!PW_RULE.test(f.password)) er.password = "At least 8 characters, one uppercase letter and one special character (!@#$%^&*)";
    if (f.confirm !== f.password) er.confirm = "Passwords don't match";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent({ email: f.email.trim(), mobile: f.mobile.trim() });
  }

  function verify() {
    setUser({
      name: `${f.first.trim()} ${f.last.trim()}`, first: f.first.trim(), last: f.last.trim(),
      username: uname, identifier: f.email.trim() || f.mobile.trim(), email: f.email.trim(), mobile: f.mobile.trim(),
      method: f.email.trim() ? "email" : "mobile", referredBy: ref || null, joined: new Date().toISOString(),
    });
    router.push("/profile");
  }

  if (sent) {
    return (
      <PageTemplate section={null} title="Registration" subtitle="Sign Up New User" icon="register" narrow>
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
    <PageTemplate section={null} title="Registration" subtitle="Sign Up New User" icon="register" narrow
      actions={<a href="/registration/login" className="tpl-action">Log In instead</a>}>
      <form className="job-form auth-box" onSubmit={submit} noValidate>
        <p className="big-q">Welcome !</p>
        <div className="auth-social">
          <button type="button" disabled title="Not wired up in the prototype">Sign in with Google</button>
          <button type="button" disabled title="Not wired up in the prototype">Sign in with Apple</button>
        </div>
        <OrLine />
        <Field label="First Name" req error={errors.first}><Input value={f.first} onChange={set("first")} autoComplete="given-name" /></Field>
        <Field label="Last Name" req error={errors.last}><Input value={f.last} onChange={set("last")} autoComplete="family-name" /></Field>
        <Field label="Email" hint="Required for verification" error={errors.email}><Input type="email" value={f.email} onChange={set("email")} autoComplete="email" /></Field>
        <OrLine />
        <Field label="Mobile" hint="Required for password recovery" error={errors.mobile}><Input type="tel" value={f.mobile} onChange={set("mobile")} placeholder="(xxx) xxx-xxxx" autoComplete="tel" /></Field>
        <Field label="Username" hint="if applicable, overwrite" error={errors.username}>
          <Input value={f.username} onChange={set("username")} placeholder={auto || "johnsmith"} autoComplete="username" />
        </Field>
        {taken && free.length > 0 && (
          <div className="ed-field wide">
            <span className="ed-label">Username is already in use — select one</span>
            <Radios name="uname" value={f.username} onChange={set("username")} options={free} />
          </div>
        )}
        <Field label="Password" req error={errors.password}><Input type="password" value={f.password} onChange={set("password")} autoComplete="new-password" /></Field>
        <Field label="Password Confirm" req error={errors.confirm}><Input type="password" value={f.confirm} onChange={set("confirm")} autoComplete="new-password" /></Field>
        <p className="nt-hint">Password should be at least 8 characters long and contain at least one special character (!@#$%^&amp;*) and one uppercase letter.</p>
        {ref && <p className="nt-hint">Referred by <b>{ref}</b></p>}
        <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>Continue</button>
      </form>
    </PageTemplate>
  );
}
