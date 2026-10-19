import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const socials = [
  {
    name: "GitHub",
    url: "https://github.com/codewith-Yush",
    icon: (
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/ayush-singh-643a4b25a",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealTargets = [pillRef.current, descRef.current, ctaRef.current, scrollRef.current].filter(Boolean);

      if (reducedMotion) {
        gsap.set(".heading-line", { y: 0, opacity: 1 });
        gsap.set([contentRef.current, ...revealTargets, ...socialsRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      gsap.set(contentRef.current, { opacity: 0 });
      gsap.set(".heading-line", { y: 16, opacity: 0 });
      gsap.set(revealTargets, { opacity: 0, y: 10 });
      gsap.set(socialsRef.current, { opacity: 0, y: 8 });

      timeline
        .to(contentRef.current, { opacity: 1, duration: 0.5 })
        .to(".heading-line", { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, 0.1)
        .to(pillRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.2)
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.3)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.4)
        .to(socialsRef.current, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03 }, 0.45)
        .to(scrollRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.5);
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="font-inter relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050505] pt-14 md:pt-16 pb-16 text-white"
    >
      <style>{`
        @media (max-height: 750px) {
          .hero-scroll-indicator {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .hero-scroll-indicator {
            display: none !important;
          }
        }
      `}</style>

      {/* Video Background with Instant Poster & Seamless Playback */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#050505]" style={{ backfaceVisibility: "hidden" }}>
        {/* Instant Poster Background fallback for 0ms delay first paint */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isVideoLoaded ? "opacity-0 pointer-events-none" : "opacity-80 sm:opacity-85 md:opacity-90"
            }`}
          style={{ backgroundImage: 'url("/images/hero-poster.webp")' }}
          aria-hidden="true"
        />

        <video
          ref={videoRef}
          poster="/images/hero-poster.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          onEnded={(e) => {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => { });
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isVideoLoaded ? "opacity-80 sm:opacity-85 md:opacity-90" : "opacity-0"
            }`}
          style={{ willChange: "transform", backfaceVisibility: "hidden", transform: "translate3d(0,0,0)" }}
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Subtle Cinematic Vignette & Smooth Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </div>

      {/* Subtle Ambient Lighting Halo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/10 via-purple-500/5 to-emerald-500/10 blur-2xl pointer-events-none z-0"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-5 sm:px-6 text-center text-white pt-12 md:pt-16 pb-10"
      >
        {/* Availability Pill */}
        <div
          ref={pillRef}
          className="mb-6 md:mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 sm:px-5 py-2 backdrop-blur-md shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
            Available for Freelance & Projects
          </span>
        </div>

        {/* Hero Headline */}
        <h1
          ref={titleRef}
          className="max-w-[70rem] text-[clamp(2.25rem,6vw,5.25rem)] font-light leading-[1.08] tracking-tight text-white drop-shadow-2xl"
        >
          <span className="block overflow-hidden py-0.5 sm:py-1">
            <span className="heading-line inline-block">
              Full Stack Developer
            </span>
          </span>
          <span className="block overflow-hidden py-0.5 sm:py-1">
            <span className="heading-line inline-block font-serif italic text-white/80">
              Freelancer &
            </span>
          </span>
          <span className="block overflow-hidden py-0.5 sm:py-1">
            <span className="heading-line inline-block font-semibold bg-gradient-to-r from-white via-white/90 to-emerald-200 bg-clip-text text-transparent">
              Data Science Student
            </span>
          </span>
        </h1>

        {/* Subtitle / Bio */}
        <p
          ref={descRef}
          className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg font-normal leading-relaxed text-white/80 drop-shadow-md px-2"
        >
          I build cinematic digital experiences bridging the gap between cutting-edge data architecture, high-performance web systems, and premium frontend design.
        </p>

        {/* CTA Buttons with Magnetic Hover */}
        <div ref={ctaRef} className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto px-4">
          <a
            href="#work"
            className="group relative inline-flex h-[52px] sm:h-[56px] w-full sm:w-[210px] items-center justify-center overflow-hidden rounded-full bg-white px-8 text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>View Projects</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </a>
          <a
            href="#contact"
            className="group relative inline-flex h-[52px] sm:h-[56px] w-full sm:w-[210px] items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-8 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:border-emerald-400/80 hover:bg-white/10 hover:text-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Get In Touch</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </span>
          </a>
        </div>

        {/* Social Icons with Magnetic Hover */}
        <div className="mt-8 md:mt-12 flex items-center justify-center gap-4 sm:gap-5">
          {socials.map((social, index) => (
            <div
              key={social.name}
              ref={(el) => {
                socialsRef.current[index] = el;
              }}
            >
              <a
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.name}
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 fill-current">
                  {social.icon}
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Scroll indicator */}
      <a
        href="#work"
        ref={scrollRef}
        aria-label="Scroll down to featured projects"
        className="hero-scroll-indicator group absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors duration-300 cursor-pointer"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] transition-transform duration-300 group-hover:translate-y-0.5">
          Explore Work
        </span>
        <div className="relative h-10 w-[1px] overflow-hidden bg-white/20 group-hover:bg-emerald-400/50 transition-colors">
          <div className="absolute left-0 top-0 h-1/2 w-full animate-[bounce_2s_infinite] bg-white group-hover:bg-emerald-400" />
        </div>
      </a>
    </section>
  );
}
