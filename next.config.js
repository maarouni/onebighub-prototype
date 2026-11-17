/** @type {import('next').NextConfig} */
// Footer timestamp, e.g. "Mon, Nov 2 '26, 6:46pm" (Pacific time, time of the build).
const now = new Date();
const part = (opts) => new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", ...opts }).format(now);
const time = part({ hour: "numeric", minute: "2-digit", hour12: true }).replace(" ", "").toLowerCase();
const buildStamp = `${part({ weekday: "short" })}, ${part({ month: "short" })} ${part({ day: "numeric" })} '${part({ year: "2-digit" })}, ${time}`;

module.exports = {
  // Shown in the footer of every page.
  env: { NEXT_PUBLIC_BUILD_STAMP: buildStamp },
  async redirects() {
    return [
      { source: "/organizations", destination: "/connect", permanent: true },
      { source: "/organizations/:path*", destination: "/connect/:path*", permanent: true },
      // Nov 16: Connect profiles moved /connections -> /connect; Connect with Me ! -> /connect-with-me.
      { source: "/connect/network", destination: "/connect-with-me/network", permanent: false },
      { source: "/connect/signup", destination: "/connect-with-me#new-user", permanent: false },
      { source: "/connect/messages", destination: "/connect-with-me/network#message", permanent: false },
      { source: "/connect/next", destination: "/connect-with-me/network#next", permanent: false },
      { source: "/connections", destination: "/connect", permanent: true },
      { source: "/connections/:path*", destination: "/connect/:path*", permanent: true },
      // Oct 26: Cesar's Figma calls the products section "OtherListings".
      { source: "/other-listings", destination: "/listings", permanent: true },
      { source: "/OtherListings", destination: "/listings", permanent: true },
    ];
  },
};
