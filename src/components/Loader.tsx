import { useState, useEffect, type CSSProperties } from "react";
import { cn } from "../utils/cn";
import { playSuccess } from "../utils/soundEffects";
import "./Loader.css";

export type LoaderProps = {
  className?: string;
  style?: CSSProperties;
  isLaunching?: boolean;
  showGrid?: boolean;
};

/**
 * Creative Speeder Loader with 3D cyber grid, glowing visor,
 * plasma thruster exhaust, and hyperspace warp streaks.
 */
export const Loader = ({
  className,
  style,
  isLaunching = false,
  showGrid = true,
}: LoaderProps) => {
  return (
    <div
      className={cn(
        "speeder-wrapper",
        isLaunching && "hyperdrive-launch",
        className
      )}
      style={style}
    >
      {/* 3D Perspective Cyber Highway Runway */}
      {showGrid && <div className="speeder-grid-floor" aria-hidden="true" />}

      {/* Multi-Layer Hyperspace Light Streaks */}
      <div className="longfazers" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Speeder Assembly */}
      <div className="loader-container">
        <div className="loader">
          {/* Dual Plasma Jet Thruster & Shockwave Exhaust */}
          <div className="plasma-thruster" aria-hidden="true">
            <div className="plasma-flare" />
            <div className="plasma-core" />
            <div className="plasma-rings">
              <span />
              <span />
              <span />
            </div>
          </div>

          {/* Aerodynamic helmet & tail wind streaks */}
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>

          {/* Chassis, Rider Body & Visor */}
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
      </div>
    </div>
  );
};

export type PreloaderProps = {
  onComplete?: () => void;
  minDuration?: number;
};

// Clean up any stale session flags from previous tests
if (typeof window !== "undefined") {
  try {
    sessionStorage.removeItem("portfolio_preloaded");
  } catch {
    // Ignore
  }
}

/**
 * Cinematic High-Tech Entry Preloader Overlay with Telemetry HUD,
 * Live Speedometer, and Hyperdrive Warp Slingshot Transition.
 */
export function Preloader({ onComplete, minDuration = 1200 }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  // Lock body scroll while Preloader is active
  useEffect(() => {
    if (visible && !fading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible, fading]);

  // Live Speedometer & Progress Tick
  useEffect(() => {
    let isMounted = true;
    let frameId = 0;
    let exitTimer = 0;
    let unmountTimer = 0;
    const startTime = performance.now();

    const finishPreloader = () => {
      if (!isMounted) return;
      setLaunching(true);
      try {
        playSuccess();
      } catch {
        // Audio safe catch
      }

      exitTimer = window.setTimeout(() => {
        if (!isMounted) return;
        setFading(true);
        unmountTimer = window.setTimeout(() => {
          if (!isMounted) return;
          setVisible(false);
          document.body.style.overflow = "";
          onComplete?.();
        }, 450);
      }, 350);
    };

    const tick = (now: number) => {
      if (!isMounted) return;
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / minDuration);

      // Easing curve for rapid acceleration
      const easedProgress = Math.pow(rawProgress, 1.2);
      setProgress(Math.round(easedProgress * 100));
      setSpeed(Math.round(easedProgress * 999));

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        finishPreloader();
      }
    };

    frameId = requestAnimationFrame(tick);

    // Skip on Escape or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        setLaunching(true);
        setFading(true);
        setTimeout(() => {
          if (!isMounted) return;
          setVisible(false);
          document.body.style.overflow = "";
          onComplete?.();
        }, 200);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [minDuration, onComplete]);

  if (!visible) return null;

  const getStatusText = (p: number) => {
    if (p < 30) return "BOOTING NEURAL KERNEL...";
    if (p < 65) return "CALIBRATING WEBGL SHADERS...";
    if (p < 95) return "SPOOLING WARP ENGINES...";
    return "HYPERDRIVE ENGAGED 🚀";
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-between overflow-hidden bg-[var(--page)] text-[var(--ink)] select-none transition-all duration-500",
        fading ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      )}
      aria-label="Portfolio initializing"
      role="status"
    >
      {/* Hyperdrive Warp Flare Burst */}
      {launching && <div className="hyperdrive-flash" aria-hidden="true" />}

      {/* Top Telemetry HUD Bar */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[var(--ink)]/60">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="uppercase text-[var(--ink)]">AYUSH_OS // QUANTUM_SYS</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <span className="text-emerald-500 font-extrabold uppercase">WARP VELOCITY</span>
          <span className="px-2 py-0.5 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[9px]">
            ESC to skip
          </span>
        </div>
      </div>

      {/* Main Speeder Action Stage */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <Loader isLaunching={launching} showGrid={true} />
      </div>

      {/* Bottom Telemetry Dashboard & Speedometer */}
      <div className="relative z-30 w-full max-w-xl mx-auto px-6 pb-8 sm:pb-12 flex flex-col items-center gap-3.5 text-center">
        {/* Digital Speedometer & Status */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-[var(--ink)]">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
            {getStatusText(progress)}
          </span>
          <span className="text-sm sm:text-base font-extrabold tracking-wider">
            {speed} <span className="text-[10px] font-normal text-[var(--ink)]/50">KM/H</span>
          </span>
        </div>

        {/* High-Tech Segmented Progress Bar */}
        <div className="w-full h-1.5 sm:h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10 p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Micro Subtitle */}
        <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ink)]/50">
          <span>Ayush Singh</span>
          <span>•</span>
          <span>Portfolio 2026</span>
          <span>•</span>
          <span className="text-emerald-500 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
