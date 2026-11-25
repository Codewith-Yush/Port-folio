import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { stopSmoothScroll, startSmoothScroll } from "../hooks/useSmoothScroll";
import { playSuccess } from "../utils/soundEffects";

export type PreloaderProps = {
  onComplete?: () => void;
  minDuration?: number;
  oncePerSession?: boolean;
};

const STORAGE_KEY = "portfolio-preloader-seen";

export function Preloader({
  onComplete,
  minDuration = 1150,
  oncePerSession = false,
}: PreloaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (!oncePerSession || typeof window === "undefined") return true;
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setExiting(true);
    playSuccess();

    if (oncePerSession) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Ignore storage errors
      }
    }

    const exitDuration = reducedMotion ? 180 : 480;
    window.setTimeout(() => {
      startSmoothScroll();
      setVisible(false);
      onComplete?.();
    }, exitDuration);
  }, [oncePerSession, onComplete, reducedMotion]);

  useEffect(() => {
    if (!visible) return;
    stopSmoothScroll();

    if (reducedMotion) {
      setRevealed(true);
      const t = window.setTimeout(finish, 180);
      return () => {
        window.clearTimeout(t);
        startSmoothScroll();
      };
    }

    const revealFrame = requestAnimationFrame(() => setRevealed(true));
    const timer = window.setTimeout(finish, minDuration);

    return () => {
      cancelAnimationFrame(revealFrame);
      window.clearTimeout(timer);
      startSmoothScroll();
    };
  }, [visible, minDuration, reducedMotion, finish]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label="Loading Ayush portfolio"
      style={{
        opacity: exiting ? 0 : 1,
        transition: reducedMotion
          ? "opacity 180ms ease"
          : "opacity 480ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--page,#f2ede4)] px-[var(--site-margin)] text-[var(--ink,#252525)] select-none will-change-[opacity]"
    >
      {/* Centered jeppesen.dev-style mark + wordmark reveal */}
      <div
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translate3d(0, -12px, 0)" : "translate3d(0, 0, 0)",
          transition: "opacity 360ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="flex flex-col items-center gap-5"
      >
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Geometric A Monogram */}
          <svg
            viewBox="0 0 36 36"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1) rotate(0deg)" : "scale(0.82) rotate(-8deg)",
              transition: "opacity 600ms ease, transform 750ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="h-9 w-9 fill-none stroke-[var(--ink,#252525)] sm:h-11 sm:w-11"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="32" height="32" rx="2.5" strokeWidth="2.4" />
            <path
              d="M11 26L18 10L25 26"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <path d="M13.5 21H22.5" strokeWidth="2.3" strokeLinecap="square" />
          </svg>

          {/* Wordmark Horizontal Wipe Reveal */}
          <div className="overflow-hidden">
            <span
              style={{
                display: "inline-block",
                clipPath: revealed ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
                transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(-12px, 0, 0)",
                transition:
                  "clip-path 850ms cubic-bezier(0.16, 1, 0.3, 1) 120ms, transform 850ms cubic-bezier(0.16, 1, 0.3, 1) 120ms",
              }}
              className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.04em] text-[var(--ink,#252525)]"
            >
              Ayush
            </span>
          </div>
        </div>

        {/* Minimalist 1px hairline progress rule */}
        <div className="h-[1px] w-36 overflow-hidden bg-[var(--ink,#252525)]/15 sm:w-44">
          <div
            style={{
              transform: revealed ? "scaleX(1)" : "scaleX(0)",
              transition: `transform ${Math.max(500, minDuration - 150)}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
            className="h-full w-full origin-left bg-[var(--ink,#252525)]"
          />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Inline Route Fallback Loader
   ========================================================================== */

export type LoaderProps = {
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg";
  label?: string;
};

export const Loader = ({ className = "", style, label = "Loading" }: LoaderProps) => (
  <div
    role="status"
    aria-label={label}
    style={style}
    className={`flex flex-col items-center gap-3 ${className}`}
  >
    <svg
      viewBox="0 0 36 36"
      className="h-7 w-7 animate-pulse fill-none stroke-[var(--ink)]"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="32" height="32" rx="2.5" strokeWidth="2.2" />
      <path d="M11 26L18 10L25 26" strokeWidth="2.4" strokeLinecap="square" />
      <path d="M13.5 21H22.5" strokeWidth="2.2" strokeLinecap="square" />
    </svg>
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
      {label}
    </span>
  </div>
);

export { Preloader as ParticlePreloader };
export default Loader;
