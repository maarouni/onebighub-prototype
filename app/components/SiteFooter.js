"use client";

import { useEffect, useState } from "react";
import { ConnectWithMe } from "./SiteHero";
import { IconButton } from "./Icons";

// Footer on every page — Oct 27 meeting: bright yellow "Connect with me !"
// button at the bottom of each page.
// Nov 5 (Cesar's Figma): Info and Dashboards icons sit next to the button
// (moved down from the header, 24 px). Same width as the page content.
// Right side, line 1: site name only (no year). Line 2: today's date + time,
// live in the viewer's local time zone.
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
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    const readUser = () => { try { setLoggedIn(!!localStorage.getItem("mc_user_v1")); } catch {} };
    readUser();
    window.addEventListener("mc-auth-changed", readUser);
    return () => { clearInterval(id); window.removeEventListener("mc-auth-changed", readUser); };
  }, []);

  return (
    <footer className="site-footer-v2">
      <div className="sf-inner">
        <span className="sf-left">
          <ConnectWithMe />
          <span className="sf-icons">
            <IconButton name="info" size={24} href="/info" />
            <IconButton name="dashboards" size={24} href={loggedIn ? "/dashboards" : "/registration"} />
          </span>
        </span>
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
