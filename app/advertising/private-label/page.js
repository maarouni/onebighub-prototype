"use client";

import { AdPage } from "../../components/AdPages";

// Nov 7 (Cesar's Figma): new "Private-Label Header" box in the Promote & Earn
// → onebigHUB Ads, Events row. Placeholder until Cesar sends the page design.
export default function PrivateLabel() {
  return (
    <AdPage title="Private-Label Header">
      <section className="ad-box">
        <div className="ad-box-head"><h2>Private-Label Header</h2></div>
        <p>Your organization&apos;s own header on onebigHUB pages. Please <a href="/info#contact">contact us</a> to discuss win-win package deals.</p>
        <p className="nt-hint">Page design coming from Cesar&apos;s Figma.</p>
      </section>
    </AdPage>
  );
}
