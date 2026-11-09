"use client";

import { ConnectPage, SectionBar } from "../../components/ConnectKit";
import { PreviewRow } from "../../components/SiteHero";
import HubLogo from "../../components/HubLogo";
import { Glyph } from "../../components/Icons";

// Connect with Me ! — Next Steps (Cesar's Figma, Nov 9):
// help line · a Connections Create My Profile(s) · b Invite Others ·
// "Get Paid for Introductions…" · c Promote & Earn ! · d Manage My Dashboards.
const DASHBOARDS = [
  ["cart", "My Shopping Cart", "Default", "cart"],
  ["idxBank", "My Account", "Wallet, Submit Payment, Expenses, Revenue", "account"],
  ["idxReceipt", "My Receipts", "", "receipts"],
  ["idxTransact", "My Transactions", "", "transactions"],
  ["idxIntro", "My Transactions", "Introductions / Referrals", "referrals"],
  ["idxAttendees", "My Events", "List of Attendees", "attendees"],
  ["idxStore", "My Events", "Participants", "participants"],
  ["idxCollateral", "My Custom Marketing Collateral", "", "collateral"],
  ["idxMessages", "My Messages", "", "messages"],
  ["settings", "Settings", "", "settings"],
];

export default function ConnectNext() {
  return (
    <ConnectPage subtitle="Next Steps">
      <SectionBar n={6} icon="idxSigns" title="Next Steps">
        <p className="hh-box hsub-line cw-help"><b><i>How may we be of help to you ?</i></b> Please <a href="/info/contact">contact us</a> with your comments and questions</p>

        <SectionBar n="a" icon="connections" title={<>Connections <span>Create My Profile(s)</span></>} hint="Individual / Business / Organization / Group">
          <PreviewRow kind="profiles" />
        </SectionBar>

        <SectionBar n="b" icon="figConnect" title={<><i>Connect with Me !</i> <span>Invite Others</span></>} hint="with My Custom QR Code">
          <PreviewRow kind="connectIntro" />
        </SectionBar>

        <p className="hh-box hsub-line"><b className="hsub-lead"><i>Get Paid</i></b> <i>for Introductions / Referrals that convert to business and/or a beneficial connection</i></p>

        <SectionBar n="c" icon="megaphone" title={<>Promote &amp; Earn ! <em>Create your Listings</em></>}
          hint={<span className="cw-bar-2nd">Share 10 % of Revenue with your 3 Levels of Introductions / Referrals</span>}>
          <PreviewRow kind="promo" />
          <div className="cw-box cw-hubbox">
            <p>onebig<b className="cw-red">HUB</b> offers various free and paid opportunities to promote your events, businesses, and organizations, online and in-person.</p>
            <p>Please <a href="/info/contact">contact us</a> to discuss <b className="cw-red">win-win</b> package deals.</p>
            <span className="cw-hubbox-logo"><HubLogo size={64} /></span>
          </div>
        </SectionBar>

        <SectionBar n="d" icon="dashboards" title="Manage My Dashboards and Settings">
          <div className="cw-box cw-dash">
            <span><Glyph name="dashboards" size={18} /> <b className="cw-dash-title">Dashboards</b> <i>Select one at a time</i></span>
            {DASHBOARDS.map(([icon, label, hint, id]) => (
              <a key={id} href={`/dashboards?open=${id}`} className="cw-dash-item"><Glyph name={icon} size={18} /> <span className="cw-blue">o {label}</span> {hint && <i>{hint}</i>}</a>
            ))}
          </div>
        </SectionBar>
      </SectionBar>
    </ConnectPage>
  );
}
