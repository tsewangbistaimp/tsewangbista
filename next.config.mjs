/** @type {import('next').NextConfig} */

// "Coming soon" mode: every other page sends visitors back to the home page.
// Remove these redirects (and restore app/page.tsx) to relaunch the portfolio.
const hiddenRoutes = [
  "/chefs-trial-crate",
  "/lead-flow-sprint",
  "/proof-sprint",
  "/thank-you",
  "/services",
  "/services/:path*"
];

const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return hiddenRoutes.map((source) => ({ source, destination: "/", permanent: false }));
  }
};

export default nextConfig;
