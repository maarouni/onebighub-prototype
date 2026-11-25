"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageTemplate from "../../components/PageTemplate";
import { SectionBar } from "../../components/ConnectKit";
import { ROMANTIC_KEY, ROMANTIC_SECTIONS, SAMPLE_MATCHES } from "../../lib/romantic";

// Connect > Individuals > Romantic Matchmaking (Cesar, Nov 24 Figma).
// Views (select one, from ?view=): how | profile | matches | digest | compare.
// Answers are saved in this browser only (prototype); no accounts yet.
const VIEWS = [
  ["how", "How It Works", "Default"],
  ["profile", "My Romantic Profile"],
  ["matches", "My Romantic Matches"],
  ["digest", "My Digest - Matches"],
  ["compare", "Compare Matches"],
];

const load = () => { try { return JSON.parse(localStorage.getItem(ROMANTIC_KEY) || "{}"); } catch { return {}; } };
const save = (v) => { try { localStorage.setItem(ROMANTIC_KEY, JSON.stringify(v)); } catch {} };

function RangeMe({ value = 50, onChange }) {
  return <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label="My score" />;
}

function SeekingRow({ item, v, set }) {
  const cur = v || { req: false, min: 0, max: 100 };
  const up = (patch) => set({ ...cur, ...patch });
  return (
    <div className="rm2-seek">
      <label className="rm2-req"><input type="checkbox" checked={cur.req} onChange={(e) => up({ req: e.target.checked })} /> Required <i>Deal-Killer</i></label>
      <div className="rm2-minmax">
        <span>Min <input type="range" min="0" max="100" value={cur.min} onChange={(e) => up({ min: Math.min(Number(e.target.value), cur.max) })} /></span>
        <span>Max <input type="range" min="0" max="100" value={cur.max} onChange={(e) => up({ max: Math.max(Number(e.target.value), cur.min) })} /></span>
      </div>
      <small>{cur.min}% – {cur.max}%</small>
    </div>
  );
}

function ItemRow({ item, data, setData }) {
  const me = data.me?.[item.id];
  const seek = data.seek?.[item.id];
  const setMe = (val) => setData((d) => ({ ...d, me: { ...(d.me || {}), [item.id]: val } }));
  const setSeek = (val) => setData((d) => ({ ...d, seek: { ...(d.seek || {}), [item.id]: val } }));
  if (item.kind === "text") {
    return (
      <div className="rm2-item">
        <div className="rm2-label">{item.label}</div>
        <textarea rows={2} placeholder="Submit Here" value={me || ""} onChange={(e) => setMe(e.target.value)} />
      </div>
    );
  }
  if (item.kind === "range") {
    return (
      <div className="rm2-item">
        <div className="rm2-label">{item.label}</div>
        <div className="rm2-pair">
          <div className="rm2-me"><span>Me</span><RangeMe value={me ?? 50} onChange={setMe} /></div>
          <div className="rm2-them"><span>Seeking in Others</span><SeekingRow item={item} v={seek} set={setSeek} /></div>
        </div>
      </div>
    );
  }
  const opts = item.options || [];
  const meList = item.kind === "multi" ? (Array.isArray(me) ? me : []) : me || "";
  const toggleMulti = (list, o) => (list.includes(o) ? list.filter((x) => x !== o) : [...list, o]);
  return (
    <div className="rm2-item">
      <div className="rm2-label">{item.label} <i>{item.kind === "multi" ? "Select all that apply" : "Select one"}</i></div>
      <div className="rm2-pair">
        <div className="rm2-me">
          <span>Me</span>
          {opts.map((o) => (
            <label key={o} className="rm2-opt">
              <input type={item.kind === "multi" ? "checkbox" : "radio"} name={item.id} checked={item.kind === "multi" ? meList.includes(o) : meList === o}
                onChange={() => setMe(item.kind === "multi" ? toggleMulti(meList, o) : o)} /> {o}
            </label>
          ))}
        </div>
        <div className="rm2-them">
          <span>Seeking in Others</span>
          <SeekingRow item={item} v={seek} set={setSeek} />
        </div>
      </div>
    </div>
  );
}

function ProfileForm() {
  const [data, setData] = useState({});
  const [ready, setReady] = useState(false);
  useEffect(() => { setData(load()); setReady(true); }, []);
  useEffect(() => { if (ready) save(data); }, [data, ready]);
  return (
    <>
      <SectionBar n={1} title="Personal Relationships" hint="Romantic Matchmaking · If applicable" defaultOpen>
        <div className="rm2-item">
          <div className="rm2-label">Identify as <i>Select one</i></div>
          {["Not Applicable / No Response", "Female — Straight", "Male — Straight", "Female — LGBTQ+", "Male — LGBTQ+"].map((o) => (
            <label key={o} className="rm2-opt"><input type="radio" name="identify" checked={data.identify === o} onChange={() => setData((d) => ({ ...d, identify: o }))} /> {o}</label>
          ))}
          <div className="rm2-label">Seeking Relationship <i>Select one</i></div>
          {["Not Applicable", "Dating — Casual", "Dating — Serious"].map((o) => (
            <label key={o} className="rm2-opt"><input type="radio" name="seeking-rel" checked={data.seekRel === o} onChange={() => setData((d) => ({ ...d, seekRel: o }))} /> {o}</label>
          ))}
          <div className="rm2-label">Brief, Sincere, Warm Introduction <i>Private until a match</i></div>
          <textarea rows={4} placeholder="What do you offer and seek in a relationship? What would others say about you at your funeral?" value={data.intro || ""} onChange={(e) => setData((d) => ({ ...d, intro: e.target.value }))} />
        </div>
      </SectionBar>
      {ROMANTIC_SECTIONS.map((sec, i) => (
        <SectionBar key={sec.id} n={i + 2} title={sec.title} defaultOpen={false}>
          {sec.items.map((it) => <ItemRow key={it.id} item={it} data={data} setData={setData} />)}
        </SectionBar>
      ))}
      <p className="rm2-note">Your answers stay in this browser for now. Accounts and saving to onebigHUB come later.</p>
    </>
  );
}

function MatchList({ digest = false }) {
  return (
    <>
      <div className="rm2-item">
        <div className="rm2-label">{digest ? "My Digest - Romantic Matches" : "My Romantic Matches"} <i>Select all that apply</i></div>
        <input placeholder="Search" disabled />
        <p className="rm2-note">Sample profiles until accounts are live. Compatibility scores appear once profiles are complete.</p>
      </div>
      {SAMPLE_MATCHES.map((m) => (
        <div key={m.key} className="rm2-card">
          <span className="rm2-key">{m.key}</span>
          <div><b>{m.name}</b><div><i>{m.tagline}</i></div><div>{m.where}</div></div>
          <span className="rm2-score">xx %</span>
        </div>
      ))}
      {digest && <div className="rm2-item"><b>Select one:</b> View Selection(s) · ADD New Listing · EDIT Selection(s) · DELETE Selection(s) from My Digest - Matches</div>}
    </>
  );
}

function Compare() {
  return (
    <div className="rm2-item">
      <div className="rm2-label">My Total Compatibility Score(s) <i>Me · A · B · C · D</i></div>
      <table className="rm2-table">
        <thead><tr><th>Survey</th><th>Me</th>{SAMPLE_MATCHES.map((m) => <th key={m.key}>{m.key}</th>)}</tr></thead>
        <tbody>
          <tr><td>Total score</td><td>—</td>{SAMPLE_MATCHES.map((m) => <td key={m.key}>xx %</td>)}</tr>
          <tr><td>Survey question (Required = Deal-Killer)</td><td>—</td>{SAMPLE_MATCHES.map((m) => <td key={m.key}>√ / X</td>)}</tr>
        </tbody>
      </table>
      <p className="rm2-note">Legend: √ = there is a match · X = there is not a match · X (Required) = Deal-Killer; the profile is rejected.</p>
    </div>
  );
}

function How() {
  return (
    <div className="rm2-item">
      <p><b>Golden Rules</b> — Honesty is the best policy. Be realistic with your expectations and selections. Integrity: do what is right even when no one is looking.</p>
      <p><b>Romantic Matchmaking</b> — Sign up and create your profile. Answer the survey (about 10–15 minutes). Seeking in Others: select your max and min tolerances. The system automatically calculates an Average Score and displays your Total Compatibility Score.</p>
      <p><b>Compare Matches</b> — See what you have in common. Your Total Compatibility Score is 100 × (# matching selections) ÷ (total questions). Required (Deal-Killer) items reject a profile when they do not match.</p>
      <p><b>Meet Your Matches</b> — Meet at the onebigHUB networking events and workshops. Have fun and best wishes with your new relationships!</p>
    </div>
  );
}

function RomanticInner() {
  const sp = useSearchParams();
  const view = VIEWS.some(([k]) => k === sp.get("view")) ? sp.get("view") : "how";
  const label = VIEWS.find(([k]) => k === view)[1];
  return (
    <PageTemplate section="connections" mode="output" activeAction="details"
      title={<>Connect&nbsp;&nbsp;<i className="pb-sub">Romantic Matchmaking</i></>} icon="connections" typeIcon="connections"
      intro={<><strong>Individual • Romantic Matchmaking.</strong> {label}.</>}>
      <div className="page rm2-page">
        <nav className="rm2-views" aria-label="Romantic Matchmaking views">
          {VIEWS.map(([k, l]) => <a key={k} href={`/connect/romantic?view=${k}`} className={view === k ? "on" : ""}>{l}</a>)}
        </nav>
        {view === "how" && <How />}
        {view === "profile" && <ProfileForm />}
        {view === "matches" && <MatchList />}
        {view === "digest" && <MatchList digest />}
        {view === "compare" && <Compare />}
      </div>
    </PageTemplate>
  );
}

export default function RomanticPage() {
  return <Suspense fallback={null}><RomanticInner /></Suspense>;
}
