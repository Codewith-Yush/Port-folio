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
      className="btn-neo-control group relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] active:scale-95"
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-[#C7ED70] transition-opacity duration-300 ${
            isDark
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-[var(--ink)] transition-opacity duration-300 ${
            isDark
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
