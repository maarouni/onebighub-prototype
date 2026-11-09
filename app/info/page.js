"use client";

import { InfoShell } from "../components/InfoKit";
import { Glyph } from "../components/Icons";

// Info · Index (Cesar's Figma, Nov 9 — "I completely revised the Index section",
// icons revised 4:38 AM: Memberships / Surveys swapped, + Classifieds, Announcements).
// Row: [icon, label, hint?, href?, opts]. opts: h = section heading, sub = indented,
// i = italic hint in red, img = picture instead of a line icon.
const PUBLIC = [
  ["idxGlobe", "Public Pages", null, null, { title: true }],
  ["calendar", "One Big Calendar - HOME", "View many types of events", "/", { h: true, img: "/icons/calendar.png" }],
  ["viewMode", "Event Details", null, "/event/1"],
  ["ticket", "RSVP / Order Tickets", null, "/event/1/rsvp"],
  ["idxDeal", "Deals", null, "/discounts", { h: true }],
  ["idxDealFill", "Discount / Gift Certificates", null, "/discounts"],
  ["connections", "Connections", "Curate your networks", "/connections", { h: true, img: "/icons/connections.png" }],
  ["figViewProfile", "Connections Details", null, "/connections?view=profiles"],
  ["figConnect", <>Connect with me ! <b className="cw-red">Killer Feature</b></>, null, "/connect", { it: true }],
  ["typeIndividual", "My Connections Details", "Individual", "/connections?type=individual"],
  ["typeBiz", "My Connections Details", "Business", "/connections?type=business"],
  ["typeOrg", "My Connections Details", "Organization", "/connections?type=org"],
  ["typeGroup", "My Connections Details", "Group", "/connections?type=group"],
  ["idxBell", "Notifications", <>Promote at <b className="cw-red">NO-COST</b></>, "/notifications", { h: true }],
  ["idxBellFill", "Notification Details", null, "/notifications"],
  ["idxBriefcase", "Jobs / Careers", null, "/employment", { h: true }],
  ["idxBriefcaseFill", "Employment Details", null, "/employment"],
];
const PERSONAL = [
  ["idxPerson", <>Personal Pages <i className="info-private">Private</i></>, null, null, { title: true }],
  ["figDigest", <>My Digest <i>Calendar</i></>, "Curate specific events", "/my-calendar", { h: true }],
  ["figEdit", "EDIT My Events", null, "/submit"],
  ["ticket", "EDIT My RSVP / Order Tickets", null, "/dashboards?open=attendees"],
  ["idxDeal", <>My Digest <i>Deals</i></>, null, "/discounts", { h: true }],
  ["idxDealFill", "EDIT My Deals", null, "/discounts/submit"],
  ["figConnDigest", <>My Digest <i>Connections</i></>, "Curate your networks", "/connections/digest", { h: true }],
  ["figEditProfile", "EDIT My Connections Details", null, "/profile"],
  ["figConnect", <>Connect with me ! <b className="cw-red">Killer Feature</b></>, null, "/connect", { it: true }],
  ["typeIndividual", "EDIT My Connections Details", "Individual", "/profile"],
  ["typeBiz", "EDIT My Connections Details", "Business", "/connections/submit"],
  ["typeOrg", "EDIT My Connections Details", "Organization", "/connections/submit"],
  ["typeGroup", "EDIT My Connections Details", "Group", "/connections/submit"],
  ["idxBell", <>My Digest <i>Notifications</i></>, "Avoid costly email blast services", "/notifications", { h: true }],
  ["idxBellFill", "EDIT My Notifications Details", null, "/notifications#edit"],
  ["idxBriefcase", <>My Digest <i>Jobs / Careers</i></>, null, "/employment", { h: true }],
  ["idxBriefcaseFill", "EDIT My Employment Listings", null, "/employment/submit"],
];
const HEADER = [
  [null, "Header", null, null, { title: true }],
  ["pdf", "Download this page as a PDF"],
  ["print", "Print this page"],
  ["login", "Registration", "Sign Up / Log In", "/registration"],
  ["register", "Sign Up", "New User", "/registration/signup", { sub: true }],
  ["idxReturn", "Log In", null, "/registration/login", { sub: true }],
  ["logout", "Log Out", null, "/registration/logout", { sub: true }],
  ["M", "Logged In", "User's First Name Initial", null, { sub: true }],
];
const INFO = [
  ["info", "Info", null, null, { title: true }],
  ["idxMenu", "INDEX", null, "/info"],
  ["idxStore", "About Us", null, "/info/about"],
  ["idxPhone", "Contact Us", null, "/info/contact"],
  ["idxScale", "Legal Documents", null, "/info/legal"],
  ["idxShield", "Child Safety Policy", null, "/info/child-safety", { sub: true }],
  ["idxPrivacy", "Privacy Policy", null, "/info/privacy", { sub: true }],
  ["idxTerms", "Terms & Conditions", null, "/info/terms", { sub: true }],
];
const ACTIONS = [
  [null, "Actions", null, null, { title: true }],
  ["search", "SEARCH"], ["idxPrevNext", "Previous / Next"], ["idxCollapse", "Collapse / View"],
  ["eyeView", "Display, Public"], ["idxHide", "Hide, Private"], ["select", <>Add Listing(s) to My <u>Selection</u></>],
  ["gcal", "Add Event(s) to My Google Calendar"], ["idxAddDigest", "Add Event(s) to My Calendar Digest"],
  ["idxSparkle", "Event Participation"], ["barter", "Barter for Premier Listing"], ["idxBarterOk", "Barter Approval"],
  ["calculate", "Calculate"], ["gallery", "Gallery"], ["comments", "Comments"], ["thumbUp", "Like"], ["share", "Share"],
  ["eyeView", "View Mode"], ["editMode", "Edit Mode"], ["plusBold", "Add New"], ["cart", "Add item to My Shopping Cart"],
  ["delete", "Delete"], ["pdf", "Download this page as a PDF"], ["print", "Print this page"], ["clearAll", "Clear All"],
  ["idxAssign", "Assign Relationship"], ["idxSigns", "Next Steps"], ["idxReturn", "SEARCH Return Button"],
  ["idxIntro", "Introductions / Referrals"], ["idxPrivateLabel", "Private-Label Header"], ["idxSwitch", "Switch"],
];
const DASH = [
  ["dashboards", "Dashboards", null, "/dashboards", { title: true }],
  ["cart", "My Shopping Cart", "Default", "/dashboards?open=cart", { o: true }],
  ["idxBank", "My Account", "Wallet, Submit Payment, Expenses, Revenue", "/dashboards?open=account", { o: true }],
  ["idxReceipt", "My Receipts", null, "/dashboards?open=receipts", { o: true }],
  ["idxTransact", "My Transactions", null, "/dashboards?open=transactions", { o: true }],
  ["idxIntro", "My Transactions", "Introductions / Referrals", "/dashboards?open=referrals", { o: true }],
  ["idxAttendees", "My Events", "List of Attendees", "/dashboards?open=attendees", { o: true }],
  ["idxStore", "My Events", "Participants", "/dashboards?open=participants", { o: true }],
  ["idxCollateral", "My Custom Marketing Collateral", null, "/dashboards?open=collateral", { o: true }],
  ["idxMessages", "My Messages", null, "/dashboards?open=messages", { o: true }],
  ["settings", "Settings", null, "/dashboards?open=settings", { o: true }],
];
const IMAGES = [
  [null, "Icons / Images", null, null, { title: true }],
  ["idxListings", "Listings"], ["idxDigestImg", "Digest"], ["expo", "Networking Expos / Mixers"], ["dinner", "Networking Dinners"],
  ["workshop", "Seminars / Workshops"], ["idxSad", "Registration Log Out"], ["select", "Registration Sign Up Email"],
  ["idxMiniCard", "Mini-Cards"], ["idxProduct", "Products"], ["idxService", "Services"], ["idxClassified", "Classifieds"],
  ["idxMembership", "Memberships"], ["idxSubscription", "Subscriptions"], ["idxSurvey", "Surveys"], ["idxAnnounce", "Announcements"],
  ["idxTarget", "Relationship(s) Professional"], ["idxHome", "Relationship(s) Personal", "Share Home"],
  ["idxSmile", "Relationship(s) Personal", "Friendship"], ["idxHeart", "Relationship(s) Romantic"],
  ["VERIFY", "Verify Email button"], ["EMAILFOOT", "Email Footer"],
];

function Icon({ name, img }) {
  if (img) return <img src={img} alt="" width="22" height="22" />;
  if (name === "M") return <span className="idx-m">M</span>;
  if (name === "VERIFY") return <span className="idx-verify">Verify Email</span>;
  if (name === "EMAILFOOT") return <span className="idx-foot">↩ ↩↩ ↪ ⋯</span>;
  return name ? <Glyph name={name} size={20} /> : <span className="idx-blank" />;
}

function Card({ rows }) {
  return (
    <section className="idx-card">
      {rows.map(([icon, label, hint, href, o = {}], i) => {
        const text = (
          <>
            <span className={`idx-label ${o.h ? "idx-h" : ""} ${o.it ? "idx-it" : ""}`}>{o.o && <span className="idx-o">o</span>}{label}{hint && !o.h && <i className="idx-hint"> {hint}</i>}</span>
            {hint && o.h && <i className="idx-sub-hint">{hint}</i>}
          </>
        );
        if (o.title) {
          return (
            <h2 key={i} className="idx-title">
              <Icon name={icon} />{href ? <a href={href}>{label}</a> : label}
            </h2>
          );
        }
        const cls = `idx-row ${o.sub ? "idx-indent" : ""} ${o.h ? "idx-row-h" : ""} ${href ? "" : "idx-static"}`;
        return href
          ? <a key={i} href={href} className={cls}><Icon name={icon} img={o.img} /><span className="idx-text">{text}</span></a>
          : <div key={i} className={cls}><Icon name={icon} img={o.img} /><span className="idx-text">{text}</span></div>;
      })}
    </section>
  );
}

export default function InfoIndex() {
  return (
    <InfoShell title="Index" icon="idxMenu">
      <div className="idx-grid">
        <Card rows={PUBLIC} /><Card rows={PERSONAL} />
        <Card rows={HEADER} /><Card rows={INFO} />
        <Card rows={ACTIONS} />
        <div className="idx-col"><Card rows={DASH} /><Card rows={IMAGES} /></div>
      </div>
    </InfoShell>
  );
}
