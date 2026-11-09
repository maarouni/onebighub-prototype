// RSVP Order Tickets (Cesar's Figma Rev 261108). The host sets the tickets up
// on "EDIT RSVP Order Tickets"; attendees order on "RSVP Order Tickets".
// Prototype: settings and the shopping cart live in this browser.

export const RSVP_KEY = "mc_rsvp_setup_v1";  // { [eventId]: setup }
export const CART_KEY = "mc_cart_v1";        // shopping cart lines
export const TICKET_FEE = 0.75;              // per ticket, included in $ Each
export const CC_FEE_PCT = 2.9;               // credit-card fee, % of ticket cost
export const MAX_QUESTIONS = 10;

export const RECIPIENT_FIELDS = ["First Name", "Last Name", "Email", "Mobile", "City", "State", "ZIP Code", "Country"];
export const BUYER_FIELDS = ["Email", "Mobile", "City", "State", "ZIP Code", "Country"];

const plusDays = (d, n) => { const x = new Date(`${d}T12:00:00`); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

// Sensible starting setup made from the event itself, until the host edits it.
export function defaultSetup(event) {
  const p = Number(event?.price) || 0;
  const start = event?.date || new Date().toISOString().slice(0, 10);
  const tickets = p > 0
    ? [
        { id: "t1", type: "Early Bird", mode: "include", price: Math.round(p * 0.8 * 100) / 100, inventory: 50, expires: plusDays(start, -14), comments: "" },
        { id: "t2", type: "Regular", mode: "include", price: p, inventory: 150, expires: start, comments: "" },
        { id: "t3", type: "Door", mode: "add", price: Math.round(p * 1.25 * 100) / 100, inventory: 40, expires: start, comments: "Pay at the door with the QR code on your ticket." },
      ]
    : [{ id: "t1", type: "Free RSVP", mode: "free", price: 0, inventory: 200, expires: start, comments: "" }];
  return {
    externalUrl: event?.rsvpUrl || "",
    tickets,
    discounts: p > 0 ? [{ id: "d1", code: "HUB10", pct: 10, from: plusDays(start, -60), to: start, comments: "10 % off for onebigHUB members" }] : [],
    recipientNA: false,
    recipientFields: ["First Name", "Last Name", "Email"],
    questions: [
      { id: "q1", text: "Any dietary restrictions or accessibility needs ?", format: "A", choices: [] },
      { id: "q2", text: "How did you hear about this event ?", format: "B", choices: ["onebigHUB", "A friend / colleague", "Social media", "Other"] },
    ],
    buyerFields: ["Email", "Mobile", "City", "State"],
    seller: { first: "", last: "", email: "", mobile: "", city: "", state: "", zip: "", country: "" },
    maxPerPerson: 10,
    note: "",
  };
}

function readAll(key) { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; } }

export function getSetup(event) {
  const saved = readAll(RSVP_KEY)[event?.id];
  return saved ? { ...defaultSetup(event), ...saved } : defaultSetup(event);
}
export function saveSetup(id, setup) {
  const all = readAll(RSVP_KEY); all[id] = setup;
  try { localStorage.setItem(RSVP_KEY, JSON.stringify(all)); } catch {}
}
export function resetSetup(id) {
  const all = readAll(RSVP_KEY); delete all[id];
  try { localStorage.setItem(RSVP_KEY, JSON.stringify(all)); } catch {}
}

// $ Each the buyer pays: "include" already has the fee inside, "add" adds it.
export const eachPrice = (t) => (t.mode === "free" ? 0 : t.mode === "add" ? Number(t.price) + TICKET_FEE : Number(t.price));
export const ccFee = (each) => Math.round(each * CC_FEE_PCT) / 100;
export const money = (n) => `$${(Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function costRange(setup) {
  const xs = setup.tickets.map(eachPrice);
  if (!xs.length) return "—";
  const lo = Math.min(...xs), hi = Math.max(...xs);
  return lo === hi ? money(lo) : `${money(lo)} - ${money(hi)}`;
}

export function findDiscount(setup, code, today = new Date().toISOString().slice(0, 10)) {
  const d = setup.discounts.find((x) => x.code && x.code.trim().toUpperCase() === code.trim().toUpperCase());
  if (!d) return null;
  if ((d.from && today < d.from) || (d.to && today > d.to)) return null;
  return d;
}

export function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
export function addToCart(lines) {
  const cart = [...getCart(), ...lines];
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  return cart;
}
export function setCart(cart) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} }
