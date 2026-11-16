"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageTemplate from "./PageTemplate";
import { MiniCard } from "./Form";
import { listReferrals } from "../lib/referrals";

// Cesar's Figma "CONNECTIONS Introductions 3-Way Referrals" (Rev 261115):
// six pages share the Connections tile + Introductions box, the "Get Paid"
// line, and the "3-Way Introductions / Referrals — Select in order" list.
export const STEPS = [
  { n: "1", href: "/referrals", label: "Connector (A) Identifies Participants (B, C)", sub: "Identify Participants" },
  { n: "2a", href: "/referrals/message", label: "Connector (A) Sends Initial Message", sub: "Send Message" },
  { n: "2b", href: "/referrals/reminders", label: "System Automatically Sends Reminder Messages", hint: "If applicable", sub: "Send Reminder Message(s)" },
  { n: "3", href: "/referrals/evaluations", label: "Connector (A) Submits Initial Evaluations of Participants (B, C)", sub: "First Evaluations" },
  { n: "4", href: "/referrals/status", label: "Participants (B, C) Submit Referral / Transaction Status", sub: "Submit Referral Status" },
  { n: "5", href: "/referrals/final", label: "Participants (B, C) Submit Final Evaluations of Transaction and Each Other", sub: "Submit Final Evaluations" },
];

export function ReferralShell({ children }) {
  const path = usePathname() || "";
  const cur = STEPS.find((s) => s.href === path) || STEPS[0];
  const [qs, setQs] = useState("");
  useEffect(() => { const id = new URLSearchParams(window.location.search).get("id"); setQs(id ? `?id=${encodeURIComponent(id)}` : ""); }, []);
  return (
    <PageTemplate section="introductions" title={<>Introductions <i className="pb-sub">{cur.sub}</i></>} icon="idxIntro">
      <div className="cw-page ref-page">
        <nav className="cw-box ref-steps" aria-label="3-Way Introductions / Referrals steps">
          <span><b>3-Way Introductions / Referrals</b> <i>Select in order</i> <b className="cw-red">Note:</b> <i>You must Sign Up or Log In</i></span>
          {STEPS.map((s) => (
            <a key={s.n} href={s.href + (s.href === "/referrals" ? "" : qs)} className={s.href === cur.href ? "on" : ""} aria-current={s.href === cur.href ? "step" : undefined}>
              <span className="ref-o">o</span> <span className="ref-n">{s.n}.</span> {s.label}{s.hint && <i> {s.hint}</i>}
            </a>
          ))}
        </nav>
        {children}
      </div>
    </PageTemplate>
  );
}

// Yellow note box about the Connector (Figma).
export function ConnectorNote() {
  return (
    <div className="ref-note">
      <b>Connector (A)</b> <i>You</i>
      <p>Introduces and submits evaluations of Participants B and C, if applicable</p>
      <p><b className="cw-red">Note:</b> It is NOT necessary for A, B or C to know each other<br />The Connector (A) can also earn referrals from both Participants (B and C), if both offer referrals</p>
    </div>
  );
}

// "Select Referral" box used by Message, Status and Evaluations.
export function useReferralPicker() {
  const [list, setList] = useState([]);
  const [id, setId] = useState("");
  useEffect(() => {
    const l = listReferrals();
    setList(l);
    const q = new URLSearchParams(window.location.search).get("id");
    setId(q && l.some((r) => r.id === q) ? q : l[0]?.id || "");
  }, []);
  const refresh = () => setList(listReferrals());
  return { list, id, setId, current: list.find((r) => r.id === id) || null, refresh };
}

export function ReferralPicker({ list, id, setId }) {
  const [q, setQ] = useState("");
  if (!list.length) {
    return <div className="box">No referrals yet. <a href="/referrals">Start one on Identify →</a></div>;
  }
  const shown = list.filter((r) => !q || `${r.id} ${r.b?.name} ${r.b?.business} ${r.c?.name} ${r.c?.business} ${r.created}`.toLowerCase().includes(q.toLowerCase()));
  const idx = list.findIndex((r) => r.id === id);
  return (
    <div className="box">
      <h2>Select Introduction / Referral</h2>
      <input className="ed-search" placeholder="SEARCH keywords, referral date, #" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%", padding: "8px 12px", marginBottom: 8 }} />
      <select value={id} onChange={(e) => setId(e.target.value)} style={{ width: "100%", padding: 8 }}>
        {shown.map((r) => <option key={r.id} value={r.id}>#{r.num} · {r.created?.slice(0, 10)} · {r.b?.business || r.b?.name} ↔ {r.c?.name}</option>)}
      </select>
      <p className="nt-hint">Referral onebigHUB.com/Referrals/{id.split("-").slice(0, -2).join("-") || "UserName"}/{list[idx]?.ymd}/{list[idx]?.num} · {idx + 1} of {list.length}</p>
    </div>
  );
}

export function Parties({ r }) {
  return (
    <div className="pick-grid">
      <div className="pick-col"><h3>Connector (A)</h3><MiniCard p={r.a} /></div>
      <div className="pick-col"><h3>Participant (B)</h3><p className="nt-hint">Buyer or Seller • Offering or Seeking a Referral</p><MiniCard p={r.b} /></div>
      <div className="pick-col"><h3>Participant (C)</h3><p className="nt-hint">Buyer or Seller · {r.c?.external ? "External (no profile)" : "Internal"}</p><MiniCard p={r.c} /></div>
    </div>
  );
}
