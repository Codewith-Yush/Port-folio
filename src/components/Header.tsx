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
        { y: -22, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" },
      );

      const desktopNav = desktopNavRef.current;
      if (desktopNav) {
        const items = Array.from(desktopNav.querySelectorAll("[data-nav-item='true']"));
        gsap.fromTo(
          items,
          { y: -8, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.06, delay: 0.1 },
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
        duration: 0.42,
        ease: "power3.out",
        onComplete: () => {
          panel.style.height = "auto";
        },
      });
      gsap.fromTo(
        links,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.05, delay: 0.06 },
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.28,
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
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--page)]/90 backdrop-blur-xl transition-colors duration-500"
    >
      <Container className="flex h-20 items-center justify-between">
        <a
          href="#hero"
          onClick={closeMenu}
          className="group flex items-center gap-3 text-sm font-black uppercase tracking-[0.22em] text-[var(--ink)]"
          aria-label="Ayush Singh home"
        >
          <span className="grid h-10 w-10 place-items-center bg-flame text-white transition duration-300 group-hover:rotate-6">
            AS
          </span>
          <span className="hidden sm:block">Ayush Singh</span>
        </a>

        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 p-1 md:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-nav-item="true"
              aria-current={activeHref === item.href ? "page" : undefined}
              className={cn(
                "group relative isolate rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)]",
                activeHref === item.href
                  ? "bg-[var(--page)] text-flame shadow-shape dark:shadow-shape-dark"
                  : "text-[var(--muted)] hover:text-flame",
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-4 bottom-2 h-px origin-left bg-gradient-to-r from-flame via-ember to-blush transition-transform duration-300",
                  activeHref === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-[var(--line)] bg-[var(--surface)] md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span className={cn("h-0.5 bg-flame transition", open && "translate-y-[7px] rotate-45")} />
              <span className={cn("h-0.5 bg-flame transition", open && "opacity-0")} />
              <span className={cn("h-0.5 bg-flame transition", open && "-translate-y-[7px] -rotate-45")} />
            </span>
          </button>
        </div>
      </Container>

      <div
        className="md:hidden"
      >
        <div
          ref={mobilePanelRef}
          className="overflow-hidden border-t border-[var(--line)] bg-[var(--page)]"
          style={{ height: 0, opacity: 0, pointerEvents: "none" }}
        >
          <nav className="min-h-0 px-5" aria-label="Mobile navigation">
            <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                data-mobile-link="true"
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-[var(--line)] py-4 text-sm font-black uppercase tracking-[0.18em] text-[var(--ink)]",
                  activeHref === item.href && "text-flame dark:text-blush",
                )}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-xs font-black tracking-[0.2em] transition",
                    activeHref === item.href ? "opacity-100" : "opacity-50",
                  )}
                >
                  ↗
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
