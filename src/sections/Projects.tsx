import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type RefObject,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ArrowLeft, Layers } from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Container } from "../components/Container";
import { playTab, playClick } from "../utils/soundEffects";

/* ========================================================================== */
/*  Concept                                                                   */
/*  — Typographic index: oversized rows, rolling-letter hover, siblings dim   */
/*  — Cursor-bound preview with velocity-driven tilt (springs, no layout)     */
/*  — View Transitions API: the preview image MORPHS into the case-study hero */
/*  — CSS scroll-driven animations (animation-timeline: view()) for reveals   */
/*  — @property conic ring, parallax hero via useScroll({ container })        */
/* ========================================================================== */

type FilterCategory = "all" | "web" | "data" | "design";
type Category = Exclude<FilterCategory, "all">;
type VTDoc = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => unknown;
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VT_NAME = "project-hero";

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Systems" },
  { key: "data", label: "Data & ML" },
  { key: "design", label: "Visual Direction" },
];

const CATEGORY_META: Record<Category, { label: string; badge: string }> = {
  web: { label: "Web Architecture", badge: "Web System" },
  data: { label: "Data Intelligence", badge: "Data & ML" },
  design: { label: "Visual Direction", badge: "Brand Identity" },
};

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

/* ------------------------------ Global CSS -------------------------------- */
const CSS = `
@property --pj-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
@keyframes pj-spin { to { --pj-angle: 360deg; } }
@keyframes pj-rise {
  from { opacity: 0; transform: translateY(56px); }
  to   { opacity: 1; transform: none; }
}
.pj-ring {
  background: conic-gradient(from var(--pj-angle), transparent 0 50%, var(--coral) 82%, transparent 100%);
  animation: pj-spin 3.2s linear infinite;
}
@supports (animation-timeline: view()) {
  .pj-reveal {
    animation: pj-rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
}
::view-transition-group(root) { animation-duration: .5s; }
::view-transition-group(${VT_NAME}) {
  animation-duration: .85s;
  animation-timing-function: cubic-bezier(.16, 1, .3, 1);
  border-radius: 1rem;
  overflow: clip;
}
::view-transition-image-pair(${VT_NAME}) { isolation: auto; }
::view-transition-old(${VT_NAME}),
::view-transition-new(${VT_NAME}) {
  mix-blend-mode: normal;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
@media (prefers-reduced-motion: reduce) {
  .pj-reveal, .pj-ring { animation: none !important; }
}
`;

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
  const inView = useInView(ref, { root: rootRef, once: true, amount: 0.6 });
  const parsed = useMemo(() => parseMetric(value), [value]);

  useEffect(() => {
    if (disabled || !inView || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration: 1.6,
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

/* ------------------------------ Text primitives --------------------------- */
/** Letters roll up and are replaced by a coral copy (pure CSS transforms). */
function RollText({ text, hot, reduced }: { text: string; hot: boolean; reduced: boolean }) {
  const words = text.split(" ");
  let n = 0;
  const on = hot && !reduced;
  const t = "transition-transform duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)]";

  return (
    <span className="block" aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden="true"
          className="inline-block overflow-hidden whitespace-nowrap align-top pb-[0.12em] -mb-[0.12em]"
        >
          {Array.from(word).map((ch, ci) => {
            const delay = `${n++ * 14}ms`;
            return (
              <span key={ci} className="relative inline-block">
                <span
                  className={cn("block", t)}
                  style={{ transform: on ? "translateY(-110%)" : "none", transitionDelay: delay }}
                >
                  {ch}
                </span>
                <span
                  className={cn("absolute left-0 top-[110%] block text-[var(--coral)]", t)}
                  style={{ transform: on ? "translateY(-110%)" : "none", transitionDelay: delay }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
          {wi < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </span>
  );
}

/** Words slide up from behind a mask. */
function MaskWords({
  text,
  delay = 0,
  inView = false,
  reduced,
}: {
  text: string;
  delay?: number;
  inView?: boolean;
  reduced: boolean;
}) {
  const words = text.split(" ");
  return (
    <span aria-label={text} className="block">
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "118%", rotate: 3 }}
            {...(inView
              ? { whileInView: { y: 0, rotate: 0 }, viewport: { once: true, amount: 0.6 } }
              : { animate: { y: 0, rotate: 0 } })}
            transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.07 }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Case study — full-screen, hero image is the View-Transition target         */
/* -------------------------------------------------------------------------- */
function CaseStudy({
  project,
  index,
  total,
  nextTitle,
  supportsVT,
  reduced,
  onClose,
  onGo,
}: {
  project: Project;
  index: number;
  total: number;
  nextTitle: string;
  supportsVT: boolean;
  reduced: boolean;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [nextHot, setNextHot] = useState(false);

  const meta = CATEGORY_META[getCategory(project)];

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
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project.title]);

  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollY, [0, 700], ["0%", "12%"]);
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  const rise = (delay = 0) => ({
    initial: reduced ? false : ({ opacity: 0, y: 28 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[100] bg-[var(--page)] text-[var(--ink)]"
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 z-30 h-[2px] origin-left bg-[var(--coral)]"
      />

      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--page)]/80 backdrop-blur-xl">
          <Container>
            <div className="flex h-16 items-center justify-between">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Index
              </button>

              <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-[var(--muted)]">
                <span className="text-[var(--ink)]">{pad(index + 1)}</span> / {pad(total)}
              </span>

              <div className="flex items-center gap-1.5">
                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => onGo(index - 1)}
                      aria-label="Previous project"
                      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] transition-all duration-300 hover:border-[var(--ink)] active:scale-90"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onGo(index + 1)}
                      aria-label="Next project"
                      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] transition-all duration-300 hover:border-[var(--ink)] active:scale-90"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div key={project.title}>
            {/* Title block */}
            <div className="pb-10 pt-10 sm:pt-16">
              <motion.p
                {...rise(0.2)}
                className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                {meta.label}
                <span className="h-px w-8 bg-[var(--line)]" />
                {project.year}
              </motion.p>

              <h2
                className="font-sans font-bold leading-[0.95] tracking-[-0.045em]"
                style={{ fontSize: "clamp(2.75rem, 9vw, 8.5rem)" }}
              >
                <MaskWords text={project.title} delay={supportsVT ? 0.35 : 0.1} reduced={reduced} />
              </h2>
            </div>

            {/* Hero — named for the View Transition */}
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-950 sm:aspect-[21/9]"
              style={supportsVT ? ({ viewTransitionName: VT_NAME } as React.CSSProperties) : undefined}
            >
              <motion.img
                src={project.image}
                alt={project.title}
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                style={{ y: reduced ? 0 : heroY, scale: reduced ? 1 : 1.3 }}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Editorial grid */}
            <div className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
              {/* Sticky meta */}
              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <dl className="divide-y divide-[var(--line)] border-y border-[var(--line)] font-mono text-xs">
                    {[
                      ["Role", project.role],
                      ["Timeline", project.year],
                      ["Domain", meta.badge],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                        <dt className="uppercase tracking-[0.2em] text-[var(--muted)]">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.galleryLink ? (
                      <button
                        type="button"
                        onClick={() => navigate(project.galleryLink!)}
                        className="btn-neo-base btn-neo-primary group inline-flex h-11 items-center justify-between gap-4 pl-6 pr-2 text-xs"
                      >
                        <span>Open Canva Showcase</span>
                        <span className="btn-icon-pod h-7 w-7 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[var(--coral)]">
                          <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                        </span>
                      </button>
                    ) : project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neo-base btn-neo-primary group inline-flex h-11 items-center justify-between gap-4 pl-6 pr-2 text-xs"
                      >
                        <span>Launch Live Demo</span>
                        <span className="btn-icon-pod h-7 w-7 bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[var(--coral)]">
                          <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5" />
                        </span>
                      </a>
                    ) : null}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neo-base btn-neo-secondary group inline-flex h-11 items-center justify-between gap-3 pl-5 pr-2 text-xs"
                      >
                        <span>Source Code</span>
                        <span className="btn-icon-pod h-7 w-7 border border-[var(--line)] bg-[var(--page)]/60 text-[var(--ink)]">
                          <ArrowUpRight className="btn-icon-pod-arrow h-3.5 w-3.5 text-[var(--coral)]" />
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </aside>

              {/* Narrative */}
              <div className="space-y-16 lg:col-span-8">
                <motion.p
                  {...rise(supportsVT ? 0.55 : 0.3)}
                  className="text-xl font-medium leading-snug tracking-tight text-[var(--ink)] sm:text-2xl lg:text-[1.9rem]"
                >
                  {project.description}
                </motion.p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-y border-[var(--line)] py-10">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <div
                        className="font-sans font-bold leading-none tracking-[-0.05em] tabular-nums text-[var(--coral)]"
                        style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}
                      >
                        <CountUp value={m.value} disabled={reduced} rootRef={scrollRef} />
                      </div>
                      <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Impact */}
                <div>
                  <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[var(--coral)]">
                    Impact &amp; Architecture
                  </h3>
                  <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
                    {project.impact}
                  </p>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Core Deliverables
                  </h3>
                  <ol>
                    {project.features.map((f, i) => (
                      <motion.li
                        key={f}
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ root: scrollRef, once: true, amount: 0.7 }}
                        transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.05 }}
                        className="relative flex items-baseline gap-5 py-5"
                      >
                        <motion.span
                          aria-hidden="true"
                          initial={reduced ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ root: scrollRef, once: true, amount: 0.7 }}
                          transition={{ duration: 1, ease: EASE }}
                          className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--line)]"
                        />
                        <span className="font-mono text-xs tabular-nums text-[var(--coral)]">
                          {pad(i + 1)}
                        </span>
                        <span className="text-base text-[var(--ink)]/90 sm:text-lg">{f}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Next project */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => onGo(index + 1)}
            onPointerEnter={() => setNextHot(true)}
            onPointerLeave={() => setNextHot(false)}
            onFocus={() => setNextHot(true)}
            onBlur={() => setNextHot(false)}
            className="group block w-full border-t border-[var(--line)] py-16 text-left outline-none sm:py-24"
          >
            <Container>
              <span className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Next project
                <ArrowUpRight className="h-4 w-4 text-[var(--coral)] transition-transform duration-500 group-hover:rotate-45" />
              </span>
              <span
                role="heading"
                aria-level={2}
                className="block font-sans font-bold leading-[1.02] tracking-[-0.045em]"
                style={{ fontSize: "clamp(2.5rem, 8vw, 7.5rem)" }}
              >
                <RollText text={nextTitle} hot={nextHot} reduced={reduced} />
              </span>
            </Container>
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export function Projects() {
  const reduced = usePrefersReducedMotion();
  const previewImgRef = useRef<HTMLImageElement>(null);

  const [filter, setFilter] = useState<FilterCategory>("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [lastShown, setLastShown] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [supportsVT, setSupportsVT] = useState(false);

  const list = useMemo(() => projects.filter((p) => matches(p, filter)), [filter]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map(({ key }) => [key, projects.filter((p) => matches(p, key)).length]),
      ) as Record<FilterCategory, number>,
    [],
  );

  useEffect(() => {
    setSupportsVT(typeof document !== "undefined" && "startViewTransition" in document);
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setIsTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* --------- Cursor-bound preview: springs + velocity-driven tilt ---------- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.6 });
  const py = useSpring(my, { stiffness: 260, damping: 30, mass: 0.6 });
  const vx = useVelocity(px);
  const rotate = useSpring(useTransform(vx, [-2200, 0, 2200], [-9, 0, 9]), {
    stiffness: 180,
    damping: 18,
  });
  const skewX = useSpring(useTransform(vx, [-2200, 0, 2200], [5, 0, -5]), {
    stiffness: 180,
    damping: 18,
  });

  const onListMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const onRowEnter = (e: React.PointerEvent, idx: number) => {
    if (e.pointerType !== "mouse") return;
    if (hovered === null) {
      mx.set(e.clientX);
      my.set(e.clientY);
      px.jump(e.clientX);
      py.jump(e.clientY);
    }
    setHovered(idx);
    setLastShown(idx);
  };

  /* ------------------------ View Transition helpers ------------------------ */
  const transition = useCallback(
    (update: () => void, before?: () => void, inside?: () => void) => {
      const doc = document as VTDoc;
      if (!doc.startViewTransition || reduced) {
        update();
        return;
      }
      before?.();
      doc.startViewTransition(() => {
        inside?.();
        flushSync(update);
      });
    },
    [reduced],
  );

  const openCase = (idx: number, e: React.MouseEvent<HTMLElement>) => {
    playClick();
    const fine = !isTouch;
    const el: HTMLElement | null = fine
      ? previewImgRef.current
      : e.currentTarget.querySelector<HTMLElement>("[data-thumb]");

    transition(
      () => {
        setHovered(null);
        setOpenIndex(idx);
      },
      () => el?.style.setProperty("view-transition-name", VT_NAME),
      () => el?.style.removeProperty("view-transition-name"),
    );
  };

  const goTo = (i: number) => {
    const n = list.length;
    const target = ((i % n) + n) % n;
    playTab();
    transition(() => setOpenIndex(target));
  };

  const closeCase = () => {
    playTab();
    transition(() => setOpenIndex(null));
  };

  const changeFilter = (key: FilterCategory) => {
    if (key === filter) return;
    playTab();
    setHovered(null);
    setFocused(null);
    startTransition(() => {
      setFilter(key);
    });
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const buttons = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-row]"),
    );
    const i = buttons.findIndex((b) => b === document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = buttons[(i + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length];
    next.focus();
  };

  const active = hovered ?? focused;
  const showPreview = !isTouch && hovered !== null && openIndex === null;
  const previewProject = list[Math.min(lastShown, Math.max(list.length - 1, 0))];
  const openProject = openIndex !== null ? list[openIndex] : undefined;

  /* --------------------------------- Render -------------------------------- */
  return (
    <section
      id="work"
      className="relative scroll-mt-20 bg-[var(--page)] pt-14 pb-12 transition-colors duration-500 sm:scroll-mt-24 sm:pt-16 sm:pb-14 md:scroll-mt-28 md:pt-18 md:pb-16"
    >
      <style>{CSS}</style>

      <Container>
        {/* Architectural Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--coral)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--coral)]" />
              </span>
              <span className="font-semibold text-[var(--ink)]">[02 // INDEX 2024–2026]</span>
            </div>

            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl md:text-5xl">
              Selected Work
            </h2>
          </div>

          <div className="flex flex-col gap-1 sm:items-end sm:text-right">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
              [INDEX ARCHIVE // 06 ENTRIES]
            </span>
            <p className="max-w-sm text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              Web systems, predictive intelligence platforms and brand direction — built end to end.
            </p>
          </div>
        </div>

        {/* Minimal Brutalist Filter Tabs */}
        <div
          role="group"
          aria-label="Filter project categories"
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--line)] sm:gap-x-8"
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
                  "relative pb-3 font-mono text-xs uppercase tracking-[0.14em] font-semibold transition-colors duration-200 sm:pb-3.5",
                  on ? "text-[var(--ink)] font-bold" : "text-[var(--muted)] hover:text-[var(--ink)]",
                )}
              >
                {label}
                <span className="ml-1.5 font-mono text-[10px] tabular-nums text-[var(--coral)] font-bold">
                  [{pad(counts[key])}]
                </span>
                {on && (
                  <motion.span
                    layoutId="pjFilterLine"
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--flame)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Index */}
        {list.length === 0 ? (
          <div className="my-8 rounded-2xl border border-dashed border-[var(--line)] p-8 py-20 text-center sm:my-12 sm:py-24">
            <Layers className="mx-auto mb-3 h-8 w-8 text-[var(--muted)] opacity-60" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              No projects in this category yet
            </p>
            <button
              type="button"
              onClick={() => changeFilter("all")}
              className="btn-neo-base btn-neo-secondary mt-6 inline-flex h-10 items-center justify-center px-6 text-xs"
            >
              Reset to All Projects
            </button>
          </div>
        ) : (
          <ul
            className="mt-0"
            onPointerMove={onListMove}
            onPointerLeave={() => setHovered(null)}
            onKeyDown={onListKey}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((project, idx) => {
                const meta = CATEGORY_META[getCategory(project)];
                const hot = active === idx;
                const dim = active !== null && !hot;

                return (
                  <motion.li
                    key={project.title}
                    layout={reduced ? false : "position"}
                    initial={reduced ? false : { opacity: 0, y: 36 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: EASE, delay: reduced ? 0 : idx * 0.06 },
                    }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    className="relative border-b border-[var(--line)]"
                  >
                    {/* Sweeping coral hairline */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-10 h-px origin-left bg-[var(--coral)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                      style={{ transform: hot ? "scaleX(1)" : "scaleX(0)" }}
                    />

                    <button
                      type="button"
                      data-row
                      aria-label={`Open case study: ${project.title}`}
                      onClick={(e) => openCase(idx, e)}
                      onPointerEnter={(e) => onRowEnter(e, idx)}
                      onFocus={() => setFocused(idx)}
                      onBlur={() => setFocused(null)}
                      className={cn(
                        "group/row block w-full text-left outline-none transition-opacity duration-500 focus-visible:bg-[var(--surface)]/50",
                        dim ? "opacity-[0.22]" : "opacity-100",
                      )}
                    >
                      <span className="pj-reveal grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-8 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:gap-x-8 md:py-9 lg:grid-cols-[4rem_minmax(0,1fr)_auto] lg:py-10">
                        <span
                          className={cn(
                            "pt-[0.55em] font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-300 sm:pt-[0.7em] md:pt-[1.1em]",
                            hot ? "text-[var(--coral)]" : "text-[var(--muted)]",
                          )}
                        >
                          {pad(idx + 1)}
                        </span>

                        <span className="block min-w-0">
                          <span
                            role="heading"
                            aria-level={3}
                            className="block font-sans font-bold leading-[1.02] tracking-[-0.045em] text-[var(--ink)]"
                            style={{ fontSize: "clamp(2.25rem, 6.6vw, 7rem)" }}
                          >
                            <RollText text={project.title} hot={hot} reduced={reduced} />
                          </span>

                          {/* mobile meta */}
                          <span className="mt-2.5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] md:hidden">
                            <span>{meta.label}</span>
                            <span className="h-px w-5 bg-[var(--line)]" />
                            <span>{project.year}</span>
                          </span>

                          {/* touch: inline thumbnail (morph source for the View Transition) */}
                          {isTouch && (
                            <span className="mt-4 block aspect-[16/9] overflow-hidden rounded-xl bg-neutral-950 sm:mt-5">
                              <img
                                data-thumb
                                src={project.image}
                                alt={project.title}
                                width={1200}
                                height={675}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover object-top"
                              />
                            </span>
                          )}
                        </span>

                        {/* desktop meta */}
                        <span className="hidden flex-col items-end gap-2 pt-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] md:flex">
                          <div className="flex items-center gap-2">
                            <span>{meta.label}</span>
                            <span className="text-[var(--line)]">/</span>
                            <span className="text-[var(--ink)] font-bold">{project.year}</span>
                          </div>
                          <div className="flex flex-wrap justify-end gap-1.5 max-w-[280px]">
                            {project.stack.slice(0, 3).map((stk) => (
                              <span
                                key={stk}
                                className="brutal-tag rounded-sm text-[10px] py-0.5 px-2 bg-[var(--surface-strong)] text-[var(--muted)]"
                              >
                                {stk}
                              </span>
                            ))}
                          </div>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1 grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] lg:h-11 lg:w-11",
                              hot
                                ? "rotate-0 border-[var(--flame)] bg-[var(--flame)] text-[var(--page)] dark:bg-[#C7ED70] dark:text-black dark:border-[#C7ED70]"
                                : "-rotate-45 border-[var(--line)] text-[var(--muted)]",
                            )}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[var(--muted)] sm:mt-14">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
            <span>Ayush Singh — Portfolio Edition 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/canva-gallery"
              onClick={() => playClick()}
              className="underline-offset-4 transition-colors hover:text-[var(--coral)] hover:underline"
            >
              Canva Exhibition Gallery →
            </Link>
            <span className="text-[var(--line)]">|</span>
            <Link
              to="/resume"
              onClick={() => playClick()}
              className="underline-offset-4 transition-colors hover:text-[var(--coral)] hover:underline"
            >
              Verified Résumé →
            </Link>
          </div>
        </div>
      </Container>

      {/* Cursor-bound preview — portaled so no transformed ancestor can break `fixed` */}
      {typeof document !== "undefined" &&
        !isTouch &&
        previewProject &&
        createPortal(
          <motion.div
            aria-hidden="true"
            style={{ x: px, y: py }}
            className="pointer-events-none fixed left-0 top-0 z-[60]"
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                style={{ rotate: reduced ? 0 : rotate, skewX: reduced ? 0 : skewX }}
                animate={{ opacity: showPreview ? 1 : 0, scale: showPreview ? 1 : 0.7 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="relative aspect-[4/3] w-[clamp(260px,28vw,420px)] rounded-xl border-2 border-[var(--ink)] bg-[var(--surface)] shadow-[10px_10px_0px_rgba(0,0,0,0.6)] overflow-hidden"
              >
                <span className="brutal-corner-cross left-2.5 top-1.5 text-white font-mono z-30 font-bold">+</span>
                <span className="brutal-corner-cross right-2.5 top-1.5 text-white font-mono z-30 font-bold">+</span>
                <div className="absolute inset-0 overflow-hidden bg-neutral-950">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.img
                      key={previewProject.title}
                      ref={previewImgRef}
                      src={previewProject.image}
                      alt={previewProject.title}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  </AnimatePresence>
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white border border-white/20">
                    [CASE STUDY // OPEN ↗]
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>,
          document.body,
        )}

      {/* Case study overlay — unmounts synchronously so the View Transition can morph */}
      {openProject &&
        openIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <CaseStudy
            project={openProject}
            index={openIndex}
            total={list.length}
            nextTitle={list[(openIndex + 1) % list.length].title}
            supportsVT={supportsVT && !reduced}
            reduced={reduced}
            onClose={closeCase}
            onGo={goTo}
          />,
          document.body,
        )}
    </section>
  );
}