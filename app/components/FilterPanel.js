"use client";

import { FilterShell, Box, CheckList, DateBox, GroupedBox, DigestBox, RegionBoxes, BothBox, RefIcon } from "./FilterKit";
import { COST_OPTIONS, REGION_GROUPS, CATEGORY_GROUPS, EMPTY_FILTERS, CAL_POSTED_OPTIONS, FORMAT_OPTIONS, countFor } from "../lib/taxonomy";
import { REFERRAL_OPTIONS, INDUSTRIES } from "../lib/organizations";

// One Big Calendar filters — Nov 8 (Cesar's Figma): Dates · Date Posted / Revised ·
// Offering $ Referrals · Event Costs · Format · Type · Categories · Industries ·
// Regions · Add Selections to My Calendar Digest.
export const AD_TYPE_OPTIONS = [
  { id: "regular", label: <>Regular <i>Free</i></> },
  { id: "premier", label: "Premier" },
];

export default function FilterPanel({ events, filters, setFilters, today, q, onHide, onDisplay }) {
  const count = (section, value) =>
    countFor(events, filters, section, { [section]: section === "date" || section === "posted" ? value : [value] }, today, q);
  const onlineOnly = filters.formats.length === 1 && filters.formats[0] === "Online";
  const kit = { filters, setFilters, count };

  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_FILTERS)} onDisplay={onDisplay}>
      {/* Nov 15 (Cesar Rev 261115, confirmed by Masoud): no "Dates" box — Date Posted / Revised comes first */}
      {/* Nov 17 (Cesar's Figma): Past 7 days default; Both / No / Yes boxes; Format before Event Costs */}
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={CAL_POSTED_OPTIONS} {...kit} />
      <BothBox title="Offering $ Referrals" icon={<RefIcon />} field="referral" options={REFERRAL_OPTIONS} {...kit} />
      <BothBox title="Format" field="formats" options={FORMAT_OPTIONS} {...kit} />
      <Box title="Event Costs">
        <CheckList field="costs" options={COST_OPTIONS} {...kit} />
      </Box>
      <BothBox title="Type" field="adtypes" options={AD_TYPE_OPTIONS} {...kit} />

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
