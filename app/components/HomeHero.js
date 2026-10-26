"use client";

import SiteHero from "./SiteHero";

// Home page top: the shared SiteHero (title bar "Welcome !", hero box, both
// rows of boxes, Connect with us !) plus the "Save Time !" line.
export default function HomeHero({ detailsHref }) {
  return (
    <div className="home-hero">
      <SiteHero section="calendar" title="Welcome !" icon="smiley" detailsHref={detailsHref} />
      <p className="hh-box hh-save">
        <b><i>Save Time !</i></b> Select filters to <b>curate</b> (organize, submit, view) <b>events</b>
      </p>
    </div>
  );
}
