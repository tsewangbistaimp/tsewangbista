"use client";

import { useEffect } from "react";

/**
 * Shared homepage-style motion: cursor-tracked glow + reveal-on-scroll for any
 * element marked with `data-reveal`. Drop this once into a page (it renders
 * nothing) to get the same animation behaviour as the main portfolio page.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const moveGlow = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    const revealTargets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    if (supportsFinePointer) {
      window.addEventListener("pointermove", moveGlow);
    }
    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      if (supportsFinePointer) {
        window.removeEventListener("pointermove", moveGlow);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}
