import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type ReactNode,
  type RefObject,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Layers,
  TrendingUp,
} from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { stopSmoothScroll, startSmoothScroll } from "../hooks/useSmoothScroll";
import { Container } from "../components/Container";
import { playTab, playClick } from "../utils/soundEffects";

/* ========================================================================== */
/*  Styles — transform / opacity only. No 3D, no blur filters.                */
/* ========================================================================== */

const STYLES = `
@keyframes prj-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
.prj-marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: prj-marquee 52s linear infinite;
}

@keyframes prj-list-in {
  from { opacity: 0; transform: translate3d(0, 16px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
.prj-list-in { animation: prj-list-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }

.prj-outline { color: transparent; -webkit-text-stroke: 1px var(--line); }
.prj-outline-accent { color: transparent; -webkit-text-stroke: 1px #B39CFF; }
@media (min-width: 768px) {
  .prj-outline-accent { -webkit-text-stroke-width: 1.5px; }
}

.prj-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.prj-underline:hover { background-size: 100% 1px; }

@media (prefers-reduced-motion: reduce) {
  .prj-marquee-track { animation: none; }
  .prj-list-in { animation: none; }
}
`;

/* ========================================================================== */
/*  Config                                                                    */
/* ========================================================================== */

type FilterCategory = "all" | "web" | "data" | "design";
type Category = Exclude<FilterCategory, "all">;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Systems" },
  { key: "data", label: "Data & ML" },
  { key: "design", label: "Visual Direction" },
];

const CATEGORY_META: Record<
  Category,
  { label: string; badge: string; accentColor: string; badgeClass: string; dotColor: string }
> = {
  web: {
    label: "Web Architecture",
    badge: "Web System",
    accentColor: "#1E90FF",
    badgeClass: "text-[#1677D9] dark:text-[#1E90FF] bg-[#1E90FF]/10 border-[#1E90FF]/30",
    dotColor: "bg-[#1E90FF]",
  },
  data: {
    label: "Data Intelligence",
    badge: "Data & ML",
    accentColor: "#B39CFF",
    badgeClass: "text-[#7654D6] dark:text-[#B39CFF] bg-[#B39CFF]/10 border-[#B39CFF]/30",
    dotColor: "bg-[#B39CFF]",
  },
  design: {
    label: "Visual Direction",
    badge: "Brand Identity",
    accentColor: "#B39CFF",
    badgeClass: "text-[#7654D6] dark:text-[#B39CFF] bg-[#B39CFF]/10 border-[#B39CFF]/30",
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
      return new URL(p.link).hostname.replace(/^www\./, "");
    } catch {
      return p.link;
    }
  }
  if (p.galleryLink) return "canva.com/gallery";
  if (p.github) return "github.com/repository";
  return "system.internal";
};

function jumpMotionValue(mv: MotionValue<number>, value: number) {
  const withJump = mv as MotionValue<number> & { jump?: (v: number) => void };
  if (typeof withJump.jump === "function") {
    withJump.jump(value);
  } else {
    mv.set(value);
  }
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
  const inView = useInView(ref, { root: rootRef, once: true, amount: 0.4 });
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

/** Masked word-by-word reveal. */
function SplitWords({
  text,
  reduced,
  className,
  delay = 0,
  inView = true,
}: {
  text: string;
  reduced: boolean;
  className?: string;
  delay?: number;
  inView?: boolean;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "112%" }}
            animate={inView ? undefined : { y: "0%" }}
            whileInView={inView ? { y: "0%" } : undefined}
            viewport={inView ? { once: true, amount: 0.25 } : undefined}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.05 }}
          >
            {w}
            {"\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  reduced,
  rootRef,
  className,
}: {
  children: ReactNode;
  delay?: number;
  reduced: boolean;
  rootRef?: RefObject<Element | null>;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, root: rootRef }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
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

/* -------------------------------------------------------------------------- */
/*  Big outlined marquee                                                      */
/* -------------------------------------------------------------------------- */
function BigMarquee({ words }: { words: string[] }) {
  // 4 copies (2 per -50% cycle) avoids gaps on ultrawide 4K/5K viewports.
  const row = useMemo(() => [...words, ...words, ...words, ...words], [words]);

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[var(--line)] py-5 sm:py-7"
    >
      <div className="prj-marquee-track">
        {row.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="flex shrink-0 items-center gap-8 pr-8 font-sans text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-none tracking-tight"
          >
            <span className={i % 2 === 0 ? "prj-outline" : "text-[var(--ink)]"}>{w}</span>
            <span className="font-serif italic text-[#B39CFF]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project panel (used in the horizontal track, single desktop & mobile)     */
/* -------------------------------------------------------------------------- */
const ProjectPanel = memo(function ProjectPanel({
  project,
  index,
  total,
  reduced,
  desktop,
  enableParallax,
  progress,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  reduced: boolean;
  desktop: boolean;
  enableParallax: boolean;
  progress: MotionValue<number>;
  onOpen: (index: number) => void;
}) {
  const meta = CATEGORY_META[getCategory(project)];
  const domainUrl = getDomainUrl(project);
  const denom = Math.max(1, total - 1);

  // Bounded percentage parallax paired with scale: 1.14 (7% overhang each side)
  // prevents exposing container edges on any viewport width or list length.
  const imgX = useTransform(progress, (v) => {
    const pct = Math.max(-5.5, Math.min(5.5, (v - index / denom) * -9));
    return `${pct}%`;
  });
  const ghostX = useTransform(progress, (v) => (v - index / denom) * -140);

  const open = () => onOpen(index);

  return (
    <article
      className={cn(
        "relative isolate shrink-0",
        desktop
          ? enableParallax
            ? "h-[clamp(460px,66vh,660px)] w-[78vw] max-w-[1320px]"
            : "h-[clamp(460px,66vh,660px)] w-full"
          : "mb-14 w-full last:mb-0",
      )}
    >
      {/* ghost index */}
      <motion.span
        aria-hidden="true"
        style={enableParallax && !reduced ? { x: ghostX } : undefined}
        className="prj-outline pointer-events-none absolute -top-[5vh] right-[2%] -z-10 select-none font-serif text-[clamp(7.5rem,20vw,19rem)] italic leading-none opacity-80"
      >
        {pad(index + 1)}
      </motion.span>

      <div
        className={cn(
          "grid h-full gap-6",
          desktop ? "grid-cols-12 gap-8 xl:gap-10" : "grid-cols-1",
        )}
      >
        {/* IMAGE */}
        <div className={cn("relative", desktop ? "col-span-7 h-full" : "")}>
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: EASE }}
            onClick={open}
            data-cursor={desktop ? "View" : undefined}
            role="button"
            tabIndex={0}
            aria-label={`Open case study: ${project.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }}
            className={cn(
              "group/image relative isolate w-full cursor-pointer overflow-hidden rounded-[20px] border border-[var(--line)] bg-neutral-950 outline-none focus-visible:ring-2 focus-visible:ring-[#B39CFF]",
              desktop ? "h-full" : "aspect-[4/3] sm:aspect-[16/10]",
            )}
          >
            <motion.div
              style={
                enableParallax && !reduced
                  ? { x: imgX, scale: 1.14, willChange: "transform" }
                  : undefined
              }
              className="absolute inset-0"
            >
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover/image:scale-[1.04]">
                <ProjectPicture
                  src={project.image}
                  alt={project.title}
                  eager={index < 2}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </motion.div>

            {/* Scrim for guaranteed legibility without mix-blend artifacts */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/25" />

            {/* top meta */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[11px] uppercase tracking-widest text-white/90 sm:p-5">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotColor)} />
                {meta.label}
              </span>
              <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1">
                {project.year}
              </span>
            </div>

            {/* overlay title */}
            <h3 className="absolute bottom-4 left-4 right-4 font-sans text-[clamp(1.85rem,4.2vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-white drop-shadow-sm sm:bottom-6 sm:left-6 sm:right-6">
              <SplitWords text={project.title} reduced={reduced} />
            </h3>
          </motion.div>
        </div>

        {/* TEXT */}
        <div
          className={cn(
            "flex flex-col justify-between gap-4 xl:gap-6",
            desktop ? "col-span-5 py-0.5" : "",
          )}
        >
          <div>
            <div className="mb-3 flex items-center gap-3 font-mono text-xs text-[var(--muted)] xl:mb-5">
              <span className="font-bold text-[#7654D6] dark:text-[#B39CFF]">
                {pad(index + 1)} / {pad(total)}
              </span>
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span className="truncate">{project.role}</span>
            </div>

            <p className="text-sm leading-relaxed text-[var(--ink)] sm:text-base xl:text-lg">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5 xl:mt-5">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--line)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--muted)] transition-colors duration-200 hover:border-[#B39CFF]/60 hover:text-[var(--ink)] xl:px-3 xl:py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {project.metrics.length > 0 && (
            <dl className="grid grid-cols-2 border-y border-[var(--line)]">
              {project.metrics.slice(0, 4).map((m, i) => (
                <div
                  key={m.label}
                  className={cn(
                    "py-2.5 xl:py-3.5",
                    i % 2 === 0 ? "pr-4" : "border-l border-[var(--line)] pl-4",
                    i > 1 && "border-t border-[var(--line)]",
                  )}
                >
                  <dd className="font-sans text-2xl font-bold tabular-nums tracking-tight text-[var(--ink)] xl:text-4xl">
                    <CountUp value={m.value} disabled={reduced} />
                  </dd>
                  <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] xl:mt-1">
                    {m.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-wrap items-center gap-2.5 xl:gap-3">
            {project.galleryLink ? (
              <Link
                to={project.galleryLink}
                onClick={() => playClick()}
                className="btn-neo-base btn-neo-primary inline-flex h-10 items-center gap-2 px-4 text-xs font-bold xl:h-11 xl:px-5"
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
                className="btn-neo-base btn-neo-primary inline-flex h-10 items-center gap-2 px-4 text-xs font-bold xl:h-11 xl:px-5"
              >
                <span>Launch Live</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="btn-neo-base btn-neo-secondary inline-flex h-10 items-center gap-2 px-3.5 text-xs font-semibold xl:h-11 xl:px-4"
              >
                <GithubIcon className="h-4 w-4 text-[var(--muted)]" />
                <span>Source</span>
              </a>
            )}

            <button
              type="button"
              onClick={open}
              className="prj-underline ml-1 inline-flex items-center gap-1.5 pb-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--ink)]"
            >
              <span>Case Study</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#7654D6] dark:text-[#B39CFF]" />
            </button>
          </div>

          <span className="sr-only">{domainUrl}</span>
        </div>
      </div>
    </article>
  );
});

/* -------------------------------------------------------------------------- */
/*  Pinned horizontal gallery (desktop) / vertical list (mobile & single)     */
/* -------------------------------------------------------------------------- */
function Gallery({
  list,
  reduced,
  desktop,
  onOpen,
}: {
  list: Project[];
  reduced: boolean;
  desktop: boolean;
  onOpen: (i: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = desktop && !reduced && list.length > 1;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const maxX = useMotionValue(0);
  useEffect(() => {
    if (!pinned) return;
    const el = trackRef.current;
    if (!el) return;
    const measure = () => maxX.set(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list, pinned, maxX]);

  const x = useTransform([scrollYProgress, maxX], ([p, m]: number[]) => -p * m);
  const barScale = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const n = Math.max(0, list.length - 1);
    const i = Math.min(n, Math.max(0, Math.round(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  useEffect(() => {
    setActive(0);
  }, [list]);

  // Preload next panel's screenshot ahead of scroll
  useEffect(() => {
    if (!pinned) return;
    const nextImg = list[active + 1]?.image;
    if (!nextImg) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextImg;
  }, [active, list, pinned]);

  const jump = (i: number) => {
    const clamped = Math.max(0, Math.min(list.length - 1, i));
    playTab();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const n = Math.max(1, list.length - 1);
    const range = wrap.offsetHeight - window.innerHeight;
    const top = wrap.getBoundingClientRect().top + window.scrollY + (clamped / n) * range;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!pinned) {
    return (
      <div className="prj-list-in mt-10">
        {list.map((p, i) => (
          <ProjectPanel
            key={p.title}
            project={p}
            index={i}
            total={list.length}
            reduced={reduced}
            desktop={desktop}
            enableParallax={false}
            progress={scrollYProgress}
            onOpen={onOpen}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="prj-list-in relative"
      style={{ height: `${list.length * 85 + 20}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x, willChange: "transform" }}
          className="flex items-center gap-[5vw] px-[max(8vw,calc(50vw-660px))] pb-16 pt-4"
        >
          {list.map((p, i) => (
            <ProjectPanel
              key={p.title}
              project={p}
              index={i}
              total={list.length}
              reduced={reduced}
              desktop
              enableParallax
              progress={scrollYProgress}
              onOpen={onOpen}
            />
          ))}
        </motion.div>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <Container>
            <div className="flex items-end justify-between gap-8 pb-5 xl:pb-6">
              <div className="min-w-0 max-w-[260px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  Now viewing
                </span>
                <div className="relative h-7 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="truncate font-sans text-lg font-bold tracking-tight text-[var(--ink)] xl:text-xl"
                    >
                      {list[active]?.title}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="pointer-events-auto flex flex-1 items-center gap-4">
                <div className="relative h-px flex-1 bg-[var(--line)]">
                  <motion.div
                    style={{ scaleX: barScale }}
                    className="absolute inset-0 origin-left bg-[#B39CFF]"
                  />
                  {list.map((p, i) => (
                    <button
                      key={p.title}
                      type="button"
                      aria-label={`Go to ${p.title}`}
                      aria-current={i === active ? "step" : undefined}
                      onClick={() => jump(i)}
                      style={{ left: `${(i / Math.max(1, list.length - 1)) * 100}%` }}
                      className="group/dot absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center outline-none"
                    >
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full border transition-[transform,background-color,border-color,box-shadow] duration-300",
                          i === active
                            ? "scale-125 border-[#B39CFF] bg-[#B39CFF] ring-4 ring-[#B39CFF]/25"
                            : i < active
                              ? "border-[#B39CFF] bg-[#B39CFF]"
                              : "border-[var(--line)] bg-[var(--page)] group-hover/dot:border-[#B39CFF]",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pointer-events-auto flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={active === 0}
                    onClick={() => jump(active - 1)}
                    aria-label="Previous project in gallery"
                    className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={active === list.length - 1}
                    onClick={() => jump(active + 1)}
                    aria-label="Next project in gallery"
                    className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="font-mono text-sm tabular-nums text-[var(--muted)]">
                  <span className="text-xl font-bold text-[var(--ink)] xl:text-2xl">
                    {pad(active + 1)}
                  </span>
                  <span className="mx-1">/</span>
                  {pad(list.length)}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Archive index with cursor-following preview                               */
/* -------------------------------------------------------------------------- */
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
  const px = useSpring(mx, { stiffness: 280, damping: 32, mass: 0.45 });
  const py = useSpring(my, { stiffness: 280, damping: 32, mass: 0.45 });

  const handleRowEnter = (i: number, clientX: number, clientY: number) => {
    if (!desktop) return;
    if (hover === null) {
      jumpMotionValue(mx, clientX);
      jumpMotionValue(my, clientY);
      jumpMotionValue(px, clientX);
      jumpMotionValue(py, clientY);
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
      <ul>
        {list.map((p, i) => {
          const meta = CATEGORY_META[getCategory(p)];
          const dim = hover !== null && hover !== i;
          return (
            <li key={p.title} className="border-b border-[var(--line)] first:border-t">
              <button
                type="button"
                onClick={() => {
                  setHover(null);
                  onOpen(i);
                }}
                onPointerEnter={(e) => handleRowEnter(i, e.clientX, e.clientY)}
                className={cn(
                  "group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-left transition-opacity duration-300 sm:gap-8 sm:py-7",
                  dim ? "opacity-30" : "opacity-100",
                )}
              >
                <span className="font-mono text-xs tabular-nums text-[#7654D6] dark:text-[#B39CFF]">
                  {pad(i + 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-sans text-[clamp(1.75rem,5.2vw,4.5rem)] font-bold leading-none tracking-tight text-[var(--ink)] transition-transform duration-500 ease-out group-hover:translate-x-3">
                    {p.title}
                  </span>
                  <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] sm:hidden">
                    {meta.badge} • {p.year}
                  </span>
                </span>
                <span className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                  <span className="hidden md:inline">{meta.badge}</span>
                  <span className="hidden sm:inline">{p.year}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] transition-colors duration-300 group-hover:border-[#B39CFF] group-hover:bg-[#B39CFF] group-hover:text-black">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {desktop && !reduced && (
        <motion.div
          aria-hidden="true"
          style={{ x: px, y: py, willChange: "transform" }}
          className="pointer-events-none fixed left-0 top-0 z-40"
        >
          <AnimatePresence>
            {hover !== null && list[hover] && (
              <motion.div
                key={list[hover].title}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="-ml-[150px] -mt-[100px] h-[200px] w-[300px] overflow-hidden rounded-2xl border border-[var(--line)] bg-neutral-950 shadow-2xl"
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

/* -------------------------------------------------------------------------- */
/*  Case Study Overlay                                                        */
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

  // Instant reset so smooth scrolling never fights newly swapped project content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [project.title]);

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
      data-lenis-prevent
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.65, ease: EASE }}
      className="fixed inset-0 z-[100] bg-[var(--page)] text-[var(--ink)]"
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-[#B39CFF]"
      />

      <div ref={scrollRef} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
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
                    onClick={() => playClick()}
                    className="btn-neo-base btn-neo-primary inline-flex h-9 items-center gap-2 px-4 text-xs font-bold"
                  >
                    <span>Launch Live</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : project.galleryLink ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onClose();
                      navigate(project.galleryLink!);
                    }}
                    className="btn-neo-base btn-neo-primary inline-flex h-9 items-center gap-2 px-4 text-xs font-bold"
                  >
                    <span>Exhibition</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                ) : project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="btn-neo-base btn-neo-secondary inline-flex h-9 items-center gap-2 px-4 text-xs font-bold"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>Source</span>
                  </a>
                ) : null}
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <motion.div
            key={project.title}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="py-10 sm:py-14"
          >
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
                <span className="truncate">{domainUrl}</span>
              </div>

              <h1 className="font-sans text-5xl font-bold leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl md:text-8xl">
                <SplitWords text={project.title} reduced={reduced} delay={0.12} inView={false} />
              </h1>
            </div>

            <Reveal reduced={reduced} rootRef={scrollRef}>
              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
                <div className="flex h-11 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex max-w-[190px] items-center gap-1.5 truncate rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-mono text-xs text-[var(--muted)] sm:max-w-xs">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E90FF]" />
                    <span className="truncate">https://{domainUrl}</span>
                  </div>
                  <div className="hidden font-mono text-xs text-[var(--muted)] sm:block">
                    Case Study
                  </div>
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950 sm:aspect-[21/9]">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    width={1600}
                    height={900}
                    decoding="async"
                    style={{
                      y: reduced ? 0 : heroY,
                      scale: reduced ? 1 : 1.12,
                      willChange: "transform",
                    }}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>

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
                          className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--ink)]"
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
                          playClick();
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
                        onClick={() => playClick()}
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
                        onClick={() => playClick()}
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
                <Reveal reduced={reduced} rootRef={scrollRef}>
                  <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-[#7654D6] dark:text-[#B39CFF]">
                    Mission & Impact
                  </h2>
                  <p className="text-xl font-medium leading-relaxed tracking-tight text-[var(--ink)] sm:text-2xl">
                    {project.description}
                  </p>
                </Reveal>

                {project.metrics.length > 0 && (
                  <Reveal reduced={reduced} rootRef={scrollRef}>
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
                      <h3 className="mb-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        <TrendingUp className="h-4 w-4 text-[#7654D6] dark:text-[#B39CFF]" />
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
                  </Reveal>
                )}

                <Reveal reduced={reduced} rootRef={scrollRef}>
                  <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Engineering Architecture
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                    {project.impact}
                  </p>
                </Reveal>

                <div>
                  <Reveal reduced={reduced} rootRef={scrollRef}>
                    <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      Core Deliverables
                    </h3>
                  </Reveal>
                  <div className="space-y-3">
                    {project.features.map((f, i) => (
                      <Reveal
                        key={f}
                        reduced={reduced}
                        rootRef={scrollRef}
                        delay={Math.min(i, 3) * 0.05}
                      >
                        <div className="flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#B39CFF]/40">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface-strong)] font-mono text-xs font-bold text-[#7654D6] dark:text-[#B39CFF]">
                            {pad(i + 1)}
                          </span>
                          <p className="text-sm font-medium leading-relaxed text-[var(--ink)] sm:text-base">
                            {f}
                          </p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
                    <span>
                      Next Project ({pad(((index + 1) % total) + 1)} / {pad(total)})
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#7654D6] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 dark:text-[#B39CFF]" />
                  </span>
                  <span className="mt-2 block font-sans text-3xl font-bold tracking-tight text-[var(--ink)] transition-colors duration-200 group-hover:text-[#7654D6] dark:group-hover:text-[#B39CFF] sm:text-4xl md:text-6xl">
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
/*  Main Section                                                              */
/* -------------------------------------------------------------------------- */
const MARQUEE_WORDS = ["Web Systems", "Data & ML", "Visual Direction", "Brand Identity"];

export function Projects() {
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop();
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

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

  // headline: the two lines drift in opposite directions as you scroll past
  const { scrollYProgress: headScroll } = useScroll({
    target: headRef,
    offset: ["start end", "end start"],
  });
  const line1X = useTransform(headScroll, [0, 1], ["14%", "-14%"]);
  const line2X = useTransform(headScroll, [0, 1], ["-14%", "14%"]);

  const openCase = useCallback((idx: number) => {
    playClick();
    setOpenIndex(idx);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const n = list.length;
      if (!n) return;
      const target = ((i % n) + n) % n;
      playTab();
      setOpenIndex(target);
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
  const usePinnedDesktop = desktop && !reduced && list.length > 1;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-16 bg-[var(--page)] pt-14 transition-colors duration-500 sm:scroll-mt-20 sm:pt-20 lg:scroll-mt-24"
    >
      <style>{STYLES}</style>

      {/* ───────────── Intro ───────────── */}
      <div ref={headRef} className="overflow-hidden">
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            <span className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B39CFF] opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B39CFF]" />
              </span>
              <span className="font-bold text-[var(--ink)]">[02 // Selected Work & Systems]</span>
            </span>
            <span>Index — {pad(projects.length)} case studies</span>
          </div>
        </Container>

        <div className="select-none font-sans font-bold uppercase leading-[0.82] tracking-tighter">
          <motion.div
            style={reduced ? undefined : { x: line1X, willChange: "transform" }}
            className="whitespace-nowrap text-[clamp(4.5rem,17vw,16rem)] text-[var(--ink)]"
          >
            Selected
          </motion.div>
          <motion.div
            style={reduced ? undefined : { x: line2X, willChange: "transform" }}
            className="flex items-baseline justify-end gap-[2vw] whitespace-nowrap pr-[4vw] text-[clamp(4.5rem,17vw,16rem)]"
          >
            <span className="mb-[1.5vw] hidden max-w-[22ch] self-end text-right font-mono text-xs font-normal normal-case leading-relaxed tracking-normal text-[var(--muted)] md:block">
              Scalable web architectures, predictive intelligence pipelines and bespoke brand
              systems — built with precision.
            </span>
            <span className="prj-outline-accent font-serif font-normal italic normal-case tracking-normal">
              Work
            </span>
          </motion.div>
        </div>

        {/* Filters */}
        <Container>
          <div
            role="group"
            aria-label="Filter project categories"
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[var(--line)] pt-5"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Filter
            </span>
            {FILTERS.map(({ key, label }) => {
              const on = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => changeFilter(key)}
                  className={cn(
                    "relative pb-1.5 font-sans text-base font-semibold tracking-tight transition-colors duration-200 sm:text-lg",
                    on ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]",
                  )}
                >
                  {label}
                  <sup className="ml-1 font-mono text-[10px] font-bold tabular-nums text-[#7654D6] dark:text-[#B39CFF]">
                    {pad(counts[key])}
                  </sup>
                  {on && (
                    <motion.span
                      layoutId="activeFilterLine"
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B39CFF]"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ───────────── Gallery ───────────── */}
      {list.length === 0 ? (
        <Container>
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
        </Container>
      ) : usePinnedDesktop ? (
        <Gallery key={`${filter}-d`} list={list} reduced={reduced} desktop onOpen={openCase} />
      ) : (
        <Container>
          <Gallery
            key={`${filter}-${desktop ? "s" : "m"}`}
            list={list}
            reduced={reduced}
            desktop={desktop}
            onOpen={openCase}
          />
        </Container>
      )}

      {/* ───────────── Marquee ───────────── */}
      <div className="mt-16 sm:mt-24">
        <BigMarquee words={MARQUEE_WORDS} />
      </div>

      {/* ───────────── Archive ───────────── */}
      {list.length > 0 && (
        <Container>
          <div className="pb-16 pt-16 sm:pb-20 sm:pt-24">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-sans text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl">
                Full{" "}
                <span className="font-serif font-normal italic text-[#7654D6] dark:text-[#B39CFF]">
                  Archive
                </span>
              </h3>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                {desktop ? "Hover to preview • Click to open" : "Tap to open"}
              </span>
            </div>
            <Archive list={list} desktop={desktop} reduced={reduced} onOpen={openCase} />

            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 font-mono text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B39CFF]" />
                <span>Ayush Singh — Portfolio Edition 2026</span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/canva-gallery"
                  onClick={() => playClick()}
                  className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors duration-200 hover:text-[#7654D6] hover:underline dark:hover:text-[#B39CFF]"
                >
                  <span>Canva Exhibition Gallery</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#7654D6] dark:text-[#B39CFF]" />
                </Link>
                <span className="text-[var(--line)]">|</span>
                <Link
                  to="/resume"
                  onClick={() => playClick()}
                  className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors duration-200 hover:text-[#7654D6] hover:underline dark:hover:text-[#B39CFF]"
                >
                  <span>Verified Résumé</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#7654D6] dark:text-[#B39CFF]" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      )}

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

