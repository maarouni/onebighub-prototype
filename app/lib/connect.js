// "Connect with Me !" (Cesar's Figma, Nov 8 Rev 261108): someone scans my QR
// code, signs up, submits their mini-card + how we're related, and we message
// each other. Prototype: everything lives in this browser until the shared
// database exists.
import { readList, writeList, upsert, nowStamp } from "./auth";

export const NETWORK_KEY = "mc_connect_network_v1";   // people I'm connected with
export const MESSAGES_KEY = "mc_connect_messages_v1"; // messages I sent
export const PENDING_KEY = "mc_connect_pending_v1";   // mini-card being submitted

export const PROFESSIONAL = [
  { id: "connection", label: "Connection", def: true },
  { id: "colleague", label: "Colleague" },
  { id: "referral", label: "Referral" },
];
export const PERSONAL = [
  { id: "connection", label: "Connection", def: true },
  { id: "friend", label: "Friend" },
  { id: "family", label: "Family" },
];
export const FOLLOW_UP = [
  { id: "01", label: "01 Cold / None", hint: "Default", def: true },
  { id: "02", label: "02 Mild", hint: "Maybe" },
  { id: "03", label: "03 Medium", hint: "Sometime" },
  { id: "04", label: "04 Warm", hint: "Soon" },
  { id: "05", label: "05 HOT !", hint: "Immediately", hot: true },
];
export const LEVELS = [
  { id: "intro", label: "My Introductions", hint: "Level 1" },
  { id: "1", label: "Level 1" },
  { id: "2", label: "Level 2" },
  { id: "3", label: "Level 3" },
];
// "My Relationships" filter groups on Scan My QR Code.
export const RELATIONSHIP_GROUPS = [
  { group: "Individuals", sub: "Personal", options: [["personal:connection", "Connection"], ["personal:friend", "Friend"], ["personal:family", "Family"]] },
  { group: "Individuals", sub: "Professional", options: [["professional:connection", "Connection"], ["professional:colleague", "Colleague"], ["professional:referral", "Referral"]] },
  { group: "Businesses", options: [["business:connection", "Connection"], ["business:referral", "Referral"]] },
  { group: "Organizations", options: [["org:connection", "Connection"], ["org:referral", "Referral"]] },
  { group: "Groups", options: [["group:connection", "Connection"], ["group:referral", "Referral"]] },
];

export const MESSAGE_TEMPLATES = {
  none: "",
  a: "We recently connected on {date} at {event}. Let's network together ! When are you available to talk or meet online / in-person to discuss how we could possibly collaborate ? I look forward to your response. Thank you !",
  b: "Great meeting you at {event} on {date} ! I'd love to learn more about what you do and see how we can refer business to each other.",
  c: "Thank you for connecting on onebigHUB. Here is my mini-card — feel free to reach out any time.",
};

// Placeholder network (Cesar's Figma uses sample names too) — shown until
// real people join through my QR code.
export const SAMPLE_NETWORK = [
  { id: "s1", name: "Angel Claus", title: "President", business: "NorthPoleTech.com", phone: "1-976-TECHIES", email: "AClaus@NorthPoleTech.com", city: "Xmasville, North Pole", level: "intro", professional: "connection", personal: "friend", followUp: "04", sample: true },
  { id: "s2", name: "Jack Frost", title: "Owner", business: "Jack Frost Heating & Cooling", phone: "1-800-TOO-COOL", email: "jack@jackfrost.com", city: "Xmasville, North Pole", level: "1", professional: "colleague", followUp: "03", sample: true },
  { id: "s3", name: "Holly Berry", title: "Realtor", business: "Berry Homes", city: "Pleasanton, CA", level: "1", professional: "referral", followUp: "05", sample: true },
  { id: "s4", name: "Nick Cole", title: "CPA", business: "Cole & Co.", city: "Dublin, CA", level: "2", professional: "connection", followUp: "02", sample: true },
  { id: "s5", name: "Ivy Green", title: "Designer", business: "Green Studio", city: "Oakland, CA", level: "2", personal: "connection", followUp: "01", sample: true },
  { id: "s6", name: "Rudy Reyes", title: "Lender", business: "Iron Gate Lending", city: "San Ramon, CA", level: "3", professional: "connection", followUp: "01", sample: true },
  { id: "s7", name: "Bay Area Founders", title: "", business: "Group", city: "San Francisco, CA", level: "3", kind: "group", followUp: "01", sample: true },
  { id: "s8", name: "Tri-Valley Chamber", title: "", business: "Organization", city: "Pleasanton, CA", level: "2", kind: "org", followUp: "03", sample: true },
];

export const getNetwork = () => readList(NETWORK_KEY);
export const addToNetwork = (p) => upsert(NETWORK_KEY, { ...p, id: p.id || `n${Date.now()}`, added: nowStamp() });
export const removeFromNetwork = (id) => writeList(NETWORK_KEY, getNetwork().filter((p) => p.id !== id));

export const getMessages = () => readList(MESSAGES_KEY);
export const saveMessage = (m) => upsert(MESSAGES_KEY, { ...m, id: m.id || `m${Date.now()}`, sent: nowStamp() });
export const clearMessages = () => writeList(MESSAGES_KEY, []);

export function fillTemplate(t, { date, event }) {
  return (t || "").replaceAll("{date}", date || "MM/DD/YY").replaceAll("{event}", event || "Event / Location");
}
