import type { Metadata } from "next";

// The full portfolio is parked in app/_portfolio/portfolio-home.tsx.
// To bring it back, replace this file's contents with:
//   export { default } from "./_portfolio/portfolio-home";
// and remove the redirects in next.config.mjs.

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Coming soon.",
  robots: { index: false, follow: false },
  openGraph: { title: "Coming Soon", description: "Coming soon.", images: [] }
};

export default function ComingSoon() {
  return (
    <main className="coming-soon">
      <div className="cursor-glow" aria-hidden="true" />
      <h1>Coming Soon</h1>
    </main>
  );
}
