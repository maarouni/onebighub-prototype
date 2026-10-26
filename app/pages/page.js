import PageTemplate from "../components/PageTemplate";

// Every page from the Oct 8 skeleton, each linked to its working version.
const GROUPS = [
  ["Entry", [
    ["Home", "/", "Welcome box, four sections, One Big Calendar"],
    ["Sign Up", "/login?mode=signup", "Create an account"],
    ["Log In", "/login?mode=login", "Welcome back"],
  ]],
  ["Calendar", [
    ["One Big Calendar", "/#results", "Filters, county map, all events"],
    ["My Calendar Digest", "/my-calendar", "Your selected events + attendance status"],
    ["Event Details", "/event/15", "Example event: map, QR, tickets"],
    ["Edit / Submit Event", "/submit", "Create Event form, Regular or Premier"],
  ]],
  ["Commerce", [
    ["Tickets / RSVP", "/event/15#tickets", "RSVP / Order Tickets into My Calendar", "Payment on hold"],
  ]],
  ["Modules", [
    ["Notifications", "/notifications", "Browse and subscribe"],
    ["My Notifications", "/notifications?tab=mine", "Your subscriptions"],
    ["Discount / Gift Certificates", "/discounts", "Browse, filter, post a certificate"],
    ["Connections", "/connections", "Digest, filters, My Membership Status"],
    ["Connections Details", "/connections/o1", "Example org: WHY, BENEFITS, QR code"],
    ["Organization Members", "/connections/o1/members", "Leadership, Staff, Members mini-cards"],
    ["EDIT My Connections Details", "/connections/submit", "Add or edit a connection"],
    ["Products, Services, Memberships", "/listings", "Browse, filter, post a listing (Oct 26)"],
    ["Listing Details", "/listings/p1", "Example membership: description, referrals, QR code"],
    ["EDIT My Other Listings", "/listings/submit", "Post a product, service or membership"],
    ["3-Way Introductions — Identify", "/referrals", "A Connector picks B Vendor and C Potential Client (Oct 26)"],
    ["3-Way Introductions — Message", "/referrals/message", "Introduction email from the Connector"],
    ["3-Way Introductions — Status", "/referrals/status", "8-step status timeline, transaction status"],
    ["3-Way Introductions — Evaluations", "/referrals/evaluations", "AV, CV and A–H ratings, product / service averages"],
    ["Registration", "/registration", "Sign Up / Log In / Log Out chooser"],
    ["Registration — Sign Up", "/registration/signup", "Name, email or mobile, username, password rules"],
    ["Registration — Log In", "/registration/login", "Email or mobile + password, Next Step mini-card"],
    ["Registration — Log Out", "/registration/logout", "Sooo ... you want to leave us ?"],
    ["My Profile", "/profile", "Mini-card, elevator pitch, links, gallery (5), QR, 3-level graph"],
    ["Event Participation", "/advertising/participation", "Expos / dinners / workshops participation request"],
    ["Barter", "/advertising/barter", "Barter for advertising or event participation"],
    ["Barter Approval (admin)", "/advertising/barter-approval", "Accept / decline barter requests"],
    ["Employment Listings", "/employment", "Browse, filter, post a job"],
    ["Earn with Advertising", "/advertising", "Hub for the advertising pages"],
    ["Calculate Advertising Cost", "/advertising/calculate", "Views vs. clicks, side by side"],
    ["Rates – onebigHUB Listings", "/advertising/listings", "Regular / Premier listing rates"],
    ["Rates – Networking Expos", "/advertising/expos", "Tickets, exhibitors, sponsors"],
    ["Rates – Dinners & Networking", "/advertising/dinners", "Tickets, restaurant hosts"],
    ["Rates – Workshops", "/advertising/workshops", "Tickets, presenters"],
    ["Earn / Invite & Refer", "/refer", "Your QR code + 5/3/2% revenue share"],
  ]],
  ["Account", [
    ["Dashboard", "/dashboards", "Referrals, digests, listings"],
  ]],
];

export const metadata = { title: "All Pages — onebigHUB (Prototype)" };

export default function AllPages() {
  return (
    <PageTemplate
      section={null}
      title="All Pages"
      subtitle="Every page from the skeleton — each one opens the working page"
      legend={false}
      actions={<a href="/skeleton.html" className="tpl-action">Original skeleton</a>}
    >
      <div className="pages-grid">
        {GROUPS.map(([g, items]) => (
          <section key={g} className="pages-group">
            <h4>{g}</h4>
            {items.map(([name, href, desc, hold]) => (
              <a key={name} href={href} className="pages-item">
                <span className="pages-name">{name}{hold && <em className="pages-hold">{hold}</em>}</span>
                <span className="pages-desc">{desc}</span>
                <span className="pages-go" aria-hidden="true">→</span>
              </a>
            ))}
          </section>
        ))}
      </div>
    </PageTemplate>
  );
}
