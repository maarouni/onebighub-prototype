"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../components/PageTemplate";
import { Radios } from "../components/Form";
import { getUser } from "../lib/auth";

// Cesar's Registration chooser (Figma /Registration, Rev 261025).
export default function RegistrationPage() {
  const router = useRouter();
  const [user, setU] = useState(null);
  const [pick, setPick] = useState("signup");
  useEffect(() => { const u = getUser(); setU(u); if (u) setPick("logout"); }, []);
  const go = () => router.push(`/registration/${pick}${typeof window !== "undefined" ? window.location.search : ""}`);
  return (
    <PageTemplate section={null} title="Registration" icon="register" narrow
      intro={<><b>Optional</b> Sign Up / Log In to manage My Calendar Digest • My Notifications • My Dashboards</>}>
      <div className="box auth-box">
        {user && <p className="nt-hint">You&rsquo;re logged in as <b>{user.name}</b>.</p>}
        <span className="ed-label">Select one</span>
        <Radios name="reg" value={pick} onChange={setPick}
          options={[{ id: "signup", label: "Sign Up New User" }, { id: "login", label: "Log In" }, { id: "logout", label: "Log Out" }]} />
        <button type="button" className="btn-primary" style={{ marginTop: 14 }} onClick={go}>Continue</button>
      </div>
    </PageTemplate>
  );
}
