"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ConnectPage, SectionBar, CardAndPitch, NetworkGraph, UpcomingSteps } from "../components/ConnectKit";
import { Box, Option } from "../components/FilterKit";
import { MiniCard } from "../components/Form";
import { getProfile } from "../lib/profile";
import { getNetwork, SAMPLE_NETWORK, FOLLOW_UP, RELATIONSHIP_GROUPS } from "../lib/connect";

// Connect with Me ! — Scan My QR Code (Cesar's Figma /UserName/ConnectWithMe).
// 1 SCAN My QR Code · View My Network (mini-card, elevator pitch, filters,
// graph or list, counts).

const relKeys = (p) => {
  const k = [];
  if (p.kind === "group" || p.kind === "org" || p.kind === "business") k.push(`${p.kind}:${p.professional === "referral" ? "referral" : "connection"}`);
  else {
    if (p.personal) k.push(`personal:${p.personal}`);
    if (p.professional) k.push(`professional:${p.professional}`);
  }
  if (p.professional === "referral") k.push("referrals");
  return k;
};

export default function ScanMyQr() {
  const [me, setMe] = useState(null);
  const [real, setReal] = useState([]);
  const [qr, setQr] = useState("");
  const [link, setLink] = useState("");
  const [flash, setFlash] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [view, setView] = useState("graph");
  const [display, setDisplay] = useState([]);
  const [follow, setFollow] = useState([]);
  const [rel, setRel] = useState([]);

  useEffect(() => {
    const p = getProfile();
    setMe(p);
    setReal(getNetwork());
    const l = `${window.location.origin}/connect/signup?u=${encodeURIComponent(p.username || "guest")}`;
    setLink(l);
    QRCode.toDataURL(l, { width: 240, margin: 1 }).then(setQr).catch(() => {});
  }, []);

  const sample = real.length === 0;
  const people = sample ? SAMPLE_NETWORK : real;
  const toggle = (list, set) => (v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const shown = useMemo(() => people.filter((p) =>
    (!display.length || display.includes(p.level === "intro" ? "intro" : p.level) || (display.includes("conn") && p.level !== "intro")) &&
    (!follow.length || follow.includes(p.followUp || "01")) &&
    (!rel.length || relKeys(p).some((k) => rel.includes(k)))
  ), [people, display, follow, rel]);

  const n = (f) => people.filter(f).length;
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2200); };
  function copy() {
    (navigator.clipboard?.writeText(link) || Promise.reject()).then(() => say("Link copied")).catch(() => say(link));
  }

  return (
    <ConnectPage>
      <SectionBar n={1} icon="qr" title="SCAN My QR Code">
        <div className="cw-qr">
          {qr ? <img src={qr} alt="My Connect with Me QR code" width="200" height="200" /> : <div className="cw-qr-wait" />}
        </div>
        <div className="cw-btn-row">
          <a href="/connect/submit" className="cw-chip">Exchange Contact Info</a>
          <a href="/connect/signup" className="cw-chip" data-tip="Opens your phone camera to scan their code">SCAN Other&apos;s QR Code</a>
          <a href="/connect/signup" className="cw-chip">Connect and Follow</a>
          <button type="button" className="cw-chip" onClick={copy}>Copy Link</button>
        </div>
        {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
      </SectionBar>

      <SectionBar icon="figViewProfile" title="View My Network">
        <CardAndPitch p={me} placeholder />
        <div className={`cw-net ${showFilters ? "" : "cw-net-full"}`}>
          {showFilters ? (
            <div className="cw-filters">
              <div className="cw-mini-bar"><b>Filters</b><button type="button" onClick={() => setShowFilters(false)}>Hide</button></div>
              <Box title="Display" hint="Select all that apply">
                <Option checked={!display.length} onChange={() => setDisplay([])} label="All - My Network" def />
                <Option checked={display.includes("intro")} onChange={() => toggle(display, setDisplay)("intro")} label={<>My Introductions <i>Level 1</i></>} />
                <Option checked={display.includes("conn")} onChange={() => toggle(display, setDisplay)("conn")} label="My Connections" />
                {["1", "2", "3"].map((l) => <Option key={l} checked={display.includes(l)} onChange={() => toggle(display, setDisplay)(l)} label={`Level ${l}`} />)}
              </Box>
              <Box title="My Follow-Up Status" hint="Select one">
                <Option type="radio" name="cw-follow" checked={!follow.length} onChange={() => setFollow([])} label="All - My Network" def />
                {FOLLOW_UP.map((f) => (
                  <Option key={f.id} type="radio" name="cw-follow" checked={follow.includes(f.id)} onChange={() => setFollow([f.id])}
                    label={<>{f.hot ? <>05 <b className="cw-hot">HOT !</b></> : f.label} <i>{f.hint === "Default" ? "" : f.hint}</i></>} />
                ))}
              </Box>
              <Box title="My Relationships" hint="Select all that apply">
                <Option checked={!rel.length} onChange={() => setRel([])} label="All" def />
                <Option checked={rel.includes("referrals")} onChange={() => toggle(rel, setRel)("referrals")} label="My Referrals / Circles of Influence" />
                {RELATIONSHIP_GROUPS.map((g) => (
                  <div key={g.group + (g.sub || "")} className="cw-relgroup">
                    <span>{g.group} {g.sub && <i>{g.sub}</i>}</span>
                    {g.options.map(([id, label]) => <Option key={id} checked={rel.includes(id)} onChange={() => toggle(rel, setRel)(id)} label={label} />)}
                  </div>
                ))}
              </Box>
            </div>
          ) : null}

          <div className="cw-netmain">
            <div className="cw-mini-bar">
              {!showFilters && <button type="button" onClick={() => setShowFilters(true)}>Filters</button>}
              <b>View as</b>
              <label><input type="radio" name="cw-view" checked={view === "graph"} onChange={() => setView("graph")} /> Graph <i>Default</i></label>
              <label><input type="radio" name="cw-view" checked={view === "list"} onChange={() => setView("list")} /> List</label>
            </div>
            <div className="cw-netbox">
              {view === "graph"
                ? <NetworkGraph me={me} people={shown} />
                : <div className="cw-list">{shown.map((p) => <MiniCard key={p.id} p={p} />)}{!shown.length && <p className="cw-muted">Nobody matches these filters.</p>}</div>}
              {sample && <p className="cw-muted cw-sample">Sample names until people join through your QR code.</p>}
            </div>
            <div className="cw-counts">
              <span><b className="cw-red">xxx,xxx</b> <b>Users Near Me</b> <i>Right Now</i></span>
              <span><b className="cw-red">{n(() => true)}</b> <b>My Network</b> <i>My Introductions + My Connections</i></span>
              <span><b className="cw-red">{n((p) => p.level === "intro")}</b> <b>My Introductions</b> <i>Level 1 — they signed up directly with my QR Code or profile</i></span>
              <span><b className="cw-red">{n((p) => p.level !== "intro")}</b> <b>My Connections</b> <i>Levels 1-3</i></span>
              {["1", "2", "3"].map((l) => <span key={l}><b className="cw-red">{n((p) => p.level === l)}</b> <b>My Connections</b> <i>Level {l}</i></span>)}
              <span><b className="cw-red">xxx,xxx</b> <b>onebig<span className="cw-red">HUB</span></b> <i>All Levels</i></span>
              <a href="/connect/next" className="cw-invite">INVITE with My Network</a>
            </div>
          </div>
        </div>
      </SectionBar>

      <UpcomingSteps from={2} />
    </ConnectPage>
  );
}
