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
          ? "border-b border-white/10 bg-black/85 backdrop-blur-3xl"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <a
          href="#hero"
          onClick={closeMenu}
          className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.45em] text-white/90 transition-colors duration-300"
          aria-label="Ayush Singh"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-[#ff5a3d] shadow-[0_0_20px_rgba(255,90,61,0.28)]" />
          <span className="min-w-[90px]">Ayush Singh</span>
        </a>

        <nav ref={desktopNavRef} className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                data-nav-item="true"
                className={cn(
                  "group relative text-sm font-medium uppercase tracking-[0.4em] text-white/60 transition-colors duration-300",
                  isActive ? "text-white" : "hover:text-white/95"
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px rounded-full bg-[#ff5a3d] transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className={cn(
              "group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 md:hidden hover:border-white/25 hover:bg-white/10 active:scale-95",
              open && "border-[#ff5a3d]/30 bg-[#ff5a3d]/10"
            )}
          >
            <span
              className={cn(
                "absolute h-[1px] w-5 bg-current transition-transform duration-300",
                open ? "rotate-45" : "translate-y-[-6px]"
              )}
            />
            <span
              className={cn(
                "absolute h-[1px] w-5 bg-current transition-all duration-300",
                open ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-[1px] w-5 bg-current transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[6px]"
              )}
            />
          </button>
        </div>
      </Container>

      <div className="md:hidden">
        <div
          ref={mobilePanelRef}
          className="mt-2 overflow-hidden bg-black/90 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
          style={{ height: 0, opacity: 0, pointerEvents: "none" }}
        >
          <nav className="px-6 py-5">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    data-mobile-link="true"
                    className={cn(
                      "group rounded-3xl border border-white/10 px-5 py-4 text-base font-semibold uppercase tracking-[0.35em] text-white/80 transition-all duration-300",
                      isActive
                        ? "bg-white/10 text-white"
                        : "hover:border-white/20 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center justify-between gap-4">
                      {item.label}
                      <span className={cn("text-xl text-[#ff5a3d] transition-transform duration-300 group-hover:translate-x-1", isActive ? "opacity-100" : "opacity-50")}>→</span>
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