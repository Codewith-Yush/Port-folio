import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const session = window.sessionStorage.getItem(storageKey);
    if (session === "light" || session === "dark") {
      return session;
    }
  } catch {
    // Fallback safe
  }

  // Default to jeppesen.dev warm bone light theme
  return "light";
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
