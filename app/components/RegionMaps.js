"use client";

// Nov 21 (Cesar, "Regions Filters"): color maps for the International and USA
// region boxes. Paths are pre-projected (scripts at build time: us-atlas /
// world-atlas → d3-geo) so nothing heavy ships to the browser. Click a region
// to toggle it in the filter.
import MAPS from "../lib/regionMaps.json";

const US_COLORS = {
  Northwest: "#5b7fe0", Southwest: "#64a8ec", Midwest: "#6fd68a", South: "#e8656b",
  Southeast: "#f6d35b", "Great Lakes": "#ef9a52", "New England": "#9b6ee8",
};
const WORLD_COLORS = {
  "North America": "#2f6db0", "Central America": "#d1453b", Caribbean: "#e3743a", "South America": "#ecb24c",
  "Northern Europe": "#d1453b", "Western Europe": "#8e64cc", "Southern Europe": "#ecb24c", "Eastern Europe": "#7cae47",
  "Northern Africa": "#3fa6d6", "Western Africa": "#a8429b", "Middle Africa": "#d1453b", "Eastern Africa": "#2f6db0", "Southern Africa": "#7cae47",
  "Western Asia": "#e3743a", "Central Asia": "#2f6db0", "Southern Asia": "#ecb24c", "Eastern Asia": "#8e64cc", "South-Eastern Asia": "#3fa6d6",
  "Australia & New Zealand": "#e3743a", Oceania: "#d1453b",
};

export function RegionMap({ kind, field, filters, setFilters, defaultRegion }) {
  const shapes = kind === "usa" ? MAPS.us : MAPS.world;
  const colors = kind === "usa" ? US_COLORS : WORLD_COLORS;
  const picked = filters[field] || [];
  const any = Object.keys(shapes).some((r) => picked.includes(r));
  const toggle = (r) => {
    if (r === defaultRegion) return setFilters((f) => ({ ...f, [field]: (f[field] || []).filter((x) => !(x in shapes)) }));
    setFilters((f) => { const cur = f[field] || []; return { ...f, [field]: cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r] }; });
  };
  const on = (r) => (any ? picked.includes(r) : r === defaultRegion);
  return (
    <svg className={`rm-map rm-${kind}`} viewBox={kind === "usa" ? "0 0 600 380" : "0 0 600 320"} role="img" aria-label={kind === "usa" ? "USA regions map" : "World regions map"}>
      {Object.entries(shapes).map(([r, s]) => (
        <path key={r} d={s.d} fill={colors[r] || "#bbb"} className={on(r) ? "rm-on" : ""} opacity={any && !on(r) ? 0.45 : 1} onClick={() => toggle(r)}>
          <title>{r}</title>
        </path>
      ))}
      {kind === "usa" && Object.entries(shapes).map(([r, s]) => (
        <text key={r} x={s.c[0]} y={s.c[1]} className="rm-label" textAnchor="middle" pointerEvents="none">{r.toUpperCase()}</text>
      ))}
    </svg>
  );
}
