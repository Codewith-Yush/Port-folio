import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const inputId = "theme-toggle";

  return (
    <label className="uiverse-switch" title={isDark ? "Light mode" : "Dark mode"}>
      <input
        id={inputId}
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <span className="uiverse-slider" aria-hidden="true" />
    </label>
  );
}
