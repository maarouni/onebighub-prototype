"use client";

import { useEffect, useState } from "react";
import { ConnectWithMe } from "./SiteHero";

// Footer on every page — Oct 27 meeting: bright yellow "Connect with me !"
// button at the bottom of each page.
// Line 1: site name only (no year). Line 2: today's date + time, live in the
// viewer's local time zone, refreshed every minute.
function formatNow(d) {
  const date = d.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
  const time = d
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .replace(/\s+/g, "")
    .toLowerCase();
  return `${date} · ${time}`;
}

export default function SiteFooter() {
  // Rendered after mount so server HTML and client clock never disagree.
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="site-footer-v2">
      <div className="sf-inner">
        <ConnectWithMe />
        <span className="sf-copy">
          <span>© onebig<b>HUB</b>.com</span>
          <em className="sf-ver" suppressHydrationWarning>
            {now ? formatNow(now) : " "}
          </em>
        </span>
      </div>
    </footer>
  );
}
