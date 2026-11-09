"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHero from "./SiteHero";
import { fetchEvents } from "../lib/events";
import { fmtTime, fmtDateRange } from "./EventVisuals";
import { cityCode } from "../lib/cityCodes";

// Shared top of "RSVP Order Tickets" and "EDIT RSVP Order Tickets": the hub
// header plus the event's listing row (Figma Rev 261108).
export function useEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(undefined);
  useEffect(() => { fetchEvents().then((all) => setEvent(all.find((e) => e.id === id) || null)); }, [id]);
  return { id, event };
}

export function RsvpShell({ title, edit = false, event, children }) {
  return (
    <div className={`page evd-page rsvp-page ${edit ? "rsvp-edit" : ""}`}>
      <SiteHero section="calendar" title={title} icon="ticket" activeAction={edit ? "edit" : "details"} />
      {event === undefined && <p>Loading…</p>}
      {event === null && <div className="empty-state">Couldn&apos;t find that event. <a href="/">Back to One Big Calendar</a></div>}
      {event && (
        <>
          <a className="rsvp-listing" href={`/event/${event.id}`}>
            <span className="evd-kind">{event.premier ? <>Premier Listing<em>(Advertisement)</em></> : <>Regular Listing<em>(Free)</em></>}</span>
            <span className={`obc-row ${event.premier ? "premier" : "regular"}`}>
              <span className="obc-cell obc-when"><span>{fmtDateRange(event.date, event.endDate)}</span><span>{fmtTime(event.time)}</span></span>
              <span className="obc-cell obc-main">
                <span className="obc-title">{event.title}</span>
                <span>{cityCode(event)}, Hosted by {event.premier ? <b>{event.hostedBy}</b> : event.hostedBy}</span>
                <span className="obc-price">{event.cost}</span>
              </span>
            </span>
          </a>
          {children}
        </>
      )}
    </div>
  );
}
