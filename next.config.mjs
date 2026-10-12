/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"]
  },
  // The private questionnaire must never be indexed, cached by crawlers or leak its URL.
  async headers() {
    const privateHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Cache-Control", value: "no-store" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Content-Security-Policy",
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
      }
    ];
    return [
      { source: "/q/:path*", headers: privateHeaders },
      { source: "/api/questionnaire/:path*", headers: privateHeaders }
    ];
  }
};

export default nextConfig;
