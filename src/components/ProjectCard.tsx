import React, { useRef } from "react";
import { ExternalLink, Sparkles, ArrowUpRight, Layers, Eye } from "lucide-react";
import type { Project } from "../data/portfolio";
import { cn } from "../utils/cn";

type ProjectCardProps = {
  project: Project;
  index: number;
  onSelect: () => void;
};

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const isCanva = Boolean(project.galleryLink);
  const formattedIndex = String(index + 1).padStart(2, "0");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(37, 42, 52, 0.12) 0%, transparent 70%)`;
      spotlightRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl",
        "border border-black/10 dark:border-white/10",
        "bg-[var(--surface)]/90 dark:bg-[#0c0c10]/95 backdrop-blur-xl",
        "shadow-lg hover:shadow-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 ease-out",
        "text-[var(--ink)]"
      )}
      style={{ transform: "translateZ(0)", willChange: "transform" }}
    >
      {/* Dynamic Cursor Spotlight Glow (GPU accelerated) */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-200"
      />

      {/* Top Browser / Media Preview Frame */}
      <div className="relative overflow-hidden border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/50">
        {/* macOS-style Window Chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.03] dark:bg-white/[0.03] border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[var(--ink)]/40 uppercase">
              {isCanva ? "gallery.canva" : "project.app"}
            </span>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-[var(--flame)] opacity-80">
            {formattedIndex}
          </div>
        </div>

        {/* Project Thumbnail with Zoom on Hover */}
        <div
          onClick={onSelect}
          className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer group/image"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
          aria-label={`View details for ${project.title}`}
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-75 transition-opacity duration-300" />

          {/* Floating Category/Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md">
              {isCanva ? (
                <>
                  <Sparkles className="h-3 w-3 text-[var(--flame)]" />
                  <span>Design System</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Production App</span>
                </>
              )}
            </div>
          </div>

          {/* Floating Hover Action Pill in Center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300 z-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#252A34] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-2xl transform scale-95 group-hover/image:scale-100 transition-transform">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>Quick Preview</span>
            </span>
          </div>

          {/* Year Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="rounded-md border border-white/10 bg-black/50 px-2 py-1 font-mono text-[10px] font-bold text-white/80 backdrop-blur-md">
              {project.year}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 relative z-10">
        <div>
          {/* Tech Stack Pills */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold text-[var(--ink)]/75 transition-colors group-hover:border-[#252A34]/30"
              >
                <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-80" />
                {tech}
              </span>
            ))}
          </div>

          {/* Project Title */}
          <h3
            onClick={onSelect}
            className="group/title flex items-start justify-between gap-2 text-xl sm:text-2xl font-semibold tracking-tight text-[var(--ink)] cursor-pointer transition-colors duration-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
          >
            <span>{project.title}</span>
            <ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition-all duration-300 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5" />
          </h3>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--ink)]/70 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 grid grid-cols-2 gap-3">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-2.5 transition-colors group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.04]"
            >
              <div className="text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                {metric.value}
              </div>
              <div className="text-[9px] uppercase tracking-wider font-semibold text-[var(--ink)]/50 mt-0.5 leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-3">
          {project.galleryLink ? (
            <a
              href={project.galleryLink}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#252A34] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#252A34]/90 hover:scale-[1.02] hover:shadow-md active:scale-95"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Showcase</span>
            </a>
          ) : project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#252A34] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#252A34]/90 hover:scale-[1.02] hover:shadow-md active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live Demo</span>
            </a>
          ) : null}

          <button
            type="button"
            onClick={onSelect}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-black/15 dark:border-white/15 text-xs font-bold uppercase tracking-wider text-[var(--ink)] hover:bg-[#252A34] hover:text-white hover:border-[#252A34] transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <span>Case Study</span>
          </button>
        </div>
      </div>
    </div>
  );
}