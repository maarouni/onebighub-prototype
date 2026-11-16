"use client";

import { FilterShell, Box, CheckList, DateBox, RegionBoxes, Option } from "./FilterKit";
import ListingTypeBox from "./ListingTypeBox";
import {
  DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, DELIVERY_OPTIONS, COST_OPTIONS,
  INDUSTRIES, REGION_GROUPS, EMPTY_LISTING_FILTERS, countListingsFor, TYPE_BOXES,
} from "../lib/listings";
import { CATEGORY_GROUPS } from "../lib/taxonomy";
import { GroupedBox } from "./FilterKit";

// One Big Table of Listings filters (Cesar's Figma Rev 261116). Products,
// Services, Memberships, Subscriptions and Surveys share the same filters;
// Classifieds, Hospitality, Investments and Pay-It-Forward add their own boxes.
export default function ListingsFilterPanel({ items, filters, setFilters, today, q, onHide, onDisplay, digestMode, setDigestMode }) {
  const count = (key, v) => countListingsFor(items, filters, { [key]: key === "posted" ? v : [v] }, today, q);
  const kit = { filters, setFilters, count };
  const type = filters.type[0] || null;
  const toggleTag = (t) => setFilters((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }));
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_LISTING_FILTERS)} onDisplay={onDisplay}>
      <ListingTypeBox current={type} onPick={(id) => setFilters((f) => ({ ...f, type: id ? [id] : [], tags: [] }))} />
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <Box title="Offering $ Referrals">
        <CheckList field="referrals" options={REFERRAL_OPTIONS} {...kit} all={false} />
      </Box>
      {(TYPE_BOXES[type] || []).map((b, i) => (
        <Box key={i} title={b.title} defaultOpen={i === 0}>
          <Option type="radio" name={`tb-${i}`} checked={!b.options.some((o) => filters.tags.includes(o))} onChange={() => setFilters((f) => ({ ...f, tags: f.tags.filter((t) => !b.options.includes(t)) }))} label="None" def />
          {b.options.map((o) => <Option key={o} checked={filters.tags.includes(o)} onChange={() => toggleTag(o)} label={o} />)}
        </Box>
      ))}
      {type !== "Pay-It-Forward" && (
        <Box title="Format">
          <CheckList field="delivery" options={DELIVERY_OPTIONS} {...kit} all={false} />
        </Box>
      )}
      <Box title={type === "Investment" ? "Cost / Seeking" : "Cost"}>
        <CheckList field="cost" options={COST_OPTIONS} {...kit} />
      </Box>
      <Box title={<>☆ Add Selections to My Digest</>} hint="Select one">
        <Option type="radio" name="lt-digest" checked={digestMode !== "auto"} onChange={() => setDigestMode?.("manual")} label="Manually" def />
        <Option type="radio" name="lt-digest" checked={digestMode === "auto"} onChange={() => setDigestMode?.("auto")} label="Automatically" />
        <p className="fp-aside"><i>Saves time and is a useful reminder to see updates (My Notification Digest)</i></p>
      </Box>
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
