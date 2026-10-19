import { useEffect, useState } from "react";
import { Command, X, Sun, Moon, Volume2, VolumeX, ArrowUp, Briefcase, Code, Mail, Activity } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { isSoundFxEnabled, toggleSoundFx, playClick, playSwitch, playTab } from "../utils/soundEffects";

export function CommandShortcuts() {
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
    const locomotiveScroll = window.__locomotiveScroll;
    const target = document.querySelector<HTMLElement>(targetId);

    if (locomotiveScroll) {
      if (targetId === "#hero" || targetId === "#") {
        locomotiveScroll.scrollTo(0, { duration: 1.2 });
      } else if (target) {
        locomotiveScroll.scrollTo(target, { offset: -70, duration: 1.2 });
      }
    } else {
      if (targetId === "#hero" || targetId === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
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
          showToast(nextSound ? "Sound Effects: Enabled 🔊" : "Sound Effects: Muted 🔇");
          break;

        case "p":
          e.preventDefault();
          scrollToTarget("#work", "Projects");
          break;

        case "s":
          e.preventDefault();
          scrollToTarget("#skills", "Skills");
          break;

        case "l":
          e.preventDefault();
          scrollToTarget("#telemetry", "Live Telemetry");
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
  }, [theme, isOpen, toggleTheme]);

  const shortcuts = [
    { key: "T", label: "Toggle Theme (Light / Dark)", icon: theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" /> },
    { key: "M", label: "Toggle UI Sound FX", icon: isSoundFxEnabled() ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" /> },
    { key: "P", label: "Jump to Projects", icon: <Briefcase className="h-3.5 w-3.5" /> },
    { key: "S", label: "Jump to Skills", icon: <Code className="h-3.5 w-3.5" /> },
    { key: "L", label: "Jump to Live Telemetry", icon: <Activity className="h-3.5 w-3.5" /> },
    { key: "C", label: "Jump to Contact", icon: <Mail className="h-3.5 w-3.5" /> },
    { key: "B", label: "Back to Top", icon: <ArrowUp className="h-3.5 w-3.5" /> },
    { key: "?", label: "Toggle Shortcuts Guide", icon: <Command className="h-3.5 w-3.5" /> },
  ];

  return (
    <>
      {/* Floating Shortcut Hint Pill (Desktop only) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            playClick();
            setIsOpen(true);
          }}
          className="group flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface)]/80 backdrop-blur-xl px-3 py-1.5 text-[11px] font-mono text-[var(--ink)]/70 shadow-lg hover:border-emerald-500/40 hover:text-[var(--ink)] transition-all duration-300 hover:scale-105 active:scale-95"
          title="Press '?' for keyboard shortcuts"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded bg-black/5 dark:bg-white/10 font-bold text-[9px] text-emerald-500">
            ⌘
          </span>
          <span className="hidden md:inline">Shortcuts</span>
          <kbd className="rounded border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/10 px-1.5 py-0.2 text-[9px] font-bold">
            ?
          </kbd>
        </button>
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-full border border-emerald-500/30 bg-[#252A34]/95 dark:bg-white/95 text-white dark:text-black px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-2xl backdrop-blur-2xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Guide */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => {
              playClick();
              setIsOpen(false);
            }}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/15 dark:border-white/15 bg-[var(--surface)] p-6 sm:p-7 text-[var(--ink)] shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                  ⌨
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[10px] text-[var(--ink)]/50">
                    Fast linear-style portfolio navigation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsOpen(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close shortcuts modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {shortcuts.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-[var(--ink)]/80">
                    <span className="text-emerald-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <kbd className="min-w-[24px] text-center rounded-lg border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/10 px-2 py-1 font-mono text-[11px] font-bold text-[var(--ink)]">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-[var(--ink)]/50">
              <span>Press <kbd className="font-bold">Esc</kbd> to close</span>
              <span>Audio feedback enabled</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
