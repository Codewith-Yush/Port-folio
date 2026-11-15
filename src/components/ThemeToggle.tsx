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
      className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 dark:bg-[#141416]/90 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] text-neutral-800 dark:text-neutral-200 transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_16px_rgba(30,144,255,0.2)] dark:hover:shadow-[0_4px_16px_rgba(179,156,255,0.3)] active:scale-95"
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
              <Sun className="h-4 w-4 text-[#B39CFF]" />
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
