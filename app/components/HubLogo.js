"use client";

// The onebigHUB hub logo (header and the Welcome ! bar). One copy, so a logo
// change shows everywhere.
export default function HubLogo({ size = 48, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {[[22, 22, 9, "#bfe3f5"], [52, 13, 6.5, "#2f49c9"], [79, 28, 5.5, "#bfe3f5"], [82, 66, 9, "#2f49c9"], [52, 88, 7, "#bfe3f5"], [16, 70, 8, "#2f49c9"]].map(([x, y, r, f], i) => (
        <g key={i}>
          <line x1="47" y1="47" x2={x} y2={y} stroke="#1a1a1a" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx={x} cy={y} r={r} fill={f} stroke="#1a1a1a" strokeWidth="2.4" />
        </g>
      ))}
      <circle cx="47" cy="47" r="15" fill="#8b1414" stroke="#1a1a1a" strokeWidth="2.6" />
    </svg>
  );
}
