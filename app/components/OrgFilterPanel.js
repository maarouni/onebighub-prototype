"use client";

import { useState } from "react";
import { FilterShell, Box, Sub, Option, CheckList, DateBox, GroupedBox, DigestBox, RegionBoxes, BothBox, RefIcon, AdTypesBox } from "./FilterKit";
import {
  DATE_POSTED_OPTIONS, REFERRAL_OPTIONS, CONNECTION_TYPES, AD_TYPES, SEEKING_EMPLOYMENT, CONN_LEVELS, CONN_COMP, MEMBER_OPTIONS, DUES_OPTIONS, MEMBERSHIP_STATUSES,
  CATEGORY_GROUPS, INDUSTRIES, REGION_GROUPS, EMPTY_ORG_FILTERS, countOrgsFor,
} from "../lib/organizations";

// Connections filters — Figma Nov 9: combined boxes (Seeking Employment holds
// Level + Compensation; Memberships holds # Members + Annual Dues). Digest
// adds Sets, My Follow-Up Status, My Relationships, My Membership Status and
// "2 Save Filter Set".
// Nov 13 (Cesar): "Profile Types" box (All · Individual · Business · Organization
// · Group) now comes before Date Posted / Revised, on Connections and the Digest.
const DIGEST_FOLLOW = [["all", "All"], ["none", "None"], ["01", "01 Cold", "Doubtful"], ["02", "02 Mild", "Maybe"], ["03", "03 Medium", "Sometime"], ["04", "04 Warm", "Soon"], ["05", "05 HOT !", "Very Soon"]];
const DIGEST_REL = [["all", "All"], ["none", "None"], ["referral", "Referral"], ["connection", "Connection"], ["colleague", "Colleague"], ["friend", "Friend"], ["family", "Family"]];
const NETWORK_LEVELS = [["all", "All"], ["none", "None"], ["intro1", "My Introductions", "Level 1"], ["c1", "My Connect", "Level 1"], ["c2", "My Connect", "Level 2"], ["c3", "My Connect", "Level 3"]];
const EMPLOYEE_RANGES = ["All", "0 - 5", "6 - 20", "21 - 50", "51 - 100", "101 - 250", "251 - 500", "501 +"];
const PROFILE_TYPES = [["Individual", ["indPersonal", "indProfessional"]], ["Business", ["biz"]], ["Organization", ["org"]], ["Group", ["group"]]];

export default function OrgFilterPanel({ items, filters, setFilters, ctx, onHide, onDisplay, digest = false, setName = "none", onPickSet, onSaveSet, onClearSet, sets = {} }) {
  const count = (key, v) => countOrgsFor(items, filters, { [key]: key === "posted" ? v : [v] }, ctx);
  const kit = { filters, setFilters, count };
  const [follow, setFollow] = useState("all");
  const [rel, setRel] = useState([]);
  const [levels, setLevels] = useState([]);
  const [empMode, setEmpMode] = useState("none");
  const [emps, setEmps] = useState("none");
  const tog = (list, set) => (v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const savePill = digest && (
    <button type="button" className="fp-submit-pill fp-set-pill" onClick={onSaveSet} disabled={setName === "none"}
      data-tip={setName === "none" ? "Pick Filter Set A, B or C first" : `Save current filters as Set ${setName}`}>
      <span className="step-badge" aria-hidden="true">2</span>
      SAVE Filter Set{setName !== "none" && <em> {setName}</em>}
    </button>
  );
  return (
    <FilterShell onHide={onHide} onClear={() => setFilters(EMPTY_ORG_FILTERS)}>
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
          {savePill}
        </Box>
      )}
      <Box title="Profile Types">
        <Option type="radio" name="org-ptype-all" checked={!filters.ctype.length} onChange={() => setFilters((f) => ({ ...f, ctype: [] }))} label="All" def />
        {PROFILE_TYPES.map(([label, ids]) => (
          <Option key={label} checked={ids.every((i) => filters.ctype.includes(i))}
            onChange={() => setFilters((f) => {
              const on = ids.every((i) => f.ctype.includes(i));
              return { ...f, ctype: on ? f.ctype.filter((x) => !ids.includes(x)) : [...new Set([...f.ctype, ...ids])] };
            })} label={label} />
        ))}
      </Box>
      <DateBox title="Date Posted / Revised" field="posted" fromKey="postedFrom" toKey="postedTo" options={DATE_POSTED_OPTIONS} {...kit} />
      {digest && (
        <>
          {/* Nov 19 (Cesar's Figma, Connect My Digest) */}
          <Box title="My Follow-Up Status" hint="Select one">
            {DIGEST_FOLLOW.map(([id, label, hint]) => (
              <Option key={id} type="radio" name="org-follow" checked={follow === id} onChange={() => setFollow(id)} def={id === "all"}
                label={<>{id === "05" ? <>05 <b className="cw-hot">HOT !</b></> : label}{hint && <i>{hint}</i>}</>} />
            ))}
          </Box>
          <Box title="My Relationships" hint="Select up to 3">
            {DIGEST_REL.map(([id, label]) => (
              <Option key={id} checked={id === "all" ? !rel.length : rel.includes(id)} def={id === "all"} label={label}
                onChange={() => id === "all" ? setRel([]) : setRel(rel.includes(id) ? rel.filter((x) => x !== id) : rel.length < 3 ? [...rel, id] : rel)} />
            ))}
          </Box>
          <Box title="Network Levels" hint="Select all that apply">
            {NETWORK_LEVELS.map(([id, label, hint]) => (
              <Option key={id} checked={id === "all" ? !levels.length : levels.includes(id)} def={id === "all"}
                onChange={() => id === "all" ? setLevels([]) : tog(levels, setLevels)(id)} label={<>{label}{hint && <i>{hint}</i>}</>} />
            ))}
          </Box>
        </>
      )}
      <BothBox title="Offering $ Referrals" icon={<RefIcon />} field="referral" options={REFERRAL_OPTIONS} {...kit} />
      <Box title="Employment" hint="Select one, if applicable">
        {[["none", "No Response"], ["offering", "Offering"], ["seeking", "Seeking"]].map(([id, label]) => (
          <Option key={id} type="radio" name="org-emp-mode" checked={empMode === id} onChange={() => setEmpMode(id)} label={label} def={id === "none"} />
        ))}
      </Box>
      <Box title="Employment">
        <CheckList field="seeking" options={SEEKING_EMPLOYMENT} {...kit} allLabel="No Response" />
        <Sub title="Employment Level"><CheckList field="level" options={CONN_LEVELS} {...kit} allLabel="No Response" /></Sub>
        <Sub title="Minimum Compensation"><CheckList field="comp" options={CONN_COMP} {...kit} allLabel="No Response" /></Sub>
      </Box>
      <Box title="# Employees" hint="If applicable">
        <Option type="radio" name="org-emps" checked={emps === "none"} onChange={() => setEmps("none")} label="No Response" def />
        {EMPLOYEE_RANGES.map((r) => <Option key={r} type="radio" name="org-emps" checked={emps === r} onChange={() => setEmps(r)} label={r} />)}
      </Box>
      {digest && <Box title="My Membership Status" hint="If applicable"><CheckList field="status" options={MEMBERSHIP_STATUSES} {...kit} /></Box>}
      <Box title="# Members" hint="If applicable">
        <CheckList field="members" options={MEMBER_OPTIONS} {...kit} allLabel="No Response" />
        <Sub title="Annual Dues"><CheckList field="dues" options={DUES_OPTIONS} {...kit} allLabel="No Response" /></Sub>
      </Box>
      {!digest && <DigestBox digest="My Connect Digest" />}
      <AdTypesBox {...kit} />
      <GroupedBox title="Categories" field="categories" groups={CATEGORY_GROUPS} {...kit} />
      <Box title="Industries" defaultOpen={filters.industry.length > 0}>
        <CheckList field="industry" options={INDUSTRIES} {...kit} />
      </Box>
      <RegionBoxes field="region" groups={REGION_GROUPS} {...kit} />
    </FilterShell>
  );
}
