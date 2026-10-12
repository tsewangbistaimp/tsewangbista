import type { Metadata } from "next";
import "../q/q.css";

export const metadata: Metadata = {
  title: { absolute: "Questionnaire admin" },
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true },
  referrer: "no-referrer"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="qx">{children}</div>;
}
