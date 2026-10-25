import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeToggle } from "../components/ThemeToggle";

import {
  isSoundFxEnabled,
  toggleSoundFx,
  playClick,
  playTab,
  playSuccess,
} from "../utils/soundEffects";

gsap.registerPlugin(ScrollTrigger);

/* ─── Unified Sound Synthesizer Bridge ───── */
class SoundFX {
  toggle(): boolean {
    return toggleSoundFx();
  }

  isEnabled(): boolean {
    return isSoundFxEnabled();
  }

  pop() {
    playTab();
  }

  tick() {
    playClick("subtle");
  }

  slide() {
    playTab();
  }

  like() {
    playSuccess();
  }
}

const soundManager = new SoundFX();

/* ─── Design Data Model ─────────────────────────────────────────────── */
export type DesignItem = {
  n: string;
  src: string;
  label: string;
  cat: "brand" | "social" | "print" | "motion";
  subtitle: string;
  client: string;
  year: string;
  resolution: string;
  colors: string[];
  tools: string[];
};

const DESIGNS: DesignItem[] = [
  {
    n: "01",
    src: "/images/projects/design1.webp",
    label: "Neon Drop",
    cat: "brand",
    subtitle: "High-voltage kinetic streetwear brand launch campaign",
    client: "Apex Apparel",
    year: "2024",
    resolution: "1080 × 1350 px (4:5)",
    colors: ["#10B981", "#8B5CF6", "#06B6D4", "#0D0D12"],
    tools: ["Canva Pro", "Vector Custom Type", "Color Grading"],
  },
  {
    n: "02",
    src: "/images/projects/design2.webp",
    label: "Cyber Social",
    cat: "social",
    subtitle: "High-contrast editorial social post with brutalist accents",
    client: "Vapor Collective",
    year: "2024",
    resolution: "1080 × 1080 px (1:1)",
    colors: ["#F59E0B", "#10B981", "#18181B", "#FAFAFA"],
    tools: ["Canva Pro", "Grid Layout", "Halftone FX"],
  },
  {
    n: "03",
    src: "/images/projects/design3.webp",
    label: "Rave Print",
    cat: "print",
    subtitle: "Underground electronic music festival promotional poster",
    client: "Sub-Bass Club",
    year: "2024",
    resolution: "300 DPI A3 Print",
    colors: ["#EC4899", "#06B6D4", "#1E1B4B", "#FFFFFF"],
    tools: ["Canva Pro", "CMYK Separation", "Noise Shaders"],
  },
  {
    n: "04",
    src: "/images/projects/design4.webp",
    label: "Acid Brand",
    cat: "brand",
    subtitle: "Acid graphic language featuring bold typography & iconography",
    client: "Kinetix Media",
    year: "2024",
    resolution: "1920 × 1080 px",
    colors: ["#84CC16", "#10B981", "#09090B", "#F4F4F5"],
    tools: ["Canva Pro", "Custom Glyphs", "Lighting Blend"],
  },
  {
    n: "05",
    src: "/images/projects/design5.webp",
    label: "Fluid Motion",
    cat: "motion",
    subtitle: "Dynamic fluid organic gradients for digital product teaser",
    client: "Lumina Labs",
    year: "2024",
    resolution: "1080 × 1920 px (9:16)",
    colors: ["#14B8A6", "#6366F1", "#0F172A", "#F8FAFC"],
    tools: ["Canva Pro", "Motion Vector", "Mesh Gradients"],
  },
  {
    n: "06",
    src: "/images/projects/design6.webp",
    label: "Glitch Post",
    cat: "social",
    subtitle: "Digital distortion aesthetic with neon cyan & magenta overlays",
    client: "Null Sector",
    year: "2024",
    resolution: "1080 × 1350 px",
    colors: ["#3B82F6", "#F43F5E", "#111827", "#FFFFFF"],
    tools: ["Canva Pro", "Chromatic Aberration", "Grid Overlays"],
  },
  {
    n: "07",
    src: "/images/projects/design7.webp",
    label: "Y2K Print",
    cat: "print",
    subtitle: "Retro-futuristic chrome editorial layout with cyber starbursts",
    client: "Millennium Z",
    year: "2024",
    resolution: "300 DPI A4 Print",
    colors: ["#F472B6", "#94A3B8", "#030712", "#F1F5F9"],
    tools: ["Canva Pro", "Chrome FX", "Star Glyphs"],
  },
  {
    n: "08",
    src: "/images/projects/design8.webp",
    label: "Brutal ID",
    cat: "brand",
    subtitle: "Raw Swiss modernist identity with monumental sans-serif typography",
    client: "Bauhaus 99",
    year: "2024",
    resolution: "1400 × 1800 px",
    colors: ["#EF4444", "#F59E0B", "#18181B", "#FFFFFF"],
    tools: ["Canva Pro", "Swiss Grid", "Type Scaling"],
  },
  {
    n: "09",
    src: "/images/projects/design9.webp",
    label: "Kinetic",
    cat: "motion",
    subtitle: "Motion graphic keyframe design with directional velocity arrows",
    client: "HyperDrive",
    year: "2024",
    resolution: "1920 × 1080 px",
    colors: ["#F59E0B", "#6366F1", "#0C0A09", "#F8FAFC"],
    tools: ["Canva Pro", "Path Tracing", "Glow Shaders"],
  },
  {
    n: "10",
    src: "/images/projects/design10.webp",
    label: "Grid Lock",
    cat: "social",
    subtitle: "Structured modular layout with high-contrast emerald highlights",
    client: "DevFlow",
    year: "2024",
    resolution: "1080 × 1350 px",
    colors: ["#10B981", "#0284C7", "#020617", "#F8FAFC"],
    tools: ["Canva Pro", "Modular Matrix", "Color Accents"],
  },
  {
    n: "11",
    src: "/images/projects/design11.webp",
    label: "Chrome Core",
    cat: "brand",
    subtitle: "Metallic iridescent logo identity & album art visualizer",
    client: "Mercury Audio",
    year: "2024",
    resolution: "1400 × 1400 px",
    colors: ["#8B5CF6", "#A3E635", "#09090B", "#FFFFFF"],
    tools: ["Canva Pro", "Iridescence FX", "Depth Lighting"],
  },
  {
    n: "12",
    src: "/images/projects/design12.webp",
    label: "Max Print",
    cat: "print",
    subtitle: "Maximalist monochrome poster celebrating experimental typography",
    client: "TypeCon Asia",
    year: "2024",
    resolution: "300 DPI A2 Print",
    colors: ["#FFFFFF", "#A1A1AA", "#18181B", "#09090B"],
    tools: ["Canva Pro", "Halftone Dot Screen", "Custom Kerning"],
  },
  {
    n: "13",
    src: "/images/projects/design13.webp",
    label: "Vapor Social",
    cat: "social",
    subtitle: "Dreamy peach and lilac gradients with subtle atmospheric dust",
    client: "Aura Skincare",
    year: "2024",
    resolution: "1080 × 1350 px",
    colors: ["#FB923C", "#C084FC", "#181824", "#FFFFFF"],
    tools: ["Canva Pro", "Soft Duotone", "Minimal Framing"],
  },
  {
    n: "14",
    src: "/images/projects/design14.webp",
    label: "Liquid Move",
    cat: "motion",
    subtitle: "Organic fluid wave shapes creating a kinetic illusion of movement",
    client: "FlowTech",
    year: "2024",
    resolution: "1080 × 1920 px",
    colors: ["#06B6D4", "#2563EB", "#0B0F19", "#F0FDF4"],
    tools: ["Canva Pro", "Wave Distortion", "Gradient Map"],
  },
  {
    n: "15",
    src: "/images/projects/design17.webp",
    label: "Neo Brand",
    cat: "brand",
    subtitle: "Futuristic dark mode interface concept and branding showcase",
    client: "Cipher Security",
    year: "2024",
    resolution: "1920 × 1080 px",
    colors: ["#10B981", "#34D399", "#09090D", "#F9FAFB"],
    tools: ["Canva Pro", "Glow Shadows", "HUD Elements"],
  },
];

const CATS = ["all", "brand", "social", "print", "motion", "favorites"] as const;
type Cat = (typeof CATS)[number];
type ViewMode = "masonry" | "grid" | "spotlight";

/* ─── Animated Number Counter ───────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (!ref.current || counted.current) return;
    counted.current = true;
    gsap.fromTo(
      ref.current,
      { innerHTML: 0 },
      {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 95%",
          once: true,
        },
      }
    );
  }, [target]);

  return (
    <span>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

/* ─── Color Swatch Pill with One-Click Copy ─────────────────────────── */
function ColorChip({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    soundManager.pop();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Click to copy ${hex}`}
      className="group relative flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-2.5 py-1 text-[11px] font-mono transition-all hover:scale-105 hover:border-black/30 dark:hover:border-white/30"
    >
      <span
        className="h-3 w-3 rounded-full border border-black/15 dark:border-white/20 shadow-xs"
        style={{ backgroundColor: hex }}
      />
      <span className="font-semibold text-black/80 dark:text-white/80">
        {copied ? "Copied!" : hex}
      </span>
    </button>
  );
}

/* ─── Pro Studio Lightbox Modal ─────────────────────────────────────── */
function Lightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  isFavorite,
  onToggleFavorite,
}: {
  item: DesignItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* Mount entrance animation */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "expo.out", delay: 0.05 }
    );
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* Crossfade image when navigation occurs */
  useEffect(() => {
    setZoomLevel(1);
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [item]);

  const handleClose = useCallback(() => {
    soundManager.slide();
    gsap.to([backdropRef.current, contentRef.current], {
      opacity: 0,
      scale: 0.93,
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  /* Keyboard shortcut bindings */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") {
        soundManager.slide();
        onNext();
      }
      if (e.key === "ArrowLeft") {
        soundManager.slide();
        onPrev();
      }
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
      if (e.key === "z" || e.key === "Z") {
        toggleZoom();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose, onNext, onPrev]);

  const toggleZoom = () => {
    soundManager.pop();
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    soundManager.pop();
    const shareData = {
      title: `${item.label} by Ayush Singh`,
      text: item.subtitle,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* User canceled share */
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-[#F4F4F0]/95 dark:bg-[#08080C]/97 backdrop-blur-2xl"
        style={{ opacity: 0 }}
        onClick={handleClose}
      />

      {/* Top Floating Controls Bar */}
      <div className="fixed top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Badge */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121217]/90 px-4 py-2 backdrop-blur-xl shadow-lg">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black/80 dark:text-white/80">
            {item.cat} · {index + 1} of {total}
          </span>
        </div>

        {/* Right Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Zoom Button */}
          <button
            type="button"
            onClick={toggleZoom}
            title="Toggle Zoom (Z)"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121217]/90 text-sm font-bold text-black/80 dark:text-white/80 backdrop-blur-xl shadow-lg transition hover:bg-[#10B981] hover:text-white hover:scale-105"
          >
            {zoomLevel === 1 ? "🔍 1x" : zoomLevel === 1.5 ? "🔍 1.5x" : "🔍 2x"}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121217]/90 text-sm font-bold text-black/80 dark:text-white/80 backdrop-blur-xl shadow-lg transition hover:bg-[#10B981] hover:text-white hover:scale-105"
          >
            {isFullscreen ? "↙" : "⛶"}
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.like();
              onToggleFavorite();
            }}
            title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition hover:scale-110 ${
              isFavorite
                ? "border-red-500/40 bg-red-500/20 text-red-500"
                : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121217]/90 text-black/70 dark:text-white/70 hover:text-red-500"
            }`}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            title="Share artwork"
            className="flex h-10 px-3.5 items-center justify-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#121217]/90 text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 backdrop-blur-xl shadow-lg transition hover:bg-[#10B981] hover:text-white hover:scale-105"
          >
            <span>↗</span>
            <span className="hidden sm:inline">{copiedShare ? "Copied!" : "Share"}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#121217]/90 text-sm font-bold text-black dark:text-white backdrop-blur-xl shadow-lg transition hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:scale-105"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => {
          soundManager.slide();
          onPrev();
        }}
        aria-label="Previous artwork"
        className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#121217]/90 text-lg font-bold text-black dark:text-white backdrop-blur-xl shadow-xl transition hover:bg-[#10B981] hover:text-white hover:scale-110 active:scale-95"
      >
        ←
      </button>

      <button
        type="button"
        onClick={() => {
          soundManager.slide();
          onNext();
        }}
        aria-label="Next artwork"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#121217]/90 text-lg font-bold text-black dark:text-white backdrop-blur-xl shadow-xl transition hover:bg-[#10B981] hover:text-white hover:scale-110 active:scale-95"
      >
        →
      </button>

      {/* Main Content Modal Panel */}
      <div
        ref={contentRef}
        className="relative z-20 my-auto flex w-full max-w-5xl flex-col items-center pt-16 pb-8"
        style={{ opacity: 0 }}
      >
        {/* Image Card Container */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0F0F14] shadow-[0_32px_96px_rgba(0,0,0,0.35)] transition-all">
          <div
            className="flex items-center justify-center overflow-auto p-3 sm:p-6"
            style={{ maxHeight: "68vh" }}
          >
            <img
              ref={imgRef}
              src={item.src}
              alt={item.label}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                cursor: zoomLevel > 1 ? "zoom-out" : "zoom-in",
              }}
              onClick={toggleZoom}
              className="max-h-[62vh] max-w-full rounded-xl object-contain shadow-sm"
            />
          </div>

          {/* Color Palette Strip */}
          <div className="border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-6 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                Extracted Color Palette:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {item.colors.map((hex) => (
                  <ColorChip key={hex} hex={hex} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Info & Studio Specs Card */}
        <div className="mt-5 w-full rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#121217]/70 p-6 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981]">
                  Artwork #{item.n} · {item.cat}
                </span>
                <span className="text-xs text-black/40 dark:text-white/40">·</span>
                <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                  {item.year}
                </span>
              </div>
              <h2
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111] dark:text-white"
              >
                {item.label}
              </h2>
              <p className="max-w-xl text-sm text-black/70 dark:text-white/70 leading-relaxed font-light">
                {item.subtitle}
              </p>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.03] p-4 text-xs font-mono">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                  Client / Context
                </span>
                <span className="font-semibold text-black/90 dark:text-white/90">{item.client}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                  Resolution
                </span>
                <span className="font-semibold text-black/90 dark:text-white/90">
                  {item.resolution}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                  Production
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Canva Pro Studio
                </span>
              </div>
            </div>
          </div>

          {/* Tools Used Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/5 dark:border-white/5 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mr-1">
              Techniques:
            </span>
            {item.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-0.5 text-[10px] font-semibold text-black/70 dark:text-white/70"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Keyboard hints banner */}
        <div className="mt-4 hidden sm:flex items-center gap-4 text-[10px] font-mono text-black/40 dark:text-white/40">
          <span>[←] Previous</span>
          <span>[→] Next</span>
          <span>[Z] Zoom</span>
          <span>[F] Fullscreen</span>
          <span>[ESC] Close</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Card with 3D Tilt Physics ──────────────────────────────── */
function GalleryCard({
  item,
  onClick,
  isFavorite,
  onToggleFavorite,
  viewMode,
}: {
  item: DesignItem;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      const el = cardRef.current;
      const glare = glareRef.current;
      if (!el) return;
      if (!rectRef.current) {
        rectRef.current = el.getBoundingClientRect();
      }
      const rect = rectRef.current;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = (((y - centerY) / centerY) * -5).toFixed(2);
      const tiltY = (((x - centerX) / centerX) * 5).toFixed(2);

      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;

      if (glare) {
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
        glare.style.opacity = "1";
      }
    });
  };

  const handleMouseEnter = () => {
    soundManager.tick();
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
      cardRef.current.style.transition = "transform 0.12s ease-out";
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)";
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  const handleCardClick = () => {
    soundManager.slide();
    onClick();
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-text="View"
      className={`gallery-card group relative cursor-pointer ${
        viewMode === "masonry" ? "mb-6 break-inside-avoid" : ""
      }`}
      style={{
        opacity: 0,
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        willChange: "transform",
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#121217] shadow-sm transition-all duration-500 hover:border-[#10B981]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
        {/* Dynamic Specular Glare Overlay */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            soundManager.like();
            onToggleFavorite(e);
          }}
          aria-label={isFavorite ? "Unsave artwork" : "Save artwork"}
          className={`absolute top-3.5 right-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl shadow-md transition-all duration-300 hover:scale-115 active:scale-95 ${
            isFavorite
              ? "border-red-500/40 bg-red-500/20 text-red-500 opacity-100"
              : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60 text-black/60 dark:text-white/60 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        {/* Artwork Image */}
        <div
          className={`relative overflow-hidden bg-black/5 dark:bg-white/5 ${
            viewMode === "grid" ? "aspect-[4/5]" : ""
          }`}
        >
          <img
            src={item.src}
            alt={item.label}
            loading="lazy"
            decoding="async"
            className={`w-full block transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
              viewMode === "grid" ? "h-full object-cover" : "h-auto object-cover"
            }`}
          />
        </div>

        {/* Spotlight extra metadata drawer if spotlight view is active */}
        {viewMode === "spotlight" && (
          <div className="p-5 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-[#121217]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                {item.cat} · #{item.n}
              </span>
              <span className="text-xs font-mono text-black/50 dark:text-white/50">
                {item.year}
              </span>
            </div>
            <h4
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-lg font-extrabold uppercase text-[#111] dark:text-white"
            >
              {item.label}
            </h4>
            <p className="mt-1 text-xs text-black/60 dark:text-white/60 line-clamp-2">
              {item.subtitle}
            </p>
            {/* Color chips preview */}
            <div className="mt-3 flex items-center gap-1.5">
              {item.colors.map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full border border-black/10 dark:border-white/20"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
                View Details →
              </span>
            </div>
          </div>
        )}

        {/* Standard Hover Overlay for Masonry & Grid */}
        {viewMode !== "spotlight" && (
          <>
            <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-white/95 via-white/30 to-transparent dark:from-black/95 dark:via-black/40 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 hidden sm:flex pointer-events-none">
              <p className="text-[0.68rem] font-mono font-bold uppercase tracking-[0.2em] text-[#10B981] mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                {item.cat} · #{item.n}
              </p>
              <p
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-xl font-extrabold uppercase text-[#111] dark:text-white leading-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-[40ms]"
              >
                {item.label}
              </p>
              <div className="mt-2.5 flex items-center justify-between translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-[80ms]">
                <div className="flex items-center gap-1.5">
                  {item.colors.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                  <span>Explore</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>

            {/* Mobile always visible minimal label */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent sm:hidden pointer-events-none">
              <p className="text-[0.6rem] font-mono font-bold uppercase tracking-widest text-emerald-400">
                {item.cat}
              </p>
              <p
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-sm font-extrabold uppercase text-white leading-tight"
              >
                {item.label}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Studio Statistics Bar ─────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: 15, suffix: "+", label: "Hero Artworks", sub: "Hand-Crafted" },
    { value: 4, suffix: "", label: "Core Categories", sub: "Brand to Print" },
    { value: 100, suffix: "%", label: "Canva Mastery", sub: "Pixel Precision" },
    { value: 3, suffix: "+", label: "Years Exp", sub: "Visual Design" },
  ];

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stats-item relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#121217]/60 backdrop-blur-xl p-5 text-center group hover:border-[#10B981]/30 transition-all duration-400 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/0 to-[#06B6D4]/0 group-hover:from-[#10B981]/5 group-hover:to-[#06B6D4]/5 transition-all duration-500" />
            <div className="relative z-10">
              <div
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-3xl sm:text-4xl font-extrabold text-[#111] dark:text-white leading-none tracking-tight"
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white">
                {stat.label}
              </p>
              <p className="mt-0.5 text-[9px] font-medium text-black/50 dark:text-white/50">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Design Philosophy Section ─────────────────────────────────────── */
function PhilosophySection() {
  const pillars = [
    {
      num: "01",
      title: "Visual Hierarchy & Contrast",
      desc: "Every design is engineered with intentional optical anchors, guiding viewer attention in milliseconds and boosting social engagement by up to 300%.",
    },
    {
      num: "02",
      title: "Chromatics & Mood Chemistry",
      desc: "Curated harmonic color palettes calibrated for digital OLED displays and physical print gamut, ensuring brand consistency across every touchpoint.",
    },
    {
      num: "03",
      title: "High-Fidelity Production",
      desc: "Sub-pixel vector alignment, typographic kerning, and custom visual effects pushed to the extreme edge of what modern Canva Pro workflows can achieve.",
    },
  ];

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] py-16">
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-[#0E0E14]/40 p-8 sm:p-14 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#10B981]">
              The Craft & Standard
            </span>
            <h3
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="mt-2 text-3xl sm:text-4xl font-extrabold uppercase text-[#111] dark:text-white tracking-tight"
            >
              Design Philosophy
            </h3>
          </div>
          <p className="max-w-md text-sm text-black/60 dark:text-white/60 leading-relaxed font-light">
            I don’t just assemble templates; I craft bespoke visual architecture tailored for
            maximum audience retention and brand authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="group relative rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-[#10B981]/30 hover:bg-white/90 dark:hover:bg-white/[0.04]"
            >
              <span className="text-3xl font-mono font-extrabold text-[#10B981]/50 group-hover:text-[#10B981] transition-colors">
                {pillar.num}
              </span>
              <h4
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="mt-4 text-lg font-bold uppercase text-[#111] dark:text-white"
              >
                {pillar.title}
              </h4>
              <p className="mt-3 text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main CanvaGallery Page Component ──────────────────────────────── */
export default function CanvaGallery() {
  const [activeCat, setActiveCat] = useState<Cat>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("canva_favorites");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail !== undefined) {
        setSoundEnabled(custom.detail.enabled);
      }
    };
    window.addEventListener("portfolio-sound-change", handleSoundChange);
    return () => window.removeEventListener("portfolio-sound-change", handleSoundChange);
  }, []);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync favorites with localStorage
  const toggleFavorite = useCallback((designNum: string) => {
    setFavorites((prev) => {
      const next = prev.includes(designNum)
        ? prev.filter((id) => id !== designNum)
        : [...prev, designNum];
      try {
        localStorage.setItem("canva_favorites", JSON.stringify(next));
      } catch {
        /* storage full or unavailable */
      }
      return next;
    });
  }, []);

  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  /* Scroll progress & floating controls */
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = total > 0 ? current / total : 0;
      setScrollProgress(progress);
      setShowScrollTop(current > 400);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  /* Hero entrance animation */
  useEffect(() => {
    let statsTimer: number;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 60, skewY: -3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "expo.out", delay: 0.15 }
      );
      gsap.fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );

      statsTimer = window.setTimeout(() => {
        const statsItems = document.querySelectorAll<HTMLElement>(".stats-item");
        if (statsItems.length) {
          gsap.fromTo(
            statsItems,
            { opacity: 0, y: 25, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            }
          );
        }
      }, 700);
    });

    return () => {
      clearTimeout(statsTimer);
      ctx.revert();
    };
  }, []);

  /* Filtered designs logic */
  const filtered = useMemo(() => {
    return DESIGNS.filter((item) => {
      const matchesCat =
        activeCat === "all"
          ? true
          : activeCat === "favorites"
          ? favorites.includes(item.n)
          : item.cat === activeCat;

      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.client.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [activeCat, searchQuery, favorites]);

  /* Gallery stagger entrance on filter / view mode change */
  useEffect(() => {
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll<HTMLElement>(".gallery-card");
      if (!cards.length) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, clearProps: "transform" });
        return;
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: { amount: 0.35, from: "start" },
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }, 50);
    return () => clearTimeout(timer);
  }, [activeCat, searchQuery, viewMode]);

  /* Marquee animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        const marqueeTl = gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 22,
          repeat: -1,
          force3D: true,
        });

        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (Math.abs(v) > 20) {
              const boost = Math.min(Math.abs(v) / 250, 3.5);
              const dir = v < 0 ? -1 : 1;
              gsap.to(marqueeTl, {
                timeScale: (1 + boost) * dir,
                duration: 0.2,
                overwrite: "auto",
                onComplete: () => {
                  gsap.to(marqueeTl, { timeScale: 1, duration: 0.7, ease: "power1.out" });
                },
              });
            }
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const closeLb = useCallback(() => setLightboxIdx(null), []);
  const nextLb = useCallback(
    () =>
      setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prevLb = useCallback(
    () =>
      setLightboxIdx((i) =>
        i === null ? null : (i - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );

  return (
    <>
      {/* Dynamic styles & typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .canva-page { font-family: 'Space Grotesk', sans-serif; min-height: 100vh; overflow-x: hidden; }
        .masonry-layout { columns: 3; column-gap: 24px; }
        @media(max-width: 1024px) { .masonry-layout { columns: 2; } }
        @media(max-width: 640px)  { .masonry-layout { columns: 1; } }

        .noise-bg::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        @keyframes shimmerGradient {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background-size: 200% auto;
          animation: shimmerGradient 4s linear infinite;
        }
      `}</style>

      <div className="canva-page noise-bg bg-[#F4F4F0] dark:bg-[#050505] text-[#111] dark:text-[#F9FAFB] min-h-screen transition-colors duration-500">
        {/* Scroll Progress Line */}
        <div
          ref={progressRef}
          className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#8B5CF6] origin-left scale-x-0 z-[100] shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-transform duration-75"
        />

        {/* Ambient Gradient Glows */}
        <div
          className="fixed pointer-events-none z-0 top-[-15%] right-[-15%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full opacity-60 dark:opacity-30"
          style={{ background: "radial-gradient(circle,rgba(67,56,202,0.18),transparent 65%)" }}
        />
        <div
          className="fixed pointer-events-none z-0 bottom-[-15%] left-[-15%] w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] rounded-full opacity-60 dark:opacity-30"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,0.18),transparent 65%)" }}
        />

        {/* ── Fixed Floating Navbar ── */}
        <nav className="fixed top-0 w-full z-50 flex justify-center border-b border-black/5 dark:border-white/10 bg-[#F4F4F0]/80 dark:bg-[#050505]/85 backdrop-blur-2xl">
          <div className="flex w-full max-w-[1400px] items-center justify-between px-[5%] py-4">
            <Link
              to="/"
              onClick={() => soundManager.pop()}
              className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.45em] text-[#111] dark:text-white no-underline transition hover:opacity-75"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-[#10B981]"
                style={{ boxShadow: "0 0 16px rgba(16,185,129,0.6)" }}
              />
              Ayush Singh
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {[
                ["Work", "/#work"],
                ["Skills", "/#skills"],
                ["Contact", "/#contact"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  to={href}
                  onClick={() => soundManager.pop()}
                  className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50 dark:text-white/60 no-underline transition hover:text-[#10B981] dark:hover:text-[#10B981]"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {/* Sound FX Toggle Button */}
              <button
                type="button"
                data-sound-toggle="true"
                onClick={handleToggleSound}
                title={`Sound effects: ${soundEnabled ? "Enabled" : "Muted"}`}
                className={`flex h-9 px-3 items-center justify-center gap-1.5 rounded-full border text-[11px] font-mono font-bold backdrop-blur-md transition-all active:scale-95 ${
                  soundEnabled
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-[#C7ED70]"
                    : "border-black/10 dark:border-white/10 bg-transparent text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                }`}
              >
                <span>{soundEnabled ? "🔊" : "🔇"}</span>
                <span className="hidden sm:inline">{soundEnabled ? "FX On" : "FX Off"}</span>
              </button>

              <ThemeToggle />

              <Link
                to="/"
                onClick={() => soundManager.pop()}
                className="btn-neo-base btn-neo-primary inline-flex h-9 items-center justify-center px-4 rounded-full text-[10px] tracking-wider transition-all duration-300 hover:scale-105 shadow-sm"
              >
                ← Home
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero Header ── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] pt-[140px] pb-6 text-center">
          {/* Eyebrow Pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#10B981] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </span>
            <span>Award-Winning Canva Visuals</span>
          </div>

          <div className="overflow-hidden inline-block pb-2">
            <h1
              ref={heroTitleRef}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
                fontWeight: 800,
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                opacity: 0,
              }}
              className="text-[#111] dark:text-white"
            >
              Hyper{" "}
              <span
                className="shimmer-text bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #10B981, #06B6D4, #8B5CF6, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Visuals
              </span>
            </h1>
          </div>

          <p
            ref={heroSubRef}
            className="max-w-xl mx-auto mt-5 text-sm sm:text-base text-black/60 dark:text-white/65 font-normal leading-relaxed"
            style={{ opacity: 0 }}
          >
            A high-fidelity curation of bold, striking visual designs — where aesthetic typography,
            color psychology, and brand architecture unite.
          </p>
        </div>

        {/* ── Stats Bar ── */}
        <StatsBar />

        {/* ── Marquee Accent Strip ── */}
        <div
          className="relative z-10 overflow-hidden bg-gradient-to-r from-[#10B981] via-[#0EA5E9] to-[#10B981] py-3.5 shadow-md"
          style={{ transform: "rotate(-1.2deg) scale(1.03)", margin: "16px 0" }}
        >
          <div
            ref={marqueeRef}
            className="flex gap-10 whitespace-nowrap"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {[...Array(6)]
              .flatMap(() => [
                "✦ Graphic Design",
                "✦ Creative Direction",
                "✦ Social Architect",
                "✦ Brand Identity",
                "✦ Typography Mastery",
                "✦ Motion Keyframes",
              ])
              .map((t, i) => (
                <span key={i} className="shrink-0">
                  {t}
                </span>
              ))}
          </div>
        </div>

        {/* ── Gallery Controls Bar (Filters, Search, View Mode) ── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] pt-10 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-black/5 dark:border-white/10 pb-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATS.map((cat) => {
                const count =
                  cat === "all"
                    ? DESIGNS.length
                    : cat === "favorites"
                    ? favorites.length
                    : DESIGNS.filter((d) => d.cat === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      soundManager.pop();
                      setActiveCat(cat);
                    }}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                      activeCat === cat
                        ? "bg-[#10B981] text-white border-[#10B981] shadow-[0_6px_20px_rgba(16,185,129,0.35)] -translate-y-0.5"
                        : "bg-white/50 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/8 dark:border-white/10 hover:border-[#10B981] hover:text-[#10B981] dark:hover:text-[#10B981]"
                    }`}
                  >
                    {cat === "favorites" ? "Saved ❤️" : cat === "all" ? "All Works" : cat}
                    <span className="ml-1.5 opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search Input & Layout Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Live Search Input */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2 pl-9 text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-[#10B981] focus:outline-none"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-black/40 dark:text-white/40">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.tick();
                    setViewMode("masonry");
                  }}
                  title="Masonry Layout"
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    viewMode === "masonry"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Masonry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.tick();
                    setViewMode("grid");
                  }}
                  title="Grid Layout"
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    viewMode === "grid"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.tick();
                    setViewMode("spotlight");
                  }}
                  title="Spotlight Layout"
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    viewMode === "spotlight"
                      ? "bg-[#10B981] text-white shadow-xs"
                      : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Spotlight
                </button>
              </div>
            </div>
          </div>

          {/* Results count feedback */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-black/50 dark:text-white/50">
            <span>
              Showing {filtered.length} of {DESIGNS.length} artworks
            </span>
            {favorites.length > 0 && (
              <span>
                {favorites.length} saved to favorites (stored locally)
              </span>
            )}
          </div>
        </div>

        {/* ── Main Gallery Presentation ── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] pb-16">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-12 text-center backdrop-blur-xl">
              <span className="text-4xl">🔍</span>
              <h4
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="mt-3 text-xl font-bold uppercase text-black dark:text-white"
              >
                No Artworks Found
              </h4>
              <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                {activeCat === "favorites"
                  ? "You haven't bookmarked any designs yet. Click the heart icon on any card to save it!"
                  : "Try clearing your search query or switching category filters."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCat("all");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-full bg-[#10B981] px-5 py-2 text-xs font-bold uppercase text-white shadow-md hover:scale-105 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "masonry" ? (
            <div className="masonry-layout">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item.n + viewMode}
                  item={item}
                  onClick={() => setLightboxIdx(i)}
                  isFavorite={favorites.includes(item.n)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.n);
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item.n + viewMode}
                  item={item}
                  onClick={() => setLightboxIdx(i)}
                  isFavorite={favorites.includes(item.n)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.n);
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            /* Spotlight Mode */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filtered.map((item, i) => (
                <GalleryCard
                  key={item.n + viewMode}
                  item={item}
                  onClick={() => setLightboxIdx(i)}
                  isFavorite={favorites.includes(item.n)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.n);
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Design Philosophy & Architectural Standard ── */}
        <PhilosophySection />

        {/* ── Bottom Call To Action ── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-[#10B981]/10 via-transparent to-[#06B6D4]/10 dark:from-[#10B981]/5 dark:to-[#06B6D4]/5 p-10 sm:p-14 text-center backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-[#10B981]/15 blur-[90px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-[#06B6D4]/15 blur-[90px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#10B981] mb-3">
                Ready for high-impact creative?
              </span>
              <h3
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-3xl sm:text-5xl font-extrabold uppercase text-[#111] dark:text-white leading-tight tracking-tight"
              >
                Let's Build Your Visuals
              </h3>
              <p className="mt-4 max-w-lg mx-auto text-sm text-black/60 dark:text-white/60 leading-relaxed font-light">
                Whether you need social campaigns, brand identity overhauls, or commercial print
                assets, let's create something extraordinary together.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/#contact"
                  onClick={() => soundManager.pop()}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#10B981] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.45)] hover:scale-105 transition-all duration-300"
                >
                  <span>Start a Project</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => soundManager.pop()}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-black/15 dark:border-white/15 bg-white/50 dark:bg-white/5 backdrop-blur-md text-[#111] dark:text-white text-xs font-bold uppercase tracking-[0.2em] hover:border-[#10B981]/50 hover:scale-105 transition-all duration-300"
                >
                  <span>← Back to Full Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Floating Action Navigation Bar (Scroll-to-top & Quick Inquire) ── */}
        <div
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 transition-all duration-400 ${
            showScrollTop
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          {/* Scroll Progress Ring & Back to Top Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.pop();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            title="Scroll to top"
            className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#121217]/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {/* Circular SVG Progress */}
            <svg className="absolute inset-0 h-full w-full -rotate-90 p-1" viewBox="0 0 36 36">
              <path
                className="text-black/10 dark:text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#10B981]"
                strokeDasharray={`${scrollProgress * 100}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-sm font-bold text-black dark:text-white transition-transform group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>

        {/* ── Footer ── */}
        <footer className="relative z-10 border-t border-black/8 dark:border-white/10 py-12 text-center bg-[#F4F4F0] dark:bg-[#050505] transition-colors">
          <div className="max-w-[1400px] mx-auto px-[5%]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/40">
                © {new Date().getFullYear()} Ayush Singh
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                Canva Pro Gallery · {DESIGNS.length} Works
              </span>
              <Link
                to="/#contact"
                onClick={() => soundManager.pop()}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/40 hover:text-[#10B981] transition-colors"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </footer>

        {/* ── Lightbox Overlay ── */}
        {lightboxIdx !== null && (
          <Lightbox
            item={filtered[lightboxIdx]}
            index={lightboxIdx}
            total={filtered.length}
            onClose={closeLb}
            onNext={nextLb}
            onPrev={prevLb}
            isFavorite={favorites.includes(filtered[lightboxIdx].n)}
            onToggleFavorite={() => toggleFavorite(filtered[lightboxIdx].n)}
          />
        )}
      </div>
    </>
  );
}
