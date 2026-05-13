import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        return;
      }

      let mm = gsap.matchMedia();

      // Desktop: Horizontal Scroll Cinematic Experience
      mm.add("(min-width: 1280px)", () => {
        const panels = panelsRef.current.filter(Boolean);
        if (!panels.length || !containerRef.current) return;

        // Total scrollable width
        const totalWidth = window.innerWidth * panels.length;

        // The master horizontal pinning tween
        const horizontalTween = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.15, max: 0.35 },
              delay: 0.1,
              ease: "power2.inOut"
            },
            end: () => `+=${totalWidth}`,
          },
        });

        // Sub-animations for each panel using containerAnimation
        panels.forEach((panel) => {
          if (!panel) return;
          const image = panel.querySelector(".project-image");
          const content = panel.querySelector(".project-content");
          const pills = panel.querySelectorAll(".tech-pill");

          if (image) {
            gsap.fromTo(
              image,
              { xPercent: 14, scale: 1.08 },
              {
                xPercent: -5,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }

          if (content) {
            gsap.fromTo(
              content,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left 65%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (pills && pills.length) {
            gsap.fromTo(
              pills,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "back.out(1.5)",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left 55%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });
      });

      // Mobile: Vertical scroll standard layout
      mm.add("(max-width: 1279px)", () => {
        const panels = panelsRef.current.filter(Boolean);
        panels.forEach((panel) => {
          if (!panel) return;
          const content = panel.querySelector(".project-content");
          if (content) {
            gsap.fromTo(
              content,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });
      });

    }, sectionRef);

    // Refresh ScrollTrigger when images load to ensure correct heights
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section id="work" ref={sectionRef} className="relative bg-[var(--page)] overflow-hidden xl:h-[100svh]">
      <div
        ref={containerRef}
        className="flex flex-col xl:flex-row h-full"
      >
        <style>{`
          @media (min-width: 1280px) {
            #work > div {
              width: ${(projects.length + 1) * 100}vw !important;
            }
          }
        `}</style>

        {/* Intro Panel */}
        <div
          ref={(el) => { panelsRef.current[0] = el; }}
          className="w-full xl:w-[100vw] h-[70vh] xl:h-full flex items-center justify-center border-b xl:border-b-0 xl:border-r border-black/5 dark:border-white/5 relative overflow-hidden shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-flame/5 via-transparent to-blush/5 opacity-50" />
          <div className="text-center z-10 px-6 relative xl:pt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-32 h-32 bg-flame/20 blur-[60px] rounded-full pointer-events-none" />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-flame mb-6 animate-pulse">Case Studies</p>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[var(--ink)] uppercase leading-[0.9]">
              Selected <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame to-blush">Works</span>
            </h2>
            <p className="mt-8 text-lg font-medium text-[var(--ink)] opacity-90 max-w-md mx-auto">
              A cinematic horizontal gallery exploring my latest projects, architectural deep-dives, and frontend mastery.
            </p>
            <div className="mt-12 hidden xl:flex justify-center">
              <div className="w-16 h-16 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-sm">
                <span className="text-2xl font-black text-[var(--ink)] opacity-80">→</span>
              </div>
            </div>
            <div className="mt-12 xl:hidden flex justify-center">
              <span className="text-sm font-bold uppercase tracking-widest opacity-50 animate-bounce">Scroll Down ↓</span>
            </div>
          </div>
        </div>

        {/* Project Panels */}
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => { panelsRef.current[index + 1] = el; }}
            className="w-full xl:w-[100vw] h-auto xl:h-full flex flex-col xl:flex-row items-center border-b xl:border-b-0 xl:border-r border-black/5 dark:border-white/5 relative overflow-hidden group shrink-0"
          >
            {/* Content Side */}
            <div className="project-content w-full xl:w-[45%] p-8 md:p-16 xl:px-24 xl:pb-24 xl:pt-32 flex flex-col justify-center relative z-10 bg-[var(--page)] xl:bg-transparent h-full order-2 xl:order-1 border-t xl:border-t-0 border-black/5 dark:border-white/5 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_40px_-20px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl md:text-7xl font-black text-black/30 dark:text-white/30 leading-none">0{index + 1}</span>
                <span className="px-3 py-1 bg-flame/10 text-flame text-xs font-black uppercase tracking-widest rounded-md border border-flame/20 shadow-sm">{project.year}</span>
              </div>

              <h3 className="text-3xl md:text-4xl xl:text-5xl font-black text-[var(--ink)] tracking-tighter mb-4 leading-[1.05]">
                {project.title}
              </h3>

              <p className="text-base md:text-lg font-medium text-[var(--ink)] opacity-70 mb-6 max-w-xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map(tech => (
                  <span key={tech} className="tech-pill px-4 py-2 border border-black/10 dark:border-white/10 bg-[var(--surface)]/50 backdrop-blur-md rounded-lg text-xs font-black uppercase tracking-widest text-[var(--ink)] shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-black/5 dark:border-white/5">
                {project.metrics.map(metric => (
                  <div key={metric.label}>
                    <div className="text-3xl xl:text-4xl font-black text-flame drop-shadow-sm">{metric.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-80 mt-2 leading-snug max-w-[120px]">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side (Cinematic) */}
            <div className="w-full xl:w-[55%] h-[50vh] xl:h-full relative overflow-hidden bg-black order-1 xl:order-2">
              {/* Dynamic Overlay Lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--page)] via-transparent to-transparent xl:bg-gradient-to-r xl:from-[var(--page)] xl:via-black/20 xl:to-transparent z-10 opacity-100 xl:opacity-80 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none" />

              {/* Fallback image background if src is missing/broken */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black z-0" />

              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="project-image absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
              />

              {/* Hover Interactions Button */}
              <div className="absolute inset-0 z-20 hidden xl:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 pointer-events-none">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 hover:bg-flame hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  Explore Live Project
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
