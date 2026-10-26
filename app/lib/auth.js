// Prototype accounts — one user per browser, kept in localStorage until the
// shared database exists. Same key the NavBar already listens to.
export const USER_KEY = "mc_user_v1";

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
}

export function setUser(u) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {}
  window.dispatchEvent(new Event("mc-auth-changed"));
}

export function clearUser() {
  try { localStorage.removeItem(USER_KEY); } catch {}
  window.dispatchEvent(new Event("mc-auth-changed"));
}

// Generic localStorage list helpers used by referrals and advertising requests.
export function readList(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
export function writeList(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
}
export function upsert(key, item) {
  const list = readList(key).filter((x) => x.id !== item.id);
  list.unshift(item);
  writeList(key, list);
  return item;
}

export const nowStamp = () => {
  const d = new Date();
  return `${d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })} ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase()}`;
};
