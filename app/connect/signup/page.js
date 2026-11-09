"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectPage, SectionBar, CardAndPitch, UpcomingSteps } from "../../components/ConnectKit";
import { Field, Input, OrLine } from "../../components/Form";
import { getProfile } from "../../lib/profile";
import { getUser } from "../../lib/auth";
import { PENDING_KEY } from "../../lib/connect";

// Connect with Me ! — Sign-Up (Figma /UserName/ConnectWithMe/SignUp): the
// person who scanned my QR code sees my mini-card, then signs up.
export default function ConnectSignUp() {
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setOwner(getProfile());
    const u = getUser();
    if (u) { setEmail(u.email || (u.identifier?.includes("@") ? u.identifier : "")); setPhone(u.mobile || ""); }
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) return setErr("Enter your mobile / phone or your email.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return setErr("That email doesn't look right.");
    try { localStorage.setItem(PENDING_KEY, JSON.stringify({ phone: phone.trim(), email: email.trim() })); } catch {}
    router.push("/connect/submit");
  }

  return (
    <ConnectPage subtitle="Sign-Up">
      <CardAndPitch p={owner} placeholder />
      <SectionBar n={2} icon="register" title={<i>Welcome !</i>} hint="Sign Up to Create Your Profile and more ...">
        <form className="cw-signup" onSubmit={submit} noValidate>
          <button type="button" className="cw-social" disabled title="Not wired up in the prototype"><b className="cw-g">G</b> Sign in with Google</button>
          <button type="button" className="cw-social" disabled title="Not wired up in the prototype"><b></b> Sign in with Apple</button>
          <Field label="Mobile / Phone"><Input type="tel" value={phone} onChange={setPhone} placeholder="(xxx) xxx-xxxx" autoComplete="tel" /></Field>
          <OrLine />
          <Field label="Email"><Input type="email" value={email} onChange={setEmail} placeholder="Submit Here" autoComplete="email" /></Field>
          {err && <p className="ed-error">{err}</p>}
          <button type="submit" className="cw-submit">Submit</button>
        </form>
      </SectionBar>
      <UpcomingSteps from={3} />
    </ConnectPage>
  );
}
