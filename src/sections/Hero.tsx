import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    name: "GitHub",
    url: "#",
    icon: (
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    ),
  },
  {
    name: "LinkedIn",
    url: "#",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    name: "Twitter",
    url: "#",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealTargets = [pillRef.current, descRef.current, ctaRef.current, scrollRef.current].filter(Boolean);

      if (reducedMotion) {
        gsap.set(".heading-line", { y: "0%", opacity: 1, rotateX: 0 });
        gsap.set([contentRef.current, ...revealTargets, ...socialsRef.current], {
          opacity: 1,
          y: 0,
          clearProps: "filter,transform",
        });
        return;
      }

      const mm = gsap.matchMedia();
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.set(contentRef.current, { opacity: 0, y: 18, filter: "blur(10px)" });
      gsap.set(".heading-line", { y: "112%", opacity: 0, rotateX: -8 });
      gsap.set(revealTargets, { opacity: 0, y: 18 });
      gsap.set(socialsRef.current, { opacity: 0, y: 14 });

      gsap.fromTo(videoRef.current, { scale: 1.065 }, { scale: 1, duration: 4.5, ease: "power2.out" });

      timeline
        .to(contentRef.current, { opacity: 1, y: 0, filter: "none", duration: 1.05, force3D: true }, 0.25)
        .to(
          ".heading-line",
          {
            y: "0%",
            rotateX: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            force3D: true,
          },
          0.5,
        )
        .to(pillRef.current, { opacity: 1, y: 0, duration: 0.8, force3D: true }, 1.0)
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.8, force3D: true }, 1.18)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, force3D: true }, 1.34)
        .to(socialsRef.current, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, force3D: true }, 1.52)
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.75, force3D: true }, 1.72);

      mm.add("(min-width: 768px)", () => {
        gsap.to(videoRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(contentRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const magneticElements = document.querySelectorAll(".magnetic-wrap");
        const cleanupFns: (() => void)[] = [];

        magneticElements.forEach((elem) => {
          const target = elem as HTMLElement;
          const onMouseMove = (event: MouseEvent) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            gsap.to(target, { x: x * 0.16, y: y * 0.16, duration: 0.45, ease: "power2.out" });
          };
          const onMouseLeave = () => {
            gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
          };

          target.addEventListener("mousemove", onMouseMove);
          target.addEventListener("mouseleave", onMouseLeave);
          cleanupFns.push(() => {
            target.removeEventListener("mousemove", onMouseMove);
            target.removeEventListener("mouseleave", onMouseLeave);
          });
        });

        return () => cleanupFns.forEach((fn) => fn());
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center justify-start overflow-hidden bg-[#050816] pt-20 text-white transition-colors duration-500"
      style={{ isolation: "isolate" }}
    >
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
        <video
          ref={videoRef}
          src="/hero.mp4"
          poster="/images/hero-poster.png"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="hero-video-media absolute inset-0 h-full w-full object-cover opacity-100"
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        />
        {/* Layered Overlays for better depth and performance */}
        <div className="hero-video-scrim absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />
        <div className="hero-video-vignette absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />
        <div className="hero-edge-light absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} />
        <div className="hero-film-grain absolute inset-0 pointer-events-none" style={{ zIndex: 4 }} />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-start justify-center px-5 py-16 sm:px-8 sm:py-20 md:px-12 lg:py-24"
        style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
      >
        <div className="hero-copy-panel w-full max-w-[min(54rem,100%)]">
          <div
            ref={pillRef}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/90 sm:text-[10px]">
              Available for Freelance
            </span>
          </div>

          <h1
            ref={titleRef}
            className="max-w-[54rem] text-[clamp(2.35rem,5.2vw,4rem)] font-black uppercase leading-[0.98] tracking-normal text-white [text-shadow:0_6px_38px_rgba(0,0,0,0.55)]"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <span className="block overflow-hidden py-1.5">
              <span className="heading-line inline-block" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>Full Stack Developer,</span>
            </span>
            <span className="block overflow-hidden py-1.5">
              <span className="heading-line inline-block" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>Freelancer &</span>
            </span>
            <span className="block overflow-hidden py-1.5">
              <span className="heading-line hero-gradient-text inline-block bg-clip-text text-transparent" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
                Data Science Student
              </span>
            </span>
          </h1>

          <p
            ref={descRef}
            className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/86 [text-shadow:0_3px_18px_rgba(0,0,0,0.6)] sm:mt-7 sm:text-lg lg:text-xl"
            style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
          >
            I build cinematic digital experiences bridging the gap between cutting-edge data architecture and premium frontend
            design.
          </p>

          <div ref={ctaRef} className="mt-9 flex w-full flex-col items-stretch gap-4 sm:mt-11 sm:w-auto sm:flex-row sm:items-center">
            <div className="magnetic-wrap inline-block">
              <a
                href="#work"
                className="hero-cta hero-cta--primary group inline-flex min-h-14 w-full items-center justify-center gap-3 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] transition-all duration-300 sm:w-auto"
              >
                View Projects
                <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </a>
            </div>
            <div className="magnetic-wrap inline-block">
              <a
                href="#contact"
                className="hero-cta hero-cta--secondary group inline-flex min-h-14 w-full items-center justify-center gap-3 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] transition-all duration-300 sm:w-auto"
              >
                Contact Me
                <span aria-hidden="true" className="transition duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </a>
            </div>
          </div>

          <div className="mt-9 flex items-center gap-3 sm:mt-12">
            {socials.map((social, index) => (
              <div
                key={social.name}
                className="magnetic-wrap inline-block"
                ref={(el) => {
                  socialsRef.current[index] = el;
                }}
              >
                <a
                  href={social.url}
                  aria-label={social.name}
                  className="hero-social-link flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/78 shadow-[0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-white/18 hover:text-white sm:h-12 sm:w-12"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    {social.icon}
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="pointer-events-none absolute bottom-8 left-6 z-10 hidden items-center gap-4 text-white/42 md:left-12 md:flex"
      >
        <div className="relative h-14 w-px overflow-hidden bg-white/18">
          <div className="absolute left-0 top-0 h-1/2 w-full animate-[bounce_2s_infinite] bg-[#ff7a45]/80" />
        </div>
        <span className="origin-left translate-x-3 translate-y-6 rotate-[-90deg] text-[10px] font-bold uppercase tracking-[0.3em]">
          Scroll
        </span>
      </div>
    </section>
  );
}
