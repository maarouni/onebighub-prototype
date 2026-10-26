"use client";

import { FilterShell, Box, CheckList, DateBox, DigestBox, RegionBoxes } from "./FilterKit";
import {
  LISTING_TYPES, DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, DELIVERY_OPTIONS, COST_OPTIONS,
  INDUSTRIES, REGION_GROUPS, EMPTY_LISTING_FILTERS, countListingsFor,
} from "../lib/listings";

// Products, Services, Memberships filters — Cesar's Figma order (Rev 261026).
export default function ListingsFilterPanel({ items, filters, setFilters, today, q, onHide, onDisplay }) {
  const count = (key, v) => countListingsFor(items, filters, { [key]: key === "posted" ? v : [v] }, today, q);
  const kit = { filters, setFilters, count };
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_LISTING_FILTERS)} onDisplay={onDisplay}>
      <Box title="Types">
        <CheckList field="type" options={LISTING_TYPES} {...kit} />
      </Box>
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <Box title="Offering $ Referrals">
        <CheckList field="referrals" options={REFERRAL_OPTIONS} {...kit} />
      </Box>
      <Box title="In-Person / Online">
        <CheckList field="delivery" options={DELIVERY_OPTIONS} {...kit} />
      </Box>
      <Box title="Cost">
        <CheckList field="cost" options={COST_OPTIONS} {...kit} />
      </Box>
      <DigestBox digest="My Other Listings Digest" />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
