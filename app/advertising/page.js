"use client";

import { AdPage } from "../components/AdPages";
import { Glyph } from "../components/Icons";
import HubLogo from "../components/HubLogo";

// Promote & Earn — landing page (Cesar's Figma Rev 261116, /PromoteAndEarn).
const DIGESTS = [
  ["calendar", "One Big Calendar", "Sell tickets, Assign your Attendance Status", "/"],
  ["connections", "Connect", <>Individuals, Businesses, Organizations, Groups<br /><i>Assign your Membership Status</i></>, "/connections"],
  ["idxBriefcase", "Careers / Jobs", "Assign your Employment Application Status", "/employment"],
  ["idxProduct", "Products", null, "/listings?type=Product"],
  ["idxService", "Services", null, "/listings?type=Service"],
  null,
  ["idxClassified", "Classifieds", null, "/listings?type=Classified"],
  ["discount", "Deals", "Discount / Gift Certificates, Premier Listings only", "/discounts"],
  ["dinner", "Hospitality", null, "/listings?type=Hospitality"],
  ["idxDeal", "Investments", null, "/listings?type=Investment"],
  ["idxHeart", "Pay-It-Forward", <>Be the reason someone smiles today !<br />Donate and Volunteer, No-Cost Premier Listings</>, "/listings?type=Pay-It-Forward"],
  null,
  ["idxMembership", "Memberships", null, "/listings?type=Membership"],
  ["idxBell", "Custom Notifications", <>Avoid costly newsletter email blast services<br />Assign your Frequency to Post / Receive Notifications by email and/or text</>, "/notifications"],
  ["idxSubscription", "Subscriptions", null, "/listings?type=Subscription"],
  ["idxSurvey", "Surveys", null, "/listings?type=Survey"],
];

export default function PromoteAndEarn() {
  return (
    <AdPage title="Promote & Earn">
      <section className="ad-box pe-box">
        <h2><HubLogo size={34} /> Performance-Based Marketing System</h2>
        <p><b className="cw-red"><i>SAVE $$$ !</i></b> <b>Full Transparency</b> <span className="cw-red">*</span> <a href="/advertising/calculate">Calculate and Manage your Advertising Cost</a> based on # times your listing may be displayed in user&rsquo;s matching filters and pages:</p>
        <p className="pe-indent"><b># views</b> or <b># clicks</b><br /><b># weeks</b></p>
        <p className="pe-note"><span className="cw-red">*</span> <i>This is <b>NOT</b> the typical, pay-and-pray shotgun, ineffective, push-marketing approaches</i></p>
      </section>

      <section className="ad-box pe-box">
        <h2><Glyph name="idxIntro" size={34} /> Earn Money for Introductions</h2>
        <p><b className="cw-red"><i>Get Paid</i></b> <i>for Introductions that convert to business and/or a beneficial connection</i></p>
        <ul>
          <li>Identify the Participants: Vendor and Potential Client</li>
          <li>Send Initial Message: Connector (A) introduces Participants (B, C) to each other and Submits initial evaluation(s)</li>
          <li>Participants (B, C) - Submit Referral Status<br />The system automatically tracks the referral status and messages</li>
          <li>Participants (B, C) - Submit Evaluation(s) of each other when the transaction is completed</li>
        </ul>
        <p><a href="/referrals">Start an Introduction →</a></p>
      </section>

      <section className="ad-box pe-box">
        <h2><img src="/icons/earn.png" alt="" width="40" height="40" /> Promote &amp; Share Profits</h2>
        <div className="pe-share">
          <div>
            <p><b className="cw-red"><i>Win-Win-Win !</i></b></p>
            <ul>
              <li><b>Share Profits</b> <i>(10%)</i> from ads and sales fees with your network of introductions <i>(up to 3 levels)</i></li>
              <li><b>My Digests</b> <i>(private)</i> Select sets of filters to <b>curate</b> <i>(organize, submit, view)</i> your custom tables of <b className="cw-red">No-Cost</b> and <b className="cw-blue">Premier</b> listings:</li>
            </ul>
            <div className="pe-digests">
              {DIGESTS.map((d, i) => d === null ? <span key={i} className="pe-gap" /> : (
                <a key={d[1]} href={d[3]} className="pe-dig">
                  {d[0] === "calendar" || d[0] === "connections" ? <img src={`/icons/${d[0]}.png`} alt="" width="20" height="20" /> : <Glyph name={d[0]} size={18} />}
                  <span><b>{d[1]}</b> {d[2] && <i>{d[2]}</i>}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="pe-levels" aria-label="Profit share by level">
            <span>2 %<br /><small>Level 3</small></span><i />
            <span>3 %<br /><small>Level 2</small></span><i />
            <span>5 %<br /><small>Level 1</small></span><i />
            <b>Vendor</b>
          </div>
        </div>
      </section>

      <section className="ad-box pe-box">
        <h2><Glyph name="login" size={34} /> Invite / Refer Others to Sign Up</h2>
        <p><b className="cw-red"><i>No-Cost and Easy !</i></b> <b>With your QR Code and Custom Marketing Collateral</b> — <a href="/connect">Connect with Me !</a></p>
        <p><Glyph name="login" size={16} /> <a href="/registration/signup"><b>Sign Up Today</b></a> to create your account, submit and edit your listings</p>
        <p><Glyph name="dashboards" size={16} /> <a href="/dashboards">Manage Your Dashboards</a></p>
      </section>
    </AdPage>
  );
}
