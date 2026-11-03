"use client";

export default function PrintButton() {
  return <button type="button" onClick={() => window.print()}>Download / Print PDF</button>;
}
