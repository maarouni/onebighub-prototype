"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old /login links (and referral QR codes: /login?mode=signup&ref=CODE) now
// go to Cesar's Registration pages.
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const mode = p.get("mode");
    p.delete("mode");
    const qs = p.toString() ? `?${p}` : "";
    router.replace(mode === "login" ? `/registration/login${qs}` : mode === "signup" ? `/registration/signup${qs}` : `/registration${qs}`);
  }, [router]);
  return null;
}
