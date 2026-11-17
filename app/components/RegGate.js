"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Glyph } from "./Icons";
import { getUser } from "../lib/auth";

// Cesar's "Pop-Up" (Figma › Registration, Nov 16): shown when a visitor who
// isn't signed in clicks a link that is only for registered users.
// During development every page stays reachable — "Preview anyway" goes on.
const MEMBERS_ONLY = [
  /^\/submit/, /^\/listings\/submit/, /^\/listings\/digest/, /^\/dashboards/, /^\/profile/, /^\/my-calendar/,
  /^\/connect\/submit/, /^\/connect\/digest/, /^\/connect-with-me\/network/, /^\/referrals/, /^\/cart/,
  /^\/advertising\/private-label/, /^\/advertising\/barter-approval/, /^\/event\/[^/]+\/rsvp\/edit/,
];
export const membersOnly = (path) => MEMBERS_ONLY.some((r) => r.test(path));

export default function RegGate() {
  const router = useRouter();
  const [to, setTo] = useState(null);
  const [pick, setPick] = useState("signup");

  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.dataset.noGate !== undefined) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !membersOnly(url.pathname) || getUser()) return;
      e.preventDefault(); e.stopPropagation();
      setPick("signup"); setTo(url.pathname + url.search + url.hash);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!to) return;
    const k = (e) => e.key === "Escape" && setTo(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [to]);

  if (!to) return null;
  const next = encodeURIComponent(to);
  return (
    <div className="rg-back" role="presentation" onClick={() => setTo(null)}>
      <div className="rg-pop" role="dialog" aria-modal="true" aria-labelledby="rg-title" onClick={(e) => e.stopPropagation()}>
        <div className="rg-bar"><Glyph name="login" size={30} /><span id="rg-title">Sign Up / Log In</span>
          <button type="button" className="rg-x" aria-label="Close" onClick={() => setTo(null)}>×</button></div>
        <p className="rg-tag"><b className="cw-red">Your Performance-Based</b> <b className="cw-blue">Marketing System</b></p>
        <div className="rg-box">
          <div>
            <p>Please sign up or log in to manage your <i>private</i> custom features and applications</p>
            <p><i>Select one</i></p>
            {[["signup", <><b>Sign Up</b> <i>New User</i></>], ["login", "Log In"]].map(([k, t]) => (
              <label key={k} className={`pk-opt ${pick === k ? "on" : ""}`}><input type="radio" name="rg" checked={pick === k} onChange={() => setPick(k)} /><span>{t}</span></label>
            ))}
            <button type="button" className="rg-go" onClick={() => { setTo(null); router.push(`/registration/${pick}?next=${next}`); }}>Continue</button>
          </div>
          <span className="rg-lock" aria-hidden="true"><Glyph name="unlock" size={72} strokeWidth={1.8} /></span>
        </div>
        <button type="button" className="rg-dev" onClick={() => { const t = to; setTo(null); router.push(t); }}>Preview page anyway <i>(development only)</i></button>
      </div>
    </div>
  );
}
