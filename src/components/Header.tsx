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

  // Scroll handler with throttle for blur/border state
  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => {
      const scrolled = window.scrollY > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
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
          ? "bg-[var(--page)]/90 backdrop-blur-2xl border-b border-[var(--line)] shadow-[0_4px_25px_rgba(0,0,0,0.15)] py-2.5 sm:py-3"
          : "bg-[var(--page)]/60 backdrop-blur-md border-b border-transparent py-3.5 sm:py-4"
      )}
    >
      {/* Minimal Brutalist Architectural Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-[var(--flame)] origin-left z-50 opacity-90"
        style={{ scaleX: reducedMotion ? 1 : scaleX }}
      />

      <Container className="flex items-center justify-between gap-4">
        {/* Brand Logo with Status Beacon & Coordinates */}
        <motion.a
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="group flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[var(--ink)] transition-opacity duration-200"
          aria-label="Ayush Singh Portfolio Home"
        >
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#C7ED70]" />
          </span>
          <span className="font-sans font-extrabold tracking-tight text-sm sm:text-base">
            Ayush Singh
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] lg:inline-block border border-[var(--line)] px-2 py-0.5 rounded-sm">
            SYS // 2026
          </span>
        </motion.a>

        {/* Minimal Brutalist Navigation Dock (Desktop) */}
        <nav
          className="hidden items-center gap-1 rounded-full p-1 transition-colors duration-200 md:flex relative bg-[var(--surface)] border border-[var(--line)]"
        >
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
                    className="absolute inset-0 rounded-full bg-[var(--ink)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </>
            );

            const linkClass = cn(
              "relative z-10 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-150 select-none",
              isActive
                ? "text-[var(--page)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
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
              "btn-neo-control group relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 md:hidden border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]",
              open && "border-[var(--ink)] bg-[var(--ink)] text-[var(--page)] dark:bg-[#C7ED70] dark:text-black dark:border-[#C7ED70]"
            )}
          >
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-transform duration-200",
                open ? "rotate-45" : "-translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-all duration-200",
                open ? "opacity-0 scale-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-4 bg-current transition-transform duration-200",
                open ? "-rotate-45" : "translate-y-1.5"
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
            className="fixed inset-x-0 top-[60px] sm:top-[64px] h-[calc(100svh-60px)] sm:h-[calc(100svh-64px)] z-50 overflow-y-auto bg-[var(--page)]/98 backdrop-blur-3xl border-b border-[var(--line)] shadow-2xl md:hidden"
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
                          "flex h-7 w-7 items-center justify-center rounded-full border border-current/25 text-xs transition-transform duration-200 group-hover:translate-x-1",
                          isActive ? "bg-[var(--flame)] text-[var(--page)] dark:bg-[#C7ED70] dark:text-black font-bold" : "text-[var(--ink)] opacity-70"
                        )}
                      >
                        ↗
                      </span>
                    </>
                  );

                  const className = cn(
                    "group flex items-center justify-between rounded-xl border px-4 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-200",
                    isActive
                      ? "bg-[var(--ink)] text-[var(--page)] border-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
                  );

                  return (
                    <motion.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
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
              <div data-mobile-bottom="true" className="pt-6 border-t border-[var(--line)] flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>Status: <strong className="text-emerald-600 dark:text-[#C7ED70]">Available for Work</strong></span>
                  <a href="mailto:ayushsingh7360@gmail.com" className="text-emerald-600 dark:text-[#C7ED70] font-bold hover:underline">Email Me ↗</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
