"use client";

import SiteHero from "./SiteHero";

// Every section page uses this template (Cesar, Oct 19: "most pages are
// templates"). The top is the shared SiteHero — yellow title bar (gray on
// EDIT pages), hero box, section tiles, the section's action row and
// "Connect with us !" — then a white intro box and the page content.
// Usage: <PageTemplate section="employment" mode="edit" title="..." intro="...">
export default function PageTemplate({
  section,
  mode = "output", // "output" | "edit"
  status = "done", // "done" | "construction"
  spacer = false,
  title,
  subtitle,
  intro,
  actions,
  children,
  narrow = false,
  subnav = null,   // no longer used: SiteHero builds every row (Nov 7 Figma)
  activeAction,
  icon,
  legend,          // kept for compatibility; the color legend is no longer shown
  tiles = true,    // false: no hub tiles (Registration pages, Nov 8 Figma)
}) {
  return (
    <div className={`tpl tpl-mode-${mode} ${narrow ? "tpl-narrow" : ""}`}>
      <SiteHero
        section={section}
        mode={mode}
        title={<>{title}{subtitle && <em className="pb-sub">{subtitle}</em>}</>}
        icon={icon}
        activeAction={activeAction}
        intro={intro}
        tiles={tiles}
      />

      {(actions || status === "construction") && (
        <div className="tpl-intro">
          <div />
          {(actions || status === "construction") && (
            <div className="tpl-intro-right">
              {status === "construction" && <span className="tpl-flag">Under construction</span>}
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Nov 10: keep the gap where an actions box used to be */}
      {spacer && !actions && <div className="tpl-spacer" aria-hidden="true" />}

      {children && <div className={`tpl-body ${mode === "edit" ? "tpl-body-edit" : ""}`}>{children}</div>}
    </div>
  );
}
