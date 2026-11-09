"use client";

import { useState } from "react";
import SiteHero from "./SiteHero";
import { Glyph } from "./Icons";

// Info section (Cesar's Figma, Nov 9 "onebigHUB screenshots - Info"):
// sub-row Index, Icons · About Us · Contact Us · Legal Docs. No main tile is
// highlighted on Info pages.
export function InfoShell({ title, icon, children, className = "" }) {
  return (
    <div className={`page info-page info-v2 ${className}`}>
      <SiteHero section="info" title={<>Info <i>{title}</i></>} icon={icon} />
      {children}
    </div>
  );
}

// Delete Account: no server accounts yet, so this erases everything onebigHUB
// saved in this browser (sign-in, My Calendar Digest, selections, settings).
export function DeleteAccount() {
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
