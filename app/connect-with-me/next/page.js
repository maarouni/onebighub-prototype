"use client";
import { useEffect } from "react";
// Nov 15 (Rev 261115): merged into Connect with Me ! Steps 4-6.
export default function Moved() {
  useEffect(() => { window.location.replace("/connect-with-me/network#next"); }, []);
  return <p style={{ padding: 20 }}>Moved — <a href="/connect-with-me/network">Connect with Me ! Steps 4-6</a></p>;
}
