import { useTheme } from "../hooks/useTheme";
import { playSwitch } from "../utils/soundEffects";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const inputId = "theme-toggle";

  const handleChange = () => {
    playSwitch();
    toggleTheme();
  };

  return (
    <label className="uiverse-switch" title={isDark ? "Light mode" : "Dark mode"}>
      <input
        id={inputId}
        type="checkbox"
        checked={isDark}
        onChange={handleChange}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <span className="uiverse-slider" aria-hidden="true" />
    </label>
  );
}
