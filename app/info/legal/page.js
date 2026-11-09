"use client";

import { InfoShell, DeleteAccount } from "../../components/InfoKit";
import { Glyph } from "../../components/Icons";

// Info · Legal Documents (Figma Nov 9): Terms and Conditions · Privacy Policy ·
// Child Safety Policy in the sub-row. Delete Account stays here until further notice.
const DOCS = [
  ["/info/terms", "Terms and Conditions", "idxTerms", "The agreement that governs using onebigHUB."],
  ["/info/privacy", "Privacy Policy", "idxPrivacy", "What information onebigHUB collects, how it's used and your privacy rights."],
  ["/info/child-safety", "Child Safety Policy", "idxShield", "How onebigHUB protects children and handles reports."],
];

export default function Legal() {
  return (
    <InfoShell title="Legal Documents" icon="idxScale">
      <div className="about-list">
        {DOCS.map(([href, t, icon, d]) => (
          <a key={href} href={href} className="about-box legal-link"><h2><Glyph name={icon} size={20} /> {t}</h2><p>{d}</p></a>
        ))}
        <section className="about-box" id="delete-help">
          <h2><Glyph name="info" size={20} /> How to Delete Your Account</h2>
          <ol className="info-steps">
            <li>Log in to onebigHUB.</li>
            <li>Open <b>Info</b> → <b>Legal Docs</b>.</li>
            <li>Click <b>Delete Account</b> below and confirm.</li>
          </ol>
          <p>You can also ask us through <a href="/info/contact">Contact Us</a>. Some records may be kept where the law requires it — see the <a href="/info/privacy">Privacy Policy</a>.</p>
        </section>
        <section className="about-box" id="delete-account">
          <h2><Glyph name="delete" size={20} /> Delete Account</h2>
          <DeleteAccount />
        </section>
      </div>
    </InfoShell>
  );
}
