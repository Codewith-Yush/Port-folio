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
          clearProps: "transform",
        });
        return;
      }

      const mm = gsap.matchMedia();
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(contentRef.current, { opacity: 0, scale: 0.96 });
      gsap.set(".heading-line", { y: "100%", opacity: 0, rotateX: -10 });
      gsap.set(revealTargets, { opacity: 0, y: 15 });
      gsap.set(socialsRef.current, { opacity: 0, y: 10 });

      // Slow cinematic zoom out on the video
      gsap.fromTo(videoRef.current, { scale: 1.1 }, { scale: 1, duration: 6, ease: "power2.out" });

      timeline
        .to(contentRef.current, { opacity: 1, scale: 1, duration: 1.5, force3D: true }, 0.2)
        .to(
          ".heading-line",
          {
            y: "0%",
            rotateX: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            force3D: true,
          },
          0.35
        )
        .to(pillRef.current, { opacity: 1, y: 0, duration: 0.9, force3D: true }, 0.8)
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.9, force3D: true }, 1.0)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.9, force3D: true }, 1.2)
        .to(socialsRef.current, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, force3D: true }, 1.4)
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.9, force3D: true }, 1.6);

      mm.add("(min-width: 768px)", () => {
        gsap.to(videoRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(contentRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="font-inter relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050505] pt-16 text-white"
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
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        />
        {/* Cinematic Vignette & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-6 text-center text-white pt-20"
      >
        <div
          ref={pillRef}
          className="mb-8 flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
            Available for Freelance
          </span>
        </div>

        <h1
          ref={titleRef}
          className="max-w-[70rem] text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.05] tracking-tight text-white drop-shadow-2xl"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <span className="block overflow-hidden py-1">
            <span className="heading-line inline-block" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              Full Stack Developer,
            </span>
          </span>
          <span className="block overflow-hidden py-1">
            <span className="heading-line inline-block font-serif italic text-white/80" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              Freelancer &
            </span>
          </span>
          <span className="block overflow-hidden py-1">
            <span className="heading-line inline-block font-semibold" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              Data Science Student.
            </span>
          </span>
        </h1>

        <p
          ref={descRef}
          className="mt-8 max-w-2xl text-base font-normal leading-relaxed text-white/80 sm:mt-10 sm:text-lg lg:text-xl drop-shadow-lg"
        >
          I build cinematic digital experiences bridging the gap between cutting-edge data architecture and premium frontend design.
        </p>

        <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <a
            href="#work"
            className="group relative inline-flex min-h-[56px] w-[220px] items-center justify-center overflow-hidden rounded-full bg-white px-9 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          >
            <span>View Projects</span>
          </a>
          <a
            href="#contact"
            className="group relative inline-flex min-h-[56px] w-[220px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-transparent px-9 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
          >
            <span>Contact Me</span>
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-5">
          {socials.map((social, index) => (
            <div
              key={social.name}
              ref={(el) => {
                socialsRef.current[index] = el;
              }}
            >
              <a
                href={social.url}
                aria-label={social.name}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-300 hover:scale-110 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  {social.icon}
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 text-white/60"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <div className="relative h-16 w-[1px] overflow-hidden bg-white/20">
          <div className="absolute left-0 top-0 h-1/2 w-full animate-[bounce_2s_infinite] bg-white" />
        </div>
      </div>
    </section>
  );
}
