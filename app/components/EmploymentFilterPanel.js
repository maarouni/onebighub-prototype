"use client";

import ListingTypeBox from "./ListingTypeBox";

import { useState } from "react";
import {
  COMP_OPTIONS,
  SORT_OPTIONS,
  DATE_POSTED_OPTIONS,
  EMPLOYMENT_LEVELS,
  EMPLOYMENT_TYPES,
  REGION_GROUPS,
  INDUSTRIES,
  EMPTY_JOB_FILTERS,
  countJobsFor,
  FORMAT_OPTIONS, TYPE_OPTIONS, LEVEL_OPTIONS, REFERRAL_OPTIONS,
} from "../lib/employmentTaxonomy";
import { CATEGORY_GROUPS } from "../lib/taxonomy";
import { FilterShell, Box, Option, CheckList, DateBox, DigestBox, RegionBoxes, AdTypesBox, BothBox, RefIcon, GroupHead, GroupedBox } from "./FilterKit";

// Employment filters — same shared structure as One Big Calendar.
export default function EmploymentFilterPanel({ jobs, filters, setFilters, today, q, onHide, onDisplay }) {
  const count = (section, value) =>
    countJobsFor(jobs, filters, section, { [section]: section === "posted" ? value : [value] }, today, q);
  const kit = { filters, setFilters, count };
  const [groupOpen, setGroupOpen] = useState(true);
  const fmt = filters.format || [];
  // Nov 20 (Cesar, "Classifieds" email — One Big Table Employment): Date Posted ·
  // Offering $ Referrals · yellow "Employment" header → Format · Type · Level ·
  // Minimum Compensation · Ad Type · Add Selections · Categories · Industries · Regions.
  return (
    <FilterShell compact onHide={onHide} onClear={() => setFilters(EMPTY_JOB_FILTERS)} onDisplay={onDisplay}>
      <ListingTypeBox current="Careers" view="table" />
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <BothBox title="Offering $ Referrals" icon={<RefIcon />} field="referrals" options={REFERRAL_OPTIONS} {...kit} />
      <GroupHead title="Employment" open={groupOpen} onToggle={() => setGroupOpen((o) => !o)} />
      {groupOpen && (
        <>
          <Box title="Format" hint="Select one" defaultOpen={fmt.length > 0}>
            {FORMAT_OPTIONS.map((o) => (
              <Option key={o} type="radio" name="emp-fmt" checked={fmt[0] === o} label={o} count={count("format", o)}
                onChange={() => setFilters((f) => ({ ...f, format: [o] }))} />
            ))}
          </Box>
          <Box title="Type" hint="If applicable" defaultOpen={filters.type.length > 0}><CheckList field="type" options={TYPE_OPTIONS} allLabel="No Response" {...kit} /></Box>
          <Box title="Level" defaultOpen={filters.level.length > 0}><CheckList field="level" options={LEVEL_OPTIONS} allLabel="No Response" {...kit} /></Box>
          <Box title="Minimum Compensation" defaultOpen={filters.comp.length > 0}><CheckList field="comp" options={COMP_OPTIONS} {...kit} /></Box>
        </>
      )}
      <AdTypesBox title="Ad Type" {...kit} />
      <DigestBox digest="My Listings Digest" />
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
        <SubmitIndustry />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}


function SubmitIndustry() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="fp-submit-here">
      {!open && !sent && (
        <button type="button" className="link-btn" onClick={() => setOpen(true)}>+ Submit Here (suggest an industry)</button>
      )}
      {open && !sent && (
        <form
          className="fp-submit-form"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <input type="text" placeholder="Industry name" required />
          <button type="submit" className="btn-primary btn-sm">Submit</button>
        </form>
      )}
      {sent && <div className="fp-flash">Thanks — sent for review.</div>}
    </div>
  );
}
