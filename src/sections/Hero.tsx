import { Button } from "../components/Button";
import { AnimatedHeroName } from "../components/AnimatedHeroName";
import { Container } from "../components/Container";
import { GeometricMark } from "../components/GeometricMark";
import { useParallax } from "../hooks/useParallax";

export function Hero() {
  const offset = useParallax(0.035);

  return (
    <section id="hero" className="grain relative overflow-hidden pt-24 sm:pt-28">
      <div
        className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-blush/45 blur-3xl"
        style={{ transform: `translateY(${offset}px)` }}
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 bottom-12 h-80 w-80 bg-flame/25 blur-3xl"
        style={{ transform: `translateY(${-offset}px)` }}
        aria-hidden="true"
      />

      <Container className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:py-16">
        <div className="hero-copy relative z-10 animate-reveal">
          <p className="hero-pill mb-5 inline-flex items-center gap-3 border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
            <span className="h-2 w-2 rounded-full bg-blush" aria-hidden="true" />
            Available for selected projects
          </p>
          <AnimatedHeroName />
          <p className="mt-5 text-2xl font-black uppercase tracking-[0.18em] text-flame dark:text-blush sm:text-3xl">
            Frontend Engineer
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            I build precise, high-performance interfaces where strong visual systems meet calm, usable product thinking.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="#work">View Work</Button>
            <Button href="#contact" variant="secondary">
              Contact
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full animate-reveal [animation-delay:160ms]">
          <GeometricMark />
        </div>
      </Container>
    </section>
  );
}
