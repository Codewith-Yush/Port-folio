import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Activity, Cpu, Radio } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { playClick } from "../../utils/soundEffects";

type VisualMode = "matrix" | "stream" | "topology";
type ActiveNode = "fullstack" | "data" | "creative" | "telemetry" | null;

interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className = "" }: HeroVisualProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive state
  const [activeMode, setActiveMode] = useState<VisualMode>("matrix");
  const [activeNode, setActiveNode] = useState<ActiveNode>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [fpsCounter, setFpsCounter] = useState(60);

  // Parallax tilt physics
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // FPS simulation jitter for technical realism
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setFpsCounter(Math.floor(59 + Math.random() * 2));
    }, 1800);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Handle pointer tracking for 3D parallax
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top),
        normX: Number((nx * 2).toFixed(2)),
        normY: Number((ny * 2).toFixed(2)),
      });

      // Subtle, premium 3D tilt
      setTilt({
        rx: -ny * 12,
        ry: nx * 14,
      });
    },
    [reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setActiveNode(null);
    setTilt({ rx: 0, ry: 0 });
    setMousePos({ x: 0, y: 0, normX: 0, normY: 0 });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Trigger pulse ripple on center core click
  const triggerCorePulse = useCallback(
    (e?: React.MouseEvent) => {
      playClick("interactive");
      const id = Date.now();
      const rect = containerRef.current?.getBoundingClientRect();
      const x = e && rect ? e.clientX - rect.left : 250;
      const y = e && rect ? e.clientY - rect.top : 250;

      setRipples((prev) => [...prev.slice(-4), { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1600);
    },
    []
  );

  // 12 Compass Degree Markers
  const degreeMarkers = useMemo(() => {
    return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      const r = 262;
      const x = 300 + r * Math.cos(rad);
      const y = 300 + r * Math.sin(rad);
      const label = `${deg.toString().padStart(3, "0")}°`;
      return { deg, x, y, label };
    });
  }, []);

  // Mode descriptions
  const modeData = {
    matrix: {
      title: "ISOMETRIC CORE MATRIX",
      desc: "Distributed micro-services & neural graph",
      accent: "#B39CFF",
    },
    stream: {
      title: "DATA PIPELINE ACTIVE",
      desc: "Live Power BI ingestion & tensor stream",
      accent: "#1E90FF",
    },
    topology: {
      title: "CREATIVE SYSTEM SHADER",
      desc: "WebGL hardware acceleration @ 60fps",
      accent: "#FF0099",
    },
  }[activeMode];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`hero-visual-root relative mx-auto w-full max-w-[480px] lg:max-w-[510px] select-none ${className}`}
      style={{ perspective: "1200px" }}
      aria-label="Interactive System Architecture & Intelligence Visualizer"
    >
      <style>{`
        @keyframes hero-spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hero-spin-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes hero-radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes hero-wave-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -80; }
        }
        @keyframes hero-pulse-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes hero-data-stream-1 {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes hero-data-stream-2 {
          0% { stroke-dashoffset: -240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes hero-float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(0.8deg); }
        }

        .hero-spin-cw {
          transform-origin: 300px 300px;
          animation: hero-spin-clockwise 38s linear infinite;
        }
        .hero-spin-cw-fast {
          transform-origin: 300px 300px;
          animation: hero-spin-clockwise 20s linear infinite;
        }
        .hero-spin-ccw {
          transform-origin: 300px 300px;
          animation: hero-spin-counter 28s linear infinite;
        }
        .hero-radar-arm {
          transform-origin: 300px 300px;
          animation: hero-radar-sweep 8s linear infinite;
        }
        .hero-wave-animated {
          animation: hero-wave-flow 3.5s linear infinite;
        }
        .hero-pulse-orb {
          animation: hero-pulse-glow 3.2s ease-in-out infinite;
        }
        .hero-stream-line-1 {
          stroke-dasharray: 8 16;
          animation: hero-data-stream-1 4s linear infinite;
        }
        .hero-stream-line-2 {
          stroke-dasharray: 6 14;
          animation: hero-data-stream-2 4.5s linear infinite;
        }
        .hero-stream-line-3 {
          stroke-dasharray: 10 18;
          animation: hero-data-stream-1 5s linear infinite;
        }
        .hero-floating-core {
          animation: hero-float-gentle 6s ease-in-out infinite;
          transform-origin: 300px 290px;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-spin-cw,
          .hero-spin-cw-fast,
          .hero-spin-ccw,
          .hero-radar-arm,
          .hero-wave-animated,
          .hero-pulse-orb,
          .hero-stream-line-1,
          .hero-stream-line-2,
          .hero-stream-line-3,
          .hero-floating-core {
            animation: none !important;
          }
        }
      `}</style>

      {/* Main 3D Card Shell */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 text-[var(--ink)] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 dark:bg-[#121216]/90 dark:border-[#B39CFF]/20"
        style={{
          transform: reducedMotion
            ? "none"
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transition: isHovered ? "transform 0.12s ease-out" : "transform 0.6s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Subtle Ambient Colored Glow under the frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-2xl opacity-20 blur-xl transition-colors duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${modeData.accent} 0%, transparent 70%)`,
          }}
        />

        {/* Top Architectural Telemetry Bar */}
        <div className="relative z-20 mb-2 flex items-center justify-between border-b border-[var(--line)] pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: modeData.accent }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: modeData.accent }}
              />
            </span>
            <span className="font-bold text-[var(--ink)]">CORE // AS-2026</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[#1E90FF] font-semibold">[FPS: {fpsCounter}]</span>
            <span className="opacity-40">/</span>
            <span className="text-[var(--ink)]">
              {isHovered ? `X:${mousePos.normX} Y:${mousePos.normY}` : "READY"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded border border-[var(--line)] px-1.5 py-0.5 text-[9px] font-bold text-[#B39CFF]">
              SYS: LIVE
            </span>
          </div>
        </div>

        {/* Center SVG Kinetic Sculpture */}
        <div className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-xl border border-[var(--line)]/50 bg-[#0B0B0E] shadow-inner">
          {/* Subtle Cybernetic Grid Pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(rgba(179,156,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(179,156,255,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* SVG Canvas (600 x 600 viewport) */}
          <svg
            viewBox="0 0 600 600"
            className="h-full w-full"
            style={{ willChange: "transform" }}
            onClick={triggerCorePulse}
          >
            <defs>
              {/* Electric Gradients */}
              <linearGradient id="gradLavenderBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B39CFF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#1E90FF" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradBluePink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FF0099" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradPinkLavender" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0099" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#B39CFF" stopOpacity="0.95" />
              </linearGradient>

              {/* Facet Sheen Gradients */}
              <linearGradient id="facetTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B39CFF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1E90FF" stopOpacity="0.2" />
              </linearGradient>

              <linearGradient id="facetLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0B0B0E" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="facetRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0099" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#121218" stopOpacity="0.85" />
              </linearGradient>

              {/* Radial Core Glow */}
              <radialGradient id="coreRadialGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B39CFF" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#1E90FF" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#FF0099" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0B0B0E" stopOpacity="0" />
              </radialGradient>

              {/* Radar Sweep Radial Gradient */}
              <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#B39CFF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#B39CFF" stopOpacity="0" />
              </radialGradient>

              {/* Neon Glow Filters */}
              <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="7" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. LAYER: Radar Calibration Outer Reticle */}
            <g opacity="0.6">
              {/* Outer boundary circle */}
              <circle
                cx="300"
                cy="300"
                r="262"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />

              {/* Cardinal axis crosshair lines */}
              <line
                x1="300"
                y1="32"
                x2="300"
                y2="568"
                stroke="rgba(179, 156, 255, 0.14)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
              <line
                x1="32"
                y1="300"
                x2="568"
                y2="300"
                stroke="rgba(179, 156, 255, 0.14)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />

              {/* 12 Degree Markings */}
              {degreeMarkers.map((m) => (
                <g key={m.deg}>
                  <line
                    x1="300"
                    y1="300"
                    x2={m.x}
                    y2={m.y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="0.75"
                  />
                  <text
                    x={m.x}
                    y={m.y + 3}
                    textAnchor="middle"
                    fill="rgba(179, 156, 255, 0.55)"
                    fontFamily="monospace"
                    fontSize="8"
                    letterSpacing="0.05em"
                  >
                    {m.label}
                  </text>
                </g>
              ))}
            </g>

            {/* 2. LAYER: Kinetic Gyroscope Rings */}
            {/* Outer Slow Clockwise Dashed Ring */}
            <g className="hero-spin-cw">
              <circle
                cx="300"
                cy="300"
                r="234"
                fill="none"
                stroke="rgba(179, 156, 255, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 12"
              />
              {/* Satellite node traveling along the outer ring */}
              <circle cx="300" cy="66" r="4" fill="#B39CFF" filter="url(#heroGlow)" />
              <circle cx="300" cy="534" r="3" fill="#1E90FF" opacity="0.8" />
            </g>

            {/* Intermediate Counter-Clockwise Caliper Ring */}
            <g className="hero-spin-ccw">
              <circle
                cx="300"
                cy="300"
                r="192"
                fill="none"
                stroke="rgba(30, 144, 255, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="24 16 6 16"
              />
              <circle cx="108" cy="300" r="3.5" fill="#1E90FF" filter="url(#heroGlow)" />
              <circle cx="492" cy="300" r="3.5" fill="#FF0099" filter="url(#heroGlow)" />
            </g>

            {/* Elliptical Angled Planetary Orbit */}
            <g
              transform="rotate(-28 300 300)"
              className="hero-spin-cw-fast"
              opacity={activeMode === "stream" ? "0.9" : "0.5"}
            >
              <ellipse
                cx="300"
                cy="300"
                rx="215"
                ry="85"
                fill="none"
                stroke="url(#gradBluePink)"
                strokeWidth="1.2"
                strokeDasharray="6 8"
              />
              <circle cx="515" cy="300" r="4.5" fill="#FF0099" filter="url(#intenseGlow)" />
            </g>

            {/* Sweeping Sonar / Radar Sector Beam */}
            <g className="hero-radar-arm" opacity={activeMode === "matrix" ? "0.45" : "0.2"}>
              <path
                d="M 300 300 L 490 200 A 234 234 0 0 1 520 280 Z"
                fill="url(#radarSweepGrad)"
              />
              <line
                x1="300"
                y1="300"
                x2="520"
                y2="280"
                stroke="rgba(179, 156, 255, 0.75)"
                strokeWidth="1.5"
                filter="url(#heroGlow)"
              />
            </g>

            {/* 3. LAYER: Spline Circuits & Real-Time Data Flow */}
            <g>
              {/* Path 1: Center to Top-Left Node (Full-Stack) */}
              <path
                id="circuit1"
                d="M 300 290 C 230 290, 170 210, 120 145"
                fill="none"
                stroke={activeNode === "fullstack" ? "#B39CFF" : "rgba(179, 156, 255, 0.3)"}
                strokeWidth={activeNode === "fullstack" ? "2.5" : "1.2"}
                strokeDasharray="4 6"
              />
              {/* Animated Glowing Light Packet 1 */}
              <path
                d="M 300 290 C 230 290, 170 210, 120 145"
                fill="none"
                stroke="#B39CFF"
                strokeWidth="3"
                className="hero-stream-line-1"
                filter="url(#heroGlow)"
              />

              {/* Path 2: Center to Top-Right Node (Data Science & Power BI) */}
              <path
                id="circuit2"
                d="M 300 290 C 370 290, 430 210, 480 145"
                fill="none"
                stroke={activeNode === "data" ? "#1E90FF" : "rgba(30, 144, 255, 0.3)"}
                strokeWidth={activeNode === "data" ? "2.5" : "1.2"}
                strokeDasharray="4 6"
              />
              {/* Animated Glowing Light Packet 2 */}
              <path
                d="M 300 290 C 370 290, 430 210, 480 145"
                fill="none"
                stroke="#1E90FF"
                strokeWidth="3"
                className="hero-stream-line-2"
                filter="url(#heroGlow)"
              />

              {/* Path 3: Center to Bottom-Right Node (Creative Systems) */}
              <path
                id="circuit3"
                d="M 300 290 C 360 360, 420 400, 470 435"
                fill="none"
                stroke={activeNode === "creative" ? "#FF0099" : "rgba(255, 0, 153, 0.3)"}
                strokeWidth={activeNode === "creative" ? "2.5" : "1.2"}
                strokeDasharray="4 6"
              />
              {/* Animated Glowing Light Packet 3 */}
              <path
                d="M 300 290 C 360 360, 420 400, 470 435"
                fill="none"
                stroke="#FF0099"
                strokeWidth="3"
                className="hero-stream-line-3"
                filter="url(#heroGlow)"
              />

              {/* Path 4: Center to Bottom-Left Node (Telemetry & Live Waveform) */}
              <path
                d="M 300 290 C 230 360, 170 400, 130 435"
                fill="none"
                stroke={activeNode === "telemetry" ? "#B39CFF" : "rgba(179, 156, 255, 0.25)"}
                strokeWidth={activeNode === "telemetry" ? "2.5" : "1"}
                strokeDasharray="4 6"
              />
            </g>

            {/* 4. LAYER: Central Isometric Hypercube / Quantum Core */}
            <g className="hero-floating-core">
              {/* Deep Central Ambient Halo */}
              <circle
                cx="300"
                cy="290"
                r="95"
                fill="url(#coreRadialGlow)"
                className="hero-pulse-orb"
              />

              {/* Outer Isometric Wireframe Cage */}
              <polygon
                points="300,195 385,242 385,338 300,385 215,338 215,242"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Top Facet (Lavender Sheen) */}
              <polygon
                points="300,205 375,248 300,290 225,248"
                fill="url(#facetTopGrad)"
                stroke="#B39CFF"
                strokeWidth="1.5"
                className="transition-opacity duration-300 hover:opacity-90"
              />

              {/* Left Facet (Electric Blue Sheen) */}
              <polygon
                points="225,248 300,290 300,375 225,332"
                fill="url(#facetLeftGrad)"
                stroke="#1E90FF"
                strokeWidth="1.5"
                className="transition-opacity duration-300 hover:opacity-90"
              />

              {/* Right Facet (Vivid Pink Sheen) */}
              <polygon
                points="300,290 375,248 375,332 300,375"
                fill="url(#facetRightGrad)"
                stroke="#FF0099"
                strokeWidth="1.5"
                className="transition-opacity duration-300 hover:opacity-90"
              />

              {/* Internal Inverted Crystalline Gem */}
              <polygon
                points="300,240 340,265 340,315 300,340 260,315 260,265"
                fill="rgba(11, 11, 14, 0.65)"
                stroke="url(#gradLavenderBlue)"
                strokeWidth="1.2"
              />

              {/* Central Pulsing Fusion Orb */}
              <circle
                cx="300"
                cy="290"
                r="16"
                fill="url(#gradLavenderBlue)"
                filter="url(#intenseGlow)"
              />
              <circle cx="300" cy="290" r="7" fill="#FFFFFF" />

              {/* Wireframe Connecting Rays from Core to Outer Vertices */}
              <line x1="300" y1="205" x2="300" y2="240" stroke="#B39CFF" strokeWidth="1" />
              <line x1="375" y1="248" x2="340" y2="265" stroke="#1E90FF" strokeWidth="1" />
              <line x1="225" y1="248" x2="260" y2="265" stroke="#B39CFF" strokeWidth="1" />
              <line x1="300" y1="375" x2="300" y2="340" stroke="#FF0099" strokeWidth="1" />
              <line x1="375" y1="332" x2="340" y2="315" stroke="#FF0099" strokeWidth="1" />
              <line x1="225" y1="332" x2="260" y2="315" stroke="#1E90FF" strokeWidth="1" />

              {/* Glowing Corner Vertex Nodes */}
              <circle cx="300" cy="205" r="3.5" fill="#B39CFF" filter="url(#heroGlow)" />
              <circle cx="375" cy="248" r="3.5" fill="#1E90FF" filter="url(#heroGlow)" />
              <circle cx="375" cy="332" r="3.5" fill="#FF0099" filter="url(#heroGlow)" />
              <circle cx="300" cy="375" r="3.5" fill="#FF0099" filter="url(#heroGlow)" />
              <circle cx="225" cy="332" r="3.5" fill="#1E90FF" filter="url(#heroGlow)" />
              <circle cx="225" cy="248" r="3.5" fill="#B39CFF" filter="url(#heroGlow)" />
            </g>

            {/* Dynamic Click Ripple Energy Shockwaves */}
            {ripples.map((rip) => (
              <motion.circle
                key={rip.id}
                cx="300"
                cy="290"
                initial={{ r: 15, opacity: 0.9, strokeWidth: 4 }}
                animate={{ r: 240, opacity: 0, strokeWidth: 0.5 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                fill="none"
                stroke={modeData.accent}
                filter="url(#intenseGlow)"
              />
            ))}

            {/* 5. LAYER: Interactive Satellite Nodes & HUD Badges */}
            {/* Satellite 1: FULL-STACK (Top-Left) */}
            <g
              transform="translate(120, 145)"
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onMouseEnter={() => {
                setActiveNode("fullstack");
                playClick("subtle");
              }}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => {
                setActiveMode("matrix");
                triggerCorePulse();
              }}
            >
              <circle
                r="24"
                fill="#121216"
                stroke={activeNode === "fullstack" ? "#B39CFF" : "rgba(179, 156, 255, 0.45)"}
                strokeWidth={activeNode === "fullstack" ? "2.5" : "1.2"}
                filter="url(#heroGlow)"
              />
              <circle r="16" fill="rgba(179, 156, 255, 0.12)" />
              {/* Bracket glyph */}
              <text
                textAnchor="middle"
                dy="4"
                fill="#B39CFF"
                fontFamily="monospace"
                fontSize="12"
                fontWeight="bold"
              >
                &lt;/&gt;
              </text>
              {/* Node Label Card */}
              <g transform="translate(-15, -34)">
                <rect
                  x="-60"
                  y="0"
                  width="120"
                  height="18"
                  rx="4"
                  fill="#121216"
                  stroke="rgba(179, 156, 255, 0.35)"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                >
                  FULLSTACK CORE
                </text>
              </g>
            </g>

            {/* Satellite 2: DATA & POWER BI (Top-Right) */}
            <g
              transform="translate(480, 145)"
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onMouseEnter={() => {
                setActiveNode("data");
                playClick("subtle");
              }}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => {
                setActiveMode("stream");
                triggerCorePulse();
              }}
            >
              <circle
                r="24"
                fill="#121216"
                stroke={activeNode === "data" ? "#1E90FF" : "rgba(30, 144, 255, 0.45)"}
                strokeWidth={activeNode === "data" ? "2.5" : "1.2"}
                filter="url(#heroGlow)"
              />
              <circle r="16" fill="rgba(30, 144, 255, 0.12)" />
              {/* Mini equalizer bars inside node */}
              <rect x="-8" y="-4" width="3" height="8" fill="#1E90FF" rx="1" />
              <rect x="-2" y="-9" width="3" height="13" fill="#1E90FF" rx="1" />
              <rect x="4" y="-6" width="3" height="10" fill="#1E90FF" rx="1" />
              {/* Node Label Card */}
              <g transform="translate(15, -34)">
                <rect
                  x="-65"
                  y="0"
                  width="130"
                  height="18"
                  rx="4"
                  fill="#121216"
                  stroke="rgba(30, 144, 255, 0.35)"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                >
                  POWER BI // DATA ML
                </text>
              </g>
            </g>

            {/* Satellite 3: CREATIVE SYSTEMS (Bottom-Right) */}
            <g
              transform="translate(470, 435)"
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onMouseEnter={() => {
                setActiveNode("creative");
                playClick("subtle");
              }}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => {
                setActiveMode("topology");
                triggerCorePulse();
              }}
            >
              <circle
                r="24"
                fill="#121216"
                stroke={activeNode === "creative" ? "#FF0099" : "rgba(255, 0, 153, 0.45)"}
                strokeWidth={activeNode === "creative" ? "2.5" : "1.2"}
                filter="url(#heroGlow)"
              />
              <circle r="16" fill="rgba(255, 0, 153, 0.12)" />
              {/* Star / Sparkle glyph */}
              <polygon
                points="0,-8 3,-2 9,0 3,2 0,8 -3,2 -9,0 -3,-2"
                fill="#FF0099"
                filter="url(#heroGlow)"
              />
              {/* Node Label Card */}
              <g transform="translate(15, 30)">
                <rect
                  x="-65"
                  y="0"
                  width="130"
                  height="18"
                  rx="4"
                  fill="#121216"
                  stroke="rgba(255, 0, 153, 0.35)"
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="0.08em"
                >
                  CREATIVE SYSTEMS
                </text>
              </g>
            </g>

            {/* Satellite 4: LIVE TELEMETRY SINE WAVE (Bottom-Left) */}
            <g
              transform="translate(130, 435)"
              className="cursor-pointer transition-transform duration-200 hover:scale-105"
              onMouseEnter={() => {
                setActiveNode("telemetry");
                playClick("subtle");
              }}
              onMouseLeave={() => setActiveNode(null)}
            >
              <rect
                x="-58"
                y="-18"
                width="116"
                height="36"
                rx="6"
                fill="#121216"
                stroke={activeNode === "telemetry" ? "#B39CFF" : "rgba(179, 156, 255, 0.35)"}
                strokeWidth={activeNode === "telemetry" ? "1.8" : "0.9"}
              />
              {/* Mini animated sine wave */}
              <path
                d="M -45 0 Q -35 -10 -25 0 T -5 0 T 15 0 T 35 0 T 45 0"
                fill="none"
                stroke="#B39CFF"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="hero-wave-animated"
              />
              <text
                x="0"
                y="28"
                textAnchor="middle"
                fill="rgba(179, 156, 255, 0.7)"
                fontFamily="monospace"
                fontSize="7.5"
                letterSpacing="0.1em"
              >
                TELEMETRY // 12MS
              </text>
            </g>
          </svg>

          {/* Interactive Click Helper Overlay Badge */}
          <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#B39CFF]/80">
            <Radio className="h-3 w-3 animate-pulse text-[#B39CFF]" />
            <span>CLICK CORE TO PULSE</span>
          </div>
        </div>

        {/* Bottom Mode Switcher & Real-Time Diagnostics */}
        <div className="relative z-20 mt-3 pt-2">
          <div className="flex items-center justify-between gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-1">
            {(
              [
                { id: "matrix", label: "[01 // MATRIX]", icon: Cpu, color: "#B39CFF" },
                { id: "stream", label: "[02 // DATA STREAM]", icon: Activity, color: "#1E90FF" },
                { id: "topology", label: "[03 // CREATIVE]", icon: Sparkles, color: "#FF0099" },
              ] as const
            ).map((mode) => {
              const active = activeMode === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    playClick("interactive");
                    setActiveMode(mode.id);
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[9.5px] uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? "bg-[var(--surface)] font-bold text-[var(--ink)] shadow-sm dark:bg-[#1C1C24]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                  style={{
                    borderLeft: active ? `2px solid ${mode.color}` : "2px solid transparent",
                  }}
                >
                  <Icon
                    className="h-3 w-3"
                    style={{ color: active ? mode.color : "currentColor" }}
                  />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Subsystem Status Caption */}
          <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[var(--muted)]">
            <div className="flex items-center gap-2 truncate">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: modeData.accent }}
              />
              <span className="font-semibold text-[var(--ink)]">{modeData.title}:</span>
              <span className="hidden sm:inline text-[var(--muted)]">{modeData.desc}</span>
            </div>
            <span className="shrink-0 text-[#1E90FF] font-mono text-[9px] font-semibold uppercase">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
