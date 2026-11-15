import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  // Check sessionStorage first:
  // Any user opening the portfolio in a new tab/browser will have null,
  // guaranteeing dark mode opens by default.
  // In-session manual toggles persist while browsing the site.
  try {
    const session = window.sessionStorage.getItem(storageKey);
    if (session === "light" || session === "dark") {
      return session;
    }
  } catch {
    // Fallback safe
  }

  // Default is strictly Dark Mode
  return "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.sessionStorage.setItem(storageKey, theme);
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Storage quota safe
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
