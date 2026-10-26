// Event Participation and Barter requests (Cesar's Figma: Advertising/Event
// Participation, Advertising/Barter, Advertising/BarterApproval).
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

export const PARTICIPATION = [
  { id: "expos", title: "Business & Technology Networking Expos, Mixers", roles: ["Venue", "Sponsor", "Exhibitor", "Other"], fields: [] },
  { id: "dinners", title: "Networking Dinners", roles: ["Restaurant / Venue", "Sponsor", "Chocolate / Desserts Tasting", "Wine / Spirits Tasting", "Other"], fields: [["venue", "Restaurant / Venue Name and Description"], ["menu", "3-Course Prix Fixe Menu"]] },
  { id: "workshops", title: "Workshops", roles: ["Venue Conference Room", "Sponsor", "Chocolate / Desserts Tasting", "Wine / Spirits Tasting", "Other"], fields: [["workshop", "Workshop Title and Description"], ["bio", "Workshop Presenter Bio"]] },
];

export const BARTER = [
  { id: "advertising", title: "Barter in Exchange for Advertising / Marketing / Promotions", seeking: ["Premier Listing(s)", "Participation in Events Hosted by onebigHUB + everyCircle"], hint: "Please be specific: ###,### distribution, frequency, etc. We will also consider bartering for event tickets, exhibiting at your events, etc.", fields: [] },
  { id: "expos", title: "Barter in Exchange to Participate in Business & Technology Networking Expos, Mixers", seeking: ["Exhibitor table", "Sponsor", "Staff", "Supplier", "Food and Beverage"], hint: "Please be specific.", fields: [] },
  { id: "dinners", title: "Barter in Exchange to Participate in Networking Dinners", seeking: ["Restaurant / Venue", "Sponsor", "Chocolate / Desserts Tasting", "Wine / Spirits Tasting"], hint: "Please be specific.", fields: [["venue", "Restaurant / Venue Name and Description"], ["menu", "3-Course Prix Fixe Menu"]] },
  { id: "workshops", title: "Barter in Exchange to Participate in Workshops", seeking: ["Venue Conference Room", "Sponsor", "Presenter"], hint: "Please be specific.", fields: [["workshop", "Workshop Title and Description"], ["bio", "Workshop Presenter Bio"]] },
];

export const EXHIBITOR_INSTRUCTIONS = [
  "These are YOUR EVENTS! Please promote them to your clients, customers, colleagues and friends — Connect • Pay-It-Forward • Invite Others.",
  "Arrive no later than 4:45pm to set up your exhibitor table and network with other participants.",
  "Bring your marketing collateral: banner, business cards, electrical cords, candies, giveaways.",
];
