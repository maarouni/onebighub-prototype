/** @type {import('next').NextConfig} */
const pkg = require("./package.json");
const buildDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Los_Angeles" });
const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);

module.exports = {
  // Shown in the footer of every page: full date + version.
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_VERSION: `v${pkg.version}${sha ? ` (${sha})` : ""}`,
  },
  // Oct 19: Cesar renamed Organizations to Connections. Old links keep working.
  async redirects() {
    return [
      { source: "/organizations", destination: "/connections", permanent: true },
      { source: "/organizations/:path*", destination: "/connections/:path*", permanent: true },
      // Oct 26: Cesar's Figma calls the products section "OtherListings".
      { source: "/other-listings", destination: "/listings", permanent: true },
      { source: "/OtherListings", destination: "/listings", permanent: true },
    ];
  },
};
