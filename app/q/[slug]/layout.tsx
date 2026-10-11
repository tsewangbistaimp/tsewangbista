import type { Metadata, Viewport } from "next";
import "../q.css";

// Neutral title and no preview images so shared links reveal nothing.
export const metadata: Metadata = {
  title: { absolute: "Questionnaire" },
  description: "Private questionnaire.",
  keywords: [],
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true, noimageindex: true },
  referrer: "no-referrer",
  openGraph: { title: "Questionnaire", description: "Private questionnaire.", images: [], type: "website" },
  twitter: { card: "summary", title: "Questionnaire", description: "Private questionnaire.", images: [] }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return <div className="qx">{children}</div>;
}
