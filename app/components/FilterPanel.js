"use client";

import { FilterShell, Box, Option, CheckList, DateBox, GroupedBox, DigestBox, RegionBoxes } from "./FilterKit";
import { DATE_OPTIONS, COST_OPTIONS, REGION_GROUPS, CATEGORY_GROUPS, EMPTY_FILTERS, countFor } from "../lib/taxonomy";
import { DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, INDUSTRIES } from "../lib/organizations";

// One Big Calendar filters — Nov 8 (Cesar's Figma): Dates · Date Posted / Revised ·
// Offering $ Referrals · Event Costs · Format · Type · Categories · Industries ·
// Regions · Add Selections to My Calendar Digest.
export const AD_TYPE_OPTIONS = [
  { id: "regular", label: <>Regular <i>Free</i></> },
  { id: "premier", label: "Premier" },
  { id: "barter", label: <>Premier <i>Barter</i></> },
];

export default function FilterPanel({ events, filters, setFilters, today, q, onHide, onDisplay }) {
  const count = (section, value) =>
    countFor(events, filters, section, { [section]: section === "date" || section === "posted" ? value : [value] }, today, q);
  const onlineOnly = filters.formats.length === 1 && filters.formats[0] === "Online";
  const kit = { filters, setFilters, count };

  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_FILTERS)} onDisplay={onDisplay}>
      <DateBox field="date" fromKey="dateFrom" toKey="dateTo" options={DATE_OPTIONS} {...kit} />

      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />

      <Box title="Offering $ Referrals"><CheckList field="referral" options={REFERRAL_OPTIONS} all={false} {...kit} /></Box>

      <Box title="Event Costs">
        <CheckList field="costs" options={COST_OPTIONS} {...kit} />
      </Box>

      <Box title="Format">
        <CheckList field="formats" options={[{ id: "In-Person", label: "In-Person" }, { id: "Online", label: "Online / Virtual" }]} all={false} {...kit} />
      </Box>

      <Box title="Type">
        <CheckList field="adtypes" options={AD_TYPE_OPTIONS} all={false} {...kit} />
      </Box>

      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />

      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>

      <RegionBoxes field="regions" groups={REGION_GROUPS} disabled={onlineOnly}
        note={onlineOnly ? "Online only is selected — regions don't apply." : null} {...kit} />

      {/* Oct 30 (Cesar): this pull-down sits below Regions */}
      <DigestBox digest="My Calendar Digest" />
    </FilterShell>
  );
}
