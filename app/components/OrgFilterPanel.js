"use client";

import { useState } from "react";
import { FOLLOW_UP, RELATIONSHIP_GROUPS } from "../lib/connect";
import { FilterShell, Box, Sub, Option, CheckList, DateBox, GroupedBox, DigestBox, RegionBoxes } from "./FilterKit";
import {
  DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, CONNECTION_TYPES, AD_TYPES, SEEKING_EMPLOYMENT, CONN_LEVELS, CONN_COMP, MEMBER_OPTIONS, DUES_OPTIONS, MEMBERSHIP_STATUSES,
  CATEGORY_GROUPS, INDUSTRIES, REGION_GROUPS, EMPTY_ORG_FILTERS, countOrgsFor,
} from "../lib/organizations";

// Connections filters — Figma Nov 9: combined boxes (Seeking Employment holds
// Level + Compensation; Memberships holds # Members + Annual Dues). Digest
// adds Sets, My Follow-Up Status, My Relationships, My Membership Status and
// "2 Save Filter Set".
export default function OrgFilterPanel({ items, filters, setFilters, ctx, onHide, onDisplay, digest = false, setName = "none", onPickSet, onSaveSet, onClearSet, sets = {} }) {
  const count = (key, v) => countOrgsFor(items, filters, { [key]: key === "posted" ? v : [v] }, ctx);
  const kit = { filters, setFilters, count };
  const [follow, setFollow] = useState([]);
  const [rel, setRel] = useState([]);
  const tog = (list, set) => (v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const savePill = digest && (
    <button type="button" className="fp-submit-pill" onClick={onSaveSet} disabled={setName === "none"}
      data-tip={setName === "none" ? "Pick Filter Set A, B or C first" : `Save current filters as Set ${setName}`}>
      <span className="step-badge" aria-hidden="true">2</span>
      Save Filter Set{setName !== "none" && <em> {setName}</em>}
    </button>
  );
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_ORG_FILTERS)} footer={savePill}>
      {digest && (
        <Box title="Sets" hint="Select one">
          <Option type="radio" name="org-filter-set" checked={setName === "none"} onChange={() => onPickSet("none")} label="No Filters" def />
          {["A", "B", "C"].map((n) => (
            <div key={n} className="fp-set-row">
              <Option type="radio" name="org-filter-set" checked={setName === n} onChange={() => onPickSet(n)}
                label={`Filter Set ${n}${sets[n] ? "" : " (empty)"}`} />
              {sets[n] && onClearSet && (
                <button type="button" className="fp-set-x" aria-label={`Delete Filter Set ${n}`} data-tip="Delete set" onClick={() => onClearSet(n)}>
                  <svg width="13" height="13" viewBox="0 0 30 30" aria-hidden="true" fill="none" stroke="#111" strokeWidth="2" strokeLinejoin="round"><path d="M6 9.2 9.2 6 15 11.8 20.8 6 24 9.2 18.2 15 24 20.8 20.8 24 15 18.2 9.2 24 6 20.8 11.8 15Z" /></svg>
                </button>
              )}
            </div>
          ))}
        </Box>
      )}
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      <Box title="Offering $ Referrals"><CheckList field="referral" options={REFERRAL_OPTIONS} all={false} {...kit} /></Box>
      {digest ? (
        <>
          <Box title="My Follow-Up Status" hint="Select all that apply">
            <Option type="radio" name="org-follow-all" checked={!follow.length} onChange={() => setFollow([])} label="All - My Network" def />
            {FOLLOW_UP.map((f) => (
              <Option key={f.id} checked={follow.includes(f.id)} onChange={() => tog(follow, setFollow)(f.id)}
                label={<>{f.hot ? <>05 <b className="cw-hot">HOT !</b></> : f.label} <i>{f.hint}</i></>} />
            ))}
          </Box>
          <Box title="My Relationships" hint="Select all that apply">
            <Option type="radio" name="org-rel-all" checked={!rel.length} onChange={() => setRel([])} label="All" def />
            <Option checked={rel.includes("referrals")} onChange={() => tog(rel, setRel)("referrals")} label="My Referrals / Circles of Influence" />
            {RELATIONSHIP_GROUPS.map((g) => (
              <Sub key={g.group + (g.sub || "")} title={g.group} hint={g.sub}>
                {g.options.map(([id, label]) => <Option key={id} checked={rel.includes(id)} onChange={() => tog(rel, setRel)(id)} label={label} />)}
              </Sub>
            ))}
          </Box>
        </>
      ) : (
        <Box title="Types"><CheckList field="ctype" options={CONNECTION_TYPES} {...kit} /></Box>
      )}
      <Box title="Ad Types"><CheckList field="adtype" options={AD_TYPES} all={false} {...kit} /></Box>
      <Box title="Seeking Employment">
        <CheckList field="seeking" options={SEEKING_EMPLOYMENT} {...kit} />
        <Sub title="Employment Level"><CheckList field="level" options={CONN_LEVELS} {...kit} /></Sub>
        <Sub title="Minimum Compensation"><CheckList field="comp" options={CONN_COMP} {...kit} allLabel="No Response" /></Sub>
      </Box>
      {digest && <Box title="My Membership Status" hint="if applicable"><CheckList field="status" options={MEMBERSHIP_STATUSES} {...kit} /></Box>}
      <Box title="Memberships">
        <Sub title="# Members" hint="if applicable"><CheckList field="members" options={MEMBER_OPTIONS} {...kit} /></Sub>
        <Sub title="Annual Dues" hint="if applicable"><CheckList field="dues" options={DUES_OPTIONS} {...kit} /></Sub>
      </Box>
      {!digest && <DigestBox digest="My Connections Digest" />}
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
