"use client";

import { ConnectPage, SectionBar } from "../../components/ConnectKit";
import { HubPreview } from "../../components/SiteHero";
import { Glyph } from "../../components/Icons";

// Connect with Me ! — Next Steps (Figma /UserName/ConnectWithMe/NextSteps):
// a Create My Profile(s) · b Invite Others with My Custom QR Code ·
// c EARN with Advertising · d Manage my Dashboards and Settings.
const DASHBOARDS = [
  ["cart", "My Shopping Cart", "Default", "/cart"],
  ["settings", "My Account", "Wallet, Submit Payment, Expenses, Revenue", "/dashboards#account"],
  ["document", "My Receipts", "", "/dashboards#receipts"],
  ["calculate", "My Transactions", "", "/dashboards#transactions"],
  ["connectMe", "My Transactions", "Introductions / Referrals", "/referrals/status"],
  ["user", "My Events", "List of Attendees", "/dashboards#attendees"],
  ["expo", "My Events", "Participants", "/dashboards#participants"],
  ["megaphone", "My Custom Marketing Collateral", "", "/dashboards#collateral"],
  ["settings", "Settings", "", "/dashboards#settings"],
];

function Go({ href }) {
  return <p className="cw-center"><a href={href} className="cw-submit">Submit</a></p>;
}

export default function ConnectNext() {
  return (
    <ConnectPage subtitle="Next Steps">
      <SectionBar n={6} title="NEXT STEPS">
        <SectionBar n="a" icon="connections" title={<>Connections <span>Create My Profile(s)</span></>} hint="Individual / Business / Organization / Group">
          <HubPreview section="connections" action="details" line={false} />
          <Go href="/profile" />
        </SectionBar>

        <SectionBar n="b" icon="figConnect" title={<><i>Connect with Me !</i> <span>Invite Others</span></>} hint="with My Custom QR Code">
          <HubPreview section="introductions" action={null} />
          <Go href="/connect" />
        </SectionBar>

        <SectionBar n="c" icon="megaphone" title={<>EARN with Advertising <span>Promote, Sell AND Earn Money !</span></>} hint="Create your Listings">
          <p className="cw-center cw-sub"><i>Share 10 % of Revenue with your 3 Levels of Introductions / Referrals</i></p>
          <HubPreview section="earn" action={null} path="/advertising/listings" />
          <div className="ad-box cw-adbox">
            <p>onebig<b className="cw-red">HUB</b> offers various free and paid opportunities to promote your events, businesses, and organizations, online and in-person. Please <a href="/info#contact">contact us</a> to discuss <b className="cw-red">win-win</b> package deals.</p>
          </div>
          <Go href="/advertising/calculate" />
        </SectionBar>

        <SectionBar n="d" icon="dashboards" title="Manage my Dashboards and Settings">
          <HubPreview section="earn" action={null} line={false} />
          <div className="cw-box cw-dash">
            <b><Glyph name="dashboards" size={18} /> Dashboards</b> <i>Select one at a time</i>
            {DASHBOARDS.map(([icon, label, hint, href], i) => (
              <a key={i} href={href} className="cw-dash-item"><Glyph name={icon} size={18} /> <span className="cw-blue">o {label}</span> {hint && <i>{hint}</i>}</a>
            ))}
          </div>
          <Go href="/dashboards" />
        </SectionBar>
      </SectionBar>
      <p className="hh-box hsub-line cw-help"><a href="/info#contact"><b><i>How may we be of help to you ?</i></b></a> Please contact us with your comments and questions.</p>
    </ConnectPage>
  );
}
