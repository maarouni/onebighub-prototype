/** @type {import('next').NextConfig} */
module.exports = {
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
