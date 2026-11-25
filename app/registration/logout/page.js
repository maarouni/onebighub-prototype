"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../../components/PageTemplate";
import { Radios } from "../../components/Form";
import { clearUser } from "../../lib/auth";

// Cesar's "Registration — Log Out" (Figma Rev 261025).
export default function LogOut() {
  const router = useRouter();
  const [pick, setPick] = useState("stay");
  const [done, setDone] = useState(false);

  function submit() {
    if (pick === "stay") {
      if (window.history.length > 1) router.back(); else router.push("/");
      return;
    }
    clearUser();
    setDone(true);
  }

  return (
    <PageTemplate section={null} title="Registration" subtitle="Log Out" icon="power" narrow tiles={false}>
      <div className="box auth-box">
        {done ? (
          <>
            <p className="sad-face" aria-hidden="true">☹</p>
            <p className="big-q">OK ... buh-bye</p>
            <p style={{ textAlign: "center" }}>See you again soon !</p>
            <p style={{ textAlign: "center" }}><a href="/calendar">Back to Find</a></p>
          </>
        ) : (
          <>
            <p className="big-q">Sooo ... you want to leave us ?</p>
            <span className="ed-label">Select one</span>
            {/* Cesar (Nov 25): selections stacked vertically; Submit centered, burgundy */}
            <div className="logout-radios">
              <Radios name="lo" value={pick} onChange={setPick}
                options={[{ id: "stay", label: "Oops, not now, keep me logged in" }, { id: "out", label: "Yes, Log Out" }]} />
            </div>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button type="button" onClick={submit}
                style={{ background: "#7a1c1c", color: "#fff", border: 0, borderRadius: 999, padding: "10px 28px", fontWeight: 700, cursor: "pointer" }}>SUBMIT</button>
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
}
