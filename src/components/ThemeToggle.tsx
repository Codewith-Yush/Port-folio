import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const inputId = "theme-toggle";

  return (
    <div className="uiverse-toggleWrapper">
      <input
        id={inputId}
        className="uiverse-input"
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <label
        htmlFor={inputId}
        className="uiverse-toggle"
        title={isDark ? "Light mode" : "Dark mode"}
      >
        <span className="uiverse-toggle__handler" aria-hidden="true">
          <span className="uiverse-crater uiverse-crater--1" />
          <span className="uiverse-crater uiverse-crater--2" />
          <span className="uiverse-crater uiverse-crater--3" />
        </span>
        <span className="uiverse-star uiverse-star--1" aria-hidden="true" />
        <span className="uiverse-star uiverse-star--2" aria-hidden="true" />
        <span className="uiverse-star uiverse-star--3" aria-hidden="true" />
        <span className="uiverse-star uiverse-star--4" aria-hidden="true" />
        <span className="uiverse-star uiverse-star--5" aria-hidden="true" />
        <span className="uiverse-star uiverse-star--6" aria-hidden="true" />
      </label>
    </div>
  );
}
