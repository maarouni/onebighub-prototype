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
  title,
  subtitle,
  intro,
  actions,
  children,
  narrow = false,
  subnav = null,   // replaces the section action row (e.g. advertising pages)
  activeAction,
  icon,
  legend,          // kept for compatibility; the color legend is no longer shown
}) {
  return (
    <div className={`tpl tpl-mode-${mode} ${narrow ? "tpl-narrow" : ""}`}>
      <SiteHero
        section={section}
        mode={mode}
        title={<>{title}{subtitle && <em className="pb-sub">{subtitle}</em>}</>}
        icon={icon}
        activeAction={activeAction}
        secondRow={subnav}
      />

      {(intro || actions || status === "construction") && (
        <div className="tpl-intro">
          <div>{intro}</div>
          {(actions || status === "construction") && (
            <div className="tpl-intro-right">
              {status === "construction" && <span className="tpl-flag">Under construction</span>}
              {actions}
            </div>
          )}
        </div>
      )}

      {children && <div className={`tpl-body ${mode === "edit" ? "tpl-body-edit" : ""}`}>{children}</div>}
    </div>
  );
}
