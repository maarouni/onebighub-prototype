// Event Participation and Barter requests (Cesar's Figma, Promote & Earn,
// Nov 16): Event Participation, Barter, Barter Approval.
// Prototype: stored in this browser until the shared database exists.
import { readList, upsert, nowStamp } from "./auth";
import { fetchEvents } from "./events";

export const REQ_KEY = "mc_ad_requests_v1";
export const listRequests = () => readList(REQ_KEY);
export const saveRequest = (r) => upsert(REQ_KEY, r);
export const newRequest = (kind, data) => saveRequest({ id: `req-${Date.now()}`, kind, submitted: nowStamp(), status: "pending", ...data });

// Events people can participate in / barter for: the ones onebigHUB and
// everyCircle host (expos, dinners, workshops).
export async function fetchHostedEvents() {
  const all = await fetchEvents();
  return all.filter((e) => /onebighub|everycircle/i.test(e.hostedBy || ""));
}

// Options are "Label" or ["Label", "italic hint"].
const TASTINGS = ["Sponsor", "Chocolate / Desserts Tasting", "Wine / Spirits Tasting", "Other"];
const HUB = <>onebig<span className="cw-red">HUB</span></>;

export const SEEKING = ["Premier Listing(s)", ["Participation in Event(s)", "Hosted by onebigHUB"]];
const CONSIDER = "We will also consider bartering for event tickets, exhibiting at your events, etc.";

// Rates page: "Barter in Exchange for Advertising / Marketing / Promotions".
export const BARTER_AD = { id: "advertising", n: null, icon: "megaphone", barter: true, offerText: true,
  title: "Barter in Exchange for Advertising / Marketing / Promotions",
  offerHint: <>Please be specific: ###,### Distribution, Frequency, etc.<br />{CONSIDER}</>,
  groups: [{ options: [
    "Distribution of Email / Text Newsletters", ["Distribution of Marketing Collateral", "Flyers, Posters, …"], ["Marketing", "Swag"],
    ["Media", "Magazine"], ["Media", "Newspaper"], ["Media", "Podcast"], ["Media", "Radio"], ["Media", "Social Media"],
    ["Hugs and Kisses", "Truly appreciated, but they don't always pay the bills !"],
  ] }], fields: [] };

const PROMOTE = { b: <>Connect • Pay-It-Forward • Invite Others</>,
  t: <><b>Please promote the event as: <i>Your Biz</i> and {HUB} cordially invite you …</b><br />Let&rsquo;s collaborate - take ownership of the event. <b><i>This is YOUR event too !</i></b></> };
const LOGO = <>We will display your logo on the event page, linking to your profile in <b>{HUB}</b> or your website</>;
const EXPO_ABOUT = (extra) => ({ h: <>About • Instructions</>, li: [
  <>Expo Typical Attendance 200 - 800+<br />5-Star Hospitality • Upscale Ambiance • Caterers • Exhibitors • Music • Prizes</>,
  <><b>{PROMOTE.b}</b><br />{PROMOTE.t}</>,
  <><b>Arrive no later than 4:45pm</b> to set up your exhibitor table, and network with other participants{extra ? <><br />We will provide you with a table linen, cocktail / high-top OR 6-8 ft exhibitor table</> : null}</>,
  "Bring your banner, business cards, candies, electrical cords, giveaways, marketing collateral, name badges, a basket to collect business cards, etc.",
  "Bring prizes for the drawing (free OR tickets sold for a participating non-profit)",
  <><b>This is an upscale event</b> - You will be much more approachable when you stand in front of your table, instead of &lsquo;hiding&rsquo; behind it, unless you are serving food or drinks</>,
  LOGO,
  ...(extra ? [] : [<>Discounts available for participating in multiple events<br />Our rates may vary depending on the event date, location, and anticipated attendance</>]),
] });

// Event Participation — one page for participating and bartering (Nov 16, 7:52 AM).
export const PART_SECTIONS = [
  { id: "expos", n: "2a", icon: "expo", title: <>Participate in {HUB} Biz &amp; Tech Networking Expos</>, plain: "Participate in onebigHUB Biz & Tech Networking Expos",
    info: [
      { h: "Exhibitor", li: ["Option A: Includes 6 ft or 8 ft table with linen", "Option B: Includes round cocktail table with linen"] },
      { h: "Sponsor", li: ["List of all attendees", "6 ft or 8 ft table with linen", "30 second introduction during very brief presentation at event",
        <>Weekly <b>{HUB}</b> Notification:<br />Event sponsored by &lsquo;Your Biz / Org&rsquo; in Expo listing<br />Premier Event listing includes your logo</>,
        "Deals - Discount / Gift Certificates for 3 months", <>Be a presenter at a monthly <b>{HUB}</b> Workshop</>,
        "Custom Effective Networking Workshop (1-3 hours at your location) presented by Cesar Plata"] },
      EXPO_ABOUT(false),
    ],
    selectHint: "Select all that apply",
    groups: [{ options: [["Exhibitor", "Option A: Includes 6 ft or 8 ft table with linen"], ["Exhibitor", "Option B: Includes round cocktail table with linen"], "Sponsor"] }], fields: [] },
  { id: "exposBarter", n: "2b", icon: "expo", barter: true, offerText: true, title: <>Barter to Participate in {HUB} Biz &amp; Tech Networking Expos</>, plain: "Barter to Participate in onebigHUB Biz & Tech Networking Expos",
    info: [
      { h: "Food & Beverage", li: [<>We usually invite multiple caterers to provide quantity and variety<br />Please bring a copy of your catering permit and MINI appetizers, plates, utensils, etc.</>] },
      { h: "Entertainment", li: ["We usually invite several entertainers to provide variety and opportunities to network / take breaks"] },
      { h: <>Media <i>Photographers, Podcasters, Reporters, Videographers, …</i></>, li: ["Draw traffic to your business ! Post event pictures / video on your website"] },
      EXPO_ABOUT(true),
    ],
    offerHint: <>Please be specific<br />{CONSIDER}</>,
    groups: [
      { title: "Staff", options: [["Ambassador", "Sign up people to our apps"], "Registration"] },
      { title: "Supplier", options: ["Venue", "Audio / Visual Equipment", ["Furniture", "Cocktail and Exhibitor Tables, Stanchions, etc."], "Decorations", ["Disposable Tableware", "forks, knives, spoons, napkins, plates, glassware, etc."], "Table Linens"] },
      { title: "Food and Beverage", note: <>Includes 6 ft or 8 ft table with linen<br />Bring LOTS of appetizers. Note: We usually invite multiple caterers.</>, options: ["Catering", "Chocolates", "Desserts", "Wine / Spirits Bar", "Wine / Spirits Tasting"] },
      { title: "Entertainment", note: "Includes round cocktail table with linen", options: ["Auction", "Art Show", "DJ", "Fashion Show", "Live Music", "Media Show", "Performance", ["Non-Profit", "Wedge Drawing / Raffle"]] },
      { title: "Media", options: ["Photography", "Videography"] },
      { title: "Services", options: [["Crew", "Bussers, Janitorial"], ["Crew", "Setting Up / Tearing Down"], "Security", "Valet Parking"] },
    ], fields: [] },
  { id: "dinners", n: 3, icon: "dinner", barter: true, title: <>Participate in {HUB} Networking Dinners</>, plain: "Participate in onebigHUB Networking Dinners",
    info: [{ h: "Restaurant Owner", li: ["Showcase your cuisine, promote your restaurant, and earn money",
      <><b>{PROMOTE.b}</b><br />5-Star Hospitality • 3-Course Prix Fixe Dinner • Upscale Ambiance • Prizes</>] }],
    offerHint: "Please be specific", groups: [{ options: ["Restaurant / Venue", ...TASTINGS] }],
    fields: [["venue", "Restaurant / Venue Name and Description"], ["menu", "3-Course Prix Fixe Menu"]] },
  { id: "workshops", n: 4, icon: "workshop", barter: true, title: <>Participate in {HUB} Workshops</>, plain: "Participate in onebigHUB Workshops",
    info: [{ h: "Workshop Presenter", li: [<>Workshop Typical Attendance 10 - 40+<br />5-Star Hospitality • Upscale Ambiance • Prizes</>,
      "Subject to approval and availability", <><b>{PROMOTE.b}</b><br />{PROMOTE.t}</>,
      <>Bring prizes for the drawing. Sell your books.<br />Bring your banner, books, candies, giveaways, marketing collateral, etc.</>, LOGO] }],
    offerHint: "Please be specific", groups: [{ options: [["Venue", "Conference Room"], ...TASTINGS] }],
    fields: [["workshop", "Workshop", "Title and Description"], ["bio", "Workshop Presenter", "Bio"]] },
];

// Private-Labeled Header page: "Barter in Exchange for My Private-Labeled Header".
export const BARTER_PL = { id: "privateLabel", n: null, icon: "idxPrivateLabel", barter: true,
  title: "Barter in Exchange for My Private-Labeled Header", groups: [],
  fields: [["name", "URL, Name of Business, Organization or Group"], ["tagline", "Tagline"]] };

// Everything Barter Approval can show.
export const ALL_SECTIONS = [BARTER_AD, BARTER_PL, ...PART_SECTIONS];
