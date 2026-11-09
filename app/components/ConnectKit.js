"use client";

import { useState } from "react";
import PageTemplate from "./PageTemplate";
import CollapseArrow from "./CollapseArrow";
import { StepBadge } from "./Steps";
import { Glyph } from "./Icons";

// Shared parts of the five "Connect with Me !" pages (Cesar's Figma, Rev 261108):
// title bar "Connect with Me ! <step>", the Connections tile + "Connect with me !"
// box selected, numbered yellow section bars, the mini-card and elevator pitch.

export function ConnectPage({ subtitle, children }) {
  return (
    <PageTemplate section="connections" activeAction="connect" icon="figConnect"
      title={<i>Connect with Me !</i>} subtitle={subtitle}>
      <div className="cw-page">{children}</div>
    </PageTemplate>
  );
}

// Yellow section bar with a red step number, collapsible (Figma "1 SCAN My QR Code").
export function SectionBar({ n, icon, title, hint, right, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="cw-section">
      <div className="cw-bar">
        {n != null && <StepBadge n={n} />}
        {icon && <Glyph name={icon} size={18} />}
        <b>{title}</b>
        {hint && <em>{hint}</em>}
        <span className="cw-bar-right">
          {right}
          <CollapseArrow open={open} onClick={() => setOpen((o) => !o)} label={typeof title === "string" ? title : "section"} />
        </span>
      </div>
      {open && <div className="cw-body">{children}</div>}
    </section>
  );
}

const initials = (n) => (n || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// Mini-card: Name, Title / Business · picture · phone, email, city.
export function PersonCard({ p, picture, placeholder = false, label }) {
  const v = (k, ph) => p?.[k] || (placeholder ? ph : "");
  return (
    <div className="cw-card">
      <div className="cw-card-name">
        <b>{[v("name", "Name"), v("title", "Title")].filter(Boolean).join(", ")}</b>
        <span>{v("business", "Business / Organization / Group")}</span>
      </div>
      <div className="cw-card-row">
        <span className="cw-av" aria-hidden="true">
          {picture || p?.picture ? <img src={picture || p.picture} alt="" />
            : p?.name ? initials(p.name) : <Glyph name="user" size={22} />}
          {label && <i>{label}</i>}
        </span>
        <span className="cw-card-meta">
          <span className="cw-red">{v("phone", "(xxx) xxx-xxxx")}</span>
          <span className="cw-blue">{v("email", "Email")}</span>
          <span className="cw-red">{v("city", "City, State")}</span>
        </span>
      </div>
    </div>
  );
}

export function PitchCard({ p, placeholder = false }) {
  const title = p?.pitchTitle || (placeholder ? "Elevator Pitch Title" : "");
  const text = p?.pitch || (placeholder ? "A brief, persuasive summary of yourself that takes about 30 to 60 seconds to deliver – roughly the length of a short elevator ride." : "");
  const linkedin = p?.linkedin;
  return (
    <div className="cw-card cw-pitch">
      <b className="cw-red">{title || "Elevator Pitch"}</b>
      <p>{text || <span className="cw-muted">No elevator pitch yet. <a href="/profile">Add one</a></span>}</p>
      <span className="cw-pitch-btns">
        <a href="/profile#gallery" className="cw-chip">Resume</a>
        <a href="/profile#gallery" className="cw-chip">Cover Letter</a>
        <a href={linkedin || "/profile"} className="cw-chip" target={linkedin ? "_blank" : undefined} rel="noopener noreferrer">LinkedIn</a>
      </span>
    </div>
  );
}

export function CardAndPitch({ p, placeholder }) {
  return (
    <div className="cw-two">
      <PersonCard p={p} placeholder={placeholder} />
      <PitchCard p={p} placeholder={placeholder} />
    </div>
  );
}

export function NextLink({ href, children }) {
  return <p className="cw-next"><a href={href}>{children} →</a></p>;
}

// Nov 9 (Cesar): instead of a "Next" link, every page lists ALL the remaining
// steps as collapsed bars, so users see where they are and can skip ahead.
export const CONNECT_STEPS = [
  { n: 2, icon: "register", title: <i>Welcome !</i>, hint: "Sign Up to Create Your Profile and more ...", href: "/connect/signup" },
  { n: 3, icon: "idxMiniCard", title: "New Users - Create My Mini-Card", hint: "Submit / Upload all that apply", href: "/connect/submit" },
  { n: 4, icon: "idxAssign", title: "Assign My Relationship & Notes", hint: "Private", href: "/connect/submit#relationship" },
  { n: 5, icon: "idxMessages", title: "Send Messages", href: "/connect/messages" },
  { n: 6, icon: "idxSigns", title: "Next Steps", href: "/connect/next" },
];
export function UpcomingSteps({ from }) {
  const list = CONNECT_STEPS.filter((s) => s.n >= from);
  if (!list.length) return null;
  return (
    <nav className="cw-steps" aria-label="Next steps">
      {list.map((s) => (
        <a key={s.n} href={s.href} className="cw-bar cw-step-link">
          <StepBadge n={s.n} /><Glyph name={s.icon} size={18} /><b>{s.title}</b>{s.hint && <em>{s.hint}</em>}
          <span className="cw-bar-right fp-arrow" aria-hidden="true"><Glyph name="expand" size={21} strokeWidth={3} /></span>
        </a>
      ))}
    </nav>
  );
}

// Radial graph: me in the middle, Level 1 / 2 / 3 rings around (Figma "View as Graph").
const RING = { intro: 1, 1: 1, 2: 2, 3: 3 };
export function NetworkGraph({ me, people }) {
  const W = 520, H = 400, cx = W / 2, cy = H / 2;
  const rings = { 1: [], 2: [], 3: [] };
  people.forEach((p) => rings[RING[p.level] || 1].push(p));
  const nodes = [];
  [1, 2, 3].forEach((r) => {
    const list = rings[r];
    list.forEach((p, i) => {
      const a = (i / Math.max(1, list.length)) * Math.PI * 2 + r * 0.6;
      const rad = r * 58 + 20;
      nodes.push({ p, x: cx + Math.cos(a) * rad * 1.25, y: cy + Math.sin(a) * rad, r });
    });
  });
  const colors = ["#7b5cd6", "#2fa36b", "#d6455d", "#2b7bd6", "#c47b1a"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="cw-graph" role="img" aria-label="My network graph">
      {[1, 2, 3].map((r) => <ellipse key={r} cx={cx} cy={cy} rx={(r * 58 + 20) * 1.25} ry={r * 58 + 20} className="cw-ring" />)}
      {nodes.map(({ p, x, y }, i) => <line key={`l${i}`} x1={cx} y1={cy} x2={x} y2={y} className="cw-edge" />)}
      {nodes.map(({ p, x, y, r }, i) => (
        <g key={p.id} className="cw-node">
          <circle cx={x} cy={y} r={r === 1 ? 13 : 10} fill={colors[i % colors.length]} />
          <text x={x} y={y + 3.5} textAnchor="middle" className="cw-node-in">{initials(p.name)}</text>
          <text x={x} y={y + (r === 1 ? 25 : 21)} textAnchor="middle" className="cw-node-label">{p.name}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={20} className="cw-me" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="cw-me-in">{initials(me?.name || "Me")}</text>
      <text x={cx} y={cy + 34} textAnchor="middle" className="cw-node-label cw-me-label">{me?.name || "Me"}</text>
    </svg>
  );
}
