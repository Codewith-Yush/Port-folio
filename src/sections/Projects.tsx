import { useEffect, useRef, useState } from "react";
import { Container } from "../components/Container";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeading } from "../components/SectionHeading";
import { projects, type Project } from "../data/portfolio";

function ProjectDetails({ project }: { project: Project }) {
  return (
    <article className="project-detail mt-6 grid overflow-hidden border border-[var(--line)] bg-[var(--page)] lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-[280px] overflow-hidden border-b border-[var(--line)] bg-[var(--surface-strong)] lg:border-b-0 lg:border-r">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="h-full min-h-[280px] w-full object-cover"
        />
        <div className="absolute left-6 top-6 border border-white/30 bg-flame px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
          {project.year}
        </div>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
          Open project
        </p>
        <h3 className="mt-4 text-4xl font-black leading-none text-[var(--ink)] sm:text-5xl">
          {project.title}
        </h3>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-[var(--muted)]">
          {project.role}
        </p>
        <p className="mt-6 text-base leading-8 text-[var(--muted)]">
          {project.impact}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-flame dark:text-blush"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="text-3xl font-black text-flame dark:text-blush">{metric.value}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[var(--muted)]">{metric.label}</p>
            </div>
          ))}
        </div>

        <ul className="mt-6 grid gap-3">
          {project.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-sm font-bold leading-7 text-[var(--ink)]">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blush" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedProject]);

  return (
    <section
      id="work"
      className="cv-auto relative overflow-hidden bg-[var(--surface)] py-16 transition-colors duration-500 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--line)]" aria-hidden="true" />
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Projects"
            title="Bold interfaces with structure under the surface."
            copy="A selection of product surfaces, dashboard systems, and interaction-heavy frontend work."
          />
          <div className="hidden h-28 w-28 rounded-full border-[24px] border-blush lg:block" aria-hidden="true" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isActive={selectedProject?.title === project.title}
              onSelect={() => setSelectedProject(project)}
            />
          ))}
        </div>

        <div ref={detailRef}>
          {selectedProject ? (
            <ProjectDetails project={selectedProject} />
          ) : (
            <div className="mt-6 border border-dashed border-[var(--line)] bg-[var(--page)] px-5 py-5 text-sm font-bold leading-7 text-[var(--muted)]">
              Select any project card to open a polished project section with details, highlights, and visual proof.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
