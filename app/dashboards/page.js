"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHero from "../components/SiteHero";
import { SectionBar } from "../components/ConnectKit";
import { Glyph } from "../components/Icons";
import { getCart, setCart, money } from "../lib/rsvp";
import { localEvents } from "../lib/events";
import { getUser } from "../lib/auth";
import { getMessages } from "../lib/connect";

// "My Dashboards" (Cesar's Figma Rev 261108) — one list, My Shopping Cart open
// by default. Prototype: the cart and orders live in this browser; payments,
// receipts and revenue need the database + a payment provider.
const ORDERS_KEY = "mc_orders_v1";
const readOrders = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; } };
const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : "—");

function Empty({ children }) { return <p className="cw-muted dash-empty">{children}</p>; }

export default function DashboardsPage() {
  const [cart, setC] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mine, setMine] = useState([]);
  const [user, setU] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [paid, setPaid] = useState("");
  const [open, setOpen] = useState("cart");

  useEffect(() => {
    setC(getCart()); setOrders(readOrders()); setMine(localEvents()); setU(getUser()); setMsgs(getMessages());
    const o = new URLSearchParams(window.location.search).get("open");
    if (o) setOpen(o);
  }, []);

  const total = cart.reduce((n, l) => n + (Number(l.subtotal) || 0), 0);
  const spent = orders.reduce((n, o) => n + (Number(o.total) || 0), 0);
  const tickets = useMemo(() => orders.flatMap((o) => o.lines.filter((l) => l.kind === "ticket")), [orders]);

  function remove(id) { const c = cart.filter((l) => l.id !== id); setC(c); setCart(c); }
  function checkout() {
    if (!cart.length) return;
    const order = { id: `R${Date.now().toString().slice(-8)}`, at: new Date().toISOString(), lines: cart, total };
    const all = [order, ...orders];
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(all)); } catch {}
    setOrders(all); setC([]); setCart([]);
    setPaid(`Demo payment recorded — receipt ${order.id}. No card was charged.`);
    setOpen("receipts");
  }

  const S = ({ id, n, icon, title, hint, children }) => (
    <SectionBar key={`${id}-${open === id}`} n={n} icon={icon} title={title} hint={hint} defaultOpen={open === id}>{children}</SectionBar>
  );

  return (
    <div className="page dash-page">
      <SiteHero section={null} title="My Dashboards" icon="dashboards" />
      <div className="cw-page dash-list">
        {S({ id: "cart", n: 1, icon: "cart", title: "My Shopping Cart", hint: "Default", children: (
          <>
            {cart.length === 0 ? <Empty>Your cart is empty. Order tickets from any event&rsquo;s <b>RSVP Order Tickets</b> link, or submit a Premier listing.</Empty> : (
              <table className="rsvp-table rsvp-checkout">
                <thead><tr><th>Item</th><th>Event Date</th><th>Qty</th><th>$ Each</th><th>$ Subtotal</th><th /></tr></thead>
                <tbody>{cart.map((l) => (
                  <tr key={l.id}>
                    <td><a href={`/event/${l.eventId}`}>{l.eventTitle}</a><span className="rsvp-sub">{l.ticket}{l.promo ? ` · promo ${l.promo}` : ""}</span></td>
                    <td className="cw-red">{l.date ? new Date(`${l.date}T12:00:00`).toLocaleDateString("en-US") : "—"}</td>
                    <td className="cw-red">{l.qty}</td><td className="cw-red">{money(l.each)}</td><td className="cw-red">{money(l.subtotal)}</td>
                    <td><button type="button" className="rsvp-x" aria-label="Remove from cart" onClick={() => remove(l.id)}><Glyph name="delete" size={14} /></button></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
            {cart.length > 0 && (
              <div className="dash-cart-foot">
                <span className="rsvp-total"><b>$ Total</b><span className="cw-red">{money(total)}</span></span>
                <button type="button" className="cw-submit" onClick={checkout}>Checkout (demo)</button>
              </div>
            )}
            {paid && <p className="nt-hint">{paid}</p>}
          </>
        ) })}

        {S({ id: "account", n: 2, icon: "miniCard", title: "My Account", hint: "Wallet • Submit Payment • Expenses • Revenue", children: (
          <div className="dash-acct">
            <div className="dash-stat"><b>{money(0)}</b><span>Wallet balance</span></div>
            <div className="dash-stat"><b>{money(spent)}</b><span>Expenses</span></div>
            <div className="dash-stat"><b>{money(0)}</b><span>Revenue (10 % referral share)</span></div>
            <div className="dash-stat"><button type="button" className="cw-submit" onClick={() => setOpen("cart")} disabled={!cart.length}>Submit Payment</button><span>{cart.length ? `${money(total)} in cart` : "Nothing due"}</span></div>
            <p className="proto-note">Wallet and payouts arrive with the payment provider (Stripe Connect).</p>
          </div>
        ) })}

        {S({ id: "receipts", n: 3, icon: "pdf", title: "My Receipts", children: (
          orders.length === 0 ? <Empty>No receipts yet.</Empty> : (
            <ul className="dash-rows">{orders.map((o) => (
              <li key={o.id}><b>{o.id}</b> <span className="cw-muted">{fmt(o.at)}</span> — {o.lines.length} item(s) <span className="cw-red">{money(o.total)}</span>
                <button type="button" className="clear-filters-link" onClick={() => window.print()}>Print</button></li>
            ))}</ul>
          )
        ) })}

        {S({ id: "transactions", n: 4, icon: "calculate", title: "My Transactions", children: (
          orders.length === 0 ? <Empty>No transactions yet.</Empty> : (
            <ul className="dash-rows">{orders.flatMap((o) => o.lines.map((l) => (
              <li key={l.id}><span className="cw-muted">{fmt(o.at)}</span> {l.eventTitle} — {l.ticket} × {l.qty} <span className="cw-red">{money(l.subtotal)}</span></li>
            )))}</ul>
          )
        ) })}

        {S({ id: "referrals", n: 5, icon: "connections", title: "My Transactions", hint: "Introductions / Referrals", children: (
          <Empty>Referral payouts show here — 10 % of sales revenue shared up to 3 levels. <a href="/refer">How it works</a> · <a href="/connect">Invite with my QR code</a></Empty>
        ) })}

        {S({ id: "attendees", n: 6, icon: "ticket", title: "My Events", hint: "List of Attendees", children: (
          mine.length === 0 ? <Empty>You haven&rsquo;t submitted any events yet. <a href="/submit">EDIT My Events</a></Empty> : (
            <ul className="dash-rows">{mine.map((e) => {
              const n = tickets.filter((t) => t.eventId === e.id).reduce((a, t) => a + t.qty, 0);
              return <li key={e.id}><a href={`/event/${e.id}`}>{e.title}</a> <span className="cw-muted">{e.date}</span> — <b>{n}</b> attendee(s) <a href={`/event/${e.id}/rsvp/edit`} className="clear-filters-link">EDIT RSVP Order Tickets</a></li>;
            })}</ul>
          )
        ) })}

        {S({ id: "participants", n: 7, icon: "connections", title: "My Events", hint: "Participants", children: (
          <Empty>Co-hosts, partners and sponsors you allow to promote your events (EDIT My Events → Allow Others to Promote) show here with their ticket sales.</Empty>
        ) })}

        {S({ id: "collateral", n: 8, icon: "qr", title: "My Custom Marketing Collateral", children: (
          <Empty>Your QR code, flyers and email templates. <a href="/connect">My QR Code</a>{mine[0] && <> · <a href={`/event/${mine[0].id}/flyer`}>Flyer for {mine[0].title}</a></>}</Empty>
        ) })}

        {S({ id: "messages", n: 9, icon: "comments", title: "My Messages", children: (
          msgs.length === 0 ? <Empty>No messages yet. Send one from <a href="/connect/messages">Connect with Me ! → Messages</a>.</Empty> : (
            <ul className="dash-rows">{msgs.map((m) => (
              <li key={m.id}><span className="cw-muted">{m.sent ? String(m.sent).slice(0, 16).replace("T", " ") : ""}</span> <b>{m.to?.name || "—"}</b> {String(m.text || "").slice(0, 90)}</li>
            ))}</ul>
          )
        ) })}

        {S({ id: "settings", n: 10, icon: "settings", title: "Settings", children: (
          <div className="dash-rows">
            <p>{user ? <>Logged in as <b>{user.name}</b>. <a href="/registration/logout">Log Out</a></> : <><a href="/registration">Sign Up / Log In</a></>}</p>
            <p><a href="/profile">EDIT My Profiles</a> · <a href="/info/legal#delete-account">Delete Account</a> · <a href="/info">Terms, Privacy &amp; Child Safety</a></p>
          </div>
        ) })}
      </div>
    </div>
  );
}
