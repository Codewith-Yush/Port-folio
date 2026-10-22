import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, Mail, ExternalLink } from "lucide-react";
import { personalInfo, projects, skillGroups } from "../data/portfolio";
import { ThemeToggle } from "../components/ThemeToggle";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-emerald-500">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-emerald-500">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export default function Resume() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink)] py-8 sm:py-12 px-4 sm:px-6 font-sans transition-colors duration-500">
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .resume-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          a {
            text-decoration: none !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-8 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono text-[11px] font-semibold uppercase tracking-wider hover:border-[var(--ink)] transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 border border-[var(--ink)] bg-[var(--ink)] text-[var(--page)] font-mono text-[11px] font-semibold uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-all shadow-md active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <main className="resume-container max-w-4xl mx-auto border border-[var(--ink)] dark:border-[var(--line)] bg-[var(--surface)] p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-xl">
        {/* Header Block */}
        <header className="border-b border-[var(--line)] pb-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[var(--ink)]">
                {personalInfo.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg font-medium text-emerald-600 dark:text-emerald-400">
                {personalInfo.title}
              </p>
              <p className="text-xs text-[var(--ink)]/60 mt-1">
                {personalInfo.location} • {personalInfo.availability}
              </p>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs font-mono text-[var(--ink)]/80">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <span>{personalInfo.email}</span>
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
              >
                <GithubIcon />
                <span>github.com/codewith-Yush</span>
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
              >
                <LinkedinIcon />
                <span>linkedin.com/in/ayush-singh</span>
              </a>
            </div>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 mb-3">
            01. Professional Summary
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--ink)]/80">
            Innovative Full Stack Developer and Data Science student with proven capability in engineering
            high-performance web applications, interactive business intelligence dashboards, and modern UI systems.
            Skilled in React 19, Next.js, TypeScript, and Tailwind CSS, coupled with Python data pipelines and
            Power BI analytics. Focused on bridging analytical data architecture with cinematic, sub-second user experiences.
          </p>
        </section>

        {/* Technical Core Competencies */}
        <section className="mb-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 mb-4">
            02. Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                  {group.title}
                </h3>
                <p className="text-[10px] text-emerald-500 font-mono mb-3">{group.category}</p>
                <ul className="space-y-1.5 text-xs text-[var(--ink)]/75">
                  {group.skills.map((s) => (
                    <li key={s.name} className="flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className="text-[9px] font-mono text-[var(--ink)]/50">{s.tier}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-10">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 mb-4">
            03. Key Production Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="border-b border-black/5 dark:border-white/5 pb-6 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--ink)]">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-emerald-500">[{project.year}]</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono no-print">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-500 hover:underline"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--ink)]/60 hover:text-[var(--ink)] hover:underline"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs font-mono text-[var(--ink)]/60 mb-2">
                  Role: <span className="font-semibold text-[var(--ink)]">{project.role}</span> • Stack:{" "}
                  {project.stack.join(", ")}
                </p>

                <p className="text-xs sm:text-sm text-[var(--ink)]/80 leading-relaxed mb-3">
                  {project.description}
                </p>

                <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-[var(--ink)]/75">
                  {project.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Education & Academic Foundation */}
        <section className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 mb-4">
            04. Education & Background
          </h2>
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="text-base font-bold text-[var(--ink)]">
                Bachelor's in Data Science & Computer Applications
              </h3>
              <span className="text-xs font-mono text-[var(--ink)]/60">2023 – Present</span>
            </div>
            <p className="text-xs text-[var(--ink)]/70 leading-relaxed">
              Core Coursework: Relational Databases & SQL, Data Structures & Algorithms, Statistical Data Analysis,
              Object-Oriented Programming, Modern Web Architectures, and Applied Machine Learning.
            </p>
          </div>
        </section>

        {/* Footer Stamp */}
        <footer className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--ink)]/50 gap-2">
          <span>Ayush Singh • Portfolio CV</span>
          <span>Open for Freelance Engagements & Engineering Roles</span>
        </footer>
      </main>
    </div>
  );
}

