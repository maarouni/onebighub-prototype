"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { slugify } from "../../lib/slug";
import { googleCalendarUrl, eventCategories } from "../../lib/taxonomy";
import { fetchEvents } from "../../lib/events";
import { fmtTime, fmtDateRange, isoOf } from "../../components/EventVisuals";
import { cityCode } from "../../lib/cityCodes";
import { Glyph } from "../../components/Icons";
import SiteHero from "../../components/SiteHero";
import { Poster } from "../../components/EventVisuals";

// Event Details — Cesar's Figma (Nov 5 rev), top to bottom:
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
  const typeLabel = event.barter ? "Premier Barter" : event.premier ? "Premier" : "Regular";
  const cats = eventCategories(event);
  const oneLine = event.oneLine || firstSentence(event.description);
  const cityLine = [event.city, [event.state, event.zip].filter(Boolean).join(" "), event.country].filter(Boolean).join(", ");

  const rows = [
    ["Hosted by", <a key="h" href={`/organizer/${slugify(event.hostedBy)}`}>{event.hostedBy}</a>],
    ["Selection", (
      <span key="s" className="evd-sel">
        <button type="button" className={`evd-sel-btn ${saved ? "on" : ""}`} onClick={toggleSaved}>
          <Glyph name="select" size={14} /> {saved ? "In My Selection" : "Add to My Selection"}
        </button>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer"><Glyph name="gcal" size={14} /> Add to My Google Calendar</a>
      </span>
    )],
    ["Referral", event.referral || <span key="r" className="evd-muted">None offered</span>],
    ["Format", online ? "Online / Virtual" : "In-Person"],
    ["Type", typeLabel],
    ["Cost", event.cost],
    ["Region", online ? "Online" : event.region || event.city],
    ["Category(ies)", cats.length ? cats.map((c) => <span key={c} className="evd-line">{c}</span>) : "—"],
    ["Description", event.description || "No description provided yet."],
  ];

  return (
    <div className="page event-detail evd-page">
      <SiteHero section="calendar" title="Event Details" icon="viewMode" activeAction="details" />

      <section className="evd-listing" aria-label="Listing">
        <a href={prev ? `/event/${prev.id}` : undefined} className={`obc-pg evd-step ${prev ? "" : "is-off"}`} aria-label="Previous listing" data-tip={prev ? "Previous" : undefined} aria-disabled={!prev}>
          <Glyph name="pagePrev" size={26} />
        </a>
        <div className="evd-listing-row">
          <span className="evd-kind">
            {event.premier ? <>Premier Listing<em>(Advertisement)</em></> : <>Regular Listing<em>(Free)</em></>}
          </span>
          <article className={`obc-row ${event.premier ? "premier" : "regular"} evd-obc`}>
            <span className="obc-cell obc-when">
              <span>{fmtDateRange(event.date, event.endDate)}</span>
              <span>{fmtTime(event.time)}</span>
            </span>
            <span className="obc-cell obc-main">
              <span className="obc-title">{event.title}</span>
              {event.premier
                ? <>
                    <span>{cityCode(event)}{!online && event.region ? `, ${event.region}` : ""}</span>
                    <span>Hosted by <b>{event.hostedBy}</b></span>
                    <span>{event.cost}</span>
                  </>
                : <span>{cityCode(event)}, Hosted by {event.hostedBy}</span>}
            </span>
            {event.premier && (
              <span className="obc-cell obc-img" aria-hidden="true">
                <Glyph name={rowImage(event)} size={46} strokeWidth={1.4} />
              </span>
            )}
          </article>
        </div>
        <a href={next ? `/event/${next.id}` : undefined} className={`obc-pg evd-step ${next ? "" : "is-off"}`} aria-label="Next listing" data-tip={next ? "Next" : undefined} aria-disabled={!next}>
          <Glyph name="pageNext" size={26} />
        </a>
        <p className="evd-count"><b>{pos + 1}</b> of <b>{ring.length}</b></p>
      </section>

      <div className="evd-subhead">
        <b>Event Details</b>
        <span className="obc-bar-tools">
          <a href="/submit" className="obc-tool" data-tip="ADD New Listing" aria-label="ADD New Listing"><Glyph name="plusBold" size={20} /></a>
          <a href="/submit" className="obc-tool" data-tip="EDIT Listing" aria-label="EDIT Listing"><Glyph name="editMode" size={19} /></a>
        </span>
      </div>

      <div className="evd-poster">
        <Poster event={event} />
        <span className="evd-note">Image or Poster <em>height can vary</em></span>
      </div>

      <div className="evd-grid">
        <div className="evd-main">
          <h1 className="evd-title">{event.title}</h1>
          <p className="evd-when">{fmtDateRange(event.date, event.endDate)}</p>
          <p className="evd-time">{fmtTime(event.time)}</p>
          {oneLine && <p className="evd-oneline">{oneLine}</p>}
          <p className="evd-loc">
            {online ? <span>Online / Virtual</span> : <>
              {event.venue && <span>{event.venue}</span>}
              {event.address && <span>{event.address}</span>}
              {cityLine && <span>{cityLine}</span>}
            </>}
          </p>

          <dl className="evd-list">
            {rows.map(([k, v]) => (
              <div key={k} className="evd-item">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {flash && <div className="fp-flash fp-flash-block">{flash}</div>}
        </div>

        <aside className="evd-side">
          <div className="evd-thumb">
            <Glyph name={rowImage(event)} size={56} strokeWidth={1.3} />
            <span>Thumbnail<br />Icon, Image or Logo</span>
          </div>

          <div className="evd-qr">
            {qrDataUrl ? <img src={qrDataUrl} alt={`QR code linking to ${event.title}`} /> : <div className="evd-qr-wait">QR Code</div>}
            <span className="evd-qr-note">QR Code <em>Created Automatically</em></span>
            <button type="button" className="evd-copy" onClick={copyLink}>Copy Link</button>
            <a href={`/event/${id}/flyer`} className="evd-flyer">Flyer &amp; email template</a>
          </div>

          {!online && mapQuery && (
            <a className="evd-map" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${mapQuery} in Google Maps`}>
              <iframe title={`Map of ${mapQuery}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=11&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
            </a>
          )}

          <div className="evd-rsvps">
            <div className="evd-rsvps-head"><b>RSVPs</b><b>{saved ? 1 : 0}</b></div>
            <p className="evd-muted">{saved ? "You — via My Selection." : "No RSVPs yet."} Attendee names show here once accounts are live.</p>
          </div>
        </aside>
      </div>

      {/* Lower half (Figma Rev 261108): Gallery · Contact · Submitted by ·
          Revised / Created · Like / Share · RSVP Order Tickets · Comments ·
          Select one: ADD future events from this host. */}
      <div className="evd-grid evd-lower">
        <div className="evd-main">
          <section className="evd-box evd-gallery">
            <h3><Glyph name="gallery" size={18} /> Gallery</h3>
            <div className="evd-gal-stage">
              <button type="button" className="evd-gal-nav" aria-label="Previous item" onClick={() => setGi((g) => (g + 2) % 3)}><Glyph name="pagePrev" size={20} /></button>
              <div className="evd-gal-item">
                <span className="evd-gal-ph"><Glyph name={rowImage(event)} size={64} strokeWidth={1.2} /><em>{gi === 0 ? "Image or Poster" : `Image or Video ${gi + 1}`}</em></span>
              </div>
              <button type="button" className="evd-gal-nav" aria-label="Next item" onClick={() => setGi((g) => (g + 1) % 3)}><Glyph name="pageNext" size={20} /></button>
            </div>
            <p className="evd-count"><b>{gi + 1}</b> of <b>3</b> <span className="evd-muted">· up to 10 items</span></p>
          </section>

          <section className="evd-box evd-comments">
            <h3>Comments / Reviews <span className="evd-muted">{comments.length}</span></h3>
            {comments.length === 0 && <p className="evd-muted">No comments yet. Be the first !</p>}
            <ul>{comments.map((c, i) => <li key={i}><span className="evd-muted">{c.at}</span> {c.t}</li>)}</ul>
            <form onSubmit={addComment} className="evd-comment-form">
              <textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Submit Here" aria-label="Write a comment" />
              <button type="submit" className="cw-submit">Submit</button>
            </form>
          </section>
        </div>

        <aside className="evd-side">
          <section className="evd-box">
            <h3>Contact</h3>
            <div className="cw-card evd-mini">
              <div className="cw-card-name"><b>{event.contactName || "Name, Title"}</b><span>{event.hostedBy || "Business / Organization"}</span></div>
              <div className="cw-card-row">
                <span className="cw-av">{(event.hostedBy || "?").slice(0, 2).toUpperCase()}</span>
                <span className="cw-card-meta">
                  <span className="cw-red">{event.contactPhone || "(xxx) xxx-xxxx"}</span>
                  {event.contactEmail ? <a className="cw-blue" href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a> : <span className="cw-blue">Email</span>}
                  <span className="cw-red">{[event.city, event.state].filter(Boolean).join(", ") || "City, State"}</span>
                </span>
              </div>
            </div>
          </section>

          <section className="evd-box">
            <h3>Submitted by</h3>
            <div className="cw-card evd-mini">
              <div className="cw-card-name"><b>{event.submittedBy || "Jack Frost"}</b><span className="cw-blue">{event.submittedOrg || "Jack Frost Heating & Cooling"}</span></div>
              <div className="cw-card-row">
                <span className="cw-av">JF</span>
                <span className="cw-card-meta"><span>1-800-TOO-COOL</span><span className="cw-blue">jack@jackfrost.com</span><span>Xmasville, North Pole, Earth</span></span>
              </div>
            </div>
          </section>

          <div className="evd-pill evd-stamps">
            <span><b>Revised</b> <i>{fmtStamp(event.posted)}</i></span>
            <span><b>Created</b> <i>{fmtStamp(event.created || event.posted)}</i></span>
          </div>
          <div className="evd-likes">
            <button type="button" className={`evd-pill ${liked ? "on" : ""}`} onClick={toggleLike} aria-pressed={liked}>
              <Glyph name="thumbUp" size={16} /> <b>Like</b> <i>{(liked ? 1 : 0).toLocaleString()}</i>
            </button>
            <button type="button" className="evd-pill" onClick={share}>
              <Glyph name="share" size={16} /> <b>Share</b> <i>0</i>
            </button>
          </div>

          <a className="evd-box evd-rsvp-link" href={`/event/${id}/rsvp`}>
            <Glyph name="ticket" size={40} strokeWidth={1.4} />
            <span>
              <b><span className="cw-red">RSVP</span> Order Tickets</b>
              <span className="cw-blue">onebigHUB.com/event/{id}/rsvp</span>
              {event.rsvpUrl && <span><b>OR External URL:</b> <span className="cw-blue">{event.rsvpUrl}</span></span>}
            </span>
          </a>
        </aside>
      </div>

      <div className="next-step-box evd-follow">
        <div className="step-head"><em className="next-step-title">Select one</em></div>
        {[
          ["none", "No thanks", true],
          ["all", `ADD Future Events from ${event.hostedBy || "this Event Host / Organizer"} to My Calendar Digest`],
          ["notify", "Notify me only (My Notifications)"],
        ].map(([v, label, def]) => (
          <label key={v} className="fp-option">
            <input type="radio" name="follow-host" checked={follow === v} onChange={() => pickFollow(v)} />
            <span className="fp-label">{label}{def && <em className="ns-default"> Default</em>}</span>
          </label>
        ))}
        {follow !== "none" && <p className="nt-hint">Saved in this browser. <a href="/my-calendar">Open My Calendar Digest</a></p>}
      </div>
    </div>
  );
}
