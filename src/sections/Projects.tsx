import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Container } from "../components/Container";
import { playTab, playClick } from "../utils/soundEffects";

/* ========================================================================== */
/*  Styles (kept in this file so there is no separate CSS import to resolve)  */
/*  All motion below is transform / opacity only → runs on the compositor.    */
/* ========================================================================== */

const STYLES = `
.prj-item {
  opacity: 0;
  transform: translate3d(0, 40px, 0) scale(0.985);
  transition:
    opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(min(var(--i, 0), 3) * 80ms);
  will-change: opacity, transform;
}
.prj-item[data-in="true"] {
  opacity: 1;
  transform: none;
  will-change: auto;
}

/* Image parallax: scroll-driven CSS animation (no JS, no per-frame work on the main thread).
   Browsers without support simply show the image slightly zoomed and still. */
.prj-img { transform: scale(1.08); }
@supports (animation-timeline: view()) {
  .prj-img {
    animation: prj-parallax linear both;
    animation-timeline: view();
    animation-range: cover 0% cover 100%;
  }
}
@keyframes prj-parallax {
  from { transform: translate3d(0, -7%, 0) scale(1.16); }
  to   { transform: translate3d(0, 7%, 0)  scale(1.16); }
}

.prj-frame { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }

@keyframes prj-list-in { from { opacity: 0; } to { opacity: 1; } }
.prj-list { animation: prj-list-in 0.35s ease-out; }

@media (prefers-reduced-motion: reduce) {
  .prj-item { opacity: 1; transform: none; transition: none; will-change: auto; }
  .prj-img  { animation: none !important; transform: none; }
  .prj-list { animation: none; }
  .prj-frame { transition: none; }
}
`;

/* ========================================================================== */
/*  Design System Configuration (Aligned with DESIGN.md)                      */
/* ========================================================================== */

type FilterCategory = "all" | "web" | "data" | "design";
type Category = Exclude<FilterCategory, "all">;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All Projects" },
  { key: "web", label: "Web Systems" },
  { key: "data", label: "Data & ML" },
  { key: "design", label: "Visual Direction" },
];

const CATEGORY_META: Record<
  Category,
  {
    label: string;
    badge: string;
    accentColor: string;
    badgeClass: string;
    dotColor: string;
  }
> = {
  web: {
    label: "Web Architecture",
    badge: "Web System",
    accentColor: "#1E90FF",
    badgeClass: "text-[#1E90FF] bg-[#1E90FF]/10 border-[#1E90FF]/30",
    dotColor: "bg-[#1E90FF]",
  },
  data: {
    label: "Data Intelligence",
    badge: "Data & ML",
    accentColor: "#B39CFF",
    badgeClass: "text-[#B39CFF] bg-[#B39CFF]/10 border-[#B39CFF]/30",
    dotColor: "bg-[#B39CFF]",
  },
  design: {
    label: "Visual Direction",
    badge: "Brand Identity",
    accentColor: "#B39CFF",
    badgeClass: "text-[#B39CFF] bg-[#B39CFF]/10 border-[#B39CFF]/30",
    dotColor: "bg-[#B39CFF]",
  },
};

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const isDesignProject = (p: Project) =>
  p.category === "design" ||
  Boolean(p.galleryLink) ||
  p.stack.includes("Canva") ||
  p.stack.includes("Brand Systems");

const isDataProject = (p: Project) =>
  p.category === "data" ||
  p.stack.includes("Power BI") ||
  p.stack.includes("Python") ||
  p.stack.includes("Data Science");

const isWebProject = (p: Project) =>
  p.category === "web" || (!isDesignProject(p) && !isDataProject(p));

const getCategory = (p: Project): Category =>
  isDesignProject(p) ? "design" : isDataProject(p) ? "data" : "web";

const matches = (p: Project, key: FilterCategory) =>
  key === "web"
    ? isWebProject(p)
    : key === "data"
      ? isDataProject(p)
      : key === "design"
        ? isDesignProject(p)
        : true;

const pad = (n: number) => String(n).padStart(2, "0");

const getDomainUrl = (p: Project) => {
  if (p.link) {
    try {
      const url = new URL(p.link);
      return url.hostname.replace(/^www\./, "");
    } catch {
      return p.link;
    }
  }
  if (p.galleryLink) return "canva.com/gallery";
  if (p.github) return "github.com/repository";
  return "system.internal";
};

/* ------------------------------ Metric parsing ---------------------------- */
function parseMetric(value: string) {
  const m = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const target = parseFloat(m[2].replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  return {
    prefix: m[1],
    suffix: m[3],
    target,
    decimals: (m[2].split(".")[1] || "").length,
    hasComma: m[2].includes(","),
  };
}

type Parsed = NonNullable<ReturnType<typeof parseMetric>>;
const fmt = (p: Parsed, v: number) =>
  p.hasComma
    ? v.toLocaleString("en-US", {
        minimumFractionDigits: p.decimals,
        maximumFractionDigits: p.decimals,
      })
    : v.toFixed(p.decimals);

/** Counts the leading number up once it scrolls into view. */
function CountUp({
  value,
  disabled,
  rootRef,
}: {
  value: string;
  disabled?: boolean;
  rootRef?: RefObject<Element | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { root: rootRef, once: true, amount: 0.5 });
  const parsed = useMemo(() => parseMetric(value), [value]);

  useEffect(() => {
    if (disabled || !inView || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current)
          ref.current.textContent = `${parsed.prefix}${fmt(parsed, v)}${parsed.suffix}`;
      },
      onComplete: () => {
        if (ref.current) ref.current.textContent = value;
      },
    });
    return () => controls.stop();
  }, [inView, disabled, parsed, value]);

  const initial = !disabled && parsed ? `${parsed.prefix}${fmt(parsed, 0)}${parsed.suffix}` : value;
  return <span ref={ref}>{initial}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Project Card                                                              */
/*  - one-time IntersectionObserver reveal (no scroll listeners per card)     */
/*  - image parallax handled by CSS scroll-driven animation                   */
/*  - spotlight + tilt move via transform only, throttled with rAF            */
/* -------------------------------------------------------------------------- */
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  total,
  reduced,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  reduced: boolean;
  onOpen: (index: number) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const ptr = useRef({ x: 0, y: 0 });

  // Reveal once when entering the viewport
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const apply = useCallback(() => {
    raf.current = 0;
    const art = articleRef.current;
    const frame = frameRef.current;
    const spot = spotRef.current;
    if (!art || !frame || !spot) return;
    const r = art.getBoundingClientRect();
    const x = ptr.current.x - r.left;
    const y = ptr.current.y - r.top;
    spot.style.transform = `translate3d(${x - 280}px, ${y - 280}px, 0)`;
    const nx = x / r.width - 0.5;
    const ny = y / r.height - 0.5;
    frame.style.transform = `perspective(1400px) rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 5).toFixed(2)}deg)`;
  }, []);

  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    ptr.current.x = e.clientX;
    ptr.current.y = e.clientY;
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  };

  const handlePointerLeave = () => {
    if (frameRef.current) {
      frameRef.current.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    }
  };

  const meta = CATEGORY_META[getCategory(project)];
  const domainUrl = getDomainUrl(project);
  const isEven = index % 2 === 1;
  const open = () => onOpen(index);

  return (
    <div
      ref={itemRef}
      className="prj-item relative mb-10 sm:mb-14 lg:mb-16 last:mb-0"
      style={{ "--i": index } as CSSProperties}
    >
      <article
        ref={articleRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="group relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7 md:p-8 lg:p-9 xl:p-10 transition-[border-color] duration-300 hover:border-[#B39CFF]/40 shadow-xl dark:bg-[#141416]"
      >
        {/* Cursor spotlight: fixed-size gradient moved with transform (no repaint) */}
        <div
          ref={spotRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -z-10 h-[560px] w-[560px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle, rgba(179,156,255,0.12), transparent 68%)",
            willChange: "transform",
          }}
        />

        {/* Oversized editorial index number */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-6 -z-10 select-none font-serif text-[7rem] font-normal italic leading-none text-[var(--ink)]/[0.045] sm:text-[9rem] lg:text-[11rem]"
        >
          {pad(index + 1)}
        </span>

        {/* Accent hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B39CFF]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Text Column */}
          <div
            className={cn(
              "flex flex-col justify-between space-y-4 sm:space-y-5 lg:col-span-6",
              isEven ? "lg:order-2" : "lg:order-1",
            )}
          >
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#B39CFF]">
                  {pad(index + 1)} / {pad(total)}
                </span>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider",
                    meta.badgeClass,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor)} />
                  {meta.label}
                </span>

                {index === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#B39CFF]/40 bg-[#B39CFF]/10 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#B39CFF]">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                )}

                <span className="font-mono text-xs text-[var(--muted)]">
                  {project.year} • {project.role}
                </span>
              </div>

              <h3
                onClick={open}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
                className="group/title inline-flex cursor-pointer items-center gap-2 font-sans text-2xl font-bold tracking-tight text-[var(--ink)] transition-colors duration-200 hover:text-[#B39CFF] sm:text-3xl lg:text-4xl"
              >
                <span>{project.title}</span>
                <ArrowUpRight className="h-6 w-6 text-[var(--muted)] transition-transform duration-300 group-hover/title:-translate-y-1 group-hover/title:translate-x-1 group-hover/title:text-[#B39CFF]" />
              </h3>

              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                {project.description}
              </p>

              {project.metrics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3.5 py-1.5 font-mono text-xs text-[var(--ink)]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#B39CFF]" />
                      <span className="font-bold text-[#B39CFF]">
                        <CountUp value={m.value} disabled={reduced} />
                      </span>
                      <span className="text-[var(--muted)]">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 font-mono text-xs text-[var(--muted)] transition-colors duration-200 hover:border-[#1E90FF]/40 hover:text-[var(--ink)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-4">
              {project.galleryLink ? (
                <Link
                  to={project.galleryLink}
                  onClick={() => playClick()}
                  className="btn-neo-base btn-neo-primary inline-flex h-11 items-center gap-2 px-5 text-xs font-bold"
                >
                  <span>Exhibition Showcase</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="btn-neo-base btn-neo-primary inline-flex h-11 items-center gap-2 px-5 text-xs font-bold"
                >
                  <span>Launch Live Demo</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="btn-neo-base btn-neo-secondary inline-flex h-11 items-center gap-2 px-4 text-xs font-semibold"
                >
                  <GithubIcon className="h-4 w-4 text-[var(--muted)]" />
                  <span>Source Code</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  open();
                }}
                className="btn-neo-base btn-neo-secondary inline-flex h-11 items-center gap-2 px-4 text-xs font-semibold"
              >
                <span>Case Study</span>
                <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
              </button>
            </div>
          </div>

          {/* Image Column */}
          <div className={cn("relative lg:col-span-6", isEven ? "lg:order-1" : "lg:order-2")}>
            {/* soft category glow behind the frame (static gradient, no blur filter) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10"
              style={{
                background: `radial-gradient(55% 55% at 50% 50%, ${meta.accentColor}2e, transparent 72%)`,
              }}
            />

            <div
              ref={frameRef}
              className="prj-frame overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] shadow-lg group-hover:will-change-transform"
            >
              <div className="flex h-10 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>

                <div className="flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-0.5 font-mono text-[11px] text-[var(--muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E90FF]" />
                  <span>{domainUrl}</span>
                </div>

                <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] sm:inline">
                  Verified Production
                </span>
              </div>

              <div
                onClick={() => {
                  playClick();
                  open();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
                className="group/image relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-neutral-950 outline-none"
              >
                {/* hover zoom lives on its own wrapper so it never fights the parallax transform */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover/image:scale-[1.05]">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={1200}
                    height={750}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    draggable={false}
                    className="prj-img h-full w-full object-cover object-top"
                  />
                </div>

                {project.metrics.length > 0 && (
                  <div className="absolute right-4 top-4 z-10 hidden items-center gap-2 rounded-full border border-white/15 bg-black/80 px-3.5 py-1.5 font-mono text-xs text-[#F4F4F6] shadow-lg sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B39CFF]" />
                    <span>
                      {project.metrics[0].value} {project.metrics[0].label}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />

                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 font-mono text-xs font-semibold text-white transition-all duration-300 group-hover/image:translate-y-0 group-hover/image:opacity-100 sm:translate-y-2 sm:opacity-0">
                  <span>View Case Study</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#B39CFF]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Case Study Modal Overlay                                                  */
/* -------------------------------------------------------------------------- */
function CaseStudy({
  project,
  index,
  total,
  nextTitle,
  nextImage,
  reduced,
  onClose,
  onGo,
}: {
  project: Project;
  index: number;
  total: number;
  nextTitle: string;
  nextImage: string;
  reduced: boolean;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const meta = CATEGORY_META[getCategory(project)];
  const domainUrl = getDomainUrl(project);

  const latest = useRef({ index, onClose, onGo });
  latest.current = { index, onClose, onGo };

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sb > 0) document.body.style.paddingRight = `${sb}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      const { index: i, onClose: close, onGo: go } = latest.current;
      if (e.key === "Escape") return close();
      if (e.key === "ArrowRight") return go(i + 1);
      if (e.key === "ArrowLeft") return go(i - 1);
      if (e.key === "Tab" && rootRef.current) {
        const f = rootRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      prevFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [project.title]);

  // Warm the next project's image so "Next" feels instant
  useEffect(() => {
    if (!nextImage) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextImage;
  }, [nextImage]);

  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollY, [0, 600], ["0%", "10%"]);
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="fixed inset-0 z-[100] bg-[var(--page)] text-[var(--ink)]"
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-[#B39CFF]"
      />

      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        {/* Sticky bar: solid background (no backdrop blur over scrolling content) */}
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--page)]/95">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="group flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted)] transition-colors duration-200 hover:text-[var(--ink)] focus-visible:outline-none"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                <span>Back to Projects</span>
              </button>

              <div className="hidden items-center gap-2 font-mono text-xs tabular-nums tracking-widest text-[var(--muted)] sm:flex">
                <span className="font-bold text-[var(--ink)]">{pad(index + 1)}</span>
                <span className="text-[var(--line)]">/</span>
                <span>{pad(total)}</span>
              </div>

              <div className="flex items-center gap-2">
                {total > 1 && (
                  <div className="mr-1 flex items-center gap-1.5 border-r border-[var(--line)] pr-3">
                    <button
                      type="button"
                      onClick={() => onGo(index - 1)}
                      aria-label="Previous project"
                      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-[color,border-color,transform] duration-200 hover:border-[var(--ink)] hover:text-[var(--ink)] active:scale-90"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onGo(index + 1)}
                      aria-label="Next project"
                      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-[color,border-color,transform] duration-200 hover:border-[var(--ink)] hover:text-[var(--ink)] active:scale-90"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neo-base btn-neo-primary inline-flex h-9 items-center gap-2 px-4 text-xs font-bold"
                  >
                    <span>Launch Live</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : project.galleryLink ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(project.galleryLink!);
                    }}
                    className="btn-neo-base btn-neo-primary inline-flex h-9 items-center gap-2 px-4 text-xs font-bold"
                  >
                    <span>Exhibition</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div key={project.title} className="py-10 sm:py-14">
            <div className="pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold",
                    meta.badgeClass,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor)} />
                  {meta.label}
                </span>
                <span className="text-[var(--line)]">•</span>
                <span>{project.year}</span>
                <span className="text-[var(--line)]">•</span>
                <span>{domainUrl}</span>
              </div>

              <h1 className="font-sans text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
              <div className="flex h-11 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-mono text-xs text-[var(--muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E90FF]" />
                  <span>https://{domainUrl}</span>
                </div>
                <div className="hidden font-mono text-xs text-[var(--muted)] sm:block">
                  Verified Case Study
                </div>
              </div>

              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950 sm:aspect-[21/9]">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  width={1600}
                  height={900}
                  decoding="async"
                  style={{ y: reduced ? 0 : heroY, scale: reduced ? 1 : 1.15, willChange: "transform" }}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
              <aside className="lg:col-span-4">
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 lg:sticky lg:top-24">
                  <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Project Overview
                  </h3>

                  <dl className="divide-y divide-[var(--line)] border-y border-[var(--line)] font-mono text-xs">
                    {[
                      ["Role", project.role],
                      ["Timeline", project.year],
                      ["Domain", meta.badge],
                      ["Status", "Production"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                        <dt className="uppercase tracking-wider text-[var(--muted)]">{k}</dt>
                        <dd className="text-right font-semibold text-[var(--ink)]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6">
                    <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--ink)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2.5">
                    {project.galleryLink ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(project.galleryLink!);
                        }}
                        className="btn-neo-base btn-neo-primary flex h-11 w-full items-center justify-between px-5 text-xs font-bold"
                      >
                        <span>Open Canva Showcase</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    ) : project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neo-base btn-neo-primary flex h-11 w-full items-center justify-between px-5 text-xs font-bold"
                      >
                        <span>Launch Live Demo</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neo-base btn-neo-secondary flex h-11 w-full items-center justify-between px-5 text-xs font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          <GithubIcon className="h-4 w-4" />
                          <span>View Source Code</span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                      </a>
                    )}
                  </div>
                </div>
              </aside>

              <div className="space-y-12 lg:col-span-8">
                <div>
                  <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-[#B39CFF]">
                    Mission & Impact
                  </h2>
                  <p className="text-xl font-medium leading-relaxed tracking-tight text-[var(--ink)] sm:text-2xl">
                    {project.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
                  <h3 className="mb-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    <TrendingUp className="h-4 w-4 text-[#B39CFF]" />
                    <span>Key Performance Indicators</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="border-l-2 border-[#B39CFF] pl-4">
                        <div className="font-sans text-4xl font-bold tabular-nums tracking-tight text-[var(--ink)] sm:text-5xl">
                          <CountUp value={m.value} disabled={reduced} rootRef={scrollRef} />
                        </div>
                        <div className="mt-1.5 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Engineering Architecture
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                    {project.impact}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Core Deliverables
                  </h3>
                  <div className="space-y-3">
                    {project.features.map((f, i) => (
                      <div
                        key={f}
                        className="flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-[border-color] duration-200 hover:border-[#B39CFF]/40"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface-strong)] font-mono text-xs font-bold text-[#B39CFF]">
                          {pad(i + 1)}
                        </span>
                        <p className="text-sm font-medium leading-relaxed text-[var(--ink)] sm:text-base">
                          {f}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {total > 1 && (
          <div className="border-t border-[var(--line)] bg-[var(--surface)] py-12 sm:py-16">
            <Container>
              <button
                type="button"
                onClick={() => onGo(index + 1)}
                className="group flex w-full flex-col items-start justify-between gap-4 text-left sm:flex-row sm:items-center"
              >
                <div>
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                    <span>Next Project</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#B39CFF] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block font-sans text-3xl font-bold tracking-tight text-[var(--ink)] transition-colors duration-200 group-hover:text-[#B39CFF] sm:text-4xl md:text-5xl">
                    {nextTitle}
                  </span>
                </div>
                <div className="btn-neo-base btn-neo-secondary inline-flex h-11 items-center gap-3 px-6 text-xs font-bold">
                  <span>Explore Case Study</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </Container>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Projects Section Component                                           */
/* -------------------------------------------------------------------------- */
export function Projects() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [filter, setFilter] = useState<FilterCategory>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = useMemo(() => projects.filter((p) => matches(p, filter)), [filter]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map(({ key }) => [key, projects.filter((p) => matches(p, key)).length]),
      ) as Record<FilterCategory, number>,
    [],
  );

  // Section-wide scroll progress (tiny bar, transform only)
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start 20%", "end 80%"],
  });
  const progressSpring = useSpring(sectionScroll, { stiffness: 220, damping: 28 });

  // Stable handlers so memoised cards don't re-render
  const openCase = useCallback((idx: number) => {
    playClick();
    setOpenIndex(idx);
  }, []);

  const goTo = (i: number) => {
    const n = list.length;
    const target = ((i % n) + n) % n;
    playTab();
    setOpenIndex(target);
  };

  const closeCase = () => {
    playTab();
    setOpenIndex(null);
  };

  const changeFilter = (key: FilterCategory) => {
    if (key === filter) return;
    playTab();
    startTransition(() => {
      setFilter(key);
    });
  };

  const openProject = openIndex !== null ? list[openIndex] : undefined;
  const nextProject = openIndex !== null ? list[(openIndex + 1) % list.length] : undefined;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-16 bg-[var(--page)] pt-12 pb-16 transition-colors duration-500 sm:scroll-mt-20 sm:pt-16 sm:pb-20 lg:scroll-mt-24 lg:pt-16 lg:pb-24 xl:pt-20 xl:pb-28"
    >
      <style>{STYLES}</style>

      <Container>
        {/* Section Architectural Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-end sm:pb-5">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B39CFF] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
              </span>
              <span className="font-bold text-[var(--ink)]">[02 // SELECTED WORK & SYSTEMS]</span>
            </div>

            <h2 className="font-sans text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl md:text-5xl">
              Featured{" "}
              <span className="font-serif font-normal italic tracking-normal text-[#7654D6] dark:text-[#B39CFF]">
                Projects
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:items-end sm:text-right">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#B39CFF]">
              [INDEX ARCHIVE // 04 PRODUCTION CASE STUDIES]
            </span>
            <p className="max-w-md text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              Scalable web architectures, predictive business intelligence pipelines, and bespoke brand design systems built with precision.
            </p>
          </div>
        </div>

        {/* Filter bar: sticky, solid background (no blur → no per-frame repaint) */}
        <div className="sticky top-[60px] z-20 mt-4 flex flex-col justify-between gap-3 border-b border-[var(--line)] bg-[var(--page)]/95 pb-3 pt-2 sm:top-[64px] sm:mt-5 sm:flex-row sm:items-center">
          <div
            role="group"
            aria-label="Filter project categories"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8"
          >
            {FILTERS.map(({ key, label }) => {
              const on = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => changeFilter(key)}
                  className={cn(
                    "relative pb-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200",
                    on ? "font-bold text-[var(--ink)]" : "text-[var(--muted)] hover:text-[#B39CFF]",
                  )}
                >
                  <span>{label}</span>
                  <span className="ml-1.5 font-mono text-xs font-bold tabular-nums text-[#B39CFF]">
                    [{pad(counts[key])}]
                  </span>

                  {on && (
                    <motion.span
                      layoutId="activeFilterPill"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-2 h-[2px] bg-[#B39CFF]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 font-mono text-xs text-[var(--muted)] sm:flex">
            <span className="text-[11px] uppercase tracking-wider">Scroll Track</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface-strong)]">
              <motion.div
                style={{ scaleX: progressSpring }}
                className="h-full w-full origin-left bg-[#B39CFF]"
              />
            </div>
          </div>
        </div>

        {/* Project Cards */}
        {list.length === 0 ? (
          <div className="my-10 rounded-2xl border border-dashed border-[var(--line)] p-8 py-20 text-center sm:my-16 sm:py-24">
            <Layers className="mx-auto mb-3 h-8 w-8 text-[var(--muted)] opacity-60" />
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
              No projects found in this domain
            </p>
            <button
              type="button"
              onClick={() => changeFilter("all")}
              className="btn-neo-base btn-neo-secondary mt-5 inline-flex h-10 items-center justify-center px-6 text-xs font-bold"
            >
              Reset to All Projects
            </button>
          </div>
        ) : (
          /* keyed by filter: a clean remount + short fade instead of heavy layout animations */
          <div key={filter} className="prj-list mt-8 sm:mt-12">
            {list.map((project, idx) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={idx}
                total={list.length}
                reduced={reduced}
                onOpen={openCase}
              />
            ))}
          </div>
        )}

        {/* Section Bottom Footer */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 font-mono text-xs text-[var(--muted)] sm:mt-24">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B39CFF]" />
            <span>Ayush Singh — Portfolio Edition 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/canva-gallery"
              onClick={() => playClick()}
              className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors duration-200 hover:text-[#B39CFF] hover:underline"
            >
              <span>Canva Exhibition Gallery</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#B39CFF]" />
            </Link>
            <span className="text-[var(--line)]">|</span>
            <Link
              to="/resume"
              onClick={() => playClick()}
              className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors duration-200 hover:text-[#B39CFF] hover:underline"
            >
              <span>Verified Résumé</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#B39CFF]" />
            </Link>
          </div>
        </div>
      </Container>

      {/* Case Study Fullscreen Modal */}
      <AnimatePresence>
        {openProject && openIndex !== null && nextProject && typeof document !== "undefined" && (
          <CaseStudy
            project={openProject}
            index={openIndex}
            total={list.length}
            nextTitle={nextProject.title}
            nextImage={nextProject.image}
            reduced={reduced}
            onClose={closeCase}
            onGo={goTo}
          />
        )}
      </AnimatePresence>
    </section>
  );
}