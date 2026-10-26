"use client";

// 3-level Connections graph (Cesar's Figma: "Display Connections,
// Introductions, Referrals — Graph / Map / Mini-Cards; Level 1 / 2 / 3").
// Rings: you in the center, Level 1 = people you introduced / referred,
// Level 2 = their connections, Level 3 = one more step out.
export default function NetworkGraph({ me, levels, depth }) {
  const W = 640, H = 460, cx = W / 2, cy = H / 2;
  const R = [0, 95, 165, 220];
  const nodes = [{ id: "me", label: me || "You", x: cx, y: cy, level: 0 }];
  const edges = [];
  const place = (list, level, parentPos) => {
    list.forEach((n, i) => {
      const base = parentPos ? parentPos.angle : 0;
      const spread = parentPos ? (Math.PI / 4) / Math.max(1, list.length) : (2 * Math.PI) / Math.max(1, list.length);
      const angle = parentPos ? base + (i - (list.length - 1) / 2) * spread : -Math.PI / 2 + i * spread;
      const pos = { x: cx + R[level] * Math.cos(angle), y: cy + R[level] * Math.sin(angle), angle };
      nodes.push({ id: n.id, label: n.label, ...pos, level });
      edges.push([parentPos ? parentPos.id : "me", n.id]);
      if (level < depth && n.children?.length) place(n.children, level + 1, { ...pos, id: n.id });
    });
  };
  place(levels, 1, null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const fill = ["var(--ink)", "var(--cg-blue)", "#7a8bd6", "#bcc6ee"];
  return (
    <svg className="net-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Connections graph, ${depth} level(s)`}>
      {[1, 2, 3].filter((l) => l <= depth).map((l) => <circle key={l} cx={cx} cy={cy} r={R[l]} fill="none" stroke="#e3e3e3" strokeDasharray="4 4" />)}
      {edges.map(([a, b]) => byId[a] && byId[b] && <line key={`${a}-${b}`} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} stroke="#b9b9b9" strokeWidth="1.2" />)}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.level === 0 ? 22 : 15 - n.level * 2} fill={fill[n.level]} stroke="#fff" strokeWidth="2" />
          <text x={n.x} y={n.y + (n.level === 0 ? 36 : 24 - n.level * 2)} textAnchor="middle" fill="var(--ink)">{n.label.length > 18 ? `${n.label.slice(0, 17)}…` : n.label}</text>
        </g>
      ))}
    </svg>
  );
}
