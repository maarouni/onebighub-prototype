"use client";

import { useState } from "react";
import { AdPage } from "../components/AdPages";
import { Glyph } from "../components/Icons";
import HubLogo from "../components/HubLogo";

// Achieve — Marketing System landing page (Cesar's Figma Rev 261118, /Achieve):
// Performance-Based Marketing System, Invite / Refer, Earn Money for
// Introductions, Marketplace & Profit-Sharing (Nov 22: was "Marketing") (Find-section digests).
const DIGESTS = [
  ["calendar", "One Big Calendar", "Sell tickets, Assign your Attendance Status", "/calendar"],
  ["connections", "Connect", <>Individuals, Businesses, Organizations, Groups<br />Individuals - Political Candidates<br />Individuals - Romantic Matchmaking<br />Organizations, Groups - Assign your Membership Status</>, "/connect"],
  ["idxBriefcase", "Employment", "Assign your Employment Application Status", "/employment"],
  ["idxProduct", "Products", null, "/listings?type=Product"],
  ["idxService", "Services", null, "/listings?type=Service"],
  null,
  ["idxClassified", "Classifieds", null, "/listings?type=Classified"],
  ["discount", <>Deals&nbsp;&nbsp;<i className="pe-hint">Premier Listings only</i></>, "Distribute certificates as discounts, gifts, incentives, raffle prizes, or rewards !", "/discounts"],
  ["comments", "Forums", null, "/listings?type=Forum"],
  ["dinner", "Hospitality", null, "/listings?type=Hospitality"],
  ["idxDeal", "Investments", null, "/listings?type=Investment"],
  ["idxHeart", <>Pay-It-Forward&nbsp;&nbsp;<i className="pe-hint">No-Cost Premier Listings</i></>, "Donate, Volunteer - Be the reason someone smiles today !", "/listings?type=Pay-It-Forward"],
  null,
  ["idxMembership", "Memberships", null, "/listings?type=Membership"],
  ["idxBell", "Custom Notifications", <>Avoid costly newsletter email blast services<br />Assign your Frequency to Post / Receive Notifications by email and/or text</>, "/notifications"],
  ["idxSubscription", "Subscriptions", null, "/listings?type=Subscription"],
  ["idxSurvey", "Surveys", null, "/listings?type=Survey"],
];

export default function Achieve() {
  const [taxOpen, setTaxOpen] = useState(false);
  return (
    <AdPage title={<>Achieve&nbsp;&nbsp;<i className="pb-sub">Marketing System</i></>}>
      <section className="ad-box pe-box">
        <h2><HubLogo size={34} /> Performance-Based Marketing System</h2>
        <p><b className="cw-red"><i>SAVE $$$ !</i></b> <b>Full Transparency</b> <span className="cw-red">*</span> <a href="/advertising/calculate">Calculate and Manage your Advertising Cost</a> based on # times your listing may be displayed in users&rsquo; matching filters and pages:<br />
          <b># views</b> or <b># clicks</b>, and <b># weeks</b></p>
        <p className="pe-note"><span className="cw-red">*</span> <i>This is <b>NOT</b> the typical, pay-and-pray shotgun, ineffective, push-marketing approaches</i></p>
      </section>

      <section className="ad-box pe-box">
        <h2><Glyph name="login" size={34} /> Introduce Others to onebig<span className="cw-red" style={{ display: "inline" }}>HUB</span></h2>
        <p><b className="cw-red"><i>No-Cost and Easy !</i></b> <b>With your QR Code and Custom Marketing Collateral</b></p>
        <p><Glyph name="login" size={16} /> <a href="/registration/signup"><b>Sign Up Today</b></a> Create your profile(s), submit and edit your listings</p>
        <p><Glyph name="dashboards" size={16} /> <a href="/dashboards">Manage Your Dashboards</a></p>
      </section>

      <section className="ad-box pe-box">
        <h2><img src="/icons/cesar/network.png" alt="" width="34" height="34" /> Earn Money for Introductions</h2>
        <p><b className="cw-red"><i>Get Paid</i></b> <i>for 3-Way Introductions that convert to business and/or a beneficial connection</i></p>
      </section>

      <section className="ad-box pe-box">
        <h2><img src="/icons/cesar/pie.png" alt="" width="34" height="34" /> Profit-Sharing <i className="pe-h2-sub">Win-Win-Win</i></h2>
        <p className="pe-bul"><span><b>(10%)</b> From advertising and sales fees with your Network of Connections <i>(3 levels)</i></span></p>
        <p className="pe-bul"><span>At end of year, revenue from introductions from unknown sources will be divided equally among all users.</span></p>
        <div className="pe-chain" aria-label="Profit share by level">
          <span className="pe-chain-node">Vendor</span><i />
          <span className="pe-chain-node">5 % <small>Level 1</small></span><i />
          <span className="pe-chain-node">3 % <small>Level 2</small></span><i />
          <span className="pe-chain-node">2 % <small>Level 3</small></span>
        </div>
      </section>

      <section className="ad-box pe-box">
        <h2><img src="/icons/cesar/taxbulb.png" alt="" width="34" height="34" /> Do You Enjoy Paying Taxes?</h2>
        <button type="button" className="pe-more" aria-expanded={taxOpen} onClick={() => setTaxOpen((v) => !v)}>
          {taxOpen ? "Hide" : "Learn more"} {taxOpen ? "▲" : "▼"}
        </button>
        {taxOpen && (
          <>
            <p><b className="cw-red"><i>Keep more of what you earn.</i></b> Running your own business can change how your income is taxed. Ask a CPA which expenses apply to your situation.</p>
            <ul>
              <li>Sign up and create your business profile</li>
              <li>Track your business expenses as you go</li>
              <li>Learn more with a CPA or tax professional before you file</li>
            </ul>
          </>
        )}
      </section>

      <section className="ad-box pe-box">
        <h2><Glyph name="megaphone" size={34} /> My Marketplace</h2>
        <div className="pe-share">
          <div>
            <p className="pe-bul"><Glyph name="idxTarget" size={20} /><span><b>My Digests</b> <i>(Private)</i><br />Select filters to <b>curate</b> <i>(organize, submit, view)</i> your custom tables of <b className="cw-red">No-Cost</b> and <b>Premier</b> listings in the <a href="/calendar">Find Section</a>:</span></p>
            <div className="pe-chips" aria-label="Digest filters">
              {[
                ["Calendar (Default)", "/calendar"], ["Employment", "/employment"], ["Products", "/listings?type=Product"], ["Services", "/listings?type=Service"],
                ["Classifieds", "/listings?type=Classified"], ["Deals", "/discounts"], ["Forums", "/listings?type=Forum"], ["Hospitality", "/listings?type=Hospitality"],
                ["Investments", "/listings?type=Investment"], ["Memberships", "/listings?type=Membership"], ["Notifications", "/notifications"], ["Pay-It-Forward", "/listings?type=Pay-It-Forward"],
                ["Subscriptions", "/listings?type=Subscription"], ["Surveys", "/listings?type=Survey"],
              ].map(([c, href]) => (
                <a key={c} href={href} className="pe-chip"><span className="pe-chip-dot" aria-hidden="true" />{c}</a>
              ))}
            </div>
            <div className="pe-digests">
              {DIGESTS.map((d, i) => d === null ? <span key={i} className="pe-gap" /> : (
                <a key={i} href={d[3]} className="pe-dig">
                  {d[0] === "calendar" || d[0] === "connections" ? <img src={`/icons/${d[0]}.png`} alt="" width="20" height="20" /> : <Glyph name={d[0]} size={18} />}
                  <span><b>{d[1]}</b>{d[2] && <span className="pe-dig-desc">{d[2]}</span>}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdPage>
  );
}
