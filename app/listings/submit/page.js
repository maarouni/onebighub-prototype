"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTemplate from "../../components/PageTemplate";
import PremierCalculator from "../../components/PremierCalculator";
import {
  REGION_GROUPS, INDUSTRIES, LISTING_TYPES, DELIVERY_OPTIONS, COST_UNITS, saveLocalListing,
} from "../../lib/listings";

// EDIT My Other Listings (Products, Services, Memberships).
const ALL_REGIONS = REGION_GROUPS.flatMap((g) => g.options);
const todayIso = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  type: "Product", name: "", description: "", details: "",
  costMin: "", costMax: "", costUnit: "one-time", referrals: false, delivery: ["In-Person"], expires: "",
  offeredBy: "", industry: INDUSTRIES[0], city: "", state: "CA", region: ALL_REGIONS[0],
  contact: "", phone: "", email: "", url: "", premier: false,
};

export default function PostListingPage() {
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(null);
  const set = (k, v) => setF((c) => ({ ...c, [k]: v }));
  const toggleDelivery = (r) => setF((c) => ({ ...c, delivery: c.delivery.includes(r) ? c.delivery.filter((x) => x !== r) : [...c.delivery, r] }));

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = "Required";
    if (!f.offeredBy.trim()) errs.offeredBy = "Required";
    if (!f.delivery.length) errs.delivery = "Pick at least one";
    if (f.delivery.includes("In-Person") && !f.city.trim()) errs.city = "Where is it offered?";
    if (f.costMax !== "" && Number(f.costMax) < Number(f.costMin || 0)) errs.costMax = "Must be at least the low end";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    saveLocalListing({
      ...f,
      id: `local-p-${Date.now()}`,
      name: f.name.trim(), offeredBy: f.offeredBy.trim(), city: f.city.trim(),
      costMin: Number(f.costMin) || 0,
      costMax: f.costMax === "" ? Number(f.costMin) || 0 : Number(f.costMax),
      posted: todayIso(),
      premierCost: f.premier && paid ? paid.total : null,
    });
    router.push("/listings");
  }

  const F = ({ k, label, req, wide, type = "text", ...rest }) => (
    <label className={`ed-field ${wide ? "wide" : ""} ${errors[k] ? "has-error" : ""}`}>
      <span className="ed-label">{label} {req && <em>Required</em>}</span>
      <input type={type} value={f[k]} onChange={(e) => set(k, e.target.value)} {...rest} />
      {errors[k] && <span className="ed-error">{errors[k]}</span>}
    </label>
  );

  return (
    <PageTemplate
      section="products"
      mode="edit"
      narrow
      title="EDIT My Other Listings"
      subtitle="Products, Services, Memberships"
      intro="Get paid! Promote your products, services and memberships — No-Cost and Premier listings available."
      actions={<a href="/listings" className="tpl-action">View listings</a>}
    >
      <form className="job-form" onSubmit={submit}>
        <div className="ed-field wide">
          <span className="ed-label">Product, Service or Membership <em>Required</em></span>
          <div className="job-type-grid">
            {LISTING_TYPES.map((t) => (
              <label key={t} className="fp-option">
                <input type="radio" name="ltype" checked={f.type === t} onChange={() => set("type", t)} />
                <span className="fp-label">{t}</span>
              </label>
            ))}
          </div>
        </div>
        {F({ k: "name", label: `${f.type} name`, req: true, wide: true })}
        {F({ k: "description", label: "One-line description", wide: true, maxLength: 140 })}
        <label className="ed-field wide">
          <span className="ed-label">Full Description</span>
          <textarea rows={3} value={f.details} onChange={(e) => set("details", e.target.value)} />
        </label>

        {F({ k: "costMin", label: "Cost from ($) — 0 if free", type: "number", min: 0 })}
        {F({ k: "costMax", label: "Cost to ($) — leave blank for a single price", type: "number", min: 0 })}
        <label className="ed-field">
          <span className="ed-label">Cost is</span>
          <select value={f.costUnit} onChange={(e) => set("costUnit", e.target.value)}>
            {COST_UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </label>
        {F({ k: "expires", label: "Listing expires", type: "date", min: todayIso() })}

        <div className={`ed-field wide ${errors.delivery ? "has-error" : ""}`}>
          <span className="ed-label">In-Person / Online <em>Required</em></span>
          <div className="job-type-grid">
            {DELIVERY_OPTIONS.map((r) => (
              <label key={r} className="fp-option">
                <input type="checkbox" checked={f.delivery.includes(r)} onChange={() => toggleDelivery(r)} />
                <span className="fp-label">{r}</span>
              </label>
            ))}
          </div>
          {errors.delivery && <span className="ed-error">{errors.delivery}</span>}
        </div>

        <label className="fp-option wide" style={{ marginBottom: 14 }}>
          <input type="checkbox" checked={f.referrals} onChange={(e) => set("referrals", e.target.checked)} />
          <span className="fp-label">Offering $ Referrals <em>(pay a share for introductions that convert)</em></span>
        </label>

        {F({ k: "offeredBy", label: "Name of Individual / Biz / Org / Group", req: true })}
        <label className="ed-field">
          <span className="ed-label">Industry</span>
          <select value={f.industry} onChange={(e) => set("industry", e.target.value)}>
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        {F({ k: "city", label: "City", req: f.delivery.includes("In-Person") })}
        {F({ k: "state", label: "State" })}
        <label className="ed-field">
          <span className="ed-label">Region</span>
          <select value={f.region} onChange={(e) => set("region", e.target.value)}>
            {REGION_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>{g.options.map((o) => <option key={o}>{o}</option>)}</optgroup>
            ))}
          </select>
        </label>
        {F({ k: "contact", label: "Contact name, title" })}
        {F({ k: "phone", label: "Phone", type: "tel" })}
        {F({ k: "email", label: "Email", type: "email" })}
        {F({ k: "url", label: "Website", type: "url", placeholder: "https://" })}

        <label className="fp-option wide">
          <input type="checkbox" checked={f.premier} onChange={(e) => set("premier", e.target.checked)} />
          <span className="fp-label">Submit as a Premier listing <em>(top placement)</em></span>
        </label>
        {f.premier && <PremierCalculator onConfirm={setPaid} />}

        <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>Post Listing</button>
        <p className="proto-note">Until the shared database is set up, listings you post show only on this computer. After posting, use <b>Send my listings to Masoud</b> on the Products, Services, Memberships page to make them permanent for everyone.</p>
      </form>
    </PageTemplate>
  );
}
