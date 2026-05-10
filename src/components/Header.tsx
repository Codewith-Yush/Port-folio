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
  const reducedMotion = usePrefersReducedMotion();
  const headerRef = useRef<HTMLElement | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  const hrefs = useMemo(() => navItems.map((item) => item.href), []);
  const activeHref = useActiveSection(hrefs);

  const closeMenu = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      );

      const desktopNav = desktopNavRef.current;
      if (desktopNav) {
        const items = Array.from(desktopNav.querySelectorAll("[data-nav-item='true']"));
        gsap.fromTo(
          items,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.08, delay: 0.2 },
        );
      }
    }, header);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (reducedMotion) {
      panel.style.height = open ? "auto" : "0px";
      panel.style.opacity = open ? "1" : "0";
      panel.style.pointerEvents = open ? "auto" : "none";
      return;
    }

    const links = Array.from(panel.querySelectorAll("[data-mobile-link='true']"));

    gsap.killTweensOf(panel);
    gsap.killTweensOf(links);

    if (open) {
      panel.style.pointerEvents = "auto";
      gsap.set(panel, { height: "auto" });
      const targetHeight = panel.getBoundingClientRect().height;
      gsap.set(panel, { height: 0, opacity: 0 });

      gsap.to(panel, {
        height: targetHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          panel.style.height = "auto";
        },
      });
      gsap.fromTo(
        links,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.08, delay: 0.1 },
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          panel.style.pointerEvents = "none";
        },
      });
    }
  }, [open, reducedMotion]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-black/5 dark:border-white/5 bg-[var(--page)]/70 backdrop-blur-2xl transition-colors duration-500"
    >
      <Container className="flex h-20 items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="group flex items-center gap-1.5 text-xl font-black tracking-tighter text-[var(--ink)] transition-transform duration-300 hover:scale-105"
          aria-label="Ayush Singh home"
        >
          <span>Ayush</span>
          <span className="text-flame dark:text-blush">Singh</span>
          <span className="h-2 w-2 rounded-full bg-flame dark:bg-blush animate-pulse" />
        </a>

        {/* Desktop Nav */}
        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-2 md:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-nav-item="true"
              aria-current={activeHref === item.href ? "page" : undefined}
              className={cn(
                "group relative isolate rounded-full px-5 py-2.5 text-sm font-semibold capitalize tracking-wide transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)]",
                activeHref === item.href
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink)] opacity-60 hover:opacity-100",
              )}
            >
              {activeHref === item.href && (
                <span className="absolute inset-0 -z-10 rounded-full bg-black/5 dark:bg-white/10" />
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full bg-black/5 dark:bg-white/10 transition-colors hover:bg-black/10 dark:hover:bg-white/20 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className={cn("h-[2px] w-5 rounded-full bg-[var(--ink)] transition-all duration-300", open && "translate-y-[7px] rotate-45")} />
            <span className={cn("h-[2px] w-5 rounded-full bg-[var(--ink)] transition-all duration-300", open && "opacity-0")} />
            <span className={cn("h-[2px] w-5 rounded-full bg-[var(--ink)] transition-all duration-300", open && "-translate-y-[7px] -rotate-45")} />
          </button>
        </div>
      </Container>

      {/* Mobile Nav Panel */}
      <div className="md:hidden">
        <div
          ref={mobilePanelRef}
          className="overflow-hidden border-t border-black/5 dark:border-white/5 bg-[var(--page)]/95 backdrop-blur-3xl"
          style={{ height: 0, opacity: 0, pointerEvents: "none" }}
        >
          <nav className="min-h-0 px-6 pb-8 pt-4" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                data-mobile-link="true"
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-4 py-4 text-2xl font-black tracking-tight transition-all duration-300",
                  activeHref === item.href 
                    ? "text-[var(--ink)] bg-black/5 dark:bg-white/10" 
                    : "text-[var(--ink)] opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "transition-all duration-300 text-flame dark:text-blush",
                    activeHref === item.href ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  →
                </span>
              </a>
            ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
