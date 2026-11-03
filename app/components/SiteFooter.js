"use client";

import { ConnectWithMe } from "./SiteHero";

// Footer on every page — Oct 27 meeting: bright yellow "Connect with me !"
// button at the bottom of each page; launch year 2027.
export default function SiteFooter() {
  return (
    <footer className="site-footer-v2">
      <div className="sf-inner">
        <ConnectWithMe />
        <span className="sf-copy">
          <span>© 2027 onebig<b>HUB</b>.com</span>
          <em className="sf-ver">{process.env.NEXT_PUBLIC_BUILD_DATE} &middot; {process.env.NEXT_PUBLIC_VERSION}</em>
        </span>
      </div>
    </footer>
  );
}
