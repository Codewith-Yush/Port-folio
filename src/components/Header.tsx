import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { navItems } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cn } from "../utils/cn";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { playClick } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const hrefs = useMemo(() => navItems.map((item) => item.href), []);
  const activeHref = useActiveSection(hrefs);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

  // Clear optimistic active href when active section is updated by scroll
  useEffect(() => {
    setOptimisticHref(null);
  }, [activeHref]);

  const effectiveActiveHref = optimisticHref ?? activeHref;

  // Smooth spring scroll progress bar with Framer Motion
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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

    setOptimisticHref(href === "#hero" || href === "#" ? "" : href);
    scrollToSection(href);
  };

  // Scroll handler (rAF-throttled): blur/border state triggers promptly on scroll
  useEffect(() => {
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const scrolled = y > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    update();

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <motion.header
      initial={reducedMotion ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#F7F5F5]/85 dark:bg-[#0D0D0D]/85 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] py-2.5 sm:py-3"
          : "bg-gradient-to-b from-[#F7F5F5]/75 dark:from-black/65 via-[#F7F5F5]/25 dark:via-black/20 to-transparent py-3.5 sm:py-4",
      )}
    >
      {/* Precision Architectural Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1E90FF] via-[#B39CFF] to-[#7654D6] origin-left z-50 opacity-90 shadow-[0_0_8px_rgba(179,156,255,0.5)]"
        style={{ scaleX: reducedMotion ? 1 : scaleX }}
      />

      <Container className="flex items-center justify-between gap-4">
        {/* Brand Logo with Status Beacon & Coordinates */}
        <motion.a
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="group flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-opacity duration-200"
          aria-label="Ayush Singh Portfolio Home"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E90FF]/60 dark:bg-[#B39CFF]/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1E90FF] dark:bg-[#B39CFF]" />
          </span>
          <span className="font-sans font-extrabold tracking-tight text-sm sm:text-base text-neutral-900 dark:text-white drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-colors duration-200">
            Ayush Singh
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400 lg:inline-block bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-0.5 rounded-full backdrop-blur-sm transition-colors duration-200">
            SYS // 2026
          </span>
        </motion.a>

        {/* Modern Borderless Frosted Glass Navigation Dock (Desktop) */}
        <nav className="hidden items-center gap-1 rounded-full p-1.5 transition-all duration-300 md:flex relative bg-white/90 dark:bg-[#141416]/90 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          {navItems.map((item) => {
            const isRouterLink = item.href.startsWith("/");
            const isActive = isRouterLink
              ? location.pathname === item.href
              : effectiveActiveHref === item.href;

            const linkContent = (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navPillIndicator"
                    className="absolute inset-0 rounded-full bg-neutral-900 text-white dark:bg-[#B39CFF] dark:text-[#0D0D0D] shadow-[0_2px_8px_rgba(0,0,0,0.18)] dark:shadow-[0_0_14px_rgba(179,156,255,0.45)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </>
            );

            const linkClass = cn(
              "relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-150 select-none",
              isActive
                ? "text-white dark:text-[#0D0D0D] font-bold"
                : "text-neutral-600 hover:text-neutral-950 dark:text-white/70 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
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
                  data-nav-item="true"
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                >
                  {linkContent}
                </Link>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                data-nav-item="true"
                aria-current={isActive ? "page" : undefined}
                className={linkClass}
              >
                {linkContent}
              </a>
            );
          })}
        </nav>

        {/* Right Tools (Sound Toggle + Theme Toggle + Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SoundToggle />
          <ThemeToggle />

          {/* Mobile Hamburger Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => {
              playClick();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            className={cn(
              "group relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 md:hidden",
              "bg-white/90 dark:bg-[#141416]/90 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] text-neutral-800 dark:text-neutral-200 hover:scale-105 active:scale-95",
              open &&
                "!bg-[#1E90FF] dark:!bg-[#B39CFF] !text-white dark:!text-[#0D0D0D]",
            )}
          >
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-transform duration-200",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-all duration-200",
                open ? "opacity-0 scale-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-transform duration-200",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </motion.button>
        </div>
      </Container>

      {/* Mobile Slide-Over Fullscreen Menu with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[60px] sm:top-[64px] h-[calc(100svh-60px)] sm:h-[calc(100svh-64px)] z-50 overflow-y-auto bg-[var(--page)]/98 backdrop-blur-3xl shadow-2xl md:hidden"
          >
            <div className="flex flex-col justify-between h-full px-6 py-8">
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                  },
                }}
                className="flex flex-col gap-3"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-2">
                  [INDEX // DIRECTORY]
                </span>
                {navItems.map((item, nIdx) => {
                  const isRouterLink = item.href.startsWith("/");
                  const isActive = isRouterLink
                    ? location.pathname === item.href
                    : effectiveActiveHref === item.href;

                  const content = (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
                          0{nIdx + 1}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs transition-transform duration-200 group-hover:translate-x-1",
                          isActive
                            ? "bg-[var(--flame)] text-[var(--page)] dark:bg-[#B39CFF] dark:text-[#0D0D0D] font-bold"
                            : "text-[var(--ink)] bg-black/[0.04] dark:bg-white/[0.06]",
                        )}
                      >
                        ↗
                      </span>
                    </>
                  );

                  const className = cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.14em] transition-all duration-200 shadow-sm",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-[#1C1C20] dark:text-[#B39CFF] shadow-md"
                      : "bg-white/80 dark:bg-white/[0.04] text-neutral-800 dark:text-white hover:bg-white dark:hover:bg-white/[0.08]",
                  );

                  return (
                    <motion.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                    >
                      {isRouterLink ? (
                        <Link
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
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          data-mobile-link="true"
                          aria-current={isActive ? "page" : undefined}
                          className={className}
                        >
                          {content}
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Bottom Mobile Quick Links */}
              <div
                data-mobile-bottom="true"
                className="pt-6 border-t border-[var(--line)] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>
                    Status:{" "}
                    <strong className="text-[#1E90FF] dark:text-[#B39CFF]">
                      Available for Work
                    </strong>
                  </span>
                  <a
                    href="mailto:ayushsingh7360@gmail.com"
                    className="text-[#1E90FF] dark:text-[#B39CFF] font-bold hover:underline"
                  >
                    Email Me ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
