import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  Code2,
  Zap,
  LayoutGrid,
} from "lucide-react";
import { cn } from "../utils/cn";
import { projects, type Project } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ProjectCard } from "../components/ProjectCard";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger);

// Project Quick-View Modal Component
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isCanva = Boolean(project.galleryLink);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content Window */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/15 dark:border-white/15 bg-[var(--surface)] p-6 sm:p-8 md:p-10 text-[var(--ink)] shadow-2xl backdrop-blur-2xl transition-all animate-scale-up"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#252A34]/10 dark:bg-white/10 border border-[#252A34]/20 dark:border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>{isCanva ? "Design Portfolio" : "Full Stack Project"}</span>
            </span>
            <span className="text-xs font-mono text-[var(--ink)]/50">
              {project.year}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm transition-all hover:scale-110 hover:bg-[#252A34] hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Media Side */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-xl bg-black/5 dark:bg-black/40">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-4 text-center"
                >
                  <div className="text-2xl font-bold text-emerald-500">
                    {m.value}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink)]/60 mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Side */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]/75">
                {project.description}
              </p>

              {/* Role & Timeline info */}
              <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--ink)]/50 block">
                    Role
                  </span>
                  <span className="font-semibold text-[var(--ink)]">
                    {project.role}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--ink)]/50 block">
                    Timeline
                  </span>
                  <span className="font-semibold text-[var(--ink)]">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Impact Statement */}
              <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-4 text-xs leading-relaxed text-[var(--ink)]">
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Impact & Objective</span>
                </div>
                <p className="text-[var(--ink)]/80">{project.impact}</p>
              </div>

              {/* Key Features List */}
              <div className="mt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-3">
                  Key Deliverables & Architecture
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-[var(--ink)]/80"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Chips */}
              <div className="mt-5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]/50 mb-2">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-semibold text-[var(--ink)]/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-black/10 dark:border-white/10">
              {project.galleryLink ? (
                <button
                  onClick={() => {
                    onClose();
                    navigate(project.galleryLink!);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#252A34] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#252A34]/90 hover:scale-[1.02] transition-all shadow-lg"
                >
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>Open Canva Showcase ↗</span>
                </button>
              ) : project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#252A34] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#252A34]/90 hover:scale-[1.02] transition-all shadow-lg"
                >
                  <ExternalLink className="h-4 w-4 text-emerald-400" />
                  <span>Launch Live Demo ↗</span>
                </a>
              ) : null}

              <button
                onClick={onClose}
                className="px-6 py-3 border border-black/15 dark:border-white/15 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#252A34] hover:text-white hover:border-[#252A34] transition-all text-[var(--ink)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FilterCategory = "all" | "web" | "design";

export function Projects() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const [selectedModalProject, setSelectedModalProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  // Filter projects based on active category
  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "web") {
      return p.stack.some((s) => ["React", "Next.js", "Tailwind"].includes(s)) && !p.galleryLink;
    }
    if (activeFilter === "design") {
      return Boolean(p.galleryLink) || p.stack.includes("Canva") || p.stack.includes("Branding");
    }
    return true;
  });

  const featuredProject = projects[0]; // AI Creator Hub flagship

  // GSAP ScrollTrigger Entrance Animation for Cards
  useEffect(() => {
    if (reducedMotion || !cardsGridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsGridRef.current?.querySelectorAll(".project-card-item");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, activeFilter]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[var(--page)] py-12 sm:py-16 md:py-20 overflow-hidden transition-colors duration-500"
    >
      {/* Subtle Ambient Radial Backdrops */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[var(--flame)]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[var(--blush)]/10 blur-[130px] pointer-events-none" />

      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-[var(--surface)]/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--flame)] backdrop-blur-md mb-4 shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Portfolio Showcase</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--ink)] leading-[1.1]">
              Featured{" "}
              <span className="font-serif italic text-[var(--flame)] font-normal">
                Projects
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[var(--ink)]/70 max-w-xl leading-relaxed">
              Explore production web platforms, bespoke design systems, and AI-driven creative tools built with performance and clean architecture at the core.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[var(--surface)]/80 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
                activeFilter === "all"
                  ? "bg-[#252A34] text-white shadow-md font-extrabold"
                  : "text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>All ({projects.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter("web")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
                activeFilter === "web"
                  ? "bg-[#252A34] text-white shadow-md font-extrabold"
                  : "text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Web Apps (2)</span>
            </button>
            <button
              onClick={() => setActiveFilter("design")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
                activeFilter === "design"
                  ? "bg-[#252A34] text-white shadow-md font-extrabold"
                  : "text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Design & Showcase (1)</span>
            </button>
          </div>
        </div>

        {/* Flagship Spotlight Featured Project (Shown when 'all' filter is active) */}
        {activeFilter === "all" && featuredProject && (
          <div className="mb-8 sm:mb-10 rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/90 dark:bg-[#0c0c10]/90 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-all duration-700" />

            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center relative z-10">
              {/* Media Preview */}
              <div
                onClick={() => setSelectedModalProject(featuredProject)}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/10 dark:bg-black/50 cursor-pointer shadow-lg group/featuredImg"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/featuredImg:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/featuredImg:opacity-75 transition-opacity" />

                {/* Spotlight Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#252A34] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-xl">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    Spotlight Flagship
                  </span>
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="rounded-md border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-xs font-bold text-white/90 backdrop-blur-md">
                    {featuredProject.year}
                  </span>
                </div>
              </div>

              {/* Content Description */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                      Featured Project · 01
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedModalProject(featuredProject)}
                    className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] cursor-pointer hover:text-emerald-500 transition-colors"
                  >
                    {featuredProject.title}
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--ink)]/75 leading-relaxed">
                    {featuredProject.description}
                  </p>

                  {/* Impact block */}
                  <div className="mt-5 p-4 rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-xs leading-relaxed text-[var(--ink)]/85">
                    <strong className="text-emerald-500 uppercase text-[9px] tracking-wider block mb-1">
                      Key Objective & Result
                    </strong>
                    {featuredProject.impact}
                  </div>

                  {/* Tech stack */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredProject.stack.map((t) => (
                      <span
                        key={t}
                        className="px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[11px] font-semibold text-[var(--ink)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {featuredProject.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-xl sm:text-2xl font-bold text-[var(--ink)]">
                          {m.value}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-[var(--ink)]/50 font-semibold mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {featuredProject.link && (
                      <a
                        href={featuredProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#252A34] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#252A34]/90 hover:scale-105 transition-all shadow-md active:scale-95"
                      >
                        <ExternalLink className="h-4 w-4 text-emerald-400" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedModalProject(featuredProject)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-white/15 text-xs font-bold uppercase tracking-wider text-[var(--ink)] hover:bg-[#252A34] hover:text-white hover:border-[#252A34] transition-all active:scale-95"
                    >
                      <span>Deep Dive</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project, idx) => (
            <div key={project.title} className="project-card-item flex">
              <ProjectCard
                project={project}
                index={idx}
                onSelect={() => setSelectedModalProject(project)}
              />
            </div>
          ))}
        </div>
      </Container>

      {/* Case Study Modal */}
      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </section>
  );
}
