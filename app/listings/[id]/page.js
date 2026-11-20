"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FindDetail from "../../components/FindDetail";
import { Glyph } from "../../components/Icons";
import { mmddyy } from "../../components/ListingTable";
import { cityCode } from "../../lib/cityCodes";
import { fetchListings, costLabel, TYPE_GLYPH, LISTING_TYPE_MENU } from "../../lib/listings";

// Nov 19 (Cesar's Figma "Find Listings"): Find Product / Service / Membership /
// Subscription / Survey / Classifieds / Hospitality / Investment /
// Pay-It-Forward Details — shared FindDetail template.
const regions = (x) => [["Regions - CA Bay Area", x.region], ["Regions - California", x.state === "CA" || !x.state ? "California" : ""], ["Regions - US National", ""], ["Regions - International", ""]];

export default function ListingDetail() {
  const { id } = useParams();
  const [all, setAll] = useState([]);
  const [l, setL] = useState(undefined);
  useEffect(() => { fetchListings().then((list) => { setL(list.find((x) => x.id === id) || null); setAll(list); }); }, [id]);
  const same = l ? all.filter((x) => x.type === l.type) : [];
  const menu = l ? LISTING_TYPE_MENU.find((t) => t.id === l.type) : null;
  const label = l ? (l.type === "Classified" ? "Classifieds" : l.type) : "";
  return (
    <FindDetail
      typeId={l?.type} typeLabel={label} icon={TYPE_GLYPH[l?.type] || "idxProduct"}
      item={l} items={same} hrefOf={(x) => `/listings/${x.id}`}
      notFound={<>Couldn&rsquo;t find that listing. <a href="/listings">Back to One Big Table</a></>}
      rowOf={(x) => ({
        id: x.id, href: `/listings/${x.id}`, left: null, premier: x.premier, alwaysImg: true, imageIcon: TYPE_GLYPH[x.type],
        title: <>{x.type} • {x.name}</>,
        lines: x.premier
          ? [<i key="d">{x.description}</i>, <b key="o">{x.offeredBy}</b>, [(x.delivery || []).join(" / "), x.industry].filter(Boolean).join(" • "), cityCode({ city: x.city }), `${costLabel(x)} • Expires ${mmddyy(x.expires)}`]
          : [x.offeredBy, cityCode({ city: x.city }), `${costLabel(x)} • Expires ${mmddyy(x.expires)}`],
        posted: `Posted / Revised ${mmddyy(x.posted)}`,
        imageNode: <Glyph name={TYPE_GLYPH[x.type] || "idxProduct"} size={24} />,
      })}
      title={l?.name} brief={l?.description}
      facts={l ? [
        ["Expires", mmddyy(l.expires)],
        ["$ Offering $ Referrals", l.referrals ? "Yes" : "No"],
        ["Description", l.description],
        ["Format", (l.delivery || []).join(" / ")],
        ["Cost", costLabel(l)],
        ["Categories", (l.categories || []).join(", ") || menu?.label],
        ["Industries", l.industry],
        ["Location", (l.delivery || []).includes("In-Person") ? l.offeredBy : "Online"],
        ["Address", l.address || ""],
        ["City, State", `${l.city}, ${l.state || "CA"}`],
        ...regions(l),
      ] : []}
      fullDescription={l?.details}
      contact={l ? { name: l.contact || "Name, Title", business: l.offeredBy, phone: l.phone, email: l.email, city: `${l.city}, ${l.state || "CA"}` } : null}
      submittedBy={l ? { name: l.offeredBy, business: l.offeredBy, city: `${l.city}, ${l.state || "CA"}` } : null}
    />
  );
}
