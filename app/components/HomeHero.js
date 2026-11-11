"use client";

import SiteHero from "./SiteHero";

// Home page top (Nov 7 Figma): title bar "One Big Calendar - Welcome !", then
// the shared SiteHero rows. No intro line on the home page.
export default function HomeHero() {
  return (
    <div className="home-hero">
      <SiteHero section="calendar" title={<span className="pb-plain">One Big Calendar - Welcome !</span>} icon="calendar" />
    </div>
  );
}
