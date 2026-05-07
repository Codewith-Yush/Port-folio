import { Container } from "../components/Container";

const paragraphs = [
  "I am Ayush Singh, a passionate web developer and AI creator focused on building modern, responsive, and visually engaging digital experiences.",
  "My work combines frontend development, creative design, AI-powered content, and clean user interfaces to create experiences that feel modern and impactful.",
  "I believe every website should be fast, minimal, user-friendly, and designed with both creativity and functionality in mind.",
];

const stats = [
  { value: "15+", label: "Projects Completed" },
  { value: "4+", label: "Years of Learning" },
  { value: "25+", label: "Skills & Tools" },
];

const values = ["Modern UI", "Creative Design", "AI Innovation"];

export function About() {
  return (
    <section
      id="about"
      className="cv-auto about-section relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute left-0 top-16 h-40 w-20 rounded-r-full bg-flame/30 blur-sm" aria-hidden="true" />
      <div className="clip-triangle absolute bottom-10 right-4 h-28 w-28 bg-blush/35" aria-hidden="true" />

      <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="about-copy relative z-10">
          <p className="mb-4 inline-flex border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-flame dark:text-blush">
            About me
          </p>
          <h2 className="max-w-3xl text-balance text-4xl font-black leading-[0.95] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            I create modern digital experiences with creativity, technology, and purpose.
          </h2>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-flame dark:text-blush">
            Clean websites, AI-powered creativity, and user-focused design experiences.
          </p>

          <div className="mt-7 grid gap-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="about-stat group border border-[var(--line)] bg-[var(--surface)] p-5 transition duration-300 hover:-translate-y-1 hover:border-flame"
              >
                <p className="text-3xl font-black text-flame dark:text-blush">{item.value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-visual relative min-h-[430px] overflow-hidden border border-[var(--line)] bg-[var(--surface)] p-6 shadow-shape dark:shadow-shape-dark sm:min-h-[500px] sm:p-8">
          <div className="absolute inset-0 shape-grid opacity-35" aria-hidden="true" />
          <div className="about-glass absolute left-6 top-6 z-10 border border-white/25 bg-white/10 p-4 backdrop-blur-md dark:bg-black/10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
              Mindset
            </p>
            <p className="mt-2 max-w-52 text-sm font-bold leading-6 text-[var(--ink)]">
              Build modern experiences that combine creativity, performance, and meaningful design.
            </p>
          </div>

          <div className="about-shape about-shape-circle absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-blush/80" aria-hidden="true" />
          <div className="about-shape about-shape-block absolute left-[12%] top-[34%] h-36 w-36 rotate-6 bg-flame/75" aria-hidden="true" />
          <div className="about-shape about-shape-arch clip-semi absolute bottom-[10%] left-[18%] h-44 w-64 bg-ember/80" aria-hidden="true" />
          <div className="about-shape about-shape-triangle clip-triangle absolute bottom-[20%] right-[9%] h-36 w-36 bg-flame/65" aria-hidden="true" />
          <div className="about-ring absolute left-[44%] top-[43%] h-28 w-28 rounded-full border-[24px] border-white/70 dark:border-black/30" aria-hidden="true" />

          <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value} className="border border-[var(--line)] bg-[var(--page)]/85 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ink)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}