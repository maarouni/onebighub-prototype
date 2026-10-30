"use client";

import { FilterShell, Box, Option, CheckList, DateBox, GroupedBox, DigestBox, RegionBoxes } from "./FilterKit";
import {
  DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, CONNECTION_TYPES, AD_TYPES, SEEKING_EMPLOYMENT, CONN_LEVELS, CONN_COMP, MEMBER_OPTIONS, DUES_OPTIONS, MEMBERSHIP_STATUSES,
  CATEGORY_GROUPS, INDUSTRIES, REGION_GROUPS, EMPTY_ORG_FILTERS, countOrgsFor,
} from "../lib/organizations";

// Connections filters — same shared structure as One Big Calendar.
export default function OrgFilterPanel({ items, filters, setFilters, ctx, onHide, onDisplay, digest = false, setName = "none", onPickSet, onSaveSet, sets = {} }) {
  const count = (key, v) => countOrgsFor(items, filters, { [key]: key === "posted" ? v : [v] }, ctx);
  const kit = { filters, setFilters, count };
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_ORG_FILTERS)} onDisplay={onDisplay}>
      {digest && (
        <Box title="Sets" hint="Select one">
          <Option type="radio" name="org-filter-set" checked={setName === "none"} onChange={() => onPickSet("none")} label="No Filters" def />
          {["A", "B", "C"].map((n) => (
            <Option key={n} type="radio" name="org-filter-set" checked={setName === n} onChange={() => onPickSet(n)}
              label={`Filter Set ${n}${sets[n] ? "" : " (empty)"}`} />
          ))}
          <button type="button" className="fp-set-save" disabled={setName === "none"} onClick={onSaveSet}>
            Save current filters as Set {setName === "none" ? "…" : setName}
          </button>
        </Box>
      )}
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <Box title="Offering $ Referrals"><CheckList field="referral" options={REFERRAL_OPTIONS} all={false} {...kit} /></Box>
      <Box title="Types"><CheckList field="ctype" options={CONNECTION_TYPES} {...kit} /></Box>
      <Box title="Seeking Employment"><CheckList field="seeking" options={SEEKING_EMPLOYMENT} {...kit} /></Box>
      <Box title="Employment Level"><CheckList field="level" options={CONN_LEVELS} {...kit} /></Box>
      <Box title="Minimum Compensation"><CheckList field="comp" options={CONN_COMP} {...kit} allLabel="No Response" /></Box>
      <Box title="Ad Types"><CheckList field="adtype" options={AD_TYPES} all={false} {...kit} /></Box>
      <Box title="# Members"><CheckList field="members" options={MEMBER_OPTIONS} {...kit} /></Box>
      <Box title="Annual Dues"><CheckList field="dues" options={DUES_OPTIONS} {...kit} /></Box>
      {digest && <Box title="My Membership Status"><CheckList field="status" options={MEMBERSHIP_STATUSES} {...kit} /></Box>}
      {!digest && <DigestBox digest="My Connections Digest" />}
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
