import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { stopSmoothScroll, startSmoothScroll } from "../hooks/useSmoothScroll";
import { Container } from "../components/Container";
import { playTab, playClick } from "../utils/soundEffects";

/* ========================================================================== */
/*  Tokens                                                                    */
/* ========================================================================== */

type FilterCategory = "all" | "web" | "data" | "design";
type Category = Exclude<FilterCategory, "all">;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ACCENT_TEXT = "text-[var(--ink)]";

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "web", label: "Web" },
  { key: "data", label: "Data & ML" },
  { key: "design", label: "Brand & design" },
];

const CATEGORY_LABEL: Record<Category, string> = {
  web: "Web system",
  data: "Data & ML",
  design: "Brand identity",
};

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

/* ------------------------------ Categorisation ---------------------------- */
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

function jumpMotionValue(mv: MotionValue<number>, value: number) {
  const withJump = mv as MotionValue<number> & { jump?: (v: number) => void };
  if (typeof withJump.jump === "function") withJump.jump(value);
  else mv.set(value);
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

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
  const inView = useInView(ref, { root: rootRef, once: true, amount: "some" });
  const parsed = useMemo(() => parseMetric(value), [value]);

  useEffect(() => {
    if (disabled || !inView || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${parsed.prefix}${fmt(parsed, v)}${parsed.suffix}`;
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

function ProjectPicture({
  src,
  alt,
  eager = false,
  className,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  const isWebp = /\.webp$/i.test(src);
  return (
    <picture className="block h-full w-full">
      {isWebp && (
        <>
          <source srcSet={src.replace(/\.webp$/i, ".avif")} type="image/avif" />
          <source srcSet={src} type="image/webp" />
        </>
      )}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={750}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className={className}
      />
    </picture>
  );
}

/* ========================================================================== */
/*  Heading: one orchestrated line-by-line reveal                             */
/* ========================================================================== */

function RevealLine({
  children,
  delay = 0,
  reduced,
}: {
  children: React.ReactNode;
  delay?: number;
  reduced: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className="block"
        initial={reduced ? false : { y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ========================================================================== */
/*  Filter: segmented control with a sliding pill                             */
/* ========================================================================== */

function FilterBar({
  filter,
  counts,
  reduced,
  onChange,
}: {
  filter: FilterCategory;
  counts: Record<FilterCategory, number>;
  reduced: boolean;
  onChange: (k: FilterCategory) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter projects"
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {FILTERS.map(({ key, label }) => {
        const on = filter === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(key)}
            className={cn(
              "relative shrink-0 rounded-[2.5px] px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#5b5b5b]",
              on ? "text-[var(--page)]" : "text-[var(--muted)] hover:text-[var(--ink)]",
            )}
          >
            {on && (
              <motion.span
                layoutId="projects-filter-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-[2.5px] bg-[var(--ink)]"
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 36 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {label}
              <span className={cn("text-xs tabular-nums", on ? "opacity-60" : "opacity-50")}>
                {counts[key]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ========================================================================== */
/*  Featured panel (stacks on scroll)                                         */
/* ========================================================================== */

function FeaturedPanel({
  project,
  index,
  total,
  progress,
  stack,
  reduced,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stack: boolean;
  reduced: boolean;
  onOpen: (i: number) => void;
}) {
  const category = getCategory(project);
  const isLast = index === total - 1;
  const start = index / total;

  // Scroll-linked: previous panels recede as the next one slides over them.
  const scale = useTransform(progress, [start, 1], [1, isLast ? 1 : 1 - (total - 1 - index) * 0.025 - 0.03]);
  const veil = useTransform(progress, [start, 1], [0, isLast ? 0 : 0.55]);
  const imgY = useTransform(progress, [start, 1], [0, -16]);

  const liveHref = project.galleryLink ?? project.link;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={stack ? { position: "sticky", top: `${6 + index * 0.75}rem` } : undefined}
      className="will-change-transform"
    >
      <motion.article
        style={stack ? { scale, transformOrigin: "50% 0%" } : undefined}
        className="relative overflow-hidden rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] md:p-10"
      >
        <div className="grid grid-cols-1 gap-[var(--gutter)] lg:grid-cols-12">
          {/* Media (3:2 aspect ratio, 4px radius matching jeppesen.dev) */}
          <button
            type="button"
            onClick={() => onOpen(index)}
            data-cursor="View"
            aria-label={`Open case study: ${project.title}`}
            className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-[4px] bg-[#1e1e1e] p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#5b5b5b] sm:p-8 lg:col-span-7"
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[4px] border border-white/10 bg-[#141414] shadow-[0_24px_50px_-16px_rgba(0,0,0,0.65)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
              <div className="flex h-6 shrink-0 items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                  {CATEGORY_LABEL[category]} · {project.year}
                </span>
              </div>
              <motion.div
                style={stack ? { y: imgY } : undefined}
                className="min-h-0 flex-1 will-change-transform"
              >
                <ProjectPicture
                  src={project.image}
                  alt={project.title}
                  eager={index < 2}
                  className="h-full w-full object-contain object-center"
                />
              </motion.div>
            </div>
          </button>

          {/* Details */}
          <div className="flex flex-col justify-between gap-6 pt-1 lg:col-span-5 lg:py-2">
            <div>
              <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <span className={cn("h-1.5 w-1.5 rounded-full bg-current", ACCENT_TEXT)} />
                {CATEGORY_LABEL[category]}
                <span aria-hidden="true" className="opacity-40">/</span>
                {project.year}
              </p>

              <h3 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-4xl xl:text-5xl">
                {project.title}
              </h3>

              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[var(--muted)]">
                {project.description}
              </p>

              {project.metrics.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-6">
                  {project.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <dt className="order-2 mt-1 text-sm text-[var(--muted)]">{m.label}</dt>
                      <dd className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--ink)] sm:text-4xl">
                        <CountUp value={m.value} disabled={reduced} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="space-y-6">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[var(--muted)]">
                {project.stack.slice(0, 6).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  className="group/cta inline-flex h-[46px] items-center gap-2 rounded-[4px] bg-[var(--ink)] px-5 text-sm font-medium text-[var(--page)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5b5b5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
                >
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                </button>

                {project.galleryLink ? (
                  <Link
                    to={project.galleryLink}
                    onClick={() => playClick()}
                    className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] px-3.5 text-xs font-semibold text-[var(--ink)] outline-none transition-colors hover:border-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                  >
                    Open gallery
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : liveHref ? (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] px-3.5 text-xs font-semibold text-[var(--ink)] outline-none transition-colors hover:border-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                  >
                    Live site
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    aria-label={`${project.title} source code on GitHub`}
                    className="grid h-[35px] w-[35px] place-items-center rounded-[2.5px] border border-[var(--line)] text-[var(--muted)] outline-none transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                  >
                    <GithubIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recede veil for stacked panels */}
        {stack && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: veil }}
            className="pointer-events-none absolute inset-0 rounded-[4px] bg-[var(--page)]"
          />
        )}
      </motion.article>
    </motion.div>
  );
}

function FeaturedStack({
  list,
  desktop,
  reduced,
  onOpen,
}: {
  list: Project[];
  desktop: boolean;
  reduced: boolean;
  onOpen: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stack = desktop && !reduced && list.length > 1;

  return (
    <Container>
      <div ref={ref} className={cn("flex flex-col gap-6", stack && "lg:gap-[16vh]")}>
        {list.map((project, i) => (
          <FeaturedPanel
            key={project.title}
            project={project}
            index={i}
            total={list.length}
            progress={scrollYProgress}
            stack={stack}
            reduced={reduced}
            onOpen={onOpen}
          />
        ))}
      </div>
    </Container>
  );
}

/* ========================================================================== */
/*  Archive: quiet index with a cursor-following preview                      */
/* ========================================================================== */

function Archive({
  list,
  desktop,
  reduced,
  onOpen,
}: {
  list: Project[];
  desktop: boolean;
  reduced: boolean;
  onOpen: (i: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 300, damping: 34, mass: 0.5 });
  const py = useSpring(my, { stiffness: 300, damping: 34, mass: 0.5 });

  const handleEnter = (i: number, x: number, y: number) => {
    if (!desktop) return;
    if (hover === null) {
      jumpMotionValue(mx, x);
      jumpMotionValue(my, y);
      jumpMotionValue(px, x);
      jumpMotionValue(py, y);
    }
    setHover(i);
  };

  return (
    <div
      onPointerMove={(e) => {
        if (!desktop) return;
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      onPointerLeave={() => setHover(null)}
      className="relative"
    >
      <ul className="border-t border-[var(--line)]">
        {list.map((p, i) => {
          const dim = hover !== null && hover !== i;
          return (
            <li key={p.title} className="border-b border-[var(--line)]">
              <button
                type="button"
                onClick={() => {
                  setHover(null);
                  onOpen(i);
                }}
                onPointerEnter={(e) => handleEnter(i, e.clientX, e.clientY)}
                className={cn(
                  "group grid w-full grid-cols-[1fr_auto] items-center gap-6 py-5 text-left outline-none transition-opacity duration-300 focus-visible:bg-[var(--surface)] sm:grid-cols-[1fr_10rem_4rem_auto] sm:py-6",
                  dim ? "opacity-35" : "opacity-100",
                )}
              >
                <span className="truncate text-2xl font-medium tracking-tight text-[var(--ink)] transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-4xl">
                  {p.title}
                </span>
                <span className="hidden text-sm text-[var(--muted)] sm:block">
                  {CATEGORY_LABEL[getCategory(p)]}
                </span>
                <span className="hidden text-sm tabular-nums text-[var(--muted)] sm:block">{p.year}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors duration-300 group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--page)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {desktop && !reduced && (
        <motion.div
          aria-hidden="true"
          style={{ x: px, y: py }}
          className="pointer-events-none fixed left-0 top-0 z-40"
        >
          <AnimatePresence>
            {hover !== null && list[hover] && (
              <motion.div
                key={list[hover].title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="-ml-[160px] -mt-[110px] h-[220px] w-[320px] overflow-hidden rounded-2xl border border-[var(--line)] bg-neutral-950 shadow-2xl"
              >
                <ProjectPicture
                  src={list[hover].image}
                  alt=""
                  eager
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ========================================================================== */
/*  Case study: side sheet                                                    */
/* ========================================================================== */

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
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const category = getCategory(project);
  const liveHref = project.galleryLink ?? project.link;

  const latest = useRef({ index, onClose, onGo });
  latest.current = { index, onClose, onGo };

  useEffect(() => {
    stopSmoothScroll();
    const prevFocus = document.activeElement as HTMLElement | null;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sb > 0) document.body.style.paddingRight = `${sb}px`;
    closeRef.current?.focus({ preventScroll: true });

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
      startSmoothScroll();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [project.title]);

  useEffect(() => {
    if (!nextImage) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextImage;
  }, [nextImage]);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      data-lenis-prevent
      className="fixed inset-0 z-[100]"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.aside
        initial={reduced ? { opacity: 0 } : { x: "100%" }}
        animate={reduced ? { opacity: 1 } : { x: 0 }}
        exit={reduced ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: 0.65, ease: EASE }}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-[var(--page)] text-[var(--ink)] shadow-2xl sm:w-[min(1080px,94vw)] sm:rounded-l-[2rem]"
      >
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 z-30 h-0.5 origin-left bg-[#5b5b5b]"
        />

        <header className="z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--line)] px-5 sm:h-[4.5rem] sm:px-8">
          <p className="truncate text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--ink)]">
              {index + 1} of {total}
            </span>
            <span aria-hidden="true" className="mx-2 opacity-40">/</span>
            {CATEGORY_LABEL[category]}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGo(index - 1)}
              aria-label="Previous project"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] outline-none transition-colors hover:border-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onGo(index + 1)}
              aria-label="Next project"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] outline-none transition-colors hover:border-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--page)] outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#5b5b5b] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div key={project.title} className="px-5 pb-20 pt-10 sm:px-10 sm:pt-14">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                {project.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
                {project.description}
              </p>
            </div>

            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-neutral-950">
              <ProjectPicture
                src={project.image}
                alt={project.title}
                eager
                className="h-full w-full object-cover object-top"
              />
            </div>

            {project.metrics.length > 0 && (
              <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-[var(--line)] py-8 md:grid-cols-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
                      <CountUp value={m.value} disabled={reduced} rootRef={scrollRef} />
                    </dd>
                    <dt className="mt-1 text-sm text-[var(--muted)]">{m.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="space-y-12 lg:col-span-7">
                <section>
                  <h3 className="text-xl font-semibold tracking-tight">How it works</h3>
                  <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-[var(--muted)]">
                    {project.impact}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold tracking-tight">What was delivered</h3>
                  <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                    {project.features.map((f) => (
                      <li key={f} className="flex gap-3 py-4 text-[15px] leading-relaxed">
                        <span aria-hidden="true" className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current", ACCENT_TEXT)} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="lg:col-span-5">
                <div className="space-y-6 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-6 lg:sticky lg:top-6">
                  <dl className="space-y-5 text-sm">
                    <div>
                      <dt className="text-[var(--muted)]">Role</dt>
                      <dd className="mt-1 text-base font-medium">{project.role}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Year</dt>
                      <dd className="mt-1 text-base font-medium">{project.year}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Built with</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)]"
                          >
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-2.5 border-t border-[var(--line)] pt-5">
                    {project.galleryLink ? (
                      <Link
                        to={project.galleryLink}
                        onClick={() => playClick()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-sm font-medium text-[var(--page)] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                      >
                        Open gallery
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : liveHref ? (
                      <a
                        href={liveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-sm font-medium text-[var(--page)] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                      >
                        Visit live site
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] text-sm font-medium outline-none transition-colors hover:border-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
                      >
                        <GithubIcon />
                        View source
                      </a>
                    )}
                  </div>
                </div>
              </aside>
            </div>

            {total > 1 && (
              <button
                type="button"
                onClick={() => onGo(index + 1)}
                className="group mt-20 flex w-full items-center justify-between gap-6 border-t border-[var(--line)] pt-8 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
              >
                <span>
                  <span className="text-sm text-[var(--muted)]">Next project</span>
                  <span className="mt-1 block text-3xl font-semibold tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-5xl">
                    {nextTitle}
                  </span>
                </span>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[var(--line)] transition-colors duration-300 group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--page)]">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}

/* ========================================================================== */
/*  Projects section                                                          */
/* ========================================================================== */

export function Projects() {
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();

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

  const openCase = useCallback((idx: number) => {
    playClick();
    setOpenIndex(idx);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const n = list.length;
      if (!n) return;
      playTab();
      setOpenIndex(((i % n) + n) % n);
    },
    [list.length],
  );

  const closeCase = useCallback(() => {
    playTab();
    setOpenIndex(null);
  }, []);

  const changeFilter = (key: FilterCategory) => {
    if (key === filter) return;
    playTab();
    startTransition(() => {
      setOpenIndex(null);
      setFilter(key);
    });
  };

  const openProject = openIndex !== null ? list[openIndex] : undefined;
  const nextProject = openIndex !== null ? list[(openIndex + 1) % list.length] : undefined;

  return (
    <section
      id="work"
      className="relative scroll-mt-16 bg-[var(--page)] pb-24 pt-20 transition-colors duration-500 sm:scroll-mt-20 sm:pb-32 sm:pt-28 lg:scroll-mt-24"
    >
      {/* Header */}
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 className="text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--ink)] lg:col-span-8">
            <RevealLine reduced={reduced}>Selected work,</RevealLine>
            <RevealLine reduced={reduced} delay={0.1}>
              built with intent.
            </RevealLine>
          </h2>

          <p className="max-w-[38ch] text-base leading-relaxed text-[var(--muted)] lg:col-span-4 lg:justify-self-end lg:pb-3">
            Web products, data pipelines and brand systems. {pad(projects.length)} projects, each with
            the story behind it.
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <FilterBar filter={filter} counts={counts} reduced={reduced} onChange={changeFilter} />
        </div>
      </Container>

      {/* Featured */}
      <div className="mt-10 sm:mt-14">
        {list.length === 0 ? (
          <Container>
            <div className="rounded-[2rem] border border-dashed border-[var(--line)] px-6 py-24 text-center">
              <p className="text-lg font-medium text-[var(--ink)]">Nothing in this category yet</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Try another filter to see more projects.</p>
              <button
                type="button"
                onClick={() => changeFilter("all")}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--ink)] px-5 text-sm font-medium text-[var(--page)] outline-none focus-visible:ring-2 focus-visible:ring-[#5b5b5b]"
              >
                Show all work
              </button>
            </div>
          </Container>
        ) : (
          <FeaturedStack
            key={filter}
            list={list}
            desktop={desktop}
            reduced={reduced}
            onOpen={openCase}
          />
        )}
      </div>

      {/* Archive */}
      {list.length > 0 && (
        <Container>
          <div className="mt-28 sm:mt-40">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h3 className="text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
                All projects
              </h3>
              <p className="text-sm text-[var(--muted)]">
                {desktop ? "Hover to preview, click to open" : "Tap to open"}
              </p>
            </div>

            <Archive list={list} desktop={desktop} reduced={reduced} onOpen={openCase} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]">
              <p>Ayush Singh, Portfolio 2026</p>
              <div className="flex items-center gap-6">
                <Link
                  to="/canva-gallery"
                  onClick={() => playClick()}
                  className="inline-flex items-center gap-1.5 underline-offset-4 outline-none transition-colors hover:text-[var(--ink)] hover:underline focus-visible:text-[var(--ink)] focus-visible:underline"
                >
                  Canva gallery
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/resume"
                  onClick={() => playClick()}
                  className="inline-flex items-center gap-1.5 underline-offset-4 outline-none transition-colors hover:text-[var(--ink)] hover:underline focus-visible:text-[var(--ink)] focus-visible:underline"
                >
                  Résumé
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      )}

      <AnimatePresence>
        {openProject && openIndex !== null && nextProject && typeof document !== "undefined" && (
          <CaseStudy
            key="case-study"
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