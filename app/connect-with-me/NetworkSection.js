"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionBar, CardAndPitch, NetworkGraph } from "../components/ConnectKit";
import { Box, Option, RefIcon } from "../components/FilterKit";
import { MiniCard } from "../components/Form";
import { getProfile } from "../lib/profile";
import { getUser } from "../lib/auth";
import { getNetwork, SAMPLE_NETWORK, FOLLOW_UP, relsOf } from "../lib/connect";

// Nov 20 (Cesar, "Connect with Me ! HOME"): Step 3 View My Network sits on the
// Connect with Me ! page. Visitors who aren't signed in see Santa Claus's
// sample mini-card and node graph first, THEN sign up — no leap of faith.
// After Sign Up / Log In they see their own mini-card and network.
const REL_OPTS = [["referrals", "Referrals"], ["connection", "Connect"], ["colleague", "Colleagues"], ["friend", "Friends"], ["family", "Family"]];
const LEVEL_OPTS = [["intro", <>My Introductions <i>Level 1</i></>], ["1", <>My Connect <i>Level 1</i></>], ["2", <>My Connect <i>Level 2</i></>], ["3", <>My Connect <i>Level 3</i></>]];
export const SANTA = { name: "Santa Claus", title: "Chief Gift Officer", business: "Santa's Workshop", phone: "1-800-HO-HO-HO", email: "santa@northpole.example", city: "North Pole, AK", pitchTitle: "Making spirits bright since forever", pitch: "I lead a global team that designs, builds and delivers gifts to every good girl and boy — on time, every year." };

export default function NetworkSection({ step = 3 }) {
  const [me, setMe] = useState(null);
  const [real, setReal] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [view, setView] = useState("graph");
  const [follow, setFollow] = useState("all");
  const [rel, setRel] = useState([]);
  const [relNone, setRelNone] = useState(false);
  const [lvl, setLvl] = useState([]);
  const [lvlNone, setLvlNone] = useState(false);
  const [offer, setOffer] = useState("both");
  useEffect(() => { setMe(getProfile()); setReal(getNetwork()); setLoggedIn(!!getUser()); }, []);
  const sample = !loggedIn || real.length === 0;
  const people = sample ? SAMPLE_NETWORK : real;
  const center = loggedIn ? me : SANTA;
  const tog = (list, set, v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const shown = useMemo(() => people.filter((p) => {
    if (follow === "none") return false;
    if (follow !== "all" && (p.followUp || "01") !== follow) return false;
    if (relNone || lvlNone) return false;
    if (rel.length) { const s = relsOf(p); if (!rel.some((k) => (k === "referrals" ? p.professional === "referral" || p.referral : s.has(k)))) return false; }
    if (lvl.length && !lvl.includes(p.level || "1")) return false;
    if (offer === "yes" && !p.offersReferral) return false;
    if (offer === "no" && p.offersReferral) return false;
    return true;
  }), [people, follow, rel, relNone, lvl, lvlNone, offer]);
  const n = (f) => people.filter(f).length;

  const toggleBtn = <button type="button" className="cw-dispf" onClick={() => setShowFilters((v) => !v)}>{showFilters ? "Hide Filters" : "Display Filters"}</button>;

  return (
    <>
      <SectionBar n={step} icon="nodeGraph" title="View My Network" right={toggleBtn}>
        <CardAndPitch p={center} placeholder={loggedIn} />
        <div className={`cw-net ${showFilters ? "" : "cw-net-full"}`}>
          {showFilters && (
            <div className="cw-filters">
              <div className="cw-mini-bar"><b>Filters</b><button type="button" onClick={() => setShowFilters(false)}>Hide</button></div>
              <Box title="View as" hint="Select one">
                <Option type="radio" name="cw-view" checked={view === "graph"} onChange={() => setView("graph")} label="Graph" def />
                <Option type="radio" name="cw-view" checked={view === "list"} onChange={() => setView("list")} label="List" />
              </Box>
              <Box title={<>My Follow-Up Status <i>Private</i></>} hint="Select one">
                <Option type="radio" name="cw-fu" checked={follow === "all"} onChange={() => setFollow("all")} label="All" def />
                <Option type="radio" name="cw-fu" checked={follow === "none"} onChange={() => setFollow("none")} label="None" />
                {FOLLOW_UP.map((f) => (
                  <Option key={f.id} type="radio" name="cw-fu" checked={follow === f.id} onChange={() => setFollow(f.id)}
                    label={<>{f.hot ? <>05 <b className="cw-hot">HOT !</b></> : f.label.replace(" / None", "")} <i>{({ "01": "Doubtful", "02": "Maybe", "03": "Sometime", "04": "Soon", "05": "Very Soon" })[f.id]}</i></>} />
                ))}
              </Box>
              <Box title="My Relationships" hint="Select all that apply">
                <Option checked={!rel.length && !relNone} onChange={() => { setRel([]); setRelNone(false); }} label="All" def />
                <Option checked={relNone} onChange={() => { setRelNone((v) => !v); setRel([]); }} label="None" />
                {REL_OPTS.map(([id, l]) => <Option key={id} checked={rel.includes(id)} onChange={() => { setRelNone(false); tog(rel, setRel, id); }} label={l} />)}
              </Box>
              <Box title="Levels" hint="Select all that apply">
                <Option checked={!lvl.length && !lvlNone} onChange={() => { setLvl([]); setLvlNone(false); }} label="All" def />
                <Option checked={lvlNone} onChange={() => { setLvlNone((v) => !v); setLvl([]); }} label="None" />
                {LEVEL_OPTS.map(([id, l]) => <Option key={id} checked={lvl.includes(id)} onChange={() => { setLvlNone(false); tog(lvl, setLvl, id); }} label={l} />)}
              </Box>
              <Box title="Offering $ Referrals" icon={<RefIcon />}>
                <Option type="radio" name="cw-offer" checked={offer === "both"} onChange={() => setOffer("both")} label="Both" def />
                <Option type="radio" name="cw-offer" checked={offer === "no"} onChange={() => setOffer("no")} label="No" />
                <Option type="radio" name="cw-offer" checked={offer === "yes"} onChange={() => setOffer("yes")} label="Yes" />
              </Box>
            </div>
          )}
          <div className="cw-netmain">
            {!showFilters && (
              <div className="cw-mini-bar"><b>View as</b>
                <label><input type="radio" name="cw-view2" checked={view === "graph"} onChange={() => setView("graph")} /> Graph <i>Default</i></label>
                <label><input type="radio" name="cw-view2" checked={view === "list"} onChange={() => setView("list")} /> List</label>
              </div>
            )}
            <div className="cw-netbox">
              {view === "graph" ? <NetworkGraph me={center} people={shown} />
                : <div className="cw-list">{shown.map((p) => <MiniCard key={p.id} p={p} />)}{!shown.length && <p className="cw-muted">Nobody matches these filters.</p>}</div>}
              {sample && <p className="cw-muted cw-sample">{loggedIn ? "Sample names until people join through your QR code." : <>Sample network for <b>Santa Claus</b> — <a href="/connect-with-me/network#signup">Sign Up / Log In</a> to see your own.</>}</p>}
            </div>
          </div>
        </div>
        <div className="cw-counts">
          <span><b className="cw-red">{n((p) => p.level === "intro")}</b> <b>My Introductions</b> <i>Level 1 - Signed up directly with my QR Code OR on my profile</i></span>
          {["1", "2", "3"].map((l) => <span key={l}><b className="cw-red">{n((p) => p.level === l)}</b> <b>My Connect</b> <i>Level {l}</i></span>)}
          <span><b className="cw-red">xxx,xxx</b> <b>Users Near Me</b> <i>Geo-locations must be enabled</i></span>
          <span><b className="cw-red">{people.length}</b> <b>My Network</b> <i>Levels 1 - 3 My Introductions + My Connect</i></span>
          <span><b className="cw-red">xxx,xxx</b> <b>onebig<span className="cw-red">HUB</span></b> <i>All Levels</i></span>
        </div>
      </SectionBar>

    </>
  );
}
