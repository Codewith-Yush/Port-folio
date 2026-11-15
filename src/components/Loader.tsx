import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { playSuccess, playClick } from "../utils/soundEffects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const STYLES = `
/* ==========================================================================
   EVENT HORIZON PRELOADER
   A black hole spins up an accretion disk, then spits it out as your name.
   On exit the name spirals back into the singularity and an iris closes.
   ========================================================================== */

.ppl-root {
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
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  /* clip-path is driven from JS each frame so the iris stays in sync with the particles */
  will-change: clip-path;
}

.ppl-root[data-exiting="true"] { pointer-events: none; }

.ppl-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* Soft colour wash + edge vignette over the scene */
.ppl-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 50% 50%, color-mix(in srgb, var(--ppl-accent) 10%, transparent), transparent 70%),
    radial-gradient(120% 90% at 50% 50%, transparent 50%, color-mix(in srgb, var(--ink) 12%, transparent) 100%);
  opacity: 0;
  animation: ppl-in 1.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
  transform: translate3d(0, 10px, 0);
  animation: ppl-up 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: opacity 0.35s ease-out;
}
.ppl-root[data-exiting="true"] .ppl-hud { opacity: 0 !important; }

.ppl-top {
  top: clamp(20px, 3.5vw, 32px);
  align-items: center;
  animation-delay: 0.2s;
}
.ppl-top strong {
  color: var(--ink);
  font-weight: 600;
}
.ppl-top span { font-variant-numeric: tabular-nums; }

.ppl-bottom {
  bottom: clamp(26px, 4vw, 40px);
  align-items: flex-end;
  animation-delay: 0.38s;
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
  will-change: transform, opacity;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}

/* ---------- Keyframes ---------- */

@keyframes ppl-in { to { opacity: 1; } }
@keyframes ppl-up { to { opacity: 1; transform: translate3d(0, 0, 0); } }

/* ---------- Reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .ppl-root { transition: opacity 0.25s ease-out; }
  .ppl-root[data-exiting="true"] { opacity: 0; }
  .ppl-hud { animation-duration: 0.01s; animation-delay: 0s; }
}
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
  jx: number; // stable jitter so re-sampling never reshuffles targets
  jy: number;
  r: number; // stable random seed
  u: number; // radial position in the accretion disk (0 = inner edge, 1 = outer edge)
  c: number; // disk colour bucket
  tc: number; // text colour bucket
  rad0: number; // orbit radius (unscaled)
  om: number; // Keplerian angular speed
  ds: number; // disk sprite size
  dop: number; // doppler size factor (updated while orbiting)
  ang: number; // current orbit angle
  thr: number; // progress threshold at which it is ejected into the text
  a: number; // phase
  k: number; // spring stiffness for text
  m: number; // 0 = disk matter … 1 = text matter (smooth cross-fade, never a pop)
  on: boolean; // assigned to text
};

/* ---- Text colour ramp (blue → lilac → deep violet) ---- */
const BUCKETS = 28;
const STOPS: [number, number, number][] = [
  [30, 144, 255],
  [179, 156, 255],
  [118, 84, 214],
];
const lerpRGB = (a: number[], b: number[], t: number): [number, number, number] => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
const COLOR_RGB = Array.from({ length: BUCKETS }, (_, i) => {
  const t = i / (BUCKETS - 1);
  return t < 0.5 ? lerpRGB(STOPS[0], STOPS[1], t * 2) : lerpRGB(STOPS[1], STOPS[2], (t - 0.5) * 2);
});

/* ---- Accretion disk ramp: white-hot inner edge → blue → lilac → violet ---- */
const DB = 24;
const DISK_STOPS: [number, number, number][] = [
  [228, 238, 255],
  [30, 144, 255],
  [179, 156, 255],
  [118, 84, 214],
];
const DISK_RGB = Array.from({ length: DB }, (_, i) => {
  const t = (i / (DB - 1)) * 3;
  const s = Math.min(2, Math.floor(t));
  return lerpRGB(DISK_STOPS[s], DISK_STOPS[s + 1], t - s);
});

const easeCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const smooth = (t: number) => t * t * (3 - 2 * t);
const TAU = Math.PI * 2;

const EXIT_MS = 1100;
const SWEEP_MS = 620; // highlight sweep across the finished name
const HOLD_MS = 750; // pause on the finished name before the exit
const STAR_COUNT = 150;
const MAX_POINTS = 2600;
const DISK_TILT = -0.22; // rad
const DISK_SQUASH = 0.3; // how edge-on the disk is
const W0 = 0.0011; // inner-edge angular speed (rad/ms)
const SPR = 64; // sprite cell size in the atlases

/** Pre-rendered soft dot: crisp core + faint halo. */
const makeSprite = (rgb: number[], halo: number, size = SPR) => {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;
  const r = size / 2;
  const col = (a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, col(1));
  grad.addColorStop(0.34, col(1));
  grad.addColorStop(0.42, col(0.55));
  grad.addColorStop(0.56, col(halo));
  grad.addColorStop(1, col(0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
};

/** All colour buckets in ONE texture so thousands of drawImage calls batch on the GPU. */
const makeAtlas = (rgbs: number[][], halo: number) => {
  const c = document.createElement("canvas");
  c.width = SPR * rgbs.length;
  c.height = SPR;
  const g = c.getContext("2d");
  if (g) rgbs.forEach((rgb, i) => g.drawImage(makeSprite(rgb, halo), i * SPR, 0));
  return c;
};

/** Pre-rendered radial falloff (replaces per-frame createRadialGradient + full-screen fills). */
const makeGlow = (size: number, stops: [number, string][]) => {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
};

const parseBg = (el: HTMLElement) => {
  const bg = getComputedStyle(el).backgroundColor;
  const nums = bg.match(/[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 3 || (nums.length >= 4 && nums[3] === 0)) return { css: "#0b0b0e", light: false };
  const scale = bg.startsWith("rgb") ? 1 : 255; // color(srgb …) is 0–1
  const [r, g, b] = nums;
  const light = ((0.2126 * r + 0.7152 * g + 0.0722 * b) * scale) / 255 > 0.55;
  return { css: bg, light };
};

/**
 * "Event Horizon" particle preloader.
 * - A black hole with a Keplerian accretion disk (inner edge spins fastest) and a gravitationally lensed ring
 * - As progress rises, disk matter is flung out of the singularity and arcs into your name, left to right
 * - 100%: the hole collapses, a lens-flare streak + shockwave fire, a highlight sweeps the name
 * - Exit: the name spirals back into the singularity while a glowing iris closes — same clock, no drift
 * - Smoothness: atlas-batched sprites, no per-particle pow()/gradients, cross-faded state changes,
 *   smoothed frame time, near-critically-damped springs, stable targets, adaptive quality
 * - Zero React renders per frame (canvas + refs); click / Esc / Space / Enter to skip; reduced-motion safe
 */
export function ParticlePreloader({
  onComplete,
  minDuration = 2600,
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
  const timeRef = useRef<HTMLSpanElement>(null);

  const exitingRef = useRef(false);
  const doneRef = useRef(false);
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

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    completeRef.current?.();
  }, []);

  const handleExit = useCallback(
    (skipped = false) => {
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

      // Normal path: the animation loop calls finish() when the iris is shut.
      // This timer is the safety net (hidden tab, throttled rAF) and the reduced-motion path.
      exitTimerRef.current = window.setTimeout(finish, reducedRef.current ? 260 : EXIT_MS + 450);
    },
    [finish]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    let started = false;
    let w = 0;
    let h = 0;
    let psize = 2;
    let textMin = 0;
    let textMax = 1;
    let Rh = 40;
    let Rin = 70;
    let Rout = 300;
    let dprCap = 2;
    let perm: number[] = [];
    let particles: Particle[] = [];
    let farIdx = new Int32Array(0);
    let nearIdx = new Int32Array(0);
    let textIdx = new Int32Array(0);

    const ptr = { x: 0, y: 0, sx: 0, sy: 0, active: false };

    let resizeTimer = 0;
    let finishTimer = 0;
    let fontTimer = 0;
    let frameId = 0;

    const { css: bgCss, light } = parseBg(root);
    const add = !light; // additive blending only reads well on dark pages

    /* ---- Sprites / textures ---- */
    const textAtlas = makeAtlas(COLOR_RGB, 0.2);
    const diskAtlas = makeAtlas(DISK_RGB, 0.26);
    const highlightSprite = makeSprite(light ? [86, 52, 200] : [238, 232, 255], 0.3);
    const glowSprite = makeGlow(256, [
      [0, "rgba(179,156,255,1)"],
      [1, "rgba(179,156,255,0)"],
    ]);
    const photonSprite = makeGlow(128, [
      [0, "rgba(226,216,255,0.5)"],
      [0.31, "rgba(226,216,255,0.5)"],
      [0.45, "rgba(179,156,255,0.22)"],
      [1, "rgba(179,156,255,0)"],
    ]);

    /* ---- Background stars ---- */
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      p: Math.random() * TAU,
    }));
    const starColor = light ? "86,52,200" : "232,228,255";

    /* ---- Sample the text into target points ---- */
    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = Math.min(w, h);
      Rh = base * 0.07;
      Rin = Rh * 1.75;
      Rout = Math.min(w * 0.46, base * 0.78);

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

      const minY = Math.max(0, Math.floor(h / 2 - lh - 16));
      const maxY = Math.min(h, Math.ceil(h / 2 + lh + 16));
      const minX = Math.max(0, Math.floor(w / 2 - longest * fs * 0.42));
      const maxX = Math.min(w, Math.ceil(w / 2 + longest * fs * 0.42));
      const boxW = Math.max(1, maxX - minX);
      const boxH = Math.max(1, maxY - minY);

      const data = o.getImageData(minX, minY, boxW, boxH).data;
      let step = Math.max(3, Math.ceil(fs / 32));
      let pts: number[] = [];
      for (;;) {
        pts = [];
        for (let y = 0; y < boxH; y += step) {
          for (let x = 0; x < boxW; x += step) {
            if (data[(y * boxW + x) * 4 + 3] > 128) pts.push(minX + x + step / 2, minY + y + step / 2);
          }
        }
        if (pts.length / 2 <= MAX_POINTS || step >= 10) break;
        step++;
      }
      psize = Math.max(1.6, Math.min(3.4, step * 0.46));

      const n = pts.length / 2;
      textMin = Infinity;
      textMax = -Infinity;
      for (let i = 0; i < n; i++) {
        const px = pts[i * 2];
        if (px < textMin) textMin = px;
        if (px > textMax) textMax = px;
      }
      if (!isFinite(textMin)) {
        textMin = 0;
        textMax = w;
      }
      const textSpan = Math.max(1, textMax - textMin);

      // Stable permutation: re-sampling (resize) keeps every particle's assignment, so nothing reshuffles mid-flight
      if (perm.length !== n) {
        perm = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [perm[i], perm[j]] = [perm[j], perm[i]];
        }
      }

      const jit = step * 0.3;

      const next: Particle[] = [];
      for (let i = 0; i < n; i++) {
        const prev = particles[i];
        let p: Particle;
        if (prev) {
          p = prev;
        } else {
          const u = Math.pow(Math.random(), 1.5); // denser toward the hot inner edge
          p = {
            // everything is born at the singularity and blooms outward
            x: w / 2 + (Math.random() - 0.5) * 24,
            y: h / 2 + (Math.random() - 0.5) * 24,
            vx: 0,
            vy: 0,
            tx: 0,
            ty: 0,
            jx: Math.random() - 0.5,
            jy: Math.random() - 0.5,
            r: Math.random(),
            u,
            c: Math.min(DB - 1, Math.floor(u * DB)),
            tc: 0,
            rad0: 0,
            om: 0,
            ds: 3.4 + 3.2 * (1 - u),
            dop: 1,
            ang: 0,
            thr: 0,
            a: Math.random() * TAU,
            k: 0.035 + Math.random() * 0.025,
            m: 0,
            on: false,
          };
        }
        p.tx = pts[perm[i] * 2] + p.jx * jit;
        p.ty = pts[perm[i] * 2 + 1] + p.jy * jit;
        const xn = (p.tx - textMin) / textSpan;
        // Mostly left→right so the name "writes" itself, with enough noise for a fuzzy front
        p.thr = Math.min(0.96, 0.5 * p.r + 0.46 * xn);
        p.tc = Math.min(BUCKETS - 1, Math.max(0, Math.floor(xn * BUCKETS)));
        p.rad0 = Rin + (Rout - Rin) * p.u;
        p.om = W0 * Math.pow(Rin / p.rad0, 1.5); // computed once, never per frame
        next.push(p);
      }
      particles = next;
      farIdx = new Int32Array(n);
      nearIdx = new Int32Array(n);
      textIdx = new Int32Array(n);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (started) build();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      if (!ptr.active) {
        ptr.sx = ptr.x;
        ptr.sy = ptr.y;
        ptr.active = true;
      }
    };
    const onLeave = () => {
      ptr.active = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") ptr.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleExit(true);
      }
    };
    window.addEventListener("keydown", onKey);

    const teardown = () => {
      alive = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(finishTimer);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(fontTimer);
      window.clearTimeout(exitTimerRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("keydown", onKey);
    };

    /* ---- Draw helpers (index lists + atlas = no per-particle branching on colour, one texture) ---- */
    const drawDiskList = (list: Int32Array, count: number, A: number) => {
      for (let j = 0; j < count; j++) {
        const p = particles[list[j]];
        const s = p.ds * p.dop;
        const m = p.m;
        if (m > 0.001) {
          ctx.globalAlpha = A * (1 - m);
          ctx.drawImage(diskAtlas, p.c * SPR, 0, SPR, SPR, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = A;
        } else {
          ctx.drawImage(diskAtlas, p.c * SPR, 0, SPR, SPR, p.x - s / 2, p.y - s / 2, s, s);
        }
      }
    };

    // the back of the disk, bent by gravity into a ring that hugs the hole (the "Interstellar" look)
    const drawLensedList = (list: Int32Array, count: number, cx: number, cy: number, rh: number) => {
      for (let j = 0; j < count; j++) {
        const p = particles[list[j]];
        if (p.r > 0.65 || p.m > 0.5) continue;
        const rl = rh * (1.28 + 1.15 * p.u);
        const s = 2.6 + 2 * (1 - p.u);
        ctx.drawImage(
          diskAtlas,
          p.c * SPR,
          0,
          SPR,
          SPR,
          cx + Math.cos(p.ang) * rl - s / 2,
          cy + Math.sin(p.ang) * rl * 0.96 - s / 2,
          s,
          s
        );
      }
    };

    /* ---- Animation loop ---- */
    let start = 0;
    let last = 0;
    let dtS = 1; // smoothed delta (kills frame-time jitter)
    let lastInt = -1;
    let lastLabel = "";
    let lastTime = "";
    let lastTimeAt = 0;
    let lastGlowOpacity = "";
    let completed = false;
    let doneAt = 0;
    let frameCount = 0;
    let ema = 16.7;
    let level = 0; // adaptive quality: 0 full · 1 lighter · 2 lighter + 1× pixel ratio
    let lastLevelAt = 0;

    const frame = (now: number) => {
      if (!alive) return;
      const frameMs = Math.min(100, Math.max(0, now - last));
      last = now;
      dtS += (Math.min(2.2, frameMs / 16.667) - dtS) * 0.25;
      const dt = Math.max(0.05, dtS);

      /* adaptive quality: if the device can't hold ~40fps, shed the most expensive extras */
      frameCount++;
      if (frameCount > 40 && frameMs < 100) {
        ema += (frameMs - ema) * 0.06;
        if (ema > 26 && level < 2 && now - lastLevelAt > 1500) {
          level++;
          lastLevelAt = now;
          if (level === 2) {
            dprCap = 1;
            build();
          }
        }
      }

      const elapsed = Math.max(0, now - start);
      const reduced = reducedRef.current;
      const raw = Math.min(1, elapsed / minDuration);
      const pe = easeSine(raw);
      const exiting = exitingRef.current;
      const eRaw = exiting ? Math.min(1, Math.max(0, (now - exitStartRef.current) / EXIT_MS)) : 0;
      const e = easeCubic(eRaw);
      // the counter/bar run to 100 during exit, so skipping never leaves them frozen mid-way
      const shown = pe + (1 - pe) * e;

      /* HUD (direct DOM writes — no React renders, only when something changed) */
      const int = Math.round(shown * 100);
      if (int !== lastInt) {
        lastInt = int;
        if (pctRef.current) pctRef.current.textContent = String(int).padStart(3, "0");
      }
      const label = exiting || completed ? "Ready" : pe < 0.3 ? "Accreting" : "Condensing";
      if (label !== lastLabel) {
        lastLabel = label;
        if (statusRef.current) statusRef.current.textContent = label;
      }
      if (now - lastTimeAt > 50) {
        const tLabel = "T+" + (Math.min(elapsed, minDuration) / 1000).toFixed(2);
        if (tLabel !== lastTime) {
          lastTime = tLabel;
          lastTimeAt = now;
          if (timeRef.current) timeRef.current.textContent = tLabel;
        }
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${w * shown}px,0,0)`;
        const go = shown >= 1 ? "0" : "0.8";
        if (go !== lastGlowOpacity) {
          lastGlowOpacity = go;
          glowRef.current.style.opacity = go;
        }
      }

      const cx = w / 2;
      const cy = h / 2;

      /* completion pulse */
      if (raw >= 1 && !completed && !exiting) {
        completed = true;
        doneAt = now;
        if (!reduced) {
          for (const p of particles) {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy) || 1;
            const f = 2 + Math.random() * 2.8;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        finishTimer = window.setTimeout(() => handleExit(false), reduced ? 300 : HOLD_MS);
      }

      /* smoothed pointer (no teleporting, speed-aware push) */
      let push = 2.2;
      if (ptr.active) {
        const k = 1 - Math.pow(0.72, dt);
        const nx = ptr.sx + (ptr.x - ptr.sx) * k;
        const ny = ptr.sy + (ptr.y - ptr.sy) * k;
        const speed = Math.hypot(nx - ptr.sx, ny - ptr.sy) / dt;
        ptr.sx = nx;
        ptr.sy = ny;
        push += 2.6 * Math.min(1, speed / 16);
      }
      const px = ptr.active ? ptr.sx : -9999;
      const py = ptr.active ? ptr.sy : -9999;

      /* scene state */
      const introT = Math.min(1, elapsed / 1300);
      const introE = 1 - Math.pow(1 - introT, 3);
      const diskScale = 0.15 + 0.85 * introE;

      // the hole gives up its mass as the name forms, collapses at 100%, then returns to swallow it all on exit
      let hs = (1 - 0.65 * pe) * (0.15 + 0.85 * introE);
      if (completed) hs *= 1 - easeCubic(Math.min(1, (now - doneAt) / 350));
      hs = Math.max(hs, 0.9 * e);
      const rh = Rh * hs;

      /* physics */
      const swirl = e * 2.6;
      const cs = Math.cos(swirl);
      const sn = Math.sin(swirl);
      const ct = Math.cos(DISK_TILT);
      const st = Math.sin(DISK_TILT);
      const inv = 1 - e;
      const REP = 130;
      const repSq = REP * REP;
      const invRep = 1 / REP;
      const kBoost = 1 + 1.4 * e;
      const mk = 1 - Math.pow(0.86, dt); // cross-fade rate between "disk matter" and "text matter"
      const dmOff = Math.pow(0.78, dt);
      const n = particles.length;

      for (let i = 0; i < n; i++) {
        const p = particles[i];
        const was = p.on;
        p.on = p.thr < pe;

        // smooth state blend — particles never pop between disk and text looks
        const mt = p.on ? 1 : 0;
        const dm = mt - p.m;
        p.m = Math.abs(dm) < 0.002 ? mt : p.m + dm * mk;

        let tx: number;
        let ty: number;
        let k: number;
        let damp: number;

        if (p.on) {
          const ox = p.tx - cx;
          const oy = p.ty - cy;
          tx = cx + (ox * cs - oy * sn) * inv;
          ty = cy + (ox * sn + oy * cs) * inv;
          k = p.k * kBoost;
          // damping tuned per-spring for ζ≈0.7: settles softly with a hint of life, no wobble
          damp = Math.pow(Math.max(0.5, 1 - 1.4 * Math.sqrt(k)), dt);
          if (!was && !reduced) {
            // flung out of the disk tangentially so it arcs into place instead of flying straight
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy) || 1;
            p.vx += (-dy / d) * 3.5;
            p.vy += (dx / d) * 3.5;
          }
        } else {
          // Keplerian orbit: inner matter circles much faster than the rim
          const rad = p.rad0 * diskScale;
          const ang = p.a + now * p.om;
          const ca = Math.cos(ang);
          p.ang = ang;
          p.dop = 1 - 0.28 * ca; // approaching side is relativistically beamed: bigger
          const ex = ca * rad;
          const ey = (Math.sin(ang) + (p.r - 0.5) * 0.12) * rad * DISK_SQUASH;
          const ox = ex * ct - ey * st;
          const oy = ex * st + ey * ct;
          tx = cx + (ox * cs - oy * sn) * inv;
          ty = cy + (ox * sn + oy * cs) * inv;
          k = 0.06 * kBoost;
          damp = dmOff;
        }

        if (reduced) {
          p.m = mt;
          p.x = p.on ? p.tx : tx;
          p.y = p.on ? p.ty : ty;
          continue;
        }

        // pointer repulsion + a little swirl so the field feels like fluid, not a force-field
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < repSq && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const factor = 1 - d * invRep;
          const f = factor * factor * factor * push; // cubic falloff = no hard edge at the radius
          p.vx += ((dx / d) * f - (dy / d) * f * 0.3) * dt;
          p.vy += ((dy / d) * f + (dx / d) * f * 0.3) * dt;
        }

        // spring toward target (frame-rate independent)
        p.vx += (tx - p.x) * k * dt;
        p.vy += (ty - p.y) * k * dt;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // classify once per frame (far/near of the hole, and who is drawn as text)
      let nf = 0;
      let nn = 0;
      let nt = 0;
      for (let i = 0; i < n; i++) {
        const p = particles[i];
        if (p.m < 0.999) {
          if (p.y < cy) farIdx[nf++] = i;
          else nearIdx[nn++] = i;
        }
        if (p.m > 0.001) textIdx[nt++] = i;
      }

      /* iris: same clock as the implosion */
      const irisR = (0.5 * Math.hypot(w, h) + 4) * (1 - e);
      if (exiting && !reduced) root.style.clipPath = `circle(${Math.max(0, irisR).toFixed(1)}px at 50% 50%)`;

      /* ---------- draw ---------- */
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      // living glow behind everything: swells with progress, flares on completion (attack is eased, never a pop)
      const sinceDone = completed ? now - doneAt : 0;
      const flash = completed ? smooth(Math.min(1, sinceDone / 90)) * Math.pow(Math.max(0, 1 - sinceDone / 800), 2) : 0;
      const glowA = Math.min(1, (0.05 + 0.1 * pe + 0.2 * flash) * (1 - e));
      const glowR = Math.min(w, h) * 0.6 * (1 + 0.25 * flash);
      ctx.globalAlpha = glowA;
      ctx.drawImage(glowSprite, cx - glowR, cy - glowR, glowR * 2, glowR * 2);

      if (!reduced) {
        // stars, with a touch of pointer parallax; they are pulled inward on exit
        ctx.fillStyle = `rgb(${starColor})`;
        const parx = ptr.active ? (ptr.sx - cx) * 0.025 : 0;
        const pary = ptr.active ? (ptr.sy - cy) * 0.025 : 0;
        const starStep = level >= 1 ? 2 : 1;
        for (let i = 0; i < stars.length; i += starStep) {
          const s = stars[i];
          const sx = cx + (s.x * w + parx * s.z - cx) * (1 - 0.7 * e);
          const sy = cy + (s.y * h + pary * s.z - cy) * (1 - 0.7 * e);
          const size = 0.8 + s.z * 1.5;
          ctx.globalAlpha = (0.2 + 0.5 * s.z) * (0.7 + 0.3 * Math.sin(now * 0.002 * (0.5 + s.z) + s.p)) * introE * (1 - e);
          ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }

        // 1) back half of the disk + its gravitationally lensed image
        ctx.globalCompositeOperation = add ? "lighter" : "source-over";
        ctx.globalAlpha = 0.9 * introE;
        drawDiskList(farIdx, nf, 0.9 * introE);
        if (hs > 0.05 && level === 0) {
          ctx.globalAlpha = 0.42 * introE;
          drawLensedList(farIdx, nf, cx, cy, rh);
          drawLensedList(nearIdx, nn, cx, cy, rh);
        }

        if (hs > 0.03) {
          // 2) photon glow hugging the horizon
          const gr = rh * 3;
          ctx.globalAlpha = introE;
          ctx.drawImage(photonSprite, cx - gr, cy - gr, gr * 2, gr * 2);

          // 3) the hole itself: a disc of the page colour punched out of the scene
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
          ctx.fillStyle = bgCss;
          ctx.beginPath();
          ctx.arc(cx, cy, rh, 0, TAU);
          ctx.fill();

          // 4) thin photon ring on the edge
          ctx.globalCompositeOperation = add ? "lighter" : "source-over";
          ctx.globalAlpha = 0.9 * introE;
          ctx.strokeStyle = light ? "rgba(86,52,200,0.9)" : "rgba(240,235,255,0.95)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(cx, cy, rh + 0.7, 0, TAU);
          ctx.stroke();
        }

        // 5) front half of the disk passes over the hole
        ctx.globalCompositeOperation = add ? "lighter" : "source-over";
        ctx.globalAlpha = 0.95 * introE;
        drawDiskList(nearIdx, nn, 0.95 * introE);
        ctx.globalCompositeOperation = "source-over";
      }

      // text particles: soft round dots with a subtle twinkle
      ctx.globalAlpha = 1;
      const baseS = psize * 2.9;
      const sweepT = completed && !exiting && !reduced ? Math.min(1, (now - doneAt) / SWEEP_MS) : 1;
      const sweeping = sweepT < 1;
      const band = Math.max(80, (textMax - textMin) * 0.16);
      const sweepX = textMin - band + (textMax - textMin + band * 2) * easeCubic(sweepT);

      for (let j = 0; j < nt; j++) {
        const p = particles[textIdx[j]];
        let s = baseS * (reduced ? 1 : 1 + 0.07 * Math.sin(now * 0.0028 + p.a * 4));
        if (sweeping) {
          const sw = 1 - Math.abs(p.tx - sweepX) / band;
          if (sw > 0) s *= 1 + 0.45 * sw;
        }
        if (p.m < 0.999) {
          ctx.globalAlpha = p.m;
          ctx.drawImage(textAtlas, p.tc * SPR, 0, SPR, SPR, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = 1;
        } else {
          ctx.drawImage(textAtlas, p.tc * SPR, 0, SPR, SPR, p.x - s / 2, p.y - s / 2, s, s);
        }
      }

      // highlight sweep
      if (sweeping) {
        for (let j = 0; j < nt; j++) {
          const p = particles[textIdx[j]];
          const sw = 1 - Math.abs(p.tx - sweepX) / band;
          if (sw <= 0.04) continue;
          const s = baseS * (1.1 + 0.45 * sw);
          ctx.globalAlpha = Math.min(1, sw * 0.95) * p.m;
          ctx.drawImage(highlightSprite, p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
      }

      if (!reduced && completed) {
        // shockwave
        const t = (now - doneAt) / 900;
        if (t < 1) {
          const rr = (1 - Math.pow(1 - t, 3)) * Math.hypot(w, h) * 0.38;
          ctx.strokeStyle = `rgba(179,156,255,${0.5 * (1 - t)})`;
          ctx.lineWidth = 1 + 2.5 * (1 - t);
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, TAU);
          ctx.stroke();
        }

        // anamorphic lens-flare streak as the singularity collapses
        if (flash > 0.01 && !exiting) {
          ctx.globalCompositeOperation = add ? "lighter" : "source-over";
          const lg = ctx.createLinearGradient(0, 0, w, 0);
          lg.addColorStop(0, "rgba(179,156,255,0)");
          lg.addColorStop(0.5, `rgba(226,216,255,${0.9 * flash})`);
          lg.addColorStop(1, "rgba(179,156,255,0)");
          ctx.fillStyle = lg;
          ctx.fillRect(0, cy - 1.2, w, 2.4);
          const lg2 = ctx.createLinearGradient(0, 0, w, 0);
          lg2.addColorStop(0, "rgba(179,156,255,0)");
          lg2.addColorStop(0.5, `rgba(179,156,255,${0.14 * flash})`);
          lg2.addColorStop(1, "rgba(179,156,255,0)");
          ctx.fillStyle = lg2;
          ctx.fillRect(0, cy - 16, w, 32);
          ctx.globalCompositeOperation = "source-over";
        }
      }

      // glowing rim on the closing iris — layered strokes instead of a full-screen gradient fill
      if (exiting && !reduced && irisR > 1) {
        const fade = 1 - e * 0.5;
        const layers: [number, number][] = [
          [56, 0.05],
          [28, 0.09],
          [12, 0.16],
          [3, 0.6],
        ];
        for (let i = 0; i < layers.length; i++) {
          const [lw, a] = layers[i];
          ctx.strokeStyle = `rgba(179,156,255,${a * fade})`;
          ctx.lineWidth = lw;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(0, irisR - lw / 2), 0, TAU);
          ctx.stroke();
        }
      }

      if (exiting && !reduced && eRaw >= 1) {
        teardown();
        finish();
        return;
      }

      frameId = requestAnimationFrame(frame);
    };

    /* Start only once the display font is ready (or after a short cap), so the name is
       sampled exactly once and no particle ever has to re-route mid-flight. */
    const begin = () => {
      if (!alive || started) return;
      started = true;
      build();
      start = performance.now();
      last = start;
      frameId = requestAnimationFrame(frame);
    };

    if (document.fonts?.load) {
      const cap = new Promise<void>((res) => {
        fontTimer = window.setTimeout(res, 450);
      });
      Promise.race([document.fonts.load("800 64px Inter").then(() => undefined, () => undefined), cap]).then(begin);
    } else {
      begin();
    }

    return teardown;
    // lines is expected to be stable; rebuild only if duration/lines change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDuration, lines[0], lines[1], handleExit, finish]);

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
        <strong>Ayush Singh</strong>
        <span ref={timeRef}>T+0.00</span>
      </header>

      <footer className="ppl-hud ppl-bottom">
        <div className="ppl-meta">
          <span ref={statusRef}>Accreting</span>
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