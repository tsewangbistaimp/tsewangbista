"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * Shared homepage-style motion: cursor-tracked glow + reveal-on-scroll for any
 * element marked with `data-reveal`. Drop this once into a page (it renders
 * nothing) to get the same animation behaviour as the main portfolio page.
 */
export default function ScrollEffects() {
  // Runs synchronously before the browser paints, so a freshly opened page
  // never flashes at whatever scroll offset the previous page left behind
  // (this was especially visible on shorter pages, where the old scroll
  // position could land past the bottom of the new page for a frame).
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
