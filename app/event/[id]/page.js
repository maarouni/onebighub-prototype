"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { slugify } from "../../lib/slug";
import { eventCategories, ATTENDANCE_STATUSES, REGION_GROUPS } from "../../lib/taxonomy";
import { fetchEvents } from "../../lib/events";
import { fmtTime, fmtDateRange, isoOf } from "../../components/EventVisuals";
import { cityCode } from "../../lib/cityCodes";
import { Glyph } from "../../components/Icons";
import SiteHero from "../../components/SiteHero";
import { Poster } from "../../components/EventVisuals";
import { ListingTable } from "../../components/ListingTable";
import HubLogo from "../../components/HubLogo";
import { MiniCardView } from "../../components/PromoKit";

// Event Details — redesigned per Cesar's Figma Rev 261117 (see the render
// below). Earlier layout notes (Nov 5 rev):
//   site hero (One Big Calendar tile stays gold)
//   listing box: the event's row as it shows in One Big Calendar, (<) (>)
//     step through listings, "### of ###"
//   gray "Event Details" sub-header with (+) ADD and pencil EDIT
//   Image or Poster (height can vary)
//   left: title, dates, time, one-line description, location, then the
//         Hosted by / Selection / Referral / Format / Type / Cost / Region /
//         Category(ies) / Description list
//   right: Thumbnail icon / image / logo · QR code (created automatically) +
//          Copy Link · Google Map · RSVPs

const STORAGE_KEY = "mc_my_calendar_v1";
const STATUS_KEY = "mc_attendance_status_v2";
const LIKES_KEY = "mc_event_likes_v1";
const COMMENTS_KEY = "mc_event_comments_v1";
const FOLLOW_KEY = "mc_event_follow_host_v1";
const fmtStamp = (iso) => { if (!iso) return "—"; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }); };

function chrono(a, b) {
  return `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`);
}

function rowImage(e) {
  const cats = [...(e.categories || []), e.category].join(" ").toLowerCase();
  if (cats.includes("dinner")) return "dinner";
  if (cats.includes("workshop") || cats.includes("seminar")) return "workshop";
  return "expo";
}

const firstSentence = (t) => (String(t || "").match(/^.*?[.!?](\s|$)/) || [t || ""])[0].trim();

export default function EventDetail() {
  const { id } = useParams();
  const [events, setEvents] = useState(null);
  const [saved, setSaved] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [flash, setFlash] = useState("");
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [follow, setFollow] = useState("none");
  const [gi, setGi] = useState(0);
  const [rp, setRp] = useState(0);
  const todayIso = useMemo(() => isoOf(new Date()), []);

  useEffect(() => {
    fetchEvents().then(setEvents);
    try { setSaved(!!JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")[id]); } catch {}
    try { setLiked(!!JSON.parse(localStorage.getItem(LIKES_KEY) || "{}")[id]); } catch {}
    try { setComments(JSON.parse(localStorage.getItem(COMMENTS_KEY) || "{}")[id] || []); } catch {}
    try { setFollow(JSON.parse(localStorage.getItem(FOLLOW_KEY) || "{}")[id] || "none"); } catch {}
  }, [id]);

  function store(key, val) {
    try { const all = JSON.parse(localStorage.getItem(key) || "{}"); all[id] = val; localStorage.setItem(key, JSON.stringify(all)); } catch {}
  }
  function toggleLike() { setLiked((v) => { store(LIKES_KEY, !v); return !v; }); }
  function addComment(e) {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    const list = [...comments, { t, at: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) }];
    setComments(list); store(COMMENTS_KEY, list); setDraft("");
  }
  function pickFollow(v) { setFollow(v); store(FOLLOW_KEY, v); }
  async function share() {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: event?.title, url }); return; } catch { return; } }
    copyLink();
  }

  useEffect(() => {
    const url = `${window.location.origin}/event/${id}`;
    QRCode.toDataURL(url, { width: 280, margin: 1 }).then(setQrDataUrl).catch(() => setQrDataUrl(null));
  }, [id]);

  const event = events ? events.find((e) => e.id === id) || null : undefined;

  // (<) (>) step through upcoming listings in One Big Calendar order (this
  // event included even if it has passed).
  const ring = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => (e.endDate || e.date) >= todayIso || e.id === id).sort(chrono);
  }, [events, todayIso, id]);
  const pos = ring.findIndex((e) => e.id === id);

  function toggleSaved() {
    try {
      const sel = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      sel[id] = !sel[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
      setSaved(!!sel[id]);
    } catch {}
  }

  function copyLink() {
    const url = window.location.href;
    (navigator.clipboard?.writeText(url) || Promise.reject())
      .then(() => setFlash("Link copied"))
      .catch(() => setFlash(url))
      .finally(() => setTimeout(() => setFlash(""), 2000));
  }

  if (event === undefined) return <div className="page"><p>Loading…</p></div>;
  if (event === null) {
    return (
      <div className="page">
        <div className="empty-state">Couldn&apos;t find that event. <a href="/">Back to One Big Calendar</a></div>
      </div>
    );
  }

  const prev = pos > 0 ? ring[pos - 1] : null;
  const next = pos >= 0 && pos < ring.length - 1 ? ring[pos + 1] : null;
  const online = event.type === "Online";
  const mapQuery = [event.venue, event.address, event.city, event.state].filter(Boolean).join(", ");
  const typeLabel = event.premier || event.barter ? "Premier" : "Regular";
  const cats = eventCategories(event);
  const oneLine = event.oneLine || firstSentence(event.description);
  const cityLine = [event.city, [event.state, event.zip].filter(Boolean).join(" "), event.country].filter(Boolean).join(", ");

  const status = (() => { try { return JSON.parse(localStorage.getItem(STATUS_KEY) || "{}")[id] || "none"; } catch { return "none"; } })();
  const statusMeta = ATTENDANCE_STATUSES.find((x) => x.id === status) || ATTENDANCE_STATUSES[0];
  const regionOf = (g) => (online ? "—" : g.options.includes(event.region) ? event.region : "—");
  const hub = /onebighub/i.test(event.hostedBy || "");
  const host = hub ? <>onebig<span className="cw-red">HUB</span></> : event.hostedBy;
  const details = [
    ["Date Posted / Revised", fmtStamp(event.revised || event.posted)],
    [<><Glyph name="referral" size={16} className="ref-ico" />Offering $ Referrals</>, event.referral ? (typeof event.referral === "string" ? event.referral : "Yes") : "No"],
    ["Format", online ? "Online" : "In-Person"],
    [<><b className="att-sym-inline">{statusMeta.icon}</b> My Attendance Status</>, <a href="/my-calendar">{statusMeta.label}</a>],
    ["Ticket Costs", event.cost || "Free"],
    ["Type", typeLabel],
    ["Privacy", event.privacy || "Public"],
    ["Categories", cats.length ? cats.join(", ") : "—"],
    ["Industries", event.industry || "—"],
    ...REGION_GROUPS.map((g) => [g.group, regionOf(g)]),
  ];

  // Sample RSVP names until accounts are live (Cesar's Figma uses the same).
  const RSVP_NAMES = ["Alabaster Snowball", "Amber Claus", "Angel Claus", "Belle Claus", "Blondie Claus", "Coco Claus", "Crystal Claus", "Gerhardt Grinch", "Ginger Claus", "Jack Frost", "Lola Claus", "Mrs Claus", "Santa Claus"];
  const rsvps = saved ? ["You", ...RSVP_NAMES] : RSVP_NAMES;
  const RPP = 13;
  const rTotal = Math.max(1, Math.ceil(rsvps.length / RPP));
  const rAt = Math.min(rp, rTotal - 1);

  return (
    <div className="page event-detail evd-page evd-v3">
      <SiteHero section="calendar" title="Event Details" icon="viewMode" activeAction="details" />

      {/* Nov 17 (Cesar's Figma, Event Details redesign) */}
      <div className="cw-bar evd-bar"><b>Event Listing</b></div>
      <section className="evd-listing3" aria-label="Listing">
        <span className="evd-kind">{event.premier ? <>Premier Listing<em>(Advertisement)</em></> : <>Regular Listing<em>(Free)</em></>}</span>
        <ListingTable rows={[{
          id: event.id, href: `/event/${event.id}`,
          left: [fmtDateRange(event.date, event.endDate), fmtTime(event.time)],
          title: event.title,
          lines: event.premier
            ? [`${cityCode(event)}${!online && event.region ? `, ${event.region}` : ""}`, <>Hosted by <b>{host}</b></>, <>{event.cost}{event.referral && <span className="obc-ref">• <Glyph name="referral" size={17} className="ref-ico" /></span>}</>]
            : [<>{cityCode(event)}, Hosted by {event.hostedBy}, <span className="obc-price">{event.cost}</span>{event.referral && <span className="obc-ref">• <Glyph name="referral" size={17} className="ref-ico" /></span>}</>],
          premier: event.premier,
          image: rowImage(event),
          imageNode: hub ? <HubLogo size={30} /> : null,
          selected: saved, onToggle: toggleSaved,
        }]} />
      </section>
      <div className="obc-pager evd-pager">
        <a href={prev ? `/event/${prev.id}` : undefined} className={`obc-pg ${prev ? "" : "is-off"}`} aria-label="Previous listing" aria-disabled={!prev}><Glyph name="pagePrev" size={24} /></a>
        <span><b className="cw-red">{pos + 1}</b> of <b className="cw-red">{ring.length}</b></span>
        <a href={next ? `/event/${next.id}` : undefined} className={`obc-pg ${next ? "" : "is-off"}`} aria-label="Next listing" aria-disabled={!next}><Glyph name="pageNext" size={24} /></a>
      </div>

      <section className="evd-box evd-head3">
        <div className="evd-head3-main">
          <h1 className="evd-title">{event.title}</h1>
          <p className="evd-when cw-red">{fmtDateRange(event.date, event.endDate)}</p>
          <p className="evd-time cw-red">{fmtTime(event.time)}</p>
          {oneLine && <p className="evd-oneline cw-red">{oneLine}</p>}
          <p className="evd-loc cw-red">
            {online ? <span>Online</span> : <>
              {event.venue && <span>{event.venue}</span>}
              {event.address && <span>{event.address}</span>}
              {cityLine && <span>{cityLine}</span>}
            </>}
          </p>
          <p><b>Hosted by</b> <a href={`/organizer/${slugify(event.hostedBy)}`} className="cw-red">{event.hostedBy}</a></p>
          <p className="evd-desc"><b>Description</b><br /><span className="cw-red">{event.description || "No description provided yet."}</span></p>
          {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
        </div>
        <aside className="evd-head3-side">
          <div className="evd-thumb">{hub ? <HubLogo size={64} /> : <Glyph name={rowImage(event)} size={56} strokeWidth={1.3} />}</div>
          <div className="evd-qr">
            {qrDataUrl ? <img src={qrDataUrl} alt={`QR code linking to ${event.title}`} /> : <div className="evd-qr-wait">QR Code</div>}
            <span className="evd-qr-note"><em>Created Automatically</em></span>
          </div>
          <button type="button" className="evd-copy" onClick={copyLink}>Copy Link</button>
          <a href={`/event/${id}/flyer`} className="evd-flyer">Flyer &amp; email template</a>
        </aside>
      </section>

      <section className="evd-box evd-facts">
        {details.map(([k, v], i) => (
          <div key={i} className="evd-fact"><b>{k}</b><span className="cw-red">{v}</span></div>
        ))}
      </section>

      <a className="evd-box evd-rsvp-link evd-gray" href={`/event/${id}/rsvp`}>
        <Glyph name="ticket" size={40} strokeWidth={1.4} />
        <span>
          <b><span className="cw-red">RSVP</span>&nbsp; Order Tickets</b>
          <span className="cw-blue">www.onebigHUB.com/event/{id}/rsvp</span>
          {event.rsvpUrl && <span><b>OR External URL:</b> <span className="cw-blue">{event.rsvpUrl}</span></span>}
        </span>
      </a>

      {!online && mapQuery && (
        <a className="evd-box evd-map3" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${mapQuery} in Google Maps`}>
          <iframe title={`Map of ${mapQuery}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=11&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
        </a>
      )}

      <div className="evd-box evd-poster3">
        <Poster event={event} />
        <span className="evd-note">Image or Poster <em>If applicable · height can vary</em></span>
      </div>

      <div className="evd-lower3">
        <div className="evd-lower3-main">
          <div className="cw-bar evd-bar"><b>Gallery</b></div>
          <div className="evd-gal-stage">
            <div className="evd-gal-item">
              <span className="evd-gal-ph"><Glyph name={rowImage(event)} size={64} strokeWidth={1.2} /><em>{gi === 0 ? "Image or Poster" : `Image or Video ${gi + 1}`}</em></span>
            </div>
          </div>
          <div className="obc-pager evd-pager">
            <button type="button" className="obc-pg" aria-label="Previous item" onClick={() => setGi((g) => (g + 2) % 3)}><Glyph name="pagePrev" size={22} /></button>
            <span><b className="cw-red">{gi + 1}</b> of <b className="cw-red">3</b> <span className="evd-muted">· up to 10 items</span></span>
            <button type="button" className="obc-pg" aria-label="Next item" onClick={() => setGi((g) => (g + 1) % 3)}><Glyph name="pageNext" size={22} /></button>
          </div>

          <div className="cw-bar evd-bar"><b>Contact</b></div>
          <MiniCardView p={{ name: event.contactName || "Name, Title", business: event.hostedBy || "Business / Organization", phone: event.contactPhone || "(xxx) xxx-xxxx", email: event.contactEmail || "Email", city: [event.city, event.state].filter(Boolean).join(", ") || "City, State" }} />

          <div className="cw-bar evd-bar"><b>Submitted by</b></div>
          <MiniCardView p={{ name: event.submittedBy || "Jack Frost", business: event.submittedOrg || "Jack Frost Heating & Cooling", phone: "1-800-TOO-COOL", email: "jack@jackfrost.com", city: "Xmasville, North Pole, Earth" }} />

          <div className="evd-pill evd-stamps">
            <span><b>Revised</b> <i className="cw-red">{fmtStamp(event.revised || event.posted)}</i></span>
            <span><b>Created</b> <i className="cw-red">{fmtStamp(event.created || event.posted)}</i></span>
          </div>

          <div className="cw-bar evd-bar"><b><Glyph name="comments" size={16} /> Comments / Reviews</b><span className="evd-muted">{comments.length}</span></div>
          <section className="evd-box evd-comments">
            {comments.length === 0 && <p className="evd-muted">No comments yet. Be the first !</p>}
            <ul>{comments.map((c, i) => <li key={i}><span className="evd-muted">{c.at}</span> {c.t}</li>)}</ul>
            <form onSubmit={addComment} className="evd-comment-form">
              <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Submit Here" aria-label="Write a comment" />
              <button type="submit" className="cw-submit">Submit</button>
            </form>
          </section>
          <div className="evd-likes">
            <button type="button" className={`evd-pill ${liked ? "on" : ""}`} onClick={toggleLike} aria-pressed={liked}>
              <Glyph name="thumbUp" size={16} /> <b className="cw-blue">Like</b> <i className="cw-red">{(liked ? 1 : 0).toLocaleString()}</i>
            </button>
            <button type="button" className="evd-pill" onClick={share}>
              <Glyph name="share" size={16} /> <b className="cw-blue">Share</b> <i className="cw-red">0</i>
            </button>
          </div>

          <label className="next-step-box evd-follow3">
            <input type="checkbox" checked={follow === "all"} onChange={() => pickFollow(follow === "all" ? "none" : "all")} />
            <Glyph name="plusBold" size={16} />
            <span>ADD Future Events from {hub ? host : event.hostedBy || "this Event Host / Organizer"} to My Calendar Digest</span>
          </label>
          {follow === "all" && <p className="nt-hint">Saved in this browser. <a href="/my-calendar">Open My Calendar Digest</a></p>}
        </div>

        <aside className="evd-lower3-side">
          <section className="evd-box evd-rsvps3">
            <div className="evd-rsvps-head"><b>RSVPs</b><b className="cw-red">{rsvps.length.toLocaleString()}</b></div>
            <ul>{rsvps.slice(rAt * RPP, rAt * RPP + RPP).map((n) => <li key={n}><span className="dg-card-pic">{n.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>{n}</li>)}</ul>
            <p className="evd-muted">Sample names until accounts are live.</p>
          </section>
          <div className="obc-pager evd-pager">
            <button type="button" className="obc-pg" disabled={rAt <= 0} onClick={() => setRp(rAt - 1)} aria-label="Previous"><Glyph name="pagePrev" size={20} /></button>
            <span><b className="cw-red">{rAt * RPP + 1}</b> - <b className="cw-red">{Math.min(rsvps.length, rAt * RPP + RPP)}</b> of <b className="cw-red">{rsvps.length}</b></span>
            <button type="button" className="obc-pg" disabled={rAt >= rTotal - 1} onClick={() => setRp(rAt + 1)} aria-label="Next"><Glyph name="pageNext" size={20} /></button>
          </div>
        </aside>
      </div>
    </div>
  );
}
