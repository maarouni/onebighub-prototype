"use client";

import SiteHero from "./SiteHero";

// Home page top (Nov 7 Figma; Nov 16: "One Big Calendar  Welcome !" with Welcome ! italic), then
// the shared SiteHero rows. No intro line on the home page.
export default function HomeHero() {
  return (
    <div className="home-hero">
      <SiteHero section="calendar" title={<>One Big Table&nbsp;&nbsp;<i className="pb-sub">Calendar</i></>} icon="calendar" />
    </div>
  );
}
