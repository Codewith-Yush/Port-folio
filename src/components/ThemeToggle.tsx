import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { playSwitch } from "../utils/soundEffects";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    playSwitch();
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-all duration-300 hover:scale-105 hover:border-[var(--ink)] active:scale-95 shadow-sm"
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-[#C7ED70] transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-[var(--ink)] transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
