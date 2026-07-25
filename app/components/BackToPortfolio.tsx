"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { MouseEvent } from "react";

/**
 * Returns to wherever the person actually came from — using browser history
 * so the homepage is restored at the same scroll position they left it at,
 * instead of always resetting to the very top like a fresh link would.
 */
export default function BackToPortfolio() {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <Link href="/" className="back-link" onClick={handleClick}>
      <ArrowLeft size={16} />
      Back to portfolio
    </Link>
  );
}
