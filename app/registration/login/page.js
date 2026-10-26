"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../../components/PageTemplate";
import { Field, Input, OrLine } from "../../components/Form";
import { Glyph } from "../../components/Icons";
import { setUser } from "../../lib/auth";

// Cesar's "Registration — Log In" (Figma Rev 261025). Continue → Index;
// Next Step → My Dashboards / Mini-Cards (here: My Profile).
export default function LogIn() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState({});
  const [forgot, setForgot] = useState(false);

  function submit(e, dest = "/") {
    e?.preventDefault();
    const er = {};
    if (!id.trim()) er.id = "Enter your email or mobile";
    else if (!id.includes("@") && !/^[0-9()+\-\s]{10,}$/.test(id)) er.id = "That doesn't look like an email or a mobile number";
    if (!pw) er.pw = "Required";
    setErrors(er);
    if (Object.keys(er).length) return;
    const name = id.includes("@") ? id.split("@")[0] : id;
    setUser({ name, identifier: id.trim(), method: id.includes("@") ? "email" : "mobile", joined: new Date().toISOString() });
    router.push(dest);
  }

  return (
    <PageTemplate section={null} title="Registration" subtitle="Log In" icon="login" narrow>
      <form className="job-form auth-box" onSubmit={submit} noValidate>
        <p className="big-q">Welcome Back !</p>
        <Field label="Email or Mobile" req error={errors.id}><Input value={id} onChange={setId} placeholder="you@example.com or (xxx) xxx-xxxx" autoComplete="username" /></Field>
        <Field label="Password" req error={errors.pw}><Input type="password" value={pw} onChange={setPw} autoComplete="current-password" /></Field>
        <button type="button" className="clear-filters-link" style={{ alignSelf: "flex-start", marginTop: 6 }} onClick={() => setForgot(true)}>Forgot Password ?</button>
        {forgot && <p className="nt-hint">Password reset sends a code to your mobile — it needs the shared database, so it isn&rsquo;t wired up in the prototype yet.</p>}
        <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>Continue</button>
        <OrLine />
        <p>Don&rsquo;t have an account ? <a href="/registration/signup">Sign Up</a></p>
        <button type="button" className="box" style={{ textAlign: "left", cursor: "pointer", font: "inherit" }} onClick={() => submit(null, "/profile")}>
          <b><Glyph name="miniCard" size={16} /> Next Step</b> — My Personal, Biz / Org Mini-Card(s). <u>Click Here to Create / Edit</u>
        </button>
        <p className="proto-note">Prototype: any password works; accounts live in this browser until the database is set up.</p>
      </form>
    </PageTemplate>
  );
}
