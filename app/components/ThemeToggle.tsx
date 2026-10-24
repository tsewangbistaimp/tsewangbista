"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

/** Switches the whole site between the dark theme (default) and the light theme. The choice is remembered in this browser. */
export default function ThemeToggle({ className = "theme-toggle" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // The theme is applied by a tiny script before the page paints; this just mirrors it for the button icon.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the choice just will not be remembered */
    }
  }

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  return (
    <button type="button" className={className} onClick={toggle} aria-label={label} title={label}>
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
