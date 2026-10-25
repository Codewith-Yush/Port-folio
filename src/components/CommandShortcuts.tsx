import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      {toastMessage && (
        <div data-ui="toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="border border-[var(--ink)] bg-[var(--ink)] text-[var(--page)] px-4 py-2 text-xs font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-[#C7ED70]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modal Guide */}
      {/* Floating Modern Minimalist Shortcuts Capsule Trigger */}
      <button
        type="button"
        onClick={() => {
          playClick();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Toggle keyboard shortcuts menu"
        className="btn-neo-base btn-neo-secondary fixed bottom-6 right-6 z-40 hidden sm:inline-flex h-10 items-center gap-2.5 px-3.5 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] active:scale-95"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--page)] text-xs font-semibold">
          ⌘
        </span>
        <span className="text-xs font-semibold text-[var(--ink)]">
          Shortcuts
        </span>
        <kbd className="rounded-md border border-[var(--line)] bg-[var(--page)] px-1.5 py-0.5 text-xs font-medium text-[var(--muted)]">
          ?
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => {
              playClick();
              setIsOpen(false);
            }}
          />
          <div data-ui="modal" className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--ink)]/30 dark:border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7 text-[var(--ink)] shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-emerald-600 dark:text-[#C7ED70] font-bold text-xs">
                  ⌘
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
                    Keyboard Shortcuts
                  </h3>
                  <p className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">
                    Linear navigation &amp; controls
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
                    <span className="text-emerald-600 dark:text-[#C7ED70]">{item.icon}</span>
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
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-[#C7ED70]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Audio feedback active
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
