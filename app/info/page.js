"use client";

import { useState } from "react";
import FillInHere from "../components/FillInHere";
import { Glyph, LEGEND } from "../components/Icons";
import SiteHero from "../components/SiteHero";

// Nov 6 (Masoud): Figma's Info items, each with an everyCircle-style icon, plus
// How to Delete Your Account and Delete Account — all on Info until further notice.
const INDEX = [
  ["about", "About Us", "connections"], ["contact", "Contact Us", "contactCard"], ["legend", "Legend Icons", "viewMode"],
  ["terms", "Terms & Conditions", "document"], ["privacy", "Privacy Policy", "shield"], ["child-safety", "Child Safety Policy", "smiley"],
  ["delete-help", "How to Delete Your Account", "info"], ["delete-account", "Delete Account", "delete"],
];
const POLICY_PAGES = ["terms", "privacy", "child-safety"];
const ICON_OF = Object.fromEntries(INDEX.map(([id, , icon]) => [id, icon]));

// Section title with its icon (same icon as the index).
const H = ({ id, children }) => <h2 className="info-h2"><Glyph name={ICON_OF[id]} size={20} /> {children}</h2>;

// Delete Account: no server accounts yet, so this erases everything onebigHUB
// saved in this browser (sign-in, My Calendar Digest, selections, settings).
function DeleteAccount() {
  const [step, setStep] = useState("idle");
  function wipe() {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith("mc_")).forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.dispatchEvent(new Event("mc-auth-changed"));
    setStep("done");
  }
  if (step === "done") return <p className="info-del-done">Done — your onebigHUB account data was deleted from this browser.</p>;
  if (step === "confirm") {
    return (
      <div className="info-del-confirm">
        <p><b>Delete your account?</b> This erases your sign-in, My Calendar Digest, selections and settings. It can&apos;t be undone.</p>
        <button type="button" className="info-del-btn" onClick={wipe}><Glyph name="delete" size={16} /> Yes, delete my account</button>
        <button type="button" className="info-del-cancel" onClick={() => setStep("idle")}>Cancel</button>
      </div>
    );
  }
  return <button type="button" className="info-del-btn" onClick={() => setStep("confirm")}><Glyph name="delete" size={16} /> Delete Account</button>;
}

// Site index from Cesar's Legend Icons page (Public vs Personal pages).
const PUBLIC_PAGES = [
  ["/", "HOME · One Big Calendar"], ["/notifications", "Notifications"], ["/employment", "Employment"],
  ["/discounts", "Discount / Gift Certificates"], ["/connections", "Connections"], ["/listings", "Products, Services ..."], ["/info", "Info"], ["/login", "Registration – Sign Up / Log In"],
];
const PERSONAL_PAGES = [
  ["/my-calendar", "My Calendar Digest"], ["/submit", "EDIT My Events"], ["/employment/submit", "EDIT My Employment Listings"], ["/discounts/submit", "EDIT My Discount / Gift Certificates"], ["/connections/submit", "EDIT My Connections Details"], ["/listings/submit", "EDIT My Other Listings"],
  ["/dashboards", "My Dashboards"], ["/profile", "Settings"],
];

// Cesar's wireframe (Figma, Oct 9 rev): "onebigHUB.com Info" —
// About Us / public info page. Copy below is lifted straight from his
// Figma notes (Business & Tech Networking Expos, sponsor tiers) — real
// content, just needs his sign-off and a final layout pass.

export default function InfoPage() {
  return (
    <div className="page info-page">
      <SiteHero section={null} title="Info" icon="info" />
      <header className="mc-head">
        <div>
          <h1>Info</h1>
          <p>Innovative, results-based marketing and revenue-sharing system. Connect &middot; Promote &middot; Earn.</p>
        </div>
      </header>

      <nav className="info-index" aria-label="Info index">
        <a href="/pages"><b>All Pages →</b></a>
        {INDEX.map(([id, label, icon]) => (
          <a key={id} href={POLICY_PAGES.includes(id) ? `/info/${id}` : `#${id}`}><Glyph name={icon} size={16} /> {label}</a>
        ))}
      </nav>

      <FillInHere>
        This is his actual Figma copy, dropped in as-is — confirm the final wording with him before it goes live.
      </FillInHere>

      <section className="info-section">
        <h2>Business &amp; Tech Networking Expos</h2>
        <p className="nt-hint">Hosted by onebigHUB + everyCircle &middot; Typical attendance 200&ndash;800+ &middot; 5-star hospitality, upscale ambiance, caterers, exhibitors, music, prizes.</p>
        <p>
          Your mini-card on the event page links to your comprehensive profile in onebigHUB, or directly to your
          website. Bring your banner, candies, giveaways and marketing collateral. Bring prizes for the drawing
          (free, or tickets sold for a participating non-profit). Discounts available for participating in multiple
          events.
        </p>

        <div className="info-tier-grid">
          <div className="info-tier">
            <h4>Caterer / Beverage Provider</h4>
            <p>Spirits, wine. Includes a 6 ft or 8 ft table with linen. Bring lots of appetizers &mdash; we usually invite multiple caterers.</p>
          </div>
          <div className="info-tier">
            <h4>Entertainment</h4>
            <p>DJ, live music, performer, photographer, videographer. Includes a round cocktail table with linen.</p>
          </div>
          <div className="info-tier">
            <h4>Exhibitor</h4>
            <p>Option A: 6 ft or 8 ft table with linen. Option B: round cocktail table with linen.</p>
          </div>
          <div className="info-tier">
            <h4>Sponsor Package</h4>
            <p>
              A custom Effective Networking Workshop (1&ndash;3 hrs) for your staff, clients and guests, presented
              by Cesar Plata at your location. List of all attendees. 6 ft or 8 ft table with linen. 30-second
              shout-out during the brief presentation. Weekly onebigHUB notification: event sponsored by your
              biz/org in the Expo listing. Premier event listing including your logo. Be a presenter at a monthly
              onebigHUB + everyCircle workshop. Discount / Gift Certificates for 2 months.
            </p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Dinners &amp; Networking</h2>
        <p>Sponsor, Chocolate / Desserts Tasting, Wine / Spirits Tasting, or other &mdash; submit your restaurant name, description and a 3-course prix fixe menu.</p>
      </section>

      <section className="info-section">
        <h2>Workshops</h2>
        <p>Hosted in a conference room. Sponsor, Chocolate / Desserts Tasting, Wine / Spirits Tasting, or other &mdash; submit your workshop presenter's topic, title, description and bio.</p>
      </section>

      <section className="info-section" id="legend">
        <H id="legend">Legend Icons</H>
        <p className="nt-hint">Every icon on the site, with the tooltip it shows on hover. Same set Cesar defined in Figma (Info → Legend Icons).</p>
        {LEGEND.map((g) => (
          <div key={g.group} className="legend-group">
            <h4>{g.group}</h4>
            <ul className="legend-grid">
              {g.items.map(([name, label]) => (
                <li key={g.group + name} data-tip={label}>
                  <span className="legend-icon"><Glyph name={name} size={20} /></span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="legend-group">
          <h4>Color code</h4>
          <ul className="legend-grid">
            <li><span className="legend-swatch lg-construction" /> Yellow — page under construction</li>
            <li><span className="legend-swatch lg-edit" /> Gray — edit page / editable inputs</li>
            <li><span className="legend-swatch lg-output" /> White — output (view) page</li>
          </ul>
        </div>
        <div className="legend-group info-site-index">
          <div>
            <h4><Glyph name="public" size={16} /> Public pages</h4>
            {PUBLIC_PAGES.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
          </div>
          <div>
            <h4><Glyph name="private" size={16} /> Personal pages (private)</h4>
            {PERSONAL_PAGES.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
          </div>
        </div>
      </section>

      <section className="info-section" id="about">
        <H id="about">About Us</H>
        <p>
          One place for every Bay Area networking event, meetup and workshop &mdash; built for organizers who are
          tired of juggling five different tools. onebigHUB is a collaboration between Masoud Arouni and Cesar
          Plata (everyCircle).
        </p>
      </section>

      <section className="info-section" id="contact">
        <H id="contact">Contact Us</H>
        <p className="nt-hint">Contact: <a href="mailto:maarouni@gmail.com">maarouni@gmail.com</a></p>
      </section>

      {[["terms", "Terms & Conditions", "The agreement that governs using onebigHUB."], ["privacy", "Privacy Policy", "What information onebigHUB collects, how it's used and your privacy rights."], ["child-safety", "Child Safety Policy", "How onebigHUB protects children and handles reports."]].map(([id, t, d]) => (
        <section key={id} className="info-section" id={id}>
          <H id={id}>{t}</H>
          <p>{d} <a href={`/info/${id}`}>Read the full {t} →</a></p>
        </section>
      ))}

      <section className="info-section" id="delete-help">
        <H id="delete-help">How to Delete Your Account</H>
        <ol className="info-steps">
          <li>Log in to onebigHUB.</li>
          <li>Open <b>Info</b> (the <Glyph name="info" size={14} /> icon at the bottom of every page).</li>
          <li>Go to <a href="#delete-account">Delete Account</a> and confirm.</li>
        </ol>
        <p>
          You can also ask us to delete it through <a href="#contact">Contact Us</a>. Some records may be kept where the
          law requires it (for example, transaction and tax records) — see section 20 of the{" "}
          <a href="/info/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section className="info-section" id="delete-account">
        <H id="delete-account">Delete Account</H>
        <p className="nt-hint">Prototype: accounts aren&apos;t on a server yet, so this deletes what onebigHUB saved in this browser.</p>
        <DeleteAccount />
      </section>
    </div>
  );
}
