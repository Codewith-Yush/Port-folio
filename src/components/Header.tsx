import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navItems } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cn } from "../utils/cn";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { playClick } from "../utils/soundEffects";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const headerRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const hrefs = useMemo(() => navItems.map((item) => item.href), []);
  const activeHref = useActiveSection(hrefs);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

  // Clear optimistic active href when active section is updated by scroll
  useEffect(() => {
    setOptimisticHref(null);
  }, [activeHref]);

  const effectiveActiveHref = optimisticHref ?? activeHref;

  const navLinkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const navIndicatorRef = useRef<HTMLDivElement | null>(null);

  // GSAP Sliding Pill Indicator for Desktop Navbar Dock
  useLayoutEffect(() => {
    const targetHref =
      location.pathname !== "/"
        ? location.pathname
        : (effectiveActiveHref || "");
    const activeEl = targetHref ? navLinkRefs.current.get(targetHref) : undefined;
    const indicatorEl = navIndicatorRef.current;

    if (!indicatorEl) return;
    if (!activeEl) {
      gsap.to(indicatorEl, { opacity: 0, duration: 0.25 });
      return;
    }

    const x = activeEl.offsetLeft;
    const width = activeEl.offsetWidth;

    if (reducedMotion) {
      gsap.set(indicatorEl, { x, width, opacity: 1 });
    } else {
      gsap.to(indicatorEl, {
        x,
        width,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    const handleResize = () => {
      const currentTarget =
        location.pathname !== "/"
          ? location.pathname
          : (effectiveActiveHref || "");
      const el = currentTarget ? navLinkRefs.current.get(currentTarget) : undefined;
      if (el && indicatorEl) {
        gsap.set(indicatorEl, { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
      }
    };

    window.addEventListener("resize", handleResize);
    document.fonts?.ready?.then(handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [effectiveActiveHref, location.pathname, reducedMotion]);

  const closeMenu = () => setOpen(false);

  // Smooth scroll click handler for navbar links
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    playClick();
    closeMenu();

    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    // If navigating to hash anchor from another route, navigate to "/#target"
    if (location.pathname !== "/") {
      navigate("/" + (href === "#hero" ? "" : href));
      return;
    }

    const locomotiveScroll = window.__locomotiveScroll;

    if (href === "#hero" || href === "#") {
      setOptimisticHref("");
      if (locomotiveScroll) {
        locomotiveScroll.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      window.history.pushState(null, "", "#hero");
      return;
    }

    setOptimisticHref(href);

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    if (locomotiveScroll) {
      locomotiveScroll.scrollTo(target, {
        offset: -80,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - headerOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    window.history.pushState(null, "", href);
  };

  // Scroll handler with throttle
  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => {
      const scrolled = window.scrollY > 30;
      setIsScrolled(scrolled);
    };

    updateScrolled();

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateScrolled();
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
        { y: -70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      const items = desktopNavRef.current?.querySelectorAll("[data-nav-item]");
      if (items) {
        gsap.fromTo(
          items,
          { y: -15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }

      if (progressBarRef.current) {
        ScrollTrigger.create({
          start: "top top",
          end: "max",
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, {
                scaleX: self.progress,
                force3D: true,
              });
            }
          },
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mobile menu animation
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    if (reducedMotion) {
      panel.style.display = open ? "block" : "none";
      panel.style.opacity = open ? "1" : "0";
      return;
    }

    const links = panel.querySelectorAll("[data-mobile-link]");
    const bottomContent = panel.querySelector("[data-mobile-bottom]");

    gsap.killTweensOf([panel, ...links, bottomContent].filter(Boolean));

    if (open) {
      document.body.style.overflow = "hidden";
      panel.style.display = "block";
      panel.style.pointerEvents = "auto";

      gsap.fromTo(
        panel,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );

      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.08,
        }
      );

      if (bottomContent) {
        gsap.fromTo(
          bottomContent,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", delay: 0.25 }
        );
      }
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          panel.style.display = "none";
          panel.style.pointerEvents = "none";
        },
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, reducedMotion]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[var(--page)]/90 backdrop-blur-2xl border-b border-[var(--line)] shadow-[0_4px_25px_rgba(0,0,0,0.15)] py-2.5 sm:py-3"
          : "bg-[var(--page)]/60 backdrop-blur-md border-b border-transparent py-3.5 sm:py-4"
      )}
    >
      {/* GSAP Scroll Progress Indicator */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-[#C7ED70] origin-left scale-x-0 z-50 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      />
      <Container className="flex items-center justify-between gap-4">
        {/* Brand Logo with Electric Status Beacon */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="group flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--ink)] transition-all duration-300 hover:opacity-80"
          aria-label="Ayush Singh Portfolio Home"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#C7ED70] shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="font-display font-extrabold tracking-wider">Ayush Singh</span>
        </a>

        {/* Floating Island Dock Navbar (Desktop) */}
        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-1 rounded-full p-1.5 transition-all duration-300 md:flex relative bg-[var(--surface)]/90 border border-[var(--line)] backdrop-blur-2xl shadow-sm hover:shadow-md"
        >
          {/* GSAP Sliding Pill Indicator */}
          <div
            ref={navIndicatorRef}
            aria-hidden="true"
            className="absolute inset-y-1.5 left-0 rounded-full shadow-md pointer-events-none transition-colors duration-300 bg-[var(--ink)]"
            style={{ opacity: 0 }}
          />

          {navItems.map((item) => {
            const isRouterLink = item.href.startsWith("/");
            const isActive = isRouterLink
              ? location.pathname === item.href
              : effectiveActiveHref === item.href;

            if (isRouterLink) {
              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    if (el) navLinkRefs.current.set(item.href, el as unknown as HTMLAnchorElement);
                  }}
                  to={item.href}
                  onClick={() => {
                    playClick();
                    closeMenu();
                  }}
                  data-nav-item="true"
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative z-10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 select-none",
                    isActive
                      ? "text-[var(--page)] font-extrabold"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <a
                key={item.href}
                ref={(el) => {
                  if (el) navLinkRefs.current.set(item.href, el);
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                data-nav-item="true"
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative z-10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 select-none",
                  isActive
                    ? "text-[var(--page)] font-extrabold"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                )}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Tools (Sound Toggle + Theme Toggle + Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SoundToggle />
          <ThemeToggle />

          {/* Mobile Hamburger Button */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => {
              playClick();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            className={cn(
              "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 md:hidden active:scale-95 border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]",
              open && "border-[var(--ink)] bg-[var(--ink)] text-[var(--page)]"
            )}
          >
            <span
              className={cn(
                "absolute h-[2px] w-4 bg-current transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "absolute h-[2px] w-4 bg-current transition-all duration-300",
                open ? "opacity-0 scale-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-[2px] w-4 bg-current transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-1.5"
              )}
            />
          </button>
        </div>
      </Container>

      {/* Mobile Slide-Over Fullscreen Menu */}
      <div
        ref={mobilePanelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className="fixed inset-x-0 top-[60px] sm:top-[64px] h-[calc(100svh-60px)] sm:h-[calc(100svh-64px)] z-50 overflow-y-auto bg-[var(--page)]/98 backdrop-blur-3xl border-b border-[var(--line)] shadow-2xl md:hidden"
        style={{ display: "none", opacity: 0 }}
      >
        <div className="flex flex-col justify-between h-full px-6 py-8">
          <nav className="flex flex-col gap-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
              Navigation Menu
            </span>
            {navItems.map((item, index) => {
              const isRouterLink = item.href.startsWith("/");
              const isActive = isRouterLink
                ? location.pathname === item.href
                : effectiveActiveHref === item.href;

              const content = (
                <>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-xs font-mono opacity-50", isActive && "opacity-90")}>
                      0{index + 1}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={cn(
                      "text-xl transition-transform duration-300 group-hover:translate-x-1",
                      isActive ? "text-emerald-400 dark:text-[#C7ED70]" : "text-emerald-500 opacity-70"
                    )}
                  >
                    →
                  </span>
                </>
              );

              const className = cn(
                "group flex items-center justify-between border px-5 py-4 font-mono text-sm font-bold uppercase tracking-[0.16em] transition-all duration-300",
                isActive
                  ? "bg-[var(--ink)] text-[var(--page)] border-[var(--ink)] shadow-lg"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
              );

              if (isRouterLink) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => {
                      playClick();
                      closeMenu();
                    }}
                    data-mobile-link="true"
                    aria-current={isActive ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  data-mobile-link="true"
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {content}
                </a>
              );
            })}
          </nav>

          {/* Bottom Mobile Quick Links */}
          <div data-mobile-bottom="true" className="pt-6 border-t border-[var(--line)] flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Status: <strong className="text-emerald-600 dark:text-[#C7ED70]">Available for Work</strong></span>
              <a href="mailto:ayushsingh7360@gmail.com" className="text-emerald-600 dark:text-[#C7ED70] font-bold hover:underline">Email Me ↗</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
