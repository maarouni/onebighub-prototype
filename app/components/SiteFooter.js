"use client";

import { ConnectWithMe } from "./SiteHero";

// Oct 19 Figma: new footer on every page, aligned with the page body —
// "Connect with us !" on the left, copyright on the right.
export default function SiteFooter() {
  return (
    <footer className="site-footer-v2">
      <div className="sf-inner">
        <ConnectWithMe />
        <span>© 2026 onebig<b>HUB</b>.com</span>
      </div>
    </footer>
  );
}
