import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Split text for dynamic reveal
      const splitHeading = new SplitText(headingRef.current, { type: "lines,words" });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Heading Stagger Reveal
      gsap.set(splitHeading.words, { y: 40, opacity: 0, rotateX: -40 });
      tl.to(splitHeading.words, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "back.out(1.2)"
      });

      // 2. Paragraphs Reveal
      const paras = textRef.current?.querySelectorAll("p");
      if (paras) {
        gsap.set(paras, { y: 20, opacity: 0 });
        tl.to(paras, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out"
        }, "-=0.5");
      }

      // 3. Stats Reveal
      const statBoxes = statsRef.current?.querySelectorAll(".about-stat");
      if (statBoxes) {
        gsap.set(statBoxes, { y: 30, opacity: 0, scale: 0.9 });
        tl.to(statBoxes, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)"
        }, "-=0.6");
      }

      // 4. Visual Box Entrance
      gsap.set(visualRef.current, { opacity: 0, x: 40, scale: 0.95 });
      tl.to(visualRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "power4.out"
      }, "-=0.8");

      // 5. Floating Shapes Reveal inside visual box
      const shapes = shapesRef.current?.querySelectorAll(".about-shape");
      if (shapes) {
        gsap.set(shapes, { scale: 0, opacity: 0, rotation: -45 });
        tl.to(shapes, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.5)"
        }, "-=0.5");
        
        // Desktop parallax for shapes
        mm.add("(min-width: 768px)", () => {
          shapes.forEach((shape, i) => {
            gsap.to(shape, {
              y: (i + 1) * -25,
              x: (i % 2 === 0 ? 1 : -1) * 15,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            });
          });
        });
      }

      // 6. Values Reveal inside visual box
      const valueTags = visualRef.current?.querySelectorAll(".value-tag");
      if (valueTags) {
        gsap.set(valueTags, { y: 20, opacity: 0 });
        tl.to(valueTags, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.6");
      }

      // Magnetic Hover Effects for Stats
      mm.add("(hover: hover)", () => {
        const cleanupFns: (() => void)[] = [];
        statBoxes?.forEach(box => {
          const onMouseMove = (e: any) => {
            const rect = box.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            gsap.to(box, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power2.out" });
          };
          const onMouseLeave = () => {
            gsap.to(box, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
          };
          box.addEventListener("mousemove", onMouseMove);
          box.addEventListener("mouseleave", onMouseLeave);
          cleanupFns.push(() => {
            box.removeEventListener("mousemove", onMouseMove);
            box.removeEventListener("mouseleave", onMouseLeave);
          });
        });
        return () => cleanupFns.forEach(fn => fn());
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="cv-auto about-section relative overflow-hidden py-12 sm:py-16"
    >
      <div className="absolute left-0 top-16 h-40 w-20 rounded-r-full bg-flame/30 blur-sm" aria-hidden="true" />
      <div className="clip-triangle absolute bottom-10 right-4 h-28 w-28 bg-blush/35" aria-hidden="true" />

      <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="about-copy relative z-10">
          <p className="mb-4 inline-flex border border-black/10 dark:border-white/10 bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-flame dark:text-blush">
            About me
          </p>
          <h2 ref={headingRef} className="max-w-3xl text-balance text-4xl font-black leading-[0.95] text-[var(--ink)] sm:text-5xl lg:text-6xl" style={{ perspective: "400px" }}>
            I create modern digital experiences with creativity, technology, and purpose.
          </h2>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-flame dark:text-blush">
            Clean websites, AI-powered creativity, and user-focused design experiences.
          </p>

          <div ref={textRef} className="mt-7 grid gap-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-base leading-8 text-[var(--ink)] opacity-70 sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div ref={statsRef} className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="about-stat group border border-black/10 dark:border-white/10 bg-[var(--surface)] p-5 transition-colors duration-300 hover:border-flame cursor-default"
              >
                <p className="text-3xl font-black text-flame dark:text-blush">{item.value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--ink)] opacity-70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div ref={visualRef} className="about-visual relative min-h-[430px] overflow-hidden border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 shadow-shape dark:shadow-shape-dark sm:min-h-[500px] sm:p-8">
          <div className="absolute inset-0 shape-grid opacity-35" aria-hidden="true" />
          
          <div className="about-glass absolute left-6 top-6 z-10 border border-white/25 bg-white/10 p-4 backdrop-blur-md dark:bg-black/10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush">
              Mindset
            </p>
            <p className="mt-2 max-w-52 text-sm font-bold leading-6 text-[var(--ink)]">
              Build modern experiences that combine creativity, performance, and meaningful design.
            </p>
          </div>

          <div ref={shapesRef}>
            <div className="about-shape about-shape-circle absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-blush/80" aria-hidden="true" />
            <div className="about-shape about-shape-block absolute left-[12%] top-[34%] h-36 w-36 rotate-6 bg-flame/75" aria-hidden="true" />
            <div className="about-shape about-shape-arch clip-semi absolute bottom-[10%] left-[18%] h-44 w-64 bg-ember/80" aria-hidden="true" />
            <div className="about-shape about-shape-triangle clip-triangle absolute bottom-[20%] right-[9%] h-36 w-36 bg-flame/65" aria-hidden="true" />
          </div>
          
          <div className="about-ring absolute left-[44%] top-[43%] h-28 w-28 rounded-full border-[24px] border-white/70 dark:border-black/30" aria-hidden="true" />

          <div className="absolute bottom-6 left-6 right-6 z-10 grid gap-3 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value} className="value-tag border border-black/10 dark:border-white/10 bg-[var(--page)]/85 px-4 py-3 backdrop-blur-sm shadow-sm transition-transform duration-300 hover:-translate-y-1 cursor-default">
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