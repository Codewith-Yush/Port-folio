import { useEffect, useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Command, X, Sun, Moon, Volume2, VolumeX, ArrowUp, Briefcase, Code, Mail, Layers, FileText } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { isSoundFxEnabled, toggleSoundFx, playClick, playSwitch, playTab } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

export function CommandShortcuts() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 1800);
  };

  const scrollToTarget = (targetId: string, label: string) => {
    playTab();
    scrollToSection(targetId);
    showToast(`Navigated to ${label}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        playClick();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (isOpen) {
          playClick();
          setIsOpen(false);
        }
        return;
      }

      switch (key) {
        case "t":
          e.preventDefault();
          playSwitch();
          toggleTheme();
          showToast(`Theme switched to ${theme === "dark" ? "Light" : "Dark"} mode`);
          break;

        case "m":
          e.preventDefault();
          const nextSound = toggleSoundFx();
          showToast(nextSound ? "Sound Effects: Enabled" : "Sound Effects: Muted");
          break;

        case "p":
          e.preventDefault();
          scrollToTarget("#work", "Projects");
          break;

        case "g":
          e.preventDefault();
          playClick();
          startTransition(() => {
            navigate("/canva-gallery");
          });
          showToast("Opening Canva Design Gallery");
          break;

        case "r":
          e.preventDefault();
          playClick();
          startTransition(() => {
            navigate("/resume");
          });
          showToast("Opening Resume / CV");
          break;

        case "s":
          e.preventDefault();
          scrollToTarget("#skills", "Skills");
          break;

        case "c":
          e.preventDefault();
          scrollToTarget("#contact", "Contact");
          break;

        case "b":
          e.preventDefault();
          scrollToTarget("#hero", "Top of Page");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, isOpen, toggleTheme, navigate]);

  const shortcuts = [
    { key: "T", label: "Toggle Theme (Light / Dark)", icon: theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" /> },
    { key: "M", label: "Toggle UI Sound FX", icon: isSoundFxEnabled() ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" /> },
    { key: "P", label: "Jump to Projects", icon: <Briefcase className="h-3.5 w-3.5" /> },
    { key: "R", label: "View Resume / CV", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "G", label: "Open Canva Showcase Gallery", icon: <Layers className="h-3.5 w-3.5" /> },
    { key: "S", label: "Jump to Skills", icon: <Code className="h-3.5 w-3.5" /> },
    { key: "C", label: "Jump to Contact", icon: <Mail className="h-3.5 w-3.5" /> },
    { key: "B", label: "Back to Top", icon: <ArrowUp className="h-3.5 w-3.5" /> },
    { key: "?", label: "Toggle Shortcuts Guide", icon: <Command className="h-3.5 w-3.5" /> },
  ];

  return (
    <>
      {/* Ephemeral Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            data-ui="toast"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 15, x: "-50%" }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
          >
            <div className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--page)] px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-xl shadow-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1E90FF] dark:bg-[#B39CFF]" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Minimal Brutalist Shortcuts Capsule Trigger */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={() => {
          playClick();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Toggle keyboard shortcuts menu"
        className="btn-neo-base fixed bottom-6 right-6 z-40 hidden sm:inline-flex h-9 items-center gap-2.5 px-3.5 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 hover:border-[var(--ink)] hover:bg-[var(--surface-strong)]"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--page)] text-[10px] font-bold">
          ⌘
        </span>
        <span className="text-[11px] font-semibold text-[var(--ink)]">
          Shortcuts
        </span>
        <kbd className="rounded border border-[var(--line)] bg-[var(--surface-strong)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">
          ?
        </kbd>
      </motion.button>

      {/* Modal Guide */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                playClick();
                setIsOpen(false);
              }}
            />
            <motion.div
              data-ui="modal"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative z-10 w-full max-w-md rounded-xl border border-[var(--ink)] bg-[var(--surface)] p-6 sm:p-7 text-[var(--ink)] shadow-[8px_8px_0px_rgba(0,0,0,0.65)]"
            >
              {/* Corner crosshairs */}
              <span className="brutal-corner-cross left-3 top-2.5">+</span>
              <span className="brutal-corner-cross right-3 top-2.5">+</span>

              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--ink)] font-mono font-bold text-xs">
                    ⌘
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                      [KEYBOARD NAVIGATION]
                    </h3>
                    <p className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">
                      Direct shortcuts &amp; audio feedback
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setIsOpen(false);
                  }}
                  className="btn-neo-control flex h-8 w-8 items-center justify-center rounded-xl text-sm active:scale-95"
                  aria-label="Close shortcuts modal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 grid gap-1.5 font-mono">
                {shortcuts.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-transparent hover:border-[var(--line)] hover:bg-[var(--surface-strong)]/80 px-3 py-2 text-xs transition-colors"
                  >
                    <span className="flex items-center gap-2.5 text-[var(--muted)] hover:text-[var(--ink)]">
                      <span className="text-[#1E90FF] dark:text-[#B39CFF]">{item.icon}</span>
                      <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
                    </span>
                    <kbd className="min-w-[24px] text-center rounded-md border border-[var(--line)] bg-[var(--page)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)] shadow-xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
                <span>Press [ Esc ] to close</span>
                <span className="flex items-center gap-1.5 text-[#1E90FF] dark:text-[#B39CFF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B39CFF] animate-pulse" />
                  Audio feedback active
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
