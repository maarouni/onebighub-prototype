import { InfoShell } from "../../components/InfoKit";

export const metadata = { title: "About Us — onebigHUB" };

// Info · About Us — Cesar's text from the Nov 9 Figma, as written.
const BLOCKS = [
  ["VISION", "Series of strategies of using the mission to achieve the vision",
    <>Develop a local and global network of businesses, communities, organizations, and professionals, empowered with state-of-the-art technology, to enable, inform, and promote business, collaboration, culture, education, networking, and volunteering:</>,
    ["Empower others to grow", "Impact others to collaborate", "Lead others to explore possibilities"]],
  ["MISSION", "A general statement of how you will achieve your vision",
    "Develop an innovative revenue system and state-of-the-art technologies for users to network, promote their products and services, automatically generate leads, share revenues, track referrals, and much more."],
  ["GOALS", "What needs to be accomplished to implement the strategy",
    <>Our <i>innovative</i>, results-based viral marketing system, and revenue-sharing business model, allows users to curate the following, based on a suite of filter selections:</>,
    ["Custom Calendars", "Discount / Gift Certificates, and Employment Listings", "Custom Notifications"]],
  ["OBJECTIVES", "Specific actions and timelines for achieving the goal",
    "We aim to categorize and organize and information and resources in an intuitive, simple, effective, and efficient manner."],
  ["CORE VALUES, PRINCIPLES", null,
    <>We will conduct business with Accountability, Diligence, Discipline, Integrity, Perseverance, and Respect<br />Our culture and mindset is to Invite, Share, Pay-It-Forward, and Be the Reason someone smiles today !</>],
  ["#MyGive4", "This movement aims to increase giving around the world to help others do better !",
    <>We believe the world lacks a paradigm of selflessness<br />Practice a giving mindset, something so different from what most of us are used to<br />Being active in your networking is about giving more to others<br />Give freely of your:</>,
    ["Ideas and Talent - Offer Advice", "Network Referrals - Share Recommendations", "Time - Volunteer", "Money / Products - Donate"]],
];

export default function About() {
  return (
    <InfoShell title="About Us" icon="idxStore">
      <div className="about-list">
        {BLOCKS.map(([h, sub, body, bullets]) => (
          <section key={h} className="about-box">
            <h2>{h}</h2>
            {sub && <p className="about-sub"><i>{sub}</i></p>}
            <p>{body}</p>
            {bullets && <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
          </section>
        ))}
      </div>
    </InfoShell>
  );
}
