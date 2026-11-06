"use client";

import { useMemo, useState } from "react";
import SiteHero from "../../components/SiteHero";
import { ResultsHead, ListingTable } from "../../components/ListingTable";

// MOCKUP (Nov 6) for Cesar: what One Big Calendar looks like as a hub —
// one list from many sources, each row tagged with where it came from and
// linking out to RSVP there. Not wired into the real calendar.
// Eventbrite + Dublin Chamber rows are real listings looked up Nov 6, 2026;
// the other sources' rows are examples.

const SOURCES = {
  eventbrite: { label: "Eventbrite", color: "#d1410c" },
  luma: { label: "Luma", color: "#7c3aed" },
  meetup: { label: "Meetup", color: "#e0393e" },
  chamber: { label: "Chamber", color: "#1f6f43" },
  sbdc: { label: "SBDC", color: "#0f5ea8" },
  ccim: { label: "CCIM", color: "#0b3c5d" },
  bni: { label: "BNI", color: "#b30000" },
  alignable: { label: "Alignable", color: "#0a7d7d" },
};

const EB = (id) => `https://www.eventbrite.com/e/${id}`;
const DUBLIN = "https://business.dublinchamber.org/events/search?from=11/07/2026&to=12/31/2026";

// [date, day label, time, title, city, host, source, url, example?]
const EVENTS = [
  ["2026-11-09", "Mon, Nov 09 '26", "07:00pm-10:00pm", "Health, Fitness, Beauty & Wellness Business Networking Mixer", "Palo Alto", "Eventbrite organizer", "eventbrite", EB("1999153152896")],
  ["2026-11-10", "Tue, Nov 10 '26", "11:30am", "Lunch Bunch — Rusty Bucket Restaurant & Tavern", "Dublin", "Dublin Chamber of Commerce", "chamber", "https://business.dublinchamber.org/events/details/lunch-bunch-rusty-bucket-restaurant-tavern-12590"],
  ["2026-11-10", "Tue, Nov 10 '26", "06:00pm-08:00pm", "Business Professionals Networking Mixer at The Province", "San Jose", "Eventbrite organizer", "eventbrite", EB("2003744039361")],
  ["2026-11-10", "Tue, Nov 10 '26", "06:00pm-08:00pm", "Workforce of the Future: Speed Networking Event", "San Francisco", "Eventbrite organizer", "eventbrite", EB("2003027441999")],
  ["2026-11-11", "Wed, Nov 11 '26", "07:00am-08:30am", "BNI Chapter Weekly Breakfast Meeting", "Pleasanton", "BNI East Bay", "bni", null, true],
  ["2026-11-11", "Wed, Nov 11 '26", "06:00pm-08:30pm", "Silicon Valley Business Network", "San Jose", "Eventbrite organizer", "eventbrite", EB("1997636023120")],
  ["2026-11-12", "Thu, Nov 12 '26", "See source", "Marketing Strategy Workshop: Marketing Strategy Fundamentals", "Dublin", "Dublin Chamber of Commerce", "chamber", DUBLIN],
  ["2026-11-12", "Thu, Nov 12 '26", "05:00pm-07:00pm", "2026 StartOut Demo Day", "San Francisco", "StartOut", "eventbrite", EB("2002631904937")],
  ["2026-11-12", "Thu, Nov 12 '26", "07:00pm-09:00pm", "Law, Real Estate & Construction Networking Event", "San Francisco", "Eventbrite organizer", "eventbrite", EB("1999408019208")],
  ["2026-11-13", "Fri, Nov 13 '26", "See source", "Sales Connection Breakfast: Relationship First Sales Approach", "Dublin", "Dublin Chamber of Commerce", "chamber", DUBLIN],
  ["2026-11-14", "Sat, Nov 14 '26", "09:00am-10:30am", "East Bay Founders Coffee", "Oakland", "Luma host", "luma", null, true],
  ["2026-11-16", "Mon, Nov 16 '26", "07:00pm-10:00pm", "Palo Alto Women in Business Social Networking Event", "Palo Alto", "Eventbrite organizer", "eventbrite", EB("2004065045499")],
  ["2026-11-17", "Tue, Nov 17 '26", "See source", "Business After Hours Networking hosted by Magge's Cleaning", "Dublin", "Dublin Chamber of Commerce", "chamber", DUBLIN],
  ["2026-11-17", "Tue, Nov 17 '26", "06:30pm-08:30pm", "Tri-Valley Small Business Owners Meetup", "Pleasanton", "Meetup group", "meetup", null, true],
  ["2026-11-18", "Wed, Nov 18 '26", "05:30pm-07:30pm", "Tri-Valley Business Mixer", "Danville", "Alignable community", "alignable", null, true],
  ["2026-11-18", "Wed, Nov 18 '26", "See source", "Marketing Strategy Workshop: Your Marketing Game Plan", "Dublin", "Dublin Chamber of Commerce", "chamber", DUBLIN],
  ["2026-11-18", "Wed, Nov 18 '26", "07:00pm-10:00pm", "Startup Networking San Francisco: Founders, Investors & Talent", "San Francisco", "Eventbrite organizer", "eventbrite", EB("1999531193626")],
  ["2026-11-19", "Thu, Nov 19 '26", "10:00am-12:30pm", "LOCAL Networking for Women in SV", "Campbell", "Eventbrite organizer", "eventbrite", EB("1987154514646")],
  ["2026-11-19", "Thu, Nov 19 '26", "12:00pm-01:00pm", "Small Business Funding 101 (webinar)", "Online", "Small Business Development Center", "sbdc", null, true],
  ["2026-11-20", "Fri, Nov 20 '26", "11:30am-01:30pm", "Commercial Real Estate Market Luncheon", "Walnut Creek", "NorCal CCIM", "ccim", null, true],
];

export default function HubMockup() {
  const [on, setOn] = useState(() => new Set(Object.keys(SOURCES)));
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = {};
    EVENTS.forEach((e) => { c[e[6]] = (c[e[6]] || 0) + 1; });
    return c;
  }, []);

  const toggle = (k) => setOn((s) => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n.size ? n : new Set(Object.keys(SOURCES));
  });

  const ql = q.trim().toLowerCase();
  const shown = EVENTS.filter((e) => on.has(e[6]) && (!ql || `${e[3]} ${e[4]} ${e[5]}`.toLowerCase().includes(ql)));

  return (
    <div className="page hubm-page">
      <SiteHero section="calendar" title="One Big Calendar" />

      <p className="hubm-banner">
        <b>MOCKUP</b> — One Big Calendar as a hub: Bay Area business networking events from many sources in one list.
        People find them here and RSVP on the original site. Eventbrite and Dublin Chamber rows are real listings
        (looked up Nov 6, 2026); rows marked <i>example</i> show what the other sources would add.
      </p>

      <div className="hubm-sources" role="group" aria-label="Sources">
        <span className="hubm-sources-label">Sources</span>
        {Object.entries(SOURCES).map(([k, s]) => (
          <button key={k} type="button" className={`hubm-chip ${on.has(k) ? "on" : ""}`} style={{ "--src": s.color }}
            aria-pressed={on.has(k)} onClick={() => toggle(k)}>
            {s.label} <b>{counts[k] || 0}</b>
          </button>
        ))}
      </div>

      <ResultsHead title="One Big Calendar" q={q} setQ={setQ} showFilters onShowFilters={() => {}} />

      <ListingTable rows={shown.map((e, i) => {
        const [, day, time, title, city, host, src, url, example] = e;
        const s = SOURCES[src];
        return {
          id: `${i}`,
          href: url || "#",
          left: [day, time],
          title: <>{title}{example && <i className="hubm-example"> example</i>}</>,
          lines: [
            /organizer$|host$/.test(host) ? city : `${city}, Hosted by ${host}`,
            <span key="src" className="hubm-src">
              <span className="hubm-badge" style={{ "--src": s.color }}>{s.label}</span>
              {url ? <>RSVP on {s.label} ↗</> : <>RSVP link on {s.label}</>}
            </span>,
          ],
        };
      })} />

      <section className="hubm-how">
        <h2>How it would work</h2>
        <ol>
          <li><b>Weekly fill:</b> we add the week&apos;s Bay Area business networking events from Eventbrite, Luma, Meetup, chambers, SBDC, CCIM, BNI and Alignable (title, date, time, city, host + link back). About 2–4 hours a week.</li>
          <li><b>One place:</b> people filter by date, region, cost and source instead of checking eight sites.</li>
          <li><b>RSVP on the source:</b> the link goes to the original page. onebigHUB counts the clicks, so we can show hosts how many people we sent them.</li>
          <li><b>Later:</b> hosts post directly on onebigHUB and pay for Premier placement.</li>
        </ol>
      </section>
    </div>
  );
}
