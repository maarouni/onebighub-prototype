"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConnectWithMe } from "./SiteHero";
import { IconButton } from "./Icons";
import REVISIONS from "../lib/pageRevisions.json";

// Footer on every page — Cesar's Figma (Nov 6):
//   [Connect with me !]  left-justified
//   (i) Info  (chart) Dashboards  centered
//   © onebigHUB.com / date + time THIS page was last revised  right
// Revision times come from app/lib/pageRevisions.json (npm run revisions,
// from git history). Later each user's own page edits will set it.

// "/event/123" -> "/event/[id]"
const PATTERNS = Object.keys(REVISIONS).map((route) => ({
  route,
  rx: new RegExp("^" + route.replace(/\[[^\]]+\]/g, "[^/]+") + "/?$"),
}));

function revisedAt(pathname) {
  const exact = REVISIONS[pathname];
  if (exact) return exact;
  const hit = PATTERNS.find((p) => p.rx.test(pathname));
  return hit ? REVISIONS[hit.route] : null;
}

// Pacific time (where the pages are edited), e.g. "Fri, Nov 6, 2026 · 9:18am".
function formatRevised(iso) {
  const d = new Date(iso);
  const tz = "America/Los_Angeles";
  const date = d.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const time = d
    .toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" })
    .replace(/\s+/g, "")
    .toLowerCase();
  return `${date} · ${time}`;
}

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const readUser = () => { try { setLoggedIn(!!localStorage.getItem("mc_user_v1")); } catch {} };
    readUser();
    window.addEventListener("mc-auth-changed", readUser);
    return () => window.removeEventListener("mc-auth-changed", readUser);
  }, []);

  const iso = revisedAt(pathname);

  return (
    <footer className="site-footer-v2">
      <div className="sf-inner sf-grid">
        <span className="sf-left">
          <ConnectWithMe />
        </span>
        <span className="sf-icons">
          <IconButton name="info" size={24} href="/info" />
          <IconButton name="dashboards" size={24} href={loggedIn ? "/dashboards" : "/registration"} />
        </span>
        <span className="sf-copy">
          <span>© onebig<b>HUB</b>.com</span>
          {iso && <em className="sf-ver" title="Page last revised">{formatRevised(iso)}</em>}
        </span>
      </div>
    </footer>
  );
}
