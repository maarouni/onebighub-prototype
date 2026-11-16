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

export const PARTICIPATION = [
  { id: "expos", n: "2a", icon: "expo", title: "Participate in Business & Technology Networking Expos, Mixers",
    roles: ["Venue", "Sponsor", "Exhibitor", "Other"], fields: [] },
  { id: "dinners", n: "2b", icon: "dinner", title: "Participate in Networking Dinners",
    roles: ["Restaurant / Venue", ...TASTINGS], fields: [["venue", "Restaurant / Venue Name and Description"], ["menu", "3-Course Prix Fixe Menu"]] },
  { id: "workshops", n: "2c", icon: "workshop", title: "Participate in Workshops",
    roles: [["Venue", "Conference Room"], ...TASTINGS], fields: [["workshop", "Workshop", "Title and Description"], ["bio", "Workshop Presenter", "Bio"]] },
];

export const SEEKING = ["Premier Listing(s)", ["Participation in Event(s)", "Hosted by onebigHUB"]];
const CONSIDER = "We will also consider bartering for event tickets, exhibiting at your events, etc.";

export const BARTER = [
  { id: "advertising", n: "2a", icon: "megaphone", title: "Barter in Exchange for Advertising / Marketing / Promotions",
    offerHint: <>Please be specific: ###,### Distribution, Frequency, etc.<br />{CONSIDER}</>, offerText: true,
    groups: [{ options: [
      "Distribution of Email / Text Newsletters", ["Distribution of Marketing Collateral", "Flyers, Posters, …"], ["Marketing", "Swag"],
      ["Media", "Magazine"], ["Media", "Newspaper"], ["Media", "Podcast"], ["Media", "Radio"], ["Media", "Social Media"],
      ["Hugs and Kisses", "Truly appreciated, but they don't always pay the bills !"],
    ] }], fields: [] },
  { id: "expos", n: "2b", icon: "expo", title: "Barter in Exchange to Participate in Biz & Tech Networking Mixers, Expos",
    offerHint: <>Please be specific.<br />{CONSIDER}</>, offerText: true,
    groups: [
      { title: "Staff", options: [["Ambassador", "Sign up people to our apps"], "Registration"] },
      { title: "Supplier", options: ["Venue", "Audio / Visual Equipment", ["Furniture", "Cocktail and Exhibitor Tables, Stanchions, etc."], "Decorations", ["Disposable Tableware", "forks, knives, spoons, napkins, plates, glassware, etc."], "Table Linens"] },
      { title: "Food and Beverage", options: ["Catering", "Chocolates", "Desserts", "Wine / Spirits Bar", "Wine / Spirits Tasting"] },
      { title: "Entertainment", options: ["Auction", "Art Show", "DJ", "Fashion Show", "Live Music", "Media Show", "Performance", ["Non-Profit", "Wedge Drawing / Raffle"]] },
      { title: "Media", options: ["Photography", "Videography"] },
      { title: "Services", options: [["Crew", "Bussers, Janitorial"], ["Crew", "Setting Up / Tearing Down"], "Security", "Valet Parking"] },
    ], fields: [] },
  { id: "dinners", n: "2c", icon: "dinner", title: "Barter in Exchange to Participate in Networking Dinners", upload: true,
    offerHint: "Please be specific", groups: [{ options: ["Restaurant / Venue", ...TASTINGS] }],
    fields: [["venue", "Restaurant / Venue Name and Description"], ["menu", "3-Course Prix Fixe Menu"]] },
  { id: "workshops", n: "2d", icon: "workshop", title: "Barter in Exchange to Participate in Workshops", upload: true,
    offerHint: "Please be specific", groups: [{ options: [["Venue", "Conference Room"], ...TASTINGS] }],
    fields: [["workshop", "Workshop", "Title and Description"], ["bio", "Workshop Presenter", "Bio"]] },
];

// "Exhibitors and Participants" box under 2b (Cesar's text).
export const EXHIBITORS_INFO = [
  { p: [<><b className="cw-red">These are YOUR EVENTS !</b> Please PROMOTE them to your clients, customers, colleagues and friends.</>,
    "Arrive no later than 4:45pm to set up your exhibitor table, and network with other participants.",
    "Please bring your marketing collateral: banner, business cards, electrical cords, candies, giveaways, name badges, a basket to collect business cards, etc.",
    "We encourage you to also bring gift certificates and/or prizes for the drawing. Our drawing will either be free OR we will invite a non-profit organization to sell tickets.",
    "This is an upscale event – You will be much more approachable when you stand in front of your table, instead of 'hiding' behind it, unless you are serving food and drinks."] },
  { h: "Exhibitors and Sponsors", p: [<>Please contact Cesar Plata to discuss a <b className="cw-red">WIN-WIN PACKAGE DEAL</b>, including Premier Listing(s) and more.</>,
    "Our rates vary depending on the event date, location, and anticipated attendance."] },
  { h: "Sponsors", p: ["A brief public introduction during the event, list of attendees, and a custom Effective Networking Workshop for your clients and colleagues."] },
  { h: <>Participants <i>Food &amp; Beverage, Entertainment, Media</i></>, p: [<b className="cw-red">No Cost to Participate</b>,
    "We will display your mini-card / logo on the event page.", "We will provide you with a table linen, cocktail / high top OR 6 ft exhibitor table."] },
  { h: "Food & Beverage", p: ["We usually invite multiple caterers to provide quantity and variety.", "Please bring a copy of your catering permit and MINI appetizers, plates, utensils, etc."] },
  { h: "Entertainment", p: ["We usually invite multiple entertainers to provide variety and opportunities to network and take breaks."] },
  { h: <>Media <i>Photographers, Podcasters, Videographers, …</i></>, p: ["Draw traffic to your business ! Post event pictures / video on your website."] },
];
