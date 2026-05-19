import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../utils/cn";
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

        const totalWidth = window.innerWidth * panels.length;

        const horizontalTween = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: true, // Optimized: removed smooth scrub delay for raw performance
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.3 },
              ease: "power2.inOut"
            },
            end: () => `+=${totalWidth}`,
          },
        });

        // Sub-animations for each panel
        panels.forEach((panel) => {
          if (!panel) return;
          const image = panel.querySelector(".project-image");
          const content = panel.querySelector(".project-content");
          const pills = panel.querySelectorAll(".tech-pill");

          if (image) {
            gsap.fromTo(
              image,
              { xPercent: 10, scale: 1.05 },
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
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left 75%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (pills && pills.length) {
            gsap.fromTo(
              pills,
              { y: 15, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left 65%",
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
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });
      });

    }, sectionRef);

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
          className="w-full xl:w-[100vw] h-[70vh] xl:h-full flex items-center justify-center border-b xl:border-b-0 xl:border-r border-black/5 dark:border-white/5 relative overflow-hidden shrink-0 bg-[var(--page)]"
        >
          <div className="text-center z-10 px-6 relative xl:pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)] opacity-50 mb-6">Case Studies</p>
            <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-light tracking-tight text-[var(--ink)] uppercase leading-[1.05]">
              <span className="block">Selected</span>
              <span className="block font-serif italic text-[var(--ink)]/70 normal-case">Works</span>
            </h2>
            <p className="mt-8 text-base font-normal text-[var(--ink)] opacity-60 max-w-md mx-auto leading-relaxed">
              A cinematic horizontal gallery exploring my latest projects, architectural deep-dives, and frontend mastery.
            </p>
            <div className="mt-16 hidden xl:flex justify-center opacity-40">
              <span className="text-sm font-semibold uppercase tracking-[0.25em]">Scroll &rarr;</span>
            </div>
            <div className="mt-12 xl:hidden flex justify-center opacity-40">
              <span className="text-xs font-semibold uppercase tracking-widest animate-bounce">&darr; Scroll Down</span>
            </div>
          </div>
        </div>

        {/* Project Panels */}
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => { panelsRef.current[index + 1] = el; }}
            className={cn(
              "w-full xl:w-[100vw] h-auto xl:h-full flex flex-col xl:flex-row items-center border-b xl:border-b-0 xl:border-r border-black/5 dark:border-white/5 relative overflow-hidden group shrink-0",
              (project.galleryLink || project.link) && "cursor-pointer"
            )}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) return;
              const href = project.galleryLink ?? project.link;
              if (!href) return;
              window.open(href, "_blank", "noopener,noreferrer");
            }}
            onKeyDown={(event) => {
              const href = project.galleryLink ?? project.link;
              if (!href) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.open(href, "_blank", "noopener,noreferrer");
              }
            }}
            role={project.galleryLink || project.link ? "button" : undefined}
            tabIndex={project.galleryLink || project.link ? 0 : undefined}
          >
            {/* Content Side */}
            <div className="project-content w-full xl:w-[40%] p-10 md:p-16 xl:px-24 flex flex-col justify-center relative z-10 bg-[var(--page)] xl:bg-[var(--page)] h-full order-2 xl:order-1 border-t xl:border-t-0 xl:border-r border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4 mb-8 opacity-40">
                <span className="text-4xl md:text-5xl font-light leading-none">0{index + 1}</span>
                <span className="text-sm font-semibold tracking-widest">{project.year}</span>
              </div>

              <h3 className="text-4xl md:text-5xl xl:text-6xl font-light text-[var(--ink)] tracking-tight mb-5 leading-[1.1]">
                {project.title}
              </h3>

              <p className="text-base md:text-lg font-normal text-[var(--ink)] opacity-60 mb-8 max-w-xl leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {project.stack.map(tech => (
                  <span key={tech} className="tech-pill px-4 py-2 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5 dark:border-white/5 opacity-80">
                {project.metrics.map(metric => (
                  <div key={metric.label}>
                    <div className="text-2xl xl:text-3xl font-medium text-[var(--ink)]">{metric.value}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-50 mt-2 max-w-[120px]">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side (Cinematic) */}
            <div className="w-full xl:w-[60%] h-[50vh] xl:h-full relative overflow-hidden bg-[#0a0a0a] order-1 xl:order-2">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="project-image absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0"
              />
              
              {/* Clean Overlay Gradient for text legibility if needed, keeping it very light */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none z-10" />

              {/* Hover Interactions Button */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-100 pointer-events-auto sm:pointer-events-none sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-500">
                {project.galleryLink ? (
                  <a
                    href={project.galleryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all duration-300"
                  >
                    View Canva Gallery
                  </a>
                ) : (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all duration-300"
                  >
                    Explore Live Project
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
