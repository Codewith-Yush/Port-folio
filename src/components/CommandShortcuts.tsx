import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, X, Sun, Moon, Volume2, VolumeX, ArrowUp, Briefcase, Code, Mail, Activity, Layers, FileText } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { isSoundFxEnabled, toggleSoundFx, playClick, playSwitch, playTab } from "../utils/soundEffects";

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

        case "g":
          e.preventDefault();
          playClick();
          navigate("/canva-gallery");
          showToast("Opening Canva Design Gallery");
          break;

        case "r":
          e.preventDefault();
          playClick();
          navigate("/resume");
          showToast("Opening Resume / CV");
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
  }, [theme, isOpen, toggleTheme, navigate]);

  const shortcuts = [
    { key: "T", label: "Toggle Theme (Light / Dark)", icon: theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" /> },
    { key: "M", label: "Toggle UI Sound FX", icon: isSoundFxEnabled() ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" /> },
    { key: "P", label: "Jump to Projects", icon: <Briefcase className="h-3.5 w-3.5" /> },
    { key: "R", label: "View Resume / CV", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "G", label: "Open Canva Showcase Gallery", icon: <Layers className="h-3.5 w-3.5" /> },
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
          className="group flex items-center gap-2 border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] shadow-lg hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all duration-300"
          title="Press '?' for keyboard shortcuts"
        >
          <span className="flex h-4 w-4 items-center justify-center border border-[var(--line)] font-bold text-[9px] text-emerald-600 dark:text-[#C7ED70]">
            ⌘
          </span>
          <span className="hidden md:inline">Shortcuts</span>
          <kbd className="border border-[var(--line)] bg-[var(--page)] px-1.5 py-0.2 text-[9px] font-bold text-[var(--ink)]">
            ?
          </kbd>
        </button>
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--page)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider shadow-2xl flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-[#C7ED70] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Guide */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => {
              playClick();
              setIsOpen(false);
            }}
          />
          <div className="relative z-10 w-full max-w-md border border-[var(--ink)] dark:border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7 text-[var(--ink)] shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center border border-[var(--line)] bg-[var(--page)] text-emerald-600 dark:text-[#C7ED70] font-mono font-bold text-xs">
                  ⌘
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                    Keyboard Shortcuts
                  </h3>
                  <p className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">
                    Linear navigation & controls
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsOpen(false);
                }}
                className="flex h-7 w-7 items-center justify-center border border-[var(--line)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--page)] transition-colors"
                aria-label="Close shortcuts modal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 grid gap-1.5 font-mono">
              {shortcuts.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border border-transparent hover:border-[var(--line)] hover:bg-[var(--surface-strong)] px-3 py-2 text-xs transition-colors"
                >
                  <span className="flex items-center gap-2.5 text-[var(--muted)] hover:text-[var(--ink)]">
                    <span className="text-emerald-600 dark:text-[#C7ED70]">{item.icon}</span>
                    <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
                  </span>
                  <kbd className="min-w-[24px] text-center border border-[var(--line)] bg-[var(--page)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)]">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
              <span>Press [ Esc ] to close</span>
              <span>Audio feedback enabled</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
