"use client";

import { useState } from "react";
import { FilterShell, Box, Sub, CheckList, DateBox, RegionBoxes, Option, BothBox, RefIcon, AdTypesBox, GroupedBox, GroupHead } from "./FilterKit";
import ListingTypeBox from "./ListingTypeBox";
import {
  DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, DELIVERY_OPTIONS, COST_OPTIONS, INVEST_COST_OPTIONS,
  INDUSTRIES, REGION_GROUPS, EMPTY_LISTING_FILTERS, countListingsFor, TYPE_BOXES, tagValue,
} from "../lib/listings";
import { CATEGORY_GROUPS } from "../lib/taxonomy";

// "Label|italic" → Label <i>italic</i>
const lbl = (s) => { const [a, b] = s.split("|"); return b ? <>{a} <i>{b}</i></> : a; };

// One Big Table of Listings filters. Products, Services, Memberships,
// Subscriptions and Surveys share the same filters. Nov 20 (Cesar, "Find
// Classifieds" 9:29 PM + "Classifieds" 10:32 PM): Classifieds, Hospitality,
// Investments and Pay-It-Forward get a yellow "<Type> — Select all that apply"
// header followed by collapsed sub-section boxes, each in Figma's order.
export default function ListingsFilterPanel({ items, filters, setFilters, today, q, onHide, onDisplay, digestMode, setDigestMode, view = "table" }) {
  const count = (key, v) => countListingsFor(items, filters, { [key]: key === "posted" ? v : [v] }, today, q);
  const kit = { filters, setFilters, count };
  const type = filters.type[0] || null;
  const tb = TYPE_BOXES[type];
  const [groupOpen, setGroupOpen] = useState(true);
  const toggleTag = (t) => setFilters((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }));
  const clearTags = (vals) => setFilters((f) => ({ ...f, tags: f.tags.filter((t) => !vals.includes(t)) }));

  const costOpts = type === "Investment" ? INVEST_COST_OPTIONS : COST_OPTIONS;
  const costBox = (title, open = true) => (
    <Box title={title} defaultOpen={open || filters.cost.length > 0}>
      <CheckList field="cost" options={costOpts} {...kit} />
    </Box>
  );

  const subBox = (b) => {
    if (b.cost) return <Box key={b.key} title={lbl(b.title)} defaultOpen={filters.cost.length > 0}><CheckList field="cost" options={COST_OPTIONS} {...kit} /></Box>;
    const vals = b.sections.flatMap((s) => s.options.map((o) => tagValue(b.key, o)));
    const any = vals.some((v) => filters.tags.includes(v));
    return (
      <Box key={b.key} title={lbl(b.title)} defaultOpen={any}>
        <Option type="radio" name={`tb-${b.key}`} checked={!any} onChange={() => clearTags(vals)} label="None" def />
        {b.sections.map((s, i) => {
          const opts = s.options.map((o) => { const v = tagValue(b.key, o); return <Option key={v} checked={filters.tags.includes(v)} onChange={() => toggleTag(v)} label={lbl(o)} count={count("tags", v)} />; });
          return s.head ? <Sub key={i} title={s.head}>{opts}</Sub> : <div key={i}>{opts}</div>;
        })}
      </Box>
    );
  };

  const fmtVals = ["fmt:Offering", "fmt:Seeking"];
  const fmtCur = fmtVals.find((v) => filters.tags.includes(v));

  return (
    <FilterShell compact onHide={onHide} onClear={() => setFilters(EMPTY_LISTING_FILTERS)} onDisplay={onDisplay}>
      <ListingTypeBox current={type} view={view} onPick={(id) => setFilters((f) => ({ ...f, type: id ? [id] : [], tags: [], cost: [] }))} />
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <BothBox title="Offering $ Referrals" icon={<RefIcon />} field="referrals" options={REFERRAL_OPTIONS} {...kit} />

      {type === "Pay-It-Forward" && (
        <Box title="Format" hint="Select one">
          {fmtVals.map((v) => (
            <Option key={v} type="radio" name="pif-fmt" checked={fmtCur === v} label={v.slice(4)}
              onChange={() => setFilters((f) => ({ ...f, tags: [...f.tags.filter((t) => !fmtVals.includes(t)), v] }))} />
          ))}
        </Box>
      )}

      {tb && (
        <>
          <GroupHead title={tb.group} open={groupOpen} onToggle={() => setGroupOpen((o) => !o)} />
          {groupOpen && tb.boxes.map(subBox)}
        </>
      )}

      {/* Cesar (Nov 20, Find Hospitality): Format sits below the Event Type / Services / Venues boxes */}
      {(!tb || type === "Hospitality" || type === "Investment") && <BothBox title="Format" field="delivery" options={DELIVERY_OPTIONS} {...kit} />}
      {type !== "Pay-It-Forward" && costBox(type === "Investment" ? "Cost / Seeking" : "Cost")}
      {type !== "Pay-It-Forward" && <AdTypesBox title="Ad Type" {...kit} />}
      <Box title={<>☆ Add Selections to My Digest</>} hint="Select one">
        <Option type="radio" name="lt-digest" checked={digestMode !== "auto"} onChange={() => setDigestMode?.("manual")} label="Manually" def />
        <Option type="radio" name="lt-digest" checked={digestMode === "auto"} onChange={() => setDigestMode?.("auto")} label="Automatically" />
        <p className="fp-aside"><i>Saves time and is a useful reminder to see updates (My Notification Digest)</i></p>
      </Box>
      {type !== "Classified" && type !== "Hospitality" && (
        <>
          <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
          <Box title="Industries" defaultOpen={filters.industry.length > 0}>
            <CheckList field="industry" options={INDUSTRIES} {...kit} />
          </Box>
        </>
      )}
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
