"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gift, X } from "lucide-react";

const MIN_DELAY_MS = 8000;
const MAX_DELAY_MS = 10000;

/**
 * Small promo card for the free portfolio service. It appears 8–10 seconds after
 * the page loads and stays hidden once closed. Dismissal lives only in component
 * state on purpose: a page refresh remounts the component and shows it again.
 */
export default function FreePortfolioPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Start the timer once per page load. The delay is picked at random between
  // 8 and 10 seconds so it never feels like a fixed, scripted interruption.
  useEffect(() => {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
    const timer = window.setTimeout(() => setIsVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  // Let keyboard users dismiss the card with Escape while it is showing.
  useEffect(() => {
    if (!isVisible || isDismissed) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDismissed(true);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <aside className="free-portfolio-popup" role="complementary" aria-label="Free portfolio offer">
      <button
        type="button"
        className="free-portfolio-popup-close"
        onClick={() => setIsDismissed(true)}
        aria-label="Close free portfolio offer"
      >
        <X size={16} />
      </button>

      <div className="free-portfolio-popup-icon" aria-hidden="true">
        <Gift size={22} />
      </div>

      <div className="free-portfolio-popup-body">
        <p className="free-portfolio-popup-tag">Free service</p>
        <p className="free-portfolio-popup-title">Get your free portfolio website</p>
        <p className="free-portfolio-popup-text">
          One short form and we&apos;ll build your professional, mobile-friendly portfolio.
        </p>
        <Link className="button primary free-portfolio-popup-cta" href="/services/free-portfolio">
          Register now
          <ArrowRight size={16} />
        </Link>
      </div>
    </aside>
  );
}
