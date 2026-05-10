import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Button } from "../components/Button";
import { AnimatedHeroName } from "../components/AnimatedHeroName";
import { Container } from "../components/Container";
import { GeometricMark } from "../components/GeometricMark";
import { useParallax } from "../hooks/useParallax";

gsap.registerPlugin(SplitText);

export function Hero() {
  const parallax = useParallax(0.035);
  const heroRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });

      const splitSubtitle = new SplitText(subtitleRef.current, { type: "words,chars" });
      const splitDesc = new SplitText(descRef.current, { type: "lines" });

      // Initial States
      gsap.set([pillRef.current, btnsRef.current, visualRef.current], { opacity: 0, y: 40 });
      gsap.set(splitSubtitle.chars, { opacity: 0, y: 30, rotateX: -90 });
      gsap.set(splitDesc.lines, { opacity: 0, y: 20 });
      gsap.set([bg1Ref.current, bg2Ref.current], { scale: 0.5, opacity: 0 });

      // Entrance Sequence
      tl.to([bg1Ref.current, bg2Ref.current], {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        stagger: 0.3
      }, 0)
      .to(pillRef.current, { opacity: 1, y: 0, duration: 1 }, 0.4)
      .to(splitSubtitle.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.02,
        duration: 0.8,
      }, 0.8) // Delayed slightly to let AnimatedHeroName play out
      .to(splitDesc.lines, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8
      }, 1.2)
      .to(btnsRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.4)
      .to(visualRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }, 0.6);

      // Ambient floating for background blobs
      gsap.to(bg1Ref.current, {
        y: 40,
        x: 30,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(bg2Ref.current, {
        y: -40,
        x: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Magnetic Hover Effects for Buttons
      mm.add("(hover: hover)", () => {
        const buttons = btnsRef.current?.querySelectorAll("a");
        const cleanups: (() => void)[] = [];
        buttons?.forEach(btn => {
          const onMouseMove = (e: any) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power2.out" });
          };
          const onMouseLeave = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
          };
          btn.addEventListener("mousemove", onMouseMove);
          btn.addEventListener("mouseleave", onMouseLeave);
          cleanups.push(() => {
            btn.removeEventListener("mousemove", onMouseMove);
            btn.removeEventListener("mouseleave", onMouseLeave);
          });
        });
        return () => cleanups.forEach(fn => fn());
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="grain relative overflow-hidden pt-20 sm:pt-28 min-h-[100svh] flex items-center">
      <div ref={parallax(1)} className="absolute -right-20 top-24 h-72 w-72 will-change-transform z-0">
         <div ref={bg1Ref} className="h-full w-full rounded-full bg-blush/45 blur-3xl" aria-hidden="true" />
      </div>
      <div ref={parallax(-1)} className="absolute -left-24 bottom-12 h-80 w-80 will-change-transform z-0">
         <div ref={bg2Ref} className="h-full w-full rounded-full bg-flame/25 blur-3xl" aria-hidden="true" />
      </div>

      <Container className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:py-16 w-full z-10 relative">
        <div className="hero-copy relative z-10">
          <p ref={pillRef} className="hero-pill mb-5 inline-flex items-center gap-3 border border-black/10 dark:border-white/10 bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-flame dark:text-blush shadow-sm transition-all duration-300 hover:shadow-md hover:border-black/30 dark:hover:border-white/30 cursor-default">
            <span className="h-2 w-2 rounded-full bg-blush animate-pulse" aria-hidden="true" />
            Available for freelance projects
          </p>

          <AnimatedHeroName />

          <p ref={subtitleRef} className="mt-5 text-xl font-black uppercase tracking-[0.18em] text-flame dark:text-blush sm:text-2xl" style={{ perspective: "600px" }}>
            Web Developer • AI Creator • Power BI Enthusiast
          </p>

          <div ref={descRef} className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink)] opacity-70 sm:text-xl font-medium">
            <p>I create modern websites, AI-powered content, and clean digital experiences</p>
            <p>that combine creativity, performance, and user-focused design.</p>
          </div>

          <div ref={btnsRef} className="mt-10 flex flex-col gap-5 sm:flex-row">
            <Button href="#work">View My Work</Button>
            <Button href="#contact" variant="secondary">
              Let’s Connect
            </Button>
          </div>
        </div>

        <div ref={visualRef} className="relative mx-auto w-full group">
          <GeometricMark />
        </div>
      </Container>
    </section>
  );
}