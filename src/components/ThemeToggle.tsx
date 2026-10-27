import { motion, AnimatePresence } from "framer-motion";
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
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      type="button"
      onClick={handleToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="btn-neo-control group relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)]"
    >
      <div className="relative h-4 w-4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "sun" : "moon"}
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#C7ED70]" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--ink)]" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
