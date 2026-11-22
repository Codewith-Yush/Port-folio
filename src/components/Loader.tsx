import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { playSuccess } from "../utils/soundEffects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { stopSmoothScroll, startSmoothScroll } from "../hooks/useSmoothScroll";

const STYLES = `
/* ==========================================================================
   TYPOGRAPHIC PRELOADER  ·  v3
   Giant per-letter title rises out of masks and inks itself in sequence,
   a rolling-digit counter climbs to 100, and the whole panel lifts away
   behind a curved edge. Transform / opacity / clip-path only.
   ========================================================================== */

.ppl-root {
  --ppl-accent: #b39cff;

  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--page, #0d0d0d);
  color: var(--ink, #ffffff);
  user-select: none;
  -webkit-font-smoothing: antialiased;
  will-change: transform;
  transition: transform 1s 0.55s cubic-bezier(0.76, 0, 0.24, 1);
}
.ppl-root[data-exiting="true"] {
  transform: translate3d(0, -100%, 0);
  pointer-events: none;
}

/* curved trailing edge: rides below the panel and sweeps away with it */
.ppl-root::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% - 1px);
  height: clamp(60px, 14vh, 160px);
  background: var(--page, #0d0d0d);
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  pointer-events: none;
}

/* ---------- Title ---------- */

.ppl-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 4vw, 40px);
  pointer-events: none;
}

.ppl-title {
  font-family: "Plus Jakarta Sans", Inter, "Helvetica Neue", Arial, sans-serif;
  font-weight: 800;
  font-size: clamp(3.4rem, 15.5vw, 13rem);
  line-height: 0.86;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

.ppl-line-mask {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  padding: 0.07em 0.08em 0.1em;
}
.ppl-line-mask:nth-child(2) { margin-left: clamp(0px, 7vw, 7rem); }

/* exit wrapper (per letter): slides the letter up and out of its mask */
.ppl-ch-exit {
  display: inline-block;
  transition: transform 0.7s cubic-bezier(0.76, 0, 0.24, 1);
  transition-delay: calc(var(--i, 0) * 28ms);
  will-change: transform;
}
.ppl-root[data-exiting="true"] .ppl-ch-exit { transform: translate3d(0, -120%, 0); }

/* entrance (per letter): rises out of the mask, staggered */
.ppl-ch {
  position: relative;
  display: inline-block;
  transform: translate3d(0, 118%, 0);
  animation: ppl-rise 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 55ms + 150ms);
}

.ppl-wire {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--ink, #ffffff) 30%, transparent);
}
.ppl-fill {
  position: absolute;
  inset: 0;
  display: block;
  color: var(--ink, #ffffff);
  clip-path: inset(0 100% 0 0);
  will-change: clip-path;
}
.ppl-accent.ppl-wire { -webkit-text-stroke-color: var(--ppl-accent); }
.ppl-accent.ppl-fill { color: var(--ppl-accent); }

/* ---------- HUD ---------- */

.ppl-hud {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 40px);
  font-family: ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted, #9e9ea8);
  opacity: 0;
  animation: ppl-in 0.9s 0.35s ease-out forwards;
  transition: opacity 0.3s ease-out;
  pointer-events: none;
}
.ppl-root[data-exiting="true"] .ppl-hud { opacity: 0 !important; }

.ppl-top { top: clamp(20px, 3.5vw, 32px); align-items: center; }
.ppl-top strong { color: var(--ink, #ffffff); font-weight: 600; letter-spacing: 0.22em; }

.ppl-status { display: inline-flex; align-items: center; gap: 8px; color: var(--ink, #ffffff); opacity: 0.85; }
.ppl-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ppl-accent);
  transition: transform 0.35s ease;
}
.ppl-root[data-phase="syncing"] .ppl-dot { animation: ppl-pulse 1s ease-in-out infinite; }
.ppl-root[data-phase="ready"] .ppl-dot { transform: scale(1.4); }

.ppl-bottom { bottom: clamp(26px, 4vw, 40px); align-items: flex-end; }

.ppl-roles { display: flex; flex-direction: column; gap: 8px; font-size: 10px; }
.ppl-roles-label { opacity: 0.6; }
.ppl-role-slot {
  height: 1.6em;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.3em;
  color: var(--ink, #ffffff);
}
.ppl-role { display: block; animation: ppl-role-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }

/* rolling digit counter */
.ppl-count {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  color: var(--ink, #ffffff);
  font-family: "Plus Jakarta Sans", Inter, sans-serif;
  font-size: clamp(48px, 9vw, 112px);
  font-weight: 300;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.ppl-digit { display: inline-block; height: 1em; overflow: hidden; }
.ppl-stack { display: flex; flex-direction: column; will-change: transform; }
.ppl-stack > span { display: block; height: 1em; line-height: 1; }
.ppl-count sup {
  font-size: 0.26em;
  letter-spacing: 0;
  line-height: 1;
  color: var(--muted, #9e9ea8);
  margin-top: 0.4em;
}

/* ---------- Progress hairline ---------- */

.ppl-track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--line, rgba(255, 255, 255, 0.1));
  overflow: hidden;
  transition: opacity 0.3s ease-out;
}
.ppl-root[data-exiting="true"] .ppl-track { opacity: 0; }
.ppl-bar {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: var(--ppl-accent);
  will-change: transform;
}

/* ---------- Keyframes ---------- */

@keyframes ppl-in { to { opacity: 1; } }
@keyframes ppl-rise { to { transform: translate3d(0, 0, 0); } }
@keyframes ppl-role-in { from { transform: translate3d(0, 110%, 0); opacity: 0; } to { transform: translate3d(0, 0, 0); opacity: 1; } }
@keyframes ppl-pulse { 50% { opacity: 0.3; } }

/* ---------- Reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .ppl-root { transition: opacity 0.3s ease-out; }
  .ppl-root[data-exiting="true"] { transform: none; opacity: 0; }
  .ppl-root::after { display: none; }
  .ppl-ch-exit { transition: none; transform: none !important; }
  .ppl-ch, .ppl-hud, .ppl-role { animation-duration: 0.01s; animation-delay: 0s; }
  .ppl-fill { clip-path: inset(0 0 0 0) !important; }
  .ppl-dot { animation: none !important; }
}
`;

export type ParticlePreloaderProps = {
  /** Fires the moment the panel starts lifting away (start hero entrances here). */
  onExit?: () => void;
  /** Fires once the preloader has fully unmounted. */
  onComplete?: () => void;
  /** Minimum time (ms) for the counter to reach 100. */
  minDuration?: number;
  /** Max time (ms) to wait for fonts + window load before revealing anyway. */
  maxWait?: number;
  /** The two title lines. */
  lines?: [string, string];
  /** Words that cycle in the bottom-left as progress advances. */
  roles?: string[];
  /** Skip entirely if it already played in this browser session. */
  skipIfSeen?: boolean;
};

const easeCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const HOLD_MS = 450; // pause on the finished title before leaving
const EXIT_MS = 1650; // letters out (≈0.95s) overlapped with panel lift (0.55s delay + 1s)
const GATE_CAP = 0.9; // progress holds here until fonts + page load are ready
const SEEN_KEY = "ppl_seen_v3";
const DEFAULT_ROLES = ["Web Systems", "Data & ML", "Visual Direction", "Brand Identity"];
const ROWS_11 = Array.from({ length: 11 }, (_, i) => String(i % 10));

const hasSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Typographic Portfolio Preloader — v3
 * - Per-letter masked rise, then each letter inks left→right in sequence as progress climbs
 * - Rolling-digit counter (digits physically roll, no text swapping)
 * - Progress holds at ~90% until web fonts + window load are really done
 * - Exit: letters slide up out of their masks, then the panel lifts away behind a curved edge
 * - Hand-off events: `preloader:exit` / `preloader:done` and <html data-preloader="active|exiting|done">
 * - Not skippable. Pauses Lenis and locks scroll while active. Zero React renders per frame.
 */
export function ParticlePreloader({
  onExit,
  onComplete,
  minDuration = 2400,
  maxWait = 6000,
  lines = ["AYUSH", "SINGH."],
  roles = DEFAULT_ROLES,
  skipIfSeen = false,
}: ParticlePreloaderProps) {
  const [visible, setVisible] = useState(() => !(skipIfSeen && typeof window !== "undefined" && hasSeen()));
  const reducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hunRef = useRef<HTMLSpanElement>(null);
  const tenRef = useRef<HTMLSpanElement>(null);
  const oneRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const exitingRef = useRef(false);
  const doneRef = useRef(false);
  const exitTimerRef = useRef(0);
  const gateRef = useRef({ fonts: false, load: false });
  const reducedRef = useRef(reducedMotion);
  const completeRef = useRef(onComplete);
  const exitCbRef = useRef(onExit);
  const rolesRef = useRef(roles);
  reducedRef.current = reducedMotion;
  completeRef.current = onComplete;
  exitCbRef.current = onExit;
  rolesRef.current = roles;

  const total = lines.reduce((n, l) => n + Array.from(l).length, 0);

  // Already seen this session → resolve immediately
  useEffect(() => {
    if (visible) return;
    document.documentElement.dataset.preloader = "done";
    completeRef.current?.();
    window.dispatchEvent(new CustomEvent("preloader:done"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock scroll + pause Lenis while active, always start from the top
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.preloader = "active";
    window.scrollTo(0, 0);
    stopSmoothScroll();
    return () => {
      document.body.style.overflow = prevOverflow;
      startSmoothScroll();
    };
  }, [visible]);

  // Real readiness: web fonts + window load, with a hard timeout
  useEffect(() => {
    if (!visible) return;
    const g = gateRef.current;
    let cancelled = false;

    const fontsReady = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    (fontsReady ?? Promise.resolve()).then(() => {
      if (!cancelled) g.fonts = true;
    });

    const onLoad = () => {
      g.load = true;
    };
    if (document.readyState === "complete") g.load = true;
    else window.addEventListener("load", onLoad, { once: true });

    const t = window.setTimeout(() => {
      g.fonts = true;
      g.load = true;
    }, maxWait);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, [visible, maxWait]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage optional */
    }
    document.documentElement.dataset.preloader = "done";
    setVisible(false);
    completeRef.current?.();
    window.dispatchEvent(new CustomEvent("preloader:done"));
    window.dispatchEvent(new Event("resize"));
  }, []);

  /** Rolls the three digit columns smoothly for a value 0–100. */
  const writeCounter = useCallback((v: number) => {
    const hun = clamp01((v - 98) / 2); // 0 → 1 over 98–100
    const ten = Math.floor(v / 10) + clamp01((v % 10 - 8) / 2); // rolls during the last 2 of each ten
    const one = v >= 100 ? 0 : v % 10; // 0 → 10 (row 10 is another "0" → seamless wrap)
    if (hunRef.current) hunRef.current.style.transform = `translate3d(0,${(-hun / 2) * 100}%,0)`;
    if (tenRef.current) tenRef.current.style.transform = `translate3d(0,${(-ten / 11) * 100}%,0)`;
    if (oneRef.current) oneRef.current.style.transform = `translate3d(0,${(-one / 11) * 100}%,0)`;
  }, []);

  const handleExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    try {
      playSuccess();
    } catch {
      /* audio optional */
    }

    const root = rootRef.current;
    if (root) {
      root.dataset.exiting = "true";
      root.dataset.phase = "ready";
    }
    writeCounter(100);
    if (statusRef.current) statusRef.current.textContent = "Ready";
    if (barRef.current) barRef.current.style.transform = "scaleX(1)";
    fillRefs.current.forEach((el) => {
      if (el) el.style.clipPath = "inset(0 0% 0 0)";
    });

    // release the page so it can play its own entrance underneath the lifting panel
    document.body.style.overflow = "";
    document.documentElement.dataset.preloader = "exiting";
    startSmoothScroll();
    exitCbRef.current?.();
    window.dispatchEvent(new CustomEvent("preloader:exit"));

    exitTimerRef.current = window.setTimeout(finish, reducedRef.current ? 320 : EXIT_MS);
  }, [finish, writeCounter]);

  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    if (!root) return;

    let alive = true;
    let frameId = 0;
    let finishTimer = 0;

    let start = 0;
    let last = 0;
    let dtS = 0;
    let completed = false;
    let lastLabel = "";
    let lastRole = -1;
    let cap = GATE_CAP; // smoothed ceiling, lifts to 1 once the page is truly ready
    const clips: string[] = [];

    const setRole = (i: number) => {
      const el = roleRef.current;
      const list = rolesRef.current;
      if (!el || !list.length) return;
      el.textContent = list[i] ?? "";
      el.style.animation = "none";
      void el.offsetWidth; // restart the CSS animation
      el.style.animation = "";
    };

    const frame = (now: number) => {
      if (!alive) return;
      if (start === 0) {
        start = now;
        last = now;
      }

      const frameMs = Math.min(100, Math.max(0, now - last));
      last = now;
      if (frameMs > 0) {
        const targetDt = Math.min(2.2, Math.max(0.25, frameMs / 16.667));
        dtS = dtS === 0 ? targetDt : dtS + (targetDt - dtS) * 0.2;
      }
      const dt = dtS === 0 ? 1 : dtS;

      const elapsed = Math.max(0, now - start);
      const reduced = reducedRef.current;

      /* Progress = time, capped until fonts + load are actually done */
      const g = gateRef.current;
      const open = g.fonts && g.load;
      const timeRaw = Math.min(1, elapsed / minDuration);
      cap += ((open ? 1 : GATE_CAP) - cap) * (1 - Math.pow(0.9, dt));
      if (open && cap > 0.9995) cap = 1;
      const raw = Math.min(timeRaw, cap);
      const waiting = !open && timeRaw > cap;
      const pe = easeSine(raw);

      /* Counter + progress bar */
      writeCounter(pe * 100);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pe})`;

      /* Status */
      const label = completed ? "Ready" : waiting ? "Syncing" : pe < 0.4 ? "Initializing" : "Loading";
      if (label !== lastLabel) {
        lastLabel = label;
        if (statusRef.current) statusRef.current.textContent = label;
        root.dataset.phase = label.toLowerCase();
      }

      /* Cycling words */
      const count = rolesRef.current.length;
      if (count) {
        const ri = Math.min(count - 1, Math.floor(pe * count));
        if (ri !== lastRole) {
          lastRole = ri;
          setRole(ri);
        }
      }

      /* Per-letter ink, left → right, letter by letter */
      if (!reduced) {
        const n = total;
        for (let k = 0; k < n; k++) {
          const startK = 0.04 + (n > 1 ? k / (n - 1) : 0) * 0.56;
          const ink = easeCubic(clamp01((pe - startK) / 0.3));
          const c = `inset(0 ${((1 - ink) * 100).toFixed(2)}% 0 0)`;
          if (clips[k] !== c) {
            clips[k] = c;
            const el = fillRefs.current[k];
            if (el) el.style.clipPath = c;
          }
        }
      }

      if (raw >= 1 && !completed) {
        completed = true;
        finishTimer = window.setTimeout(handleExit, reduced ? 240 : HOLD_MS);
      }

      if (!exitingRef.current) frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimer);
      window.clearTimeout(exitTimerRef.current);
    };
  }, [visible, minDuration, handleExit, writeCounter, total]);

  if (!visible) return null;

  let k = 0;

  return (
    <div
      ref={rootRef}
      className="ppl-root"
      data-exiting="false"
      data-phase="initializing"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Portfolio loading"
    >
      <style>{STYLES}</style>

      <main className="ppl-stage" aria-hidden="true">
        <div className="ppl-title">
          {lines.map((line, li) => (
            <span key={li} className="ppl-line-mask">
              {Array.from(line).map((c) => {
                const idx = k++;
                const accent = c === "." ? " ppl-accent" : "";
                return (
                  <span key={idx} className="ppl-ch-exit" style={{ "--i": idx } as CSSProperties}>
                    <span className="ppl-ch">
                      <span className={`ppl-wire${accent}`}>{c}</span>
                      <span
                        ref={(el) => {
                          fillRefs.current[idx] = el;
                        }}
                        className={`ppl-fill${accent}`}
                      >
                        {c}
                      </span>
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </main>

      <header className="ppl-hud ppl-top">
        <strong>Ayush Singh</strong>
        <span className="ppl-status">
          <span className="ppl-dot" aria-hidden="true" />
          <span ref={statusRef}>Initializing</span>
        </span>
      </header>

      <footer className="ppl-hud ppl-bottom">
        <div className="ppl-roles">
          <span className="ppl-roles-label">Focus</span>
          <span className="ppl-role-slot">
            <span ref={roleRef} className="ppl-role">
              {roles[0] ?? ""}
            </span>
          </span>
        </div>

        <div className="ppl-count" aria-hidden="true">
          <span className="ppl-digit">
            <span ref={hunRef} className="ppl-stack">
              <span>0</span>
              <span>1</span>
            </span>
          </span>
          <span className="ppl-digit">
            <span ref={tenRef} className="ppl-stack">
              {ROWS_11.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </span>
          </span>
          <span className="ppl-digit">
            <span ref={oneRef} className="ppl-stack">
              {ROWS_11.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </span>
          </span>
          <sup>%</sup>
        </div>
      </footer>

      <div className="ppl-track" aria-hidden="true">
        <div ref={barRef} className="ppl-bar" />
      </div>
    </div>
  );
}

/* ==========================================================================
   Inline Loader — intentionally renders nothing.
   Kept as a component so existing <Loader /> usages / Suspense fallbacks
   keep working without showing the spinner.
   ========================================================================== */

export type LoaderProps = {
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg";
  label?: string;
};

export const Loader = (_props: LoaderProps) => null;

/** Drop-in name for existing imports: `import { Preloader } from "./Loader"` */
export { ParticlePreloader as Preloader };

export default Loader;