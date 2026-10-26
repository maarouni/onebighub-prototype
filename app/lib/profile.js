// My Profile (Cesar's individual profile / mini-card, Figma Rev 261021+):
// name, title, business, contact, elevator pitch, external links, gallery
// (max 5 items), QR code, and the 3-level Connections graph.
import { getUser } from "./auth";

export const PROFILE_KEY = "mc_profile_v1";
export const GALLERY_KEY = "mc_profile_gallery_v1"; // kept apart: images are large
export const GALLERY_MAX = 5;

export function getProfile() {
  let p = {};
  try { p = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch {}
  const u = getUser();
  return {
    name: p.name || u?.name || "", title: p.title || "", business: p.business || "", tagline: p.tagline || "",
    phone: p.phone || u?.mobile || "", email: p.email || u?.email || (u?.identifier?.includes("@") ? u.identifier : ""),
    city: p.city || "", url: p.url || "",
    pitchTitle: p.pitchTitle || "", pitch: p.pitch || "",
    linkedin: p.linkedin || "", links: p.links || [{ name: "", url: "" }, { name: "", url: "" }, { name: "", url: "" }],
    username: u?.username || (u?.name || "guest").toLowerCase().replace(/[^a-z0-9]/g, ""),
  };
}

export function saveProfile(p) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); return true; } catch { return false; }
}

export function getGallery() {
  try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]"); } catch { return []; }
}
export function saveGallery(g) {
  try { localStorage.setItem(GALLERY_KEY, JSON.stringify(g)); return true; } catch { return false; }
}

// Shrink an uploaded image to fit localStorage (max 800px, JPEG).
export function shrinkImage(file, max = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Not an image")); };
    img.src = url;
  });
}
