"use client";

import SiteHero from "./SiteHero";

// One legal page (Info → Terms & Conditions / Privacy Policy / Child Safety
// Policy). Text lives in app/lib/policies.js.
const LINKS = [
  ["/info/terms", "Terms & Conditions"],
  ["/info/privacy", "Privacy Policy"],
  ["/info/child-safety", "Child Safety Policy"],
];

function render(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const [type, text] = blocks[i];
    if (type === "li") {
      const items = [];
      while (i < blocks.length && blocks[i][0] === "li") items.push(blocks[i++][1]);
      i--;
      out.push(<ul key={i}>{items.map((t, j) => <li key={j}>{t}</li>)}</ul>);
    } else if (type === "h2") out.push(<h2 key={i}>{text}</h2>);
    else if (type === "h3") out.push(<h3 key={i}>{text}</h3>);
    else out.push(<p key={i}>{text}</p>);
  }
  return out;
}

export default function PolicyPage({ title, href, blocks }) {
  return (
    <div className="page info-page policy-page">
      <SiteHero section={null} title={title} icon="info" />
      <nav className="info-index" aria-label="Policies">
        <a href="/info"><b>← Info</b></a>
        {LINKS.map(([h, l]) => <a key={h} href={h} aria-current={h === href ? "page" : undefined}>{l}</a>)}
      </nav>
      <p className="policy-flag">
        <b>Draft for review</b> — adapted from everyCircle&apos;s policy. The operating company, contact email and mailing
        address are <b>[TO BE DECIDED]</b>. Some sections describe things onebigHUB doesn&apos;t have yet (mobile apps,
        SMS texts, marketplace payments, a Cookie Policy) and need a legal review before launch.
      </p>
      <article className="policy-body">
        <h1>{title}</h1>
        {render(blocks)}
      </article>
    </div>
  );
}
