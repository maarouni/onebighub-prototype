"use client";

// Small form controls shared by the newer pages (registration, referrals,
// barter, profile). Same classes as the existing EDIT pages, so they pick up
// the gray Edit Mode styling automatically.
export function Field({ label, req, hint, error, wide, children }) {
  return (
    <label className={`ed-field ${wide ? "wide" : ""} ${error ? "has-error" : ""}`}>
      <span className="ed-label">{label} {req && <em>Required</em>} {hint && <i>{hint}</i>}</span>
      {children}
      {error && <span className="ed-error">{error}</span>}
    </label>
  );
}

export function Input({ value, onChange, ...rest }) {
  return <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Area({ value, onChange, rows = 3, ...rest }) {
  return <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Checks({ options, value = [], onChange, name }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <div className="job-type-grid">
      {options.map((o) => (
        <label key={o} className="fp-option">
          <input type="checkbox" name={name} checked={value.includes(o)} onChange={() => toggle(o)} />
          <span className="fp-label">{o}</span>
        </label>
      ))}
    </div>
  );
}

export function Radios({ options, value, onChange, name }) {
  return (
    <div className="job-type-grid">
      {options.map((o) => {
        const id = typeof o === "string" ? o : o.id;
        const label = typeof o === "string" ? o : o.label;
        return (
          <label key={id} className="fp-option">
            <input type="radio" name={name} checked={value === id} onChange={() => onChange(id)} />
            <span className="fp-label">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

// "--------- OR ---------" divider from Cesar's forms.
export function OrLine() {
  return <div className="form-or"><span>OR</span></div>;
}

// Mini-card (Cesar's "Angel Claus" card): name/title/business, contact line.
export function MiniCard({ p, children, onClick, selected }) {
  if (!p) return null;
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className={`mini-card ${selected ? "on" : ""}`} onClick={onClick}>
      <span className="mini-card-av">{(p.name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
      <span className="mini-card-body">
        <span><b>{p.name}</b>{p.title ? <>, {p.title}</> : null}</span>
        {p.business && <span className="mini-card-biz">{p.business}</span>}
        {p.pitchTitle && <span className="mini-card-pitch">{p.pitchTitle}</span>}
        <span className="mini-card-meta">{[p.phone, p.email, p.city].filter(Boolean).join(" · ") || "—"}</span>
        {children}
      </span>
    </Tag>
  );
}
