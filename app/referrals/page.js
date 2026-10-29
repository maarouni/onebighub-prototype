"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReferralShell } from "../components/ReferralShell";
import { Field, Input, MiniCard, OrLine, Radios } from "../components/Form";
import { fetchProfiles, matchProfile, newReferralId, saveReferral, REFERRAL_CATEGORIES } from "../lib/referrals";
import { getProfile } from "../lib/profile";
import { getUser } from "../lib/auth";

// Step 1 — Identify Vendor (B) and Potential Client (C). You are the Connector (A).
export default function Identify() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [qb, setQb] = useState("");
  const [qc, setQc] = useState("");
  const [b, setB] = useState(null);
  const [cMode, setCMode] = useState("internal");
  const [c, setC] = useState(null);
  const [ext, setExt] = useState({ name: "", title: "", business: "", phone: "", email: "", city: "" });
  const [bOffer, setBOffer] = useState("offering");
  const [cat, setCat] = useState("business");
  const [err, setErr] = useState("");

  useEffect(() => {
    setMe(getProfile());
    setLoggedIn(!!getUser());
    fetchProfiles().then(setProfiles);
  }, []);

  function submit() {
    const client = cMode === "external" ? { ...ext, external: true } : c;
    if (!b) return setErr("Select the Vendor (B).");
    if (!client || !client.name?.trim()) return setErr(cMode === "external" ? "Enter the Potential Client's name." : "Select the Potential Client (C).");
    if (cMode === "external" && !client.email && !client.phone) return setErr("Add an email or phone for the Potential Client so they get the introduction.");
    if (client.business && client.business === b.business && cMode === "internal") return setErr("B and C must be different.");
    const meta = newReferralId(me.username || "guest");
    const r = saveReferral({
      ...meta, created: new Date().toISOString(),
      a: { name: me.name || "You (not logged in)", title: me.title, business: me.business, pitchTitle: me.pitchTitle, phone: me.phone, email: me.email, city: me.city },
      category: cat, b: { ...b, offering: bOffer }, c: client,
      log: [], transaction: [], evaluations: {}, referralB: "", referralC: "",
    });
    router.push(`/referrals/message?id=${encodeURIComponent(r.id)}`);
  }

  const inCat = profiles.filter((p) => (p.category || "business") === cat);
  const listB = inCat.filter((p) => matchProfile(p, qb)).slice(0, 30);
  const listC = profiles.filter((p) => p.id !== b?.id && matchProfile(p, qc)).slice(0, 30);

  return (
    <ReferralShell subtitle="Identify">
      {!loggedIn && <div className="box nt-hint">Tip: <a href="/registration/login">Log In</a> so referrals are saved under your name and your profile shows as the Connector.</div>}
      <div className="pick-grid">
        <section className="pick-col">
          <h3>A. Connector — You</h3>
          <p className="nt-hint">Introduces and submits evaluations of B and C. You can also earn referrals from both B and C when both offer them.</p>
          {me && <MiniCard p={{ ...me, name: me.name || "Your name" }} />}
          <a href="/profile" className="nt-hint">Edit my profile / elevator pitch →</a>
        </section>

        <section className="pick-col">
          <h3>B. Vendor</h3>
          <Radios name="boffer" value={bOffer} onChange={setBOffer} options={[{ id: "offering", label: "Offering a referral" }, { id: "seeking", label: "Seeking a referral" }]} />
          <span className="ed-label">Referral category <i>Select one at a time</i></span>
          <Radios name="bcat" value={cat} onChange={(v) => { setCat(v); if (b && (b.category || "business") !== v) setB(null); }} options={REFERRAL_CATEGORIES} />
          <input placeholder="SEARCH — click to select profile" value={qb} onChange={(e) => setQb(e.target.value)} style={{ padding: "8px 10px" }} />
          <div className="mini-card-list">
            {listB.map((p) => <MiniCard key={p.id} p={p} selected={b?.id === p.id} onClick={() => setB(p)} />)}
          </div>
          <p className="nt-hint">{listB.length} of {inCat.length} {REFERRAL_CATEGORIES.find((x) => x.id === cat)?.label.toLowerCase()} profiles{inCat.length === 0 ? " — none yet in the prototype (they come with the database)" : ""}</p>
        </section>

        <section className="pick-col">
          <h3>C. Potential Client</h3>
          <p className="nt-hint">Buyer or seller. A profile is NOT required.</p>
          <Radios name="cmode" value={cMode} onChange={setCMode} options={[{ id: "internal", label: "Has a profile" }, { id: "external", label: "No profile (external)" }]} />
          {cMode === "internal" ? (
            <>
              <input placeholder="SEARCH — click to select profile" value={qc} onChange={(e) => setQc(e.target.value)} style={{ padding: "8px 10px" }} />
              <div className="mini-card-list">
                {listC.map((p) => <MiniCard key={p.id} p={p} selected={c?.id === p.id} onClick={() => setC(p)} />)}
              </div>
            </>
          ) : (
            <div className="job-form">
              <Field label="Name" req><Input value={ext.name} onChange={(v) => setExt({ ...ext, name: v })} /></Field>
              <Field label="Title"><Input value={ext.title} onChange={(v) => setExt({ ...ext, title: v })} /></Field>
              <Field label="Business / Organization / Group"><Input value={ext.business} onChange={(v) => setExt({ ...ext, business: v })} /></Field>
              <Field label="Phone"><Input type="tel" value={ext.phone} onChange={(v) => setExt({ ...ext, phone: v })} placeholder="(xxx) xxx-xxxx" /></Field>
              <Field label="Email"><Input type="email" value={ext.email} onChange={(v) => setExt({ ...ext, email: v })} /></Field>
              <Field label="City, State"><Input value={ext.city} onChange={(v) => setExt({ ...ext, city: v })} /></Field>
            </div>
          )}
        </section>
      </div>
      <OrLine />
      {err && <p className="ed-error">{err}</p>}
      <button type="button" className="btn-primary" onClick={submit}>Submit — continue to the Introduction Message</button>
      <p className="proto-note">Prototype: referrals are saved in this browser until the shared database is set up. Referral fees and payouts aren&rsquo;t calculated yet.</p>
    </ReferralShell>
  );
}
