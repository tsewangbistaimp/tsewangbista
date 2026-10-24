import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-vercel-domain.vercel.app"),
  title: {
    default: "Tsewang Bista | Technology, Business & Innovation",
    template: "%s | TsewangBistaX"
  },
  description:
    "Full-stack developer, UI/UX designer and AI marketer building websites and growth systems. BSc Computing student and small business owner in Kathmandu, Nepal.",
  keywords: [
    "Tsewang Bista",
    "TsewangBistaX",
    "AI marketer Nepal",
    "Next.js developer Nepal",
    "UI UX designer Nepal",
    "shoe business Nepal",
    "Mustang apple farming"
  ],
  openGraph: {
    title: "Tsewang Bista | Technology, Business & Innovation",
    description: "Full-stack developer, UI/UX designer, AI marketer and small business owner from Kathmandu, Nepal.",
    images: ["/images/tsewang-bista-profile.jpeg"],
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
