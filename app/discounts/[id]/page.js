"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FindDetail from "../../components/FindDetail";
import { Glyph } from "../../components/Icons";
import { mmddyy } from "../../components/ListingTable";
import { cityCode } from "../../lib/cityCodes";
import { fetchDiscounts, discountLabel } from "../../lib/discounts";

// Nov 19 (Cesar's Figma "Find Listings"): Find Deal Details — shared FindDetail template.
const regions = (x) => [["Regions - CA Bay Area", x.region], ["Regions - California", "California"], ["Regions - US National", ""], ["Regions - International", ""]];

export default function DealDetail() {
  const { id } = useParams();
  const [all, setAll] = useState([]);
  const [d, setD] = useState(undefined);
  useEffect(() => { fetchDiscounts().then((list) => { setD(list.find((x) => x.id === id) || null); setAll(list); }); }, [id]);
  return (
    <FindDetail
      typeId="Deals" typeLabel="Deal" icon="discount" section="discounts"
      item={d} items={all} hrefOf={(x) => `/discounts/${x.id}`}
      notFound={<>Couldn&rsquo;t find that deal. <a href="/discounts">Back to One Big Table - Deals</a></>}
      rowOf={(x) => ({
        id: x.id, href: `/discounts/${x.id}`, left: null, premier: x.premier, alwaysImg: true, imageIcon: "discount",
        title: <>Deal • {x.offer}</>,
        lines: x.premier
          ? [<i key="d">{x.description}</i>, <b key="c">{x.company}</b>, [(x.redeem || []).join(" / "), x.industry].filter(Boolean).join(" • "), cityCode({ city: x.city }), `${discountLabel(x)} • Expires ${mmddyy(x.expires)}`]
          : [x.company, cityCode({ city: x.city }), `${discountLabel(x)} • Expires ${mmddyy(x.expires)}`],
        posted: `Posted / Revised ${mmddyy(x.posted)}`,
        imageNode: <Glyph name="discount" size={24} />,
      })}
      title={d?.offer} brief={d?.description}
      facts={d ? [
        ["Discount / Gift Certificate", (d.types || [d.type]).filter(Boolean).join(", ")],
        ["Discount", discountLabel(d)],
        ["Expires", mmddyy(d.expires)],
        ["Format - Redeem Deal", (d.redeem || []).join(" / ")],
        ["Industries", d.industry],
        ["City, State", `${d.city}, CA`],
        ...regions(d),
      ] : []}
      fullDescription={d?.details || d?.instructions}
      contact={d ? { name: d.contact || "Name, Title", business: d.company, phone: d.phone, email: d.email, city: `${d.city}, CA` } : null}
      submittedBy={d ? { name: d.company, business: d.company, city: `${d.city}, CA` } : null}
    />
  );
}
