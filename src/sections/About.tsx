import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

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
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (reducedMotion) return;
      const elements = contentRef.current?.children;
      if (elements) {
        gsap.fromTo(elements, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" }});
      }
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="about" ref={containerRef} className="relative overflow-hidden bg-[var(--page)] py-24 sm:py-32 text-black dark:text-white border-t border-black/5 dark:border-white/5 transition-colors duration-500">
      <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 dark:bg-white/5 blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-black/5 dark:bg-white/5 blur-[100px] pointer-events-none transition-colors duration-500" />
      
      <Container className="relative z-10 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div ref={contentRef} className="relative z-10">
          <div className="mb-6 inline-flex border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-black dark:text-white backdrop-blur-md rounded-full transition-colors duration-500">
            About me
          </div>
          
          <h2 className="max-w-3xl text-balance text-4xl font-light leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl drop-shadow-sm dark:drop-shadow-2xl transition-colors duration-500">
            I create modern digital experiences with <span className="font-serif italic text-black/70 dark:text-white/70">creativity</span> and purpose.
          </h2>
          
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-black/80 dark:text-white/80 transition-colors duration-500">
            Clean websites, AI-powered creativity, and user-focused design experiences.
          </p>

          <div className="mt-10 grid gap-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-base leading-relaxed text-[var(--muted)] transition-colors duration-500">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="group border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 backdrop-blur-sm transition-colors duration-500 hover:border-black/20 dark:hover:border-white/30 rounded-2xl">
                <p className="text-4xl font-light text-[var(--ink)]">{item.value}</p>
                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px] w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 p-8 backdrop-blur-sm transition-colors duration-500">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none transition-colors duration-500" />
           
           <div className="absolute left-8 top-8 z-10 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 p-5 backdrop-blur-md rounded-2xl transition-colors duration-500">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/50 dark:text-white/50">
              Mindset
            </p>
            <p className="mt-3 max-w-52 text-sm font-normal leading-relaxed text-[var(--ink)]">
              Build modern experiences that combine creativity, performance, and meaningful design.
            </p>
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-10 grid gap-3 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value} className="border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/50 px-4 py-3 backdrop-blur-md rounded-xl text-center transition-colors duration-500">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute right-[10%] top-[20%] h-32 w-32 rounded-full border border-black/20 dark:border-white/20 bg-transparent animate-[spin_10s_linear_infinite]" />
          <div className="absolute left-[20%] top-[40%] h-24 w-24 rotate-12 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-lg animate-[bounce_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[30%] right-[25%] h-40 w-40 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 blur-xl animate-[pulse_6s_ease-in-out_infinite]" />
        </div>
      </Container>
    </section>
  );
}
