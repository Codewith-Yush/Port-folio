import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { navItems } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cn } from "../utils/cn";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const headerRef = useRef<HTMLElement | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const hrefs = useMemo(() => navItems.map((item) => item.href), []);
  const activeHref = useActiveSection(hrefs);
  const onHero = !isScrolled && !open;

  const closeMenu = () => setOpen(false);

  // Scroll handler
  useEffect(() => {
    let frame = 0;
    let lastScrolled = window.scrollY > 50;
    setIsScrolled(lastScrolled);

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 50;
        if (next !== lastScrolled) {
          lastScrolled = next;
          setIsScrolled(next);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Entrance animations
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" }
      );

      const items = desktopNavRef.current?.querySelectorAll("[data-nav-item]");
      if (items) {
        gsap.fromTo(
          items,
          { y: -20, opacity: 0, rotateX: 15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "back.out(1.4)",
            delay: 0.4,
          }
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mobile menu animation
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (reducedMotion) {
      panel.style.height = open ? "auto" : "0";
      panel.style.opacity = open ? "1" : "0";
      return;
    }

    const links = panel.querySelectorAll("[data-mobile-link]");

    gsap.killTweensOf([panel, ...links]);

    if (open) {
      panel.style.pointerEvents = "auto";
      gsap.set(panel, { height: "auto" });
      const height = panel.getBoundingClientRect().height;
      gsap.set(panel, { height: 0, opacity: 0 });

      gsap.to(panel, {
        height,
        opacity: 1,
        duration: 0.55,
        ease: "power4.out",
        onComplete: () => panel.style.height = "auto",
      });

      gsap.fromTo(
        links,
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(1.2)",
          delay: 0.15,
        }
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => (panel.style.pointerEvents = "none"),
      });
    }
  }, [open, reducedMotion]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "py-3 bg-[#0a0a0f]/95 backdrop-blur-3xl border-b border-white/10 shadow-2xl shadow-black/60"
          : "py-5 bg-gradient-to-b from-black/70 via-black/40 to-transparent"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo - Gen Z Energy */}
        <a
          href="#hero"
          onClick={closeMenu}
          className={cn(
            "group flex items-center gap-2 text-3xl font-black tracking-[-0.04em] transition-all duration-300 active:scale-95",
            onHero ? "text-white" : "text-white"
          )}
          aria-label="Ayush Singh"
        >
          <span className="group-hover:text-[#ff5a3d] transition-colors duration-300">Ayush</span>
          <span className="text-[#ff5a3d] drop-shadow-[0_0_20px_#ff5a3d]">Singh</span>
          <div className="relative h-2.5 w-2.5">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#ff5a3d]/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5a3d] shadow-[0_0_18px_#ff5a3d]" />
          </div>
        </a>

        {/* Desktop Nav */}
        <nav
          ref={desktopNavRef}
          className={cn(
            "hidden items-center gap-1.5 rounded-3xl border px-2 py-1.5 backdrop-blur-3xl md:flex",
            onHero
              ? "border-white/20 bg-white/5"
              : "border-white/10 bg-zinc-950/70"
          )}
        >
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                data-nav-item="true"
                className={cn(
                  "group relative px-6 py-3 text-sm font-black uppercase tracking-[0.125em] transition-all duration-300 hover:scale-105 active:scale-95 rounded-2xl overflow-hidden",
                  isActive
                    ? "text-white"
                    : onHero
                      ? "text-white/70 hover:text-white"
                      : "text-zinc-400 hover:text-white"
                )}
              >
                {/* Background glow on hover/active */}
                <div
                  className={cn(
                    "absolute inset-0 -z-10 rounded-2xl opacity-0 transition-all duration-300 group-hover:opacity-100",
                    isActive ? "bg-gradient-to-r from-[#ff5a3d]/20 to-transparent" : "bg-white/5"
                  )}
                />

                <span className="relative z-10">{item.label}</span>

                {/* Neon underline */}
                <span
                  className={cn(
                    "absolute bottom-2 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ff5a3d] to-orange-400 transition-all duration-300",
                    isActive ? "w-8" : "w-0 group-hover:w-6"
                  )}
                />

                {/* Subtle shine effect */}
                <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700" />
              </a>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-2xl">
            <ThemeToggle />
          </div>

          {/* Hamburger - Gen Z Style */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className={cn(
              "group relative flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-2xl transition-all md:hidden hover:bg-white/10 active:scale-95",
              open && "bg-[#ff5a3d]/10 border-[#ff5a3d]/30"
            )}
          >
            <span
              className={cn(
                "h-0.5 w-6 origin-center rounded-full bg-white transition-all duration-300",
                open && "rotate-45 translate-y-[5px]"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 origin-center rounded-full bg-white transition-all duration-300",
                open && "opacity-0 scale-75"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-6 origin-center rounded-full bg-white transition-all duration-300",
                open && "-rotate-45 -translate-y-[5px]"
              )}
            />
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div
          ref={mobilePanelRef}
          className="mt-3 overflow-hidden border-y border-white/10 bg-[#0a0a0f]/95 backdrop-blur-3xl shadow-2xl"
          style={{ height: 0, opacity: 0, pointerEvents: "none" }}
        >
          <nav className="px-6 py-8">
            <div className="flex flex-col gap-3">
              {navItems.map((item, i) => {
                const isActive = activeHref === item.href;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    data-mobile-link="true"
                    className={cn(
                      "group flex items-center justify-between rounded-3xl border px-6 py-6 text-3xl font-black tracking-tight transition-all duration-300 active:scale-[0.97]",
                      isActive
                        ? "border-[#ff5a3d]/40 bg-gradient-to-r from-[#ff5a3d]/10 to-transparent text-white"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5 text-white/80 hover:text-white"
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "text-4xl text-[#ff5a3d] transition-all duration-300 group-hover:translate-x-2",
                        isActive ? "opacity-100" : "opacity-40"
                      )}
                    >
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}