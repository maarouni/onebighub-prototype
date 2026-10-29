"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PageTemplate from "./PageTemplate";
import { Glyph } from "./Icons";
import { MiniCard } from "./Form";
import { listReferrals } from "../lib/referrals";

// The four 3-Way Introductions / Referrals pages share this top and row.
const LINKS = [
  { href: "/referrals", icon: "search", label: "1. Identify Vendor & Potential Client" },
  { href: "/referrals/message", icon: "email", label: "2. Send Introduction Message" },
  { href: "/referrals/status", icon: "viewMode", label: "3. Referral Status" },
  { href: "/referrals/evaluations", icon: "select", label: "4. Evaluations" },
];

export function ReferralShell({ subtitle, children }) {
  const path = usePathname() || "";
  return (
    <PageTemplate
      section="introductions"
      title="3-Way Introductions / Referrals"
      subtitle={subtitle}
      icon="connectMe"
      intro={<><b>Get Paid</b> for introductions / referrals that convert to business and/or a beneficial connection. It is <b>not</b> necessary for A, B or C to know each other.</>}
      subnav={
        <nav className="sub-nav" aria-label="3-Way Introductions pages">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={path === l.href ? "active" : ""}>
              <Glyph name={l.icon} size={20} /><span>{l.label}</span>
            </a>
          ))}
        </nav>
      }
    >
      {children}
    </PageTemplate>
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
      <h2>Select Referral</h2>
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
      <div className="pick-col"><h3>A. Connector</h3><MiniCard p={r.a} /></div>
      <div className="pick-col"><h3>B. Vendor</h3><p className="nt-hint">Offering or seeking a referral</p><MiniCard p={r.b} /></div>
      <div className="pick-col"><h3>C. Potential Client</h3><p className="nt-hint">Buyer or seller · {r.c?.external ? "External (no profile)" : "Internal"}</p><MiniCard p={r.c} /></div>
    </div>
  );
}
