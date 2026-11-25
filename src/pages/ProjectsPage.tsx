import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../sections/Footer";
import { projects, type Project } from "../data/portfolio";
import { cn } from "../utils/cn";
import { playClick, playTab } from "../utils/soundEffects";

type FilterCategory = "all" | "web" | "data" | "design";

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "web", label: "Web" },
  { key: "data", label: "Data & ML" },
  { key: "design", label: "Brand & design" },
];

const CATEGORY_LABEL: Record<Exclude<FilterCategory, "all">, string> = {
  web: "Web system",
  data: "Data & ML",
  design: "Brand identity",
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

const getCategory = (p: Project): Exclude<FilterCategory, "all"> =>
  isDesignProject(p) ? "design" : isDataProject(p) ? "data" : "web";

const matches = (p: Project, key: FilterCategory) => {
  if (key === "all") return true;
  return getCategory(p) === key;
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const counts = useMemo(
    () => ({
      all: projects.length,
      web: projects.filter((p) => matches(p, "web")).length,
      data: projects.filter((p) => matches(p, "data")).length,
      design: projects.filter((p) => matches(p, "design")).length,
    }),
    [],
  );

  const visible = useMemo(
    () => projects.filter((p) => matches(p, filter)),
    [filter],
  );

  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-[var(--page)] text-[var(--ink)] transition-colors duration-300">
      <div aria-hidden="true" className="jeppesen-grain" />
      <Header />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="px-[var(--site-margin)] pb-[var(--section-high)] pt-32 sm:pt-40"
      >
        {/* ── 1. Editorial Page Header ── */}
        <div className="grid grid-cols-12 gap-[var(--gutter)] border-b border-[var(--line)] pb-10">
          <div className="col-span-12 lg:col-span-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Featured Work
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
              Selected projects &amp; systems.
            </h1>
          </div>
          <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:items-end">
            <p className="max-w-[36ch] text-sm leading-relaxed text-[var(--muted)] sm:text-base lg:text-right">
              Full-stack web platforms, Power BI analytics pipelines, and brand design systems.
            </p>
          </div>
        </div>

        {/* ── 2. Filter Bar (4px / 2.5px jeppesen.dev shape) ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter projects"
            className="inline-flex max-w-full gap-1 overflow-x-auto rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-1"
          >
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    playTab();
                    setFilter(key);
                  }}
                  className={cn(
                    "shrink-0 rounded-[2.5px] px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--ink)] text-[var(--page)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]",
                  )}
                >
                  <span>{label}</span>
                  <span className="ml-1.5 text-xs tabular-nums opacity-65">
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            to="/about"
            onClick={() => playClick()}
            className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] px-3.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            <span>About Ayush</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── 3. Full-width 12-column Project Cards matching jeppesen.dev ── */}
        <div className="mt-10 flex flex-col gap-[var(--gutter)]">
          {visible.map((project, idx) => {
            const category = getCategory(project);
            const liveHref = project.galleryLink ?? project.link;

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors duration-300 hover:border-[var(--ink)]/30 md:p-10"
              >
                <div className="grid grid-cols-1 gap-[var(--gutter)] lg:grid-cols-12">
                  {/* Left: 3:2 Centered Mockup Frame */}
                  <button
                    type="button"
                    data-cursor="View"
                    onClick={() => {
                      playClick();
                      setSelected(project);
                    }}
                    aria-label={`Inspect ${project.title}`}
                    className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-[4px] bg-[#1e1e1e] p-5 text-left sm:p-8 lg:col-span-7"
                  >
                    <div className="flex h-full w-full flex-col overflow-hidden rounded-[4px] border border-white/10 bg-[#141414] shadow-[0_24px_50px_-16px_rgba(0,0,0,0.65)] transition-transform duration-700 ease-out group-hover:scale-[1.03]">
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
                      <div className="min-h-0 flex-1">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                    </div>
                  </button>

                  {/* Right: Project Details */}
                  <div className="flex flex-col justify-between gap-6 lg:col-span-5 lg:py-2">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                          {CATEGORY_LABEL[category]} · {project.year}
                        </span>

                        {project.galleryLink ? (
                          <Link
                            to={project.galleryLink}
                            onClick={() => playClick()}
                            className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] bg-[var(--page)] px-3.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                          >
                            <span>Gallery</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : liveHref ? (
                          <a
                            href={liveHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playClick()}
                            className="inline-flex h-[35px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] bg-[var(--page)] px-3.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                          >
                            <span>Live site</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>

                      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                        {project.title}
                      </h2>

                      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                        {project.description}
                      </p>

                      {project.metrics.length > 0 && (
                        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-5">
                          {project.metrics.slice(0, 2).map((m) => (
                            <div key={m.label}>
                              <dd className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                                {m.value}
                              </dd>
                              <dt className="mt-1 text-xs text-[var(--muted)]">{m.label}</dt>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-[2.5px] border border-[var(--line)] bg-[var(--page)] px-2.5 py-1 font-mono text-[11px] text-[var(--ink)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            setSelected(project);
                          }}
                          className="inline-flex h-[46px] items-center gap-2 rounded-[4px] bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--page)] transition-opacity hover:opacity-85"
                        >
                          <span>Read case study</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playClick()}
                            className="inline-flex h-[46px] items-center gap-1.5 rounded-[4px] border border-[var(--line)] px-4 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                          >
                            <span>GitHub</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.main>

      {/* ── Case Study Modal ── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative z-10 max-h-[88svh] w-full max-w-3xl overflow-y-auto rounded-[4px] border border-[var(--line)] bg-[var(--page)] p-6 text-[var(--ink)] shadow-2xl sm:p-10"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {selected.role} · {selected.year}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                    {selected.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close case study"
                  className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[2.5px] border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 aspect-[16/10] overflow-hidden rounded-[4px] bg-[var(--surface-strong)]">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-full w-full object-contain object-center"
                />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                {selected.impact}
              </p>

              {selected.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    Key Highlights
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {selected.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ink)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
