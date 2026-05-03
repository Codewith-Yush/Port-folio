import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative grid h-14 w-14 place-items-center overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition duration-300 hover:-translate-y-0.5 hover:border-flame focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)] sm:h-12 sm:w-12"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span
        className="absolute inset-1 bg-gradient-to-br from-flame/20 via-ember/10 to-blush/25 opacity-0 transition duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span className="relative h-8 w-8" aria-hidden="true">
        <span
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush shadow-[0_0_0_5px_rgb(255_147_152/0.22)] transition duration-500"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark
              ? "translate(-50%, -50%) scale(1) rotate(0deg)"
              : "translate(-50%, -50%) scale(0.45) rotate(-90deg)",
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame transition duration-500"
          style={{
            transform: isDark
              ? "translate(-50%, -50%) scale(0.92)"
              : "translate(-50%, -50%) scale(1)",
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--surface)] transition duration-500"
          style={{
            transform: isDark
              ? "translate(-18%, -72%) scale(0.82)"
              : "translate(52%, -120%) scale(0.82)",
          }}
        />
        <span
          className="absolute inset-0 transition duration-500"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0.7) rotate(45deg)" : "scale(1) rotate(0deg)",
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="absolute left-1/2 top-1/2 h-1 w-1.5 origin-[0.125rem_1rem] rounded-full bg-flame"
              style={{
                transform: `rotate(${index * 45}deg) translateY(-14px)`,
              }}
            />
          ))}
        </span>
      </span>
    </button>
  );
}
