import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "../components/Container";
import { navItems } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/codewith-Yush",
    icon: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ayush-singh-643a4b25a",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: "M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z",
  },
  {
    label: "Email",
    href: "mailto:ayushsingh7360@gmail.com",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Setup split text for the huge footer text
      const splitText = new SplitText(textRef.current, { type: "chars" });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        }
      });

      // Reset states
      gsap.set(splitText.chars, { y: 150, opacity: 0 });
      gsap.set([topBarRef.current, linksRef.current, bottomBarRef.current], { opacity: 0, y: 30 });

      // Base Animations (All Devices)
      tl.to(splitText.chars, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.04,
        ease: "expo.out"
      })
      .to(topBarRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
      .to(linksRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
      .to(bottomBarRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

      // Desktop Only: Parallax effect to save performance on mobile
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(parallaxWrapperRef.current, 
          { y: -30 },
          {
            y: 30,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      });

      // Devices with hover support: Magnetic interaction
      mm.add("(hover: hover)", () => {
        const socials = linksRef.current?.querySelectorAll(".magnetic-item");
        const navLinks = topBarRef.current?.querySelectorAll("a");
        const cleanupFns: (() => void)[] = [];

        socials?.forEach(item => {
          const icon = item.querySelector("svg");
          
          const onMouseMove = (e: any) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            gsap.to(item, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
            if(icon) gsap.to(icon, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
          };
          
          const onMouseLeave = () => {
            gsap.to(item, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            if(icon) gsap.to(icon, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
          };

          item.addEventListener("mousemove", onMouseMove);
          item.addEventListener("mouseleave", onMouseLeave);

          cleanupFns.push(() => {
            item.removeEventListener("mousemove", onMouseMove);
            item.removeEventListener("mouseleave", onMouseLeave);
          });
        });
        
        navLinks?.forEach(link => {
          const onMouseMove = (e: any) => {
            const rect = link.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            gsap.to(link, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out", opacity: 1 });
          };
          
          const onMouseLeave = () => {
            gsap.to(link, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)", opacity: 0.7 });
          };

          link.addEventListener("mousemove", onMouseMove);
          link.addEventListener("mouseleave", onMouseLeave);

          cleanupFns.push(() => {
            link.removeEventListener("mousemove", onMouseMove);
            link.removeEventListener("mouseleave", onMouseLeave);
          });
        });

        return () => cleanupFns.forEach(fn => fn());
      });

    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[var(--page)] text-[var(--ink)] pt-16 md:pt-24 pb-8 md:pb-12 overflow-hidden border-t border-black/10 dark:border-white/10">
       <Container>
         {/* Top Bar: Nav Links */}
         <div ref={topBarRef} className="flex flex-col md:flex-row justify-between md:items-center pb-8 border-b border-black/10 dark:border-white/10 mb-12 md:mb-16 gap-6">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--ink)] opacity-70">Explore</span>
            <div className="flex flex-wrap gap-x-6 gap-y-4 md:gap-x-8">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="group relative overflow-hidden text-sm font-semibold text-[var(--ink)] opacity-70 hover:opacity-100 transition-opacity inline-block">
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{item.label}</span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-[#DF6C4F]">{item.label}</span>
                </a>
              ))}
            </div>
         </div>

         {/* Huge Text */}
         <div ref={parallaxWrapperRef} className="flex justify-center items-center mb-16 md:mb-24 overflow-hidden py-4 cursor-default group">
            <h2 ref={textRef} 
                className="text-[clamp(4rem,14vw,12rem)] font-black leading-none tracking-tighter uppercase inline-block whitespace-nowrap text-transparent bg-clip-text" 
                style={{ 
                  WebkitTextStroke: "2px var(--ink)",
                  backgroundImage: "linear-gradient(to right, var(--ink) 50%, transparent 50%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "100% 0",
                  transition: "background-position 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "0 0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "100% 0"}
            >
               LET'S TALK
            </h2>
         </div>

         {/* Bottom section with Socials & Copyright */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
            <div ref={bottomBarRef} className="flex flex-col gap-2 order-2 md:order-1">
               <span className="text-sm font-semibold text-[var(--ink)] opacity-70">© {new Date().getFullYear()} Ayush Singh. All rights reserved.</span>
               <span className="text-sm text-[var(--ink)] opacity-70 flex items-center gap-1 font-medium">
                 Crafted with <span className="text-red-500 animate-pulse">♥</span>
               </span>
            </div>

            <div ref={linksRef} className="flex flex-wrap gap-4 order-1 md:order-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group magnetic-item relative overflow-hidden flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[var(--ink)] opacity-80 hover:opacity-100 transition-all duration-300 bg-transparent hover:border-[var(--ink)]"
                >
                  <span className="absolute inset-0 bg-[var(--ink)] rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 pointer-events-none transition-colors duration-500 group-hover:text-[var(--page)]">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
         </div>
       </Container>
    </footer>
  );
}