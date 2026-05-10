import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger);

export function BentoGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".bento-card");
      if (!cards) return;

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Mouse tracking glow effect
      const handleMouseMove = (e: MouseEvent) => {
        cards.forEach((card) => {
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
          (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
        });
      };

      const gridElement = gridRef.current;
      if (gridElement) {
        gridElement.addEventListener("mousemove", handleMouseMove as any);
      }

      return () => {
        if (gridElement) {
          gridElement.removeEventListener("mousemove", handleMouseMove as any);
        }
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="bento" ref={containerRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-flame/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-blush/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Container>
        <div className="mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[var(--ink)]">
            Everything in its{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame to-blush">
              right place.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-medium text-[var(--ink)] opacity-70">
            A deeper dive into my tools, statistics, and what I'm actively building right now.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[240px]"
        >
          {/* 1. About Me (Span 2 cols, 1 row) */}
          <div className="bento-card group col-span-1 md:col-span-2 row-span-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-[var(--ink)]">About Me</h3>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-[var(--ink)] opacity-70 font-medium leading-relaxed">
              I am an obsessive builder who loves bridging the gap between cutting-edge AI and seamless frontend experiences. Clean code is my love language.
            </p>
          </div>

          {/* 2. Featured Project (Span 2 cols, 2 rows) Spotlight */}
          <div className="bento-card group col-span-1 md:col-span-2 lg:col-span-2 row-span-2 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start z-10 relative">
              <span className="px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] bg-flame text-white rounded-full shadow-lg shadow-flame/30">
                Featured Spotlight
              </span>
              <a href="#work" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-flame transition-colors hover:text-white cursor-pointer group-hover:rotate-12">
                ↗
              </a>
            </div>
            
            <div className="mt-8 z-10 relative flex-1">
              <h3 className="text-3xl md:text-4xl font-black text-[var(--ink)] mb-3 group-hover:text-flame transition-colors duration-300">
                AI Content Engine
              </h3>
              <p className="text-[var(--ink)] opacity-70 font-medium max-w-sm mb-6">
                A highly scalable full-stack application leveraging LLMs to instantly generate, format, and deploy marketing copy.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Next.js 14", "OpenAI", "Tailwind", "Framer Motion"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-semibold border border-black/10 dark:border-white/10 rounded-full bg-[var(--page)]/80 backdrop-blur-md text-[var(--ink)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Image/Video Parallax Preview */}
            <div className="absolute -bottom-16 -right-16 w-[80%] h-[75%] rounded-tl-3xl shadow-2xl bg-gradient-to-br from-[var(--ink)] to-black/80 transform group-hover:-translate-y-6 group-hover:-translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 flex flex-col overflow-hidden">
              <div className="w-full h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-1.5 backdrop-blur-md">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gradient-to-b from-white/5 to-transparent relative p-4">
                 {/* Faux Code blocks */}
                 <div className="w-3/4 h-4 rounded bg-white/10 mb-3" />
                 <div className="w-1/2 h-4 rounded bg-white/10 mb-3" />
                 <div className="w-5/6 h-4 rounded bg-flame/40 mb-3" />
                 <div className="w-1/3 h-4 rounded bg-white/10" />
              </div>
            </div>
          </div>

          {/* 3. Tech Stack (1 col, 2 rows) */}
          <div className="bento-card group col-span-1 row-span-2 flex flex-col">
            <h3 className="text-xl font-black text-[var(--ink)] mb-6">Tech Arsenal</h3>
            <div className="flex-1 flex flex-wrap content-start gap-2">
              {[
                "React",
                "TypeScript",
                "Tailwind",
                "Next.js",
                "Node",
                "Python",
                "Framer Motion",
                "GSAP",
                "PostgreSQL",
                "Figma",
              ].map((t, i) => (
                <span
                  key={t}
                  className="px-3 py-1.5 text-sm font-semibold border border-black/10 dark:border-white/10 rounded-xl bg-[var(--page)] hover:bg-flame hover:text-white hover:border-flame transition-all duration-300 cursor-default"
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 4. GitHub Stats (1 col, 1 row) */}
          <div className="bento-card group col-span-1 row-span-1 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 bg-[var(--page)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[var(--ink)] group-hover:text-[var(--page)] transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <h4 className="text-3xl font-black text-[var(--ink)]">1.2k+</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-60 mt-1">
              Commits this year
            </p>
          </div>

          {/* 5. Experience (1 col, 1 row) */}
          <div className="bento-card group col-span-1 md:col-span-2 lg:col-span-1 row-span-1 flex flex-col justify-center">
            <h3 className="text-lg font-black text-[var(--ink)] mb-1">Freelance Dev</h3>
            <p className="text-sm font-bold text-flame mb-4">2022 - Present</p>
            <p className="text-sm font-medium text-[var(--ink)] opacity-70">
              Delivering high-performance modern web applications for global clients.
            </p>
          </div>

          {/* 6. Current Learning (1 col, 1 row) */}
          <div className="bento-card group col-span-1 row-span-1 flex flex-col justify-center border-flame/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-flame/10 to-blush/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-[var(--ink)] opacity-70 mb-4 uppercase tracking-widest">
                Currently Learning
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--page)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-black/5 dark:border-white/5">
                  🧠
                </div>
                <div className="font-black text-lg text-[var(--ink)] leading-tight">
                  Advanced Machine Learning
                </div>
              </div>
            </div>
          </div>

          {/* 7. Coding Hours (1 col, 1 row) */}
          <div className="bento-card group col-span-1 row-span-1 flex flex-col justify-between overflow-hidden relative">
            <h3 className="text-lg font-black text-[var(--ink)] relative z-10">Dedication</h3>
            <div className="relative z-10 mt-auto">
              <p className="text-4xl font-black text-[var(--ink)]">5k+</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-60 mt-1">
                Hours Coded
              </p>
            </div>
            <svg
              className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--ink)] opacity-5 group-hover:opacity-10 transition-opacity duration-300 group-hover:rotate-12 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>

          {/* 8. Fun Facts (1 col, 1 row) */}
          <div className="bento-card group col-span-1 row-span-1 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-[var(--ink)] opacity-70 uppercase tracking-widest mb-3">
              Fun Fact
            </h3>
            <p className="text-sm font-medium text-[var(--ink)] leading-relaxed italic border-l-2 border-flame pl-3">
              "I drink exactly 4 cups of coffee while debugging tricky responsive layouts."
            </p>
          </div>

          {/* 9. Currently Building (Span 2 cols, 1 row) */}
          <div className="bento-card group col-span-1 md:col-span-2 row-span-1 flex items-center justify-between overflow-hidden relative bg-[var(--ink)] text-[var(--page)] border-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mb-2">
                Currently Building
              </p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                Geometric UI Library
              </h3>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-full border border-[var(--page)]/30 flex items-center justify-center group-hover:rotate-45 group-hover:bg-[var(--page)] group-hover:text-[var(--ink)] transition-all duration-300 cursor-pointer">
              <span className="text-xl font-bold">↗</span>
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .bento-card {
          position: relative;
          border-radius: 1.5rem;
          background-color: color-mix(in srgb, var(--surface) 50%, transparent);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
          padding: 1.5rem;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.5s ease;
        }

        .dark .bento-card {
          background-color: color-mix(in srgb, var(--surface) 30%, transparent);
          border: 1px solid color-mix(in srgb, white 8%, transparent);
        }
        
        /* Subtle Mouse Glow using CSS Variables updated by JS */
        .bento-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: radial-gradient(
            600px circle at var(--mouse-x, 0) var(--mouse-y, 0), 
            color-mix(in srgb, var(--ink) 3%, transparent),
            transparent 40%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
          pointer-events: none;
        }

        .dark .bento-card::before {
           background: radial-gradient(
            600px circle at var(--mouse-x, 0) var(--mouse-y, 0), 
            color-mix(in srgb, white 5%, transparent),
            transparent 40%
          );
        }
        
        .bento-card:hover::before {
          opacity: 1;
        }

        .bento-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow: 0 20px 40px color-mix(in srgb, var(--ink) 6%, transparent);
          border-color: color-mix(in srgb, var(--ink) 15%, transparent);
        }

        .dark .bento-card:hover {
          box-shadow: 0 20px 40px color-mix(in srgb, black 50%, transparent);
          border-color: color-mix(in srgb, white 20%, transparent);
        }
      `}</style>
    </section>
  );
}
