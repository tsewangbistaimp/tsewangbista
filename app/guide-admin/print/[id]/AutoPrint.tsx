"use client";

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="no-print" style={{ marginBottom: 16 }}>
      <button type="button" onClick={() => window.print()} style={{ background: "#111", border: 0, borderRadius: 99, color: "#fff", cursor: "pointer", font: "inherit", fontWeight: 700, padding: "10px 22px" }}>Download PDF</button>{" "}
      <span style={{ color: "#666", fontSize: 13 }}>In the print window, choose &ldquo;Save as PDF&rdquo; as the destination.</span>
    </div>
  );
}
