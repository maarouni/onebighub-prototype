"use client";
import { REGION_GROUPS, regionPath } from "../../lib/taxonomy";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FindDetail from "../../components/FindDetail";
import { Glyph } from "../../components/Icons";
import { mmddyy } from "../../components/ListingTable";
import { cityCode } from "../../lib/cityCodes";
import { fetchJobs, compLabel } from "../../lib/jobs";

// Nov 19 (Cesar's Figma "Find Listings"): Find Employment Details — shared FindDetail template.
const regions = (x) => { const rp = regionPath(x.region); return REGION_GROUPS.map((g) => [g.group, rp[g.key] || ""]); };

export default function JobDetail() {
  const { id } = useParams();
  const [all, setAll] = useState([]);
  const [j, setJ] = useState(undefined);
  useEffect(() => { fetchJobs().then((list) => { setJ(list.find((x) => x.id === id) || null); setAll(list); }); }, [id]);
  return (
    <FindDetail
      typeId="Careers" typeLabel="Employment" icon="idxBriefcase" section="employment"
      item={j} items={all} hrefOf={(x) => `/employment/${x.id}`}
      notFound={<>Couldn&rsquo;t find that job. <a href="/employment">Back to One Big Table - Employment</a></>}
      rowOf={(x) => ({
        id: x.id, href: `/employment/${x.id}`, left: null, premier: x.premier, alwaysImg: true, imageIcon: "idxBriefcase",
        title: <>Career / Job • {x.title}</>,
        lines: x.premier
          ? [<i key="l">{[(x.types || []).join(", "), x.level].filter(Boolean).join(" • ")}</i>, <b key="c">{x.company}</b>, x.industry, cityCode({ city: x.city }), compLabel(x)]
          : [x.company, cityCode({ city: x.city }), compLabel(x)],
        posted: `Posted / Revised ${mmddyy(x.posted)}`,
        imageNode: <Glyph name="idxBriefcase" size={24} />,
      })}
      title={j?.title} brief={j ? `${j.company} • ${j.industry}` : ""}
      facts={j ? [
        ["Expires", mmddyy(j.expires)],
        ["$ Offering $ Referrals", j.referral ? "Yes" : "No"],
        ["Employment Format", (j.types || []).filter((t) => /hybrid|in-person|remote/i.test(t)).join(", ")],
        ["Employment Type", (j.types || []).filter((t) => !/hybrid|in-person|remote/i.test(t)).join(", ")],
        ["Employment Level", j.level],
        ["Compensation", compLabel(j)],
        ["Industries", j.industry],
        ["Location", j.company],
        ["City, State", `${j.city}, CA`],
        ...regions(j),
      ] : []}
      fullDescription={j?.description}
      contact={j ? { name: j.contact || "Name, Title", business: j.company, phone: j.phone, email: j.email, city: `${j.city}, CA` } : null}
      submittedBy={j ? { name: j.company, business: j.company, city: `${j.city}, CA` } : null}
    />
  );
}
