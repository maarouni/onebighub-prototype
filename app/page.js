"use client";

import PageTemplate from "./components/PageTemplate";

// Nov 20 (Cesar, "onebigHUB HOME"): the homepage — "Welcome !" with three big
// cards for Find, Connect and Achieve. The calendar moved to /calendar.
const CARDS = [
  {
    href: "/calendar", img: "/icons/find.png", title: "Find", head: "One Big Table of Listings",
    lines: [<i key="1">Events, Marketplace, Opportunities …</i>, <><b>Custom Digests</b> - <i>Select Filters, Assign Attendance …</i></>],
  },
  {
    href: "/connect-with-me", img: "/icons/connections.png", title: "Connect", head: <>Performance-Based Marketing <span className="cw-red">*</span></>,
    lines: [<><b>Custom Profiles</b> - <i>Individual, Biz, Org, Group</i></>, <><b>Virtual Biz Card</b> - <i>Add Notes, View Node Graphs</i></>,
      <><span className="cw-red">*</span> <i>Advertising based on <b className="cw-red">RESULTS</b>:&nbsp; # clicks or views</i></>],
  },
  {
    href: "/advertising", img: "/icons/achieve.png", title: "Achieve", head: "Profit-Sharing System",
    lines: [<i key="1">Easy&nbsp;&nbsp;•&nbsp;&nbsp;<b className="cw-red">No-Cost</b>&nbsp;&nbsp;•&nbsp;&nbsp;No Membership …</i>, <i key="2">Promote&nbsp;&nbsp;•&nbsp;&nbsp;Buy&nbsp;&nbsp;•&nbsp;&nbsp;Sell&nbsp;&nbsp;•&nbsp;&nbsp;Earn</i>],
  },
];

export default function Home() {
  return (
    <PageTemplate section={null} title={<i>Welcome !</i>} icon="smiley" tiles={false} legend={false}>
      <div className="home-cards">
        {CARDS.map((c) => (
          <a key={c.title} href={c.href} className="home-card">
            <img src={c.img} alt="" width="96" height="96" />
            <span className="home-card-text">
              <b className="home-card-title">{c.title}</b>
              <b className="home-card-head">{c.head}</b>
              {c.lines.map((l, i) => <span key={i}>{l}</span>)}
            </span>
          </a>
        ))}
      </div>
    </PageTemplate>
  );
}
