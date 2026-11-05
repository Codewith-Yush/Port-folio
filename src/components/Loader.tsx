import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { playSuccess, playClick } from "../utils/soundEffects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const STYLES = `
/* ==========================================================================
   PARTICLE PRELOADER
   Canvas particles assemble the name; iris-close reveal on exit.
   ========================================================================== */

.ppl-root {
  --ppl-ease: cubic-bezier(0.76, 0, 0.24, 1);
  --ppl-accent: #b39cff;
  --ppl-blue: #1e90ff;
  --ppl-deep: #7654d6;

  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: hidden;
  background: var(--page);
  color: var(--ink);
  cursor: pointer;
  user-select: none;
  clip-path: circle(150vmax at 50% 50%);
  transition: clip-path 1s var(--ppl-ease);
  will-change: clip-path;
}

/* Iris closes toward the centre, revealing the page beneath */
.ppl-root[data-exiting="true"] {
  clip-path: circle(0px at 50% 50%);
  pointer-events: none;
}

.ppl-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* Soft colour wash + edge vignette behind the particles */
.ppl-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 50% 50%, color-mix(in srgb, var(--ppl-accent) 14%, transparent), transparent 70%),
    radial-gradient(120% 90% at 50% 50%, transparent 55%, color-mix(in srgb, var(--ink) 10%, transparent) 100%);
  opacity: 0;
  animation: ppl-in 1.4s 0.1s ease-out forwards;
}

/* ---------- HUD ---------- */

.ppl-hud {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 40px);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0;
  transform: translate3d(0, 8px, 0);
  animation: ppl-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: opacity 0.4s ease-out;
}
.ppl-root[data-exiting="true"] .ppl-hud { opacity: 0 !important; }

.ppl-top {
  top: clamp(20px, 3.5vw, 32px);
  align-items: center;
  animation-delay: 0.15s;
}
.ppl-top strong {
  color: var(--ink);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.ppl-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--ppl-deep);
}
.ppl-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--ppl-accent);
  animation: ppl-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.ppl-bottom {
  bottom: clamp(26px, 4vw, 40px);
  align-items: flex-end;
  animation-delay: 0.3s;
}
.ppl-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 10px;
}
.ppl-meta span:last-child { opacity: 0.45; }

.ppl-count {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  color: var(--ink);
  font-size: clamp(44px, 8vw, 88px);
  font-weight: 300;
  letter-spacing: -0.04em;
  line-height: 0.85;
  font-variant-numeric: tabular-nums;
}
.ppl-count sup {
  font-size: 0.28em;
  letter-spacing: 0;
  color: var(--muted);
  margin-top: 0.3em;
}

/* ---------- Progress hairline ---------- */

.ppl-track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--line);
  overflow: hidden;
}
.ppl-bar {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--ppl-blue), var(--ppl-accent), var(--ppl-deep));
  will-change: transform;
}
.ppl-glow {
  position: absolute;
  top: -8px;
  left: -60px;
  width: 120px;
  height: 18px;
  background: radial-gradient(closest-side, var(--ppl-accent), transparent);
  filter: blur(6px);
  opacity: 0.8;
  will-change: transform;
  pointer-events: none;
}

/* ---------- Keyframes ---------- */

@keyframes ppl-in { to { opacity: 1; } }
@keyframes ppl-up { to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes ppl-ping {
  75%, 100% { transform: scale(2.6); opacity: 0; }
}

/* ---------- Reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .ppl-root { transition: opacity 0.25s ease-out; }
  .ppl-root[data-exiting="true"] {
    clip-path: circle(150vmax at 50% 50%);
    opacity: 0;
  }
  .ppl-hud { animation-duration: 0.01s; animation-delay: 0s; }
  .ppl-dot::after { animation: none; }
}
`;

const LOADER_STYLES = `
@keyframes minimal-spin { to { transform: rotate(360deg); } }
@keyframes minimal-spin-rev { to { transform: rotate(-360deg); } }
@keyframes minimal-breathe { 0%,100% { transform: scale(.7); opacity: .55; } 50% { transform: scale(1); opacity: 1; } }
.minimal-loader-spin { animation: minimal-spin 1.1s cubic-bezier(.5,.1,.5,.9) infinite; transform-origin: center; }
.minimal-loader-spin-rev { animation: minimal-spin-rev 1.9s linear infinite; transform-origin: center; }
.minimal-loader-dot { animation: minimal-breathe 1.6s ease-in-out infinite; transform-origin: center; }
@media (prefers-reduced-motion: reduce) { .minimal-loader-spin { animation-duration: 2.4s; } .minimal-loader-spin-rev { animation: none; } }
`;

export type ParticlePreloaderProps = {
  onComplete?: () => void;
  /** Time (ms) for the counter to reach 100%. */
  minDuration?: number;
  /** Two lines of text the particles assemble into. */
  lines?: [string, string];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // text target
  ty: number;
  thr: number; // progress threshold at which it joins the text
  a: number; // orbit phase
  b: number; // orbit variance
  k: number; // spring stiffness
  on: boolean; // currently assigned to text
};

/* ---- Colour ramp (blue → lilac → deep violet), bucketed for fast batched drawing ---- */
const BUCKETS = 28;
const STOPS: [number, number, number][] = [
  [30, 144, 255],
  [179, 156, 255],
  [118, 84, 214],
];
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
const COLORS = Array.from({ length: BUCKETS }, (_, i) => {
  const t = i / (BUCKETS - 1);
  return t < 0.5 ? mix(STOPS[0], STOPS[1], t * 2) : mix(STOPS[1], STOPS[2], (t - 0.5) * 2);
});

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const EXIT_MS = 1000;

/**
 * Particle portfolio preloader.
 * - Thousands of particles orbit in a living ring, then spring into your name as progress rises
 * - Pointer repels particles; a shockwave pulses at 100%
 * - Exit: everything implodes to a point while a circular iris closes to reveal the page
 * - Zero React renders per frame (canvas + refs); frame-rate independent physics
 * - Click / Esc / Space / Enter to skip; reduced-motion safe
 */
export function ParticlePreloader({
  onComplete,
  minDuration = 2200,
  lines = ["AYUSH", "SINGH."],
}: ParticlePreloaderProps) {
  const [visible, setVisible] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const exitingRef = useRef(false);
  const exitStartRef = useRef(0);
  const exitTimerRef = useRef(0);
  const reducedRef = useRef(reducedMotion);
  const completeRef = useRef(onComplete);
  reducedRef.current = reducedMotion;
  completeRef.current = onComplete;

  // Lock scroll while mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleExit = useCallback((skipped = false) => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    exitStartRef.current = performance.now();

    try {
      if (skipped) playClick("subtle");
      else playSuccess();
    } catch {
      /* audio optional */
    }

    if (rootRef.current) rootRef.current.dataset.exiting = "true";
    document.body.style.overflow = "";

    exitTimerRef.current = window.setTimeout(
      () => {
        setVisible(false);
        completeRef.current?.();
      },
      reducedRef.current ? 260 : EXIT_MS + 40
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let psize = 2;
    let particles: Particle[] = [];
    let buckets: number[][] = [];
    const pointer = { x: -9999, y: -9999 };

    /* ---- Sample the text into target points ---- */
    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;

      const longest = Math.max(lines[0].length, lines[1].length);
      const fs = Math.min((w * 0.88) / (longest * 0.7), h * 0.24, 230);
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `800 ${fs}px Inter, "Helvetica Neue", Arial, sans-serif`;
      const lh = fs * 0.98;
      o.fillText(lines[0], w / 2, h / 2 - lh / 2 - 6);
      o.fillText(lines[1], w / 2, h / 2 + lh / 2 - 6);

      const data = o.getImageData(0, 0, w, h).data;
      let step = 4;
      let pts: number[] = [];
      for (;;) {
        pts = [];
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            if (data[(y * w + x) * 4 + 3] > 128) pts.push(x, y);
          }
        }
        if (pts.length / 2 <= 4200) break;
        step++;
      }
      psize = Math.max(1.6, Math.min(3.4, step * 0.46));

      const n = pts.length / 2;
      const order = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [order[i], order[j]] = [order[j], order[i]];
      }

      const next: Particle[] = [];
      buckets = Array.from({ length: BUCKETS }, () => []);
      for (let i = 0; i < n; i++) {
        const tx = pts[order[i] * 2];
        const ty = pts[order[i] * 2 + 1];
        const prev = particles[i];
        const p: Particle = prev ?? {
          x: w / 2 + (Math.random() - 0.5) * w * 0.6,
          y: h / 2 + (Math.random() - 0.5) * h * 0.6,
          vx: 0,
          vy: 0,
          tx,
          ty,
          thr: Math.random() * 0.96,
          a: Math.random() * Math.PI * 2,
          b: Math.random(),
          k: 0.035 + Math.random() * 0.025,
          on: false,
        };
        p.tx = tx;
        p.ty = ty;
        next.push(p);
        const bi = Math.min(BUCKETS - 1, Math.floor((tx / w) * BUCKETS));
        buckets[bi].push(i);
      }
      particles = next;
    };

    build();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleExit(true);
      }
    };
    window.addEventListener("keydown", onKey);

    /* ---- Animation loop ---- */
    const start = performance.now();
    let last = start;
    let lastInt = -1;
    let completed = false;
    let frameId = 0;
    let finishTimer = 0;
    let alive = true;

    const frame = (now: number) => {
      if (!alive) return;
      const dt = Math.min(2.2, (now - last) / 16.667);
      last = now;

      const raw = Math.min(1, (now - start) / minDuration);
      const pe = ease(raw);
      const reduced = reducedRef.current;

      // exit progress (0..1)
      const e = exitingRef.current ? ease(Math.min(1, (now - exitStartRef.current) / EXIT_MS)) : 0;

      // HUD (direct DOM writes — no React renders)
      const int = Math.round(pe * 100);
      if (int !== lastInt) {
        lastInt = int;
        if (pctRef.current) pctRef.current.textContent = String(int).padStart(3, "0");
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${pe})`;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${w * pe}px,0,0)`;
        glowRef.current.style.opacity = pe >= 1 ? "0" : "0.8";
      }

      // completion pulse
      if (raw >= 1 && !completed) {
        completed = true;
        if (statusRef.current) statusRef.current.textContent = "Ready";
        if (!reduced) {
          const cx = w / 2;
          const cy = h / 2;
          for (const p of particles) {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy) || 1;
            const f = 2.5 + Math.random() * 3.5;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        finishTimer = window.setTimeout(() => handleExit(false), 520);
      }

      // physics
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34 * (1 - e);
      const REP = 120;
      const repSq = REP * REP;
      const invRep = 1 / REP;
      const dmOn = Math.pow(0.84, dt);
      const dmOff = Math.pow(0.9, dt);

      for (const p of particles) {
        p.on = p.thr < pe;

        let tx: number;
        let ty: number;
        let k: number;
        let dm: number;

        if (p.on) {
          tx = p.tx + (cx - p.tx) * e;
          ty = p.ty + (cy - p.ty) * e;
          k = p.k;
          dm = dmOn;
        } else {
          const ang = p.a + now * 0.00025 * (0.4 + p.b);
          const rad = R * (0.7 + 0.3 * Math.sin(now * 0.0006 + p.a * 7)) * (0.8 + p.b * 0.4);
          tx = cx + Math.cos(ang) * rad * 1.35;
          ty = cy + Math.sin(ang) * rad * 0.8;
          k = 0.014;
          dm = dmOff;
        }

        if (reduced) {
          p.x = p.on ? p.tx : tx;
          p.y = p.on ? p.ty : ty;
          continue;
        }

        // pointer repulsion
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < repSq && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const factor = 1 - d * invRep;
          const f = factor * factor * 3.2;
          p.vx += (dx / d) * f * dt;
          p.vy += (dy / d) * f * dt;
        }

        // spring toward target (frame-rate independent)
        p.vx += (tx - p.x) * k * dt;
        p.vy += (ty - p.y) * k * dt;
        p.vx *= dm;
        p.vy *= dm;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // draw
      ctx.clearRect(0, 0, w, h);

      if (!reduced) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#B39CFF";
        for (const p of particles) {
          if (!p.on) ctx.fillRect(p.x, p.y, 1.4, 1.4);
        }
      }

      ctx.globalAlpha = 1;
      const half = psize / 2;
      for (let b = 0; b < BUCKETS; b++) {
        const list = buckets[b];
        if (!list || !list.length) continue;
        ctx.fillStyle = COLORS[b];
        for (let i = 0; i < list.length; i++) {
          const p = particles[list[i]];
          if (p && p.on) ctx.fillRect(p.x - half, p.y - half, psize, psize);
        }
      }

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimer);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(exitTimerRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
    };
    // lines is expected to be stable; rebuild only if duration/lines change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDuration, lines[0], lines[1], handleExit]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="ppl-root"
      data-exiting="false"
      role="status"
      aria-live="polite"
      aria-label="Portfolio loading"
      onClick={() => handleExit(true)}
    >
      <style>{STYLES}</style>
      <canvas ref={canvasRef} className="ppl-canvas" aria-hidden="true" />
      <div className="ppl-vignette" aria-hidden="true" />

      <header className="ppl-hud ppl-top">
        <strong>
          <span className="ppl-dot" aria-hidden="true" />
          Ayush Singh
        </strong>
        <span>SYS // 2026</span>
      </header>

      <footer className="ppl-hud ppl-bottom">
        <div className="ppl-meta">
          <span ref={statusRef}>Loading</span>
          <span>Click or press ESC to skip</span>
        </div>
        <div className="ppl-count" aria-hidden="true">
          <span ref={pctRef}>000</span>
          <sup>%</sup>
        </div>
      </footer>

      <div className="ppl-track" aria-hidden="true">
        <div ref={barRef} className="ppl-bar" />
        <div ref={glowRef} className="ppl-glow" />
      </div>
    </div>
  );
}


/* ==========================================================================
   Inline Loader (small spinner)
   ========================================================================== */

export type LoaderProps = {
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg";
  label?: string;
};

const PX = { sm: 20, md: 32, lg: 48 } as const;
const SW = { sm: 2.4, md: 2, lg: 2 } as const;

export const Loader = ({ className, style, size = "md", label }: LoaderProps) => {
  const gid = "loader-grad-" + useId().replace(/:/g, "");
  const px = PX[size];
  const sw = SW[size];
  const layer: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, ...style }}
      role="status"
      aria-label={label || "Loading"}
    >
      <style>{LOADER_STYLES}</style>
      <div style={{ position: "relative", width: px, height: px, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 40 40" style={layer} aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E90FF" />
              <stop offset="55%" stopColor="#B39CFF" />
              <stop offset="100%" stopColor="#7654D6" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" strokeWidth={sw} />
        </svg>
        <svg viewBox="0 0 40 40" className="minimal-loader-spin-rev" style={layer} aria-hidden="true">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#B39CFF" strokeOpacity="0.35" strokeWidth={sw} strokeDasharray="10 90" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 40 40" className="minimal-loader-spin" style={layer} aria-hidden="true">
          <circle cx="20" cy="20" r="16" fill="none" stroke={`url(#${gid})`} strokeWidth={sw} strokeDasharray="30 70" strokeLinecap="round" />
        </svg>
        <span
          className="minimal-loader-dot"
          style={{ position: "absolute", width: "18%", height: "18%", borderRadius: 9999, background: "#B39CFF" }}
          aria-hidden="true"
        />
      </div>
      {label ? (
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          {label}
        </span>
      ) : null}
    </div>
  );
};

/** Drop-in name for existing imports: `import { Preloader } from "./Loader"` */
export { ParticlePreloader as Preloader };

export default Loader;