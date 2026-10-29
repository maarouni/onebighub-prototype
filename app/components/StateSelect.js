"use client";

import { US_STATES, DEFAULT_STATE } from "../lib/usStates";

// State pull-down, California by default (Oct 27 meeting).
export default function StateSelect({ value, onChange, label = "State", bare = false }) {
  const select = (
    <select value={value || DEFAULT_STATE} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
    </select>
  );
  if (bare) return select;
  return (
    <label className="ed-field">
      <span className="ed-label">{label}</span>
      {select}
    </label>
  );
}
