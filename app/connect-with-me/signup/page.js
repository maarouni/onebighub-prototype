"use client";
import { useEffect } from "react";
// Nov 15 (Rev 261115): merged into Connect with Me ! Steps 1-3.
export default function Moved() {
  useEffect(() => { window.location.replace("/connect-with-me#new-user"); }, []);
  return <p style={{ padding: 20 }}>Moved — <a href="/connect-with-me">Connect with Me !</a></p>;
}
