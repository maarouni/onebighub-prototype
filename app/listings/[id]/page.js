"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import PageTemplate from "../../components/PageTemplate";
import { Glyph, IconButton } from "../../components/Icons";
import { HostAvatar, shortDate } from "../../components/EventVisuals";
import { fetchListings, costLabel } from "../../lib/listings";

const SEL_KEY = "mc_listing_selection_v1";

// Product / Service / Membership details. Cesar's detail template for this
// section is still a copy of Employment, so the fields follow the list row.
export default function ListingDetail() {
  const { id } = useParams();
  const [l, setL] = useState(undefined);
  const [qr, setQr] = useState(null);
  const [saved, setSaved] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    fetchListings().then((list) => setL(list.find((x) => x.id === id) || null));
    try { setSaved(!!JSON.parse(localStorage.getItem(SEL_KEY) || "{}")[id]); } catch {}
    QRCode.toDataURL(`${window.location.origin}/listings/${id}`, { width: 240, margin: 1 }).then(setQr).catch(() => {});
  }, [id]);

  if (l === undefined) return <div className="tpl"><p>Loading…</p></div>;
  if (l === null) return <div className="tpl"><div className="empty-state">Couldn&rsquo;t find that listing. <a href="/listings">Back to Products, Services, Memberships</a></div></div>;

  function toggle() {
    try {
      const sel = JSON.parse(localStorage.getItem(SEL_KEY) || "{}");
      sel[id] = !sel[id];
      localStorage.setItem(SEL_KEY, JSON.stringify(sel));
      setSaved(!!sel[id]);
    } catch {}
  }

  return (
    <PageTemplate
      section="products"
      title={`${l.type} Details`}
      subtitle="Products, Services, Memberships"
      legend={false}
      actions={<a href="/listings" className="tpl-action">← All listings</a>}
    >
      <div className="disc-detail">
        <div className="disc-detail-main">
          <div className="disc-cert">
            <span className="disc-cert-kicker">{l.type}</span>
            <h1>{l.name}</h1>
            <p className="disc-desc">{l.description}</p>
            <div className="disc-cert-row">
              <span className="disc-value">{costLabel(l)}</span>
              <span>Expires <b>{shortDate(l.expires)}</b></span>
              {l.premier && <span className="price-chip job-premier-chip">PREMIER</span>}
            </div>
          </div>

          <div className="event-icon-bar">
            <IconButton name="select" tip={saved ? "In My Selection — click to remove" : "Add listing to My Selection"} onClick={toggle} className={saved ? "on" : ""} />
            <IconButton name="like" tip="Like (coming soon)" />
            <IconButton name="share" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => { setFlash("Link copied"); setTimeout(() => setFlash(""), 1800); })} />
            <IconButton name="pdf" onClick={() => window.print()} />
            <IconButton name="print" onClick={() => window.print()} />
          </div>
          {flash && <div className="fp-flash fp-flash-block">{flash}</div>}

          <h4 className="section-label">Full Description</h4>
          <p>{l.details || "—"}</p>

          <h4 className="section-label">In-Person / Online</h4>
          <p>{(l.delivery || []).join(" and ")}{(l.delivery || []).includes("In-Person") ? ` · ${l.city}, ${l.state || "CA"}` : ""}</p>

          <h4 className="section-label">Offering $ Referrals</h4>
          <p>{l.referrals ? "Yes — earn a share when an introduction you make converts to a sale." : "No"}</p>

          <p className="nt-hint">{l.industry} · {l.city}, {l.state || "CA"} · {l.region}{l.phone ? ` · ${l.phone}` : ""}{l.url ? ` · ${l.url}` : ""} · Posted {shortDate(l.posted)}</p>
        </div>

        <aside className="disc-detail-side">
          <div className="host-card">
            <HostAvatar name={l.offeredBy} size={40} />
            <div>
              <div className="host-card-label">Offered by</div>
              <div className="host-card-name">{l.offeredBy}</div>
              {l.contact && <div className="nt-hint">{l.contact}</div>}
            </div>
          </div>
          <div className="qr-card">
            {qr ? <img src={qr} alt={`QR code for ${l.name}`} /> : <div style={{ padding: 40 }}>Generating QR code…</div>}
            <div className="qr-card-label"><b>Listing QR Code</b> — share or print it.</div>
          </div>
          <button type="button" className="btn-primary rsvp-btn" onClick={toggle}><Glyph name="select" size={17} /> {saved ? "In My Selection" : "Add to My Selection"}</button>
        </aside>
      </div>
    </PageTemplate>
  );
}
