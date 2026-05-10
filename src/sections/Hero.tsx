import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Button } from "../components/Button";
import { Container } from "../components/Container";

gsap.registerPlugin(SplitText);

function TypewriterText({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    const timeoutId = setTimeout(() => {
      setStarted(true);
      let i = 0;
      intervalId = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(intervalId);
      }, 40); // Fast, premium typing speed
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, startDelay]);

  return (
    <span className="inline-block relative">
      <span dangerouslySetInnerHTML={{ __html: displayed.replace(/&/g, '<span class="text-flame">&</span>') }} />
      {started && <span className="absolute -right-3 top-0 h-full w-[3px] bg-flame animate-[pulse_0.8s_ease-in-out_infinite]" />}
    </span>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Cinematic Blur Reveal for Title
      const splitTitle = new SplitText(titleRef.current, { type: "chars" });
      gsap.set(splitTitle.chars, { opacity: 0, filter: "blur(20px)", scale: 1.5, y: 40 });
      gsap.set([pillRef.current, roleRef.current, descRef.current, ctaRef.current], { opacity: 0, y: 30 });
      
      tl.to(splitTitle.chars, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power3.out",
      }, 0.2)
      .to(pillRef.current, { opacity: 1, y: 0, duration: 1 }, 1.0)
      .to(roleRef.current, { opacity: 1, y: 0, duration: 1 }, 1.2)
      .to(descRef.current, { opacity: 1, y: 0, duration: 1 }, 1.4)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 1 }, 1.6);

      // 2. Interactive Mouse Glow tracking & Ambient Particles (Desktop Only for Performance)
      mm.add("(min-width: 768px)", () => {
        const handleMouseMove = (e: MouseEvent) => {
          if (!glowRef.current) return;
          const x = (e.clientX - window.innerWidth / 2) * 0.5;
          const y = (e.clientY - window.innerHeight / 2) * 0.5;
          
          gsap.to(glowRef.current, {
            x: x,
            y: y,
            duration: 1.5,
            ease: "power3.out",
          });
        };
        window.addEventListener("mousemove", handleMouseMove);

        const particles = document.querySelectorAll(".hero-particle");
        particles.forEach((p) => {
          gsap.to(p, {
            y: "random(-150, 150)",
            x: "random(-150, 150)",
            rotation: "random(-180, 180)",
            duration: "random(5, 12)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        return () => window.removeEventListener("mousemove", handleMouseMove);
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[var(--page)] pt-32 md:pt-40 pb-16">
      
      {/* Dynamic Animated Geometric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)", backgroundSize: "60px 60px", backgroundPosition: "center center" }} />
        
        {/* Mouse Reactive Glow Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[1000px]">
           <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-flame/10 to-blush/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
        </div>
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
           <div 
             key={i} 
             className={`hero-particle absolute rounded-full ${i % 3 === 0 ? 'bg-flame' : i % 3 === 1 ? 'bg-blush' : 'bg-[var(--ink)]'} opacity-20 dark:opacity-30 blur-[1px] hidden md:block`} 
             style={{ 
               width: Math.random() * 6 + 2 + 'px', 
               height: Math.random() * 6 + 2 + 'px', 
               top: Math.random() * 100 + '%', 
               left: Math.random() * 100 + '%',
               willChange: "transform"
             }} 
           />
        ))}
      </div>

      <Container className="relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Availability Badge */}
          <div ref={pillRef} className="mb-6 md:mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface)]/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--ink)]">Available for New Projects</span>
          </div>

          {/* Cinematic Name */}
          <h1 ref={titleRef} className="text-[clamp(4.5rem,12vw,14rem)] font-black tracking-tighter leading-[0.85] uppercase text-[var(--ink)]">
            Ayush <br /> <span className="text-transparent bg-clip-text bg-gradient-to-br from-flame via-flame to-blush">Singh</span>
          </h1>

          {/* Role with Typing Effect */}
          <p ref={roleRef} className="mt-8 md:mt-12 text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-[0.15em] text-[var(--ink)] opacity-90 h-10">
            <TypewriterText text="Freelancer & MSc Data Science Student" startDelay={1800} />
          </p>

          <div ref={descRef} className="mt-4 md:mt-6 max-w-2xl text-base md:text-lg lg:text-xl font-medium leading-relaxed text-[var(--ink)] opacity-90">
            Bridging the gap between cutting-edge data architecture and award-winning frontend design. I build digital experiences that perform flawlessly and look spectacular.
          </div>

          {/* CTA & Socials */}
          <div ref={ctaRef} className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center gap-6 md:gap-8">
            <Button href="#work" className="px-10 py-5 text-sm tracking-[0.2em] shadow-[0_0_40px_rgba(223,108,79,0.3)] hover:shadow-[0_0_60px_rgba(223,108,79,0.5)]">
              Explore Portfolio
            </Button>
            
            <div className="flex items-center gap-4">
              {['GitHub', 'LinkedIn', 'Twitter'].map(social => (
                 <a key={social} href="#" aria-label={social} className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-wider bg-[var(--surface)]/50 backdrop-blur-md hover:bg-[var(--ink)] hover:text-[var(--page)] hover:scale-110 transition-all duration-300">
                   {social.slice(0, 2)}
                 </a>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}