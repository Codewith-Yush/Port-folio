import type { Project } from "../data/portfolio";

type ProjectCardProps = {
  project: Project;
  index: number;
  isActive: boolean;
  onSelect: () => void;
};

export function ProjectCard({ project, index, isActive, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className="project-card group grid overflow-hidden border border-[var(--line)] bg-[var(--surface)] text-left transition duration-500 hover:-translate-y-2 hover:border-flame hover:shadow-shape focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] dark:hover:shadow-shape-dark"
      data-active={isActive}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--line)] bg-[var(--surface-strong)]">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="border border-[var(--line)] bg-[var(--page)] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-flame dark:text-blush"
            >
              {item}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-black leading-tight text-[var(--ink)]">
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          {project.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-flame dark:text-blush">
          View case study
          <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </button>
  );
}
