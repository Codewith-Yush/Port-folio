import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { navItems } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { useMagnetic } from "../hooks/useMagnetic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cn } from "../utils/cn";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { playClick } from "../utils/soundEffects";
import { scrollToSection } from "../utils/scrollToSection";

/** Minimalist geometric "A" architectural monogram for Ayush */
function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={cn("fill-none stroke-current", className)} aria-hidden="true">
      <rect x="2" y="2" width="32" height="32" rx="2.5" strokeWidth="2.4" />
      <path d="M11 26L18 10L25 26" strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M13.5 21H22.5" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const talkMagnetic = useMagnetic<HTMLAnchorElement>(0.2, reducedMotion);

  const hrefs = useMemo(
    () => navItems.filter((i) => i.href.startsWith("#")).map((item) => item.href),
    [],
  );
  const activeHref = useActiveSection(hrefs);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticHref(null);
  }, [activeHref]);

  const effectiveActiveHref = optimisticHref ?? activeHref;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const closeMenu = () => setOpen(false);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    playClick();
    closeMenu();

    if (href.startsWith("/")) {
      navigate(href);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/" + (href === "#hero" ? "" : href));
      return;
    }

    setOptimisticHref(href === "#hero" || href === "#" ? "" : href);
    scrollToSection(href);
  };

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
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-[var(--site-margin)] pt-4 sm:pt-7">
        {/* Precision Scroll Progress Hairline */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 right-0 h-[2px] origin-left bg-[var(--ink)] opacity-75"
          style={{ scaleX: reducedMotion ? 1 : scaleX }}
        />

        <div className="flex items-center justify-between gap-4">
          {/* Left: Geometric Mark + Ayush (always high-contrast over both #f2ede4 and #252525) */}
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                playClick();
                scrollToSection("#hero");
              } else {
                playClick();
              }
            }}
            aria-label="Ayush Portfolio Home"
            className="pointer-events-auto group inline-flex h-[34px] items-center gap-2 rounded-[2.5px] border border-[#252525]/15 bg-[#f2ede4]/90 px-2.5 text-[#252525] shadow-sm backdrop-blur-md transition-colors duration-200 hover:border-[#252525]/40 hover:bg-[#f2ede4] sm:h-[35px] sm:px-3"
          >
            <BrandMark className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display text-[13px] font-bold uppercase tracking-[0.12em]">
              Ayush
            </span>
          </Link>

          {/* Right: Talk to Ayush + Menu (always high-contrast over both #f2ede4 and #252525) */}
          <div className="pointer-events-auto flex items-center gap-2">
            <a
              ref={talkMagnetic.ref}
              onMouseMove={talkMagnetic.onMouseMove}
              onMouseLeave={talkMagnetic.onMouseLeave}
              href="/#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex h-[34px] items-center gap-2 rounded-[2.5px] border border-[#f2ede4]/25 bg-[#252525] px-3.5 text-[13px] font-semibold text-[#f2ede4] shadow-sm transition-opacity duration-200 hover:opacity-85 will-change-transform sm:h-[35px]"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Talk to Ayush</span>
            </a>

            <button
              type="button"
              onClick={() => {
                playClick();
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-controls="site-menu-drawer"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-[34px] items-center justify-center rounded-[2.5px] border border-[#252525]/20 bg-[#f2ede4] px-3.5 text-[13px] font-semibold text-[#252525] shadow-sm transition-colors duration-200 hover:bg-[#e9e2d5] sm:h-[35px]"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Over Navigation Drawer matching jeppesen.dev */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/35 backdrop-blur-[6px]"
              aria-hidden="true"
            />

            {/* Drawer Panel: clamp(24rem, 40vw, 48rem) on desktop, 100vw on mobile */}
            <motion.aside
              id="site-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site Navigation"
              initial={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex h-full w-full flex-col justify-between border-l border-[var(--line)] bg-[var(--page)] p-[var(--site-margin)] text-[var(--ink)] shadow-2xl sm:w-[clamp(24rem,40vw,48rem)]"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    closeMenu();
                  }}
                  aria-label="Close menu"
                  className="inline-flex h-[34px] items-center gap-1.5 rounded-[2.5px] border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                >
                  <span>Close</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="my-auto flex flex-col gap-1.5 py-6" aria-label="Primary">
                {navItems.map((item, idx) => {
                  const isRouterLink = item.href.startsWith("/");
                  const isActive = isRouterLink
                    ? location.pathname === item.href
                    : location.pathname === "/" && effectiveActiveHref === item.href;

                  const inner = (
                    <>
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
                          0{idx + 1}
                        </span>
                        <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[var(--muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />
                    </>
                  );

                  const linkCls = cn(
                    "group flex items-center justify-between rounded-[4px] px-3.5 py-2.5 transition-colors duration-200",
                    isActive
                      ? "bg-[var(--surface-strong)] text-[var(--ink)]"
                      : "text-[var(--ink)] hover:bg-[var(--surface)]",
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
                        aria-current={isActive ? "page" : undefined}
                        className={linkCls}
                      >
                        {inner}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={linkCls}
                    >
                      {inner}
                    </a>
                  );
                })}
              </nav>

              {/* Drawer Footer: Theme, Sound & Contact */}
              <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    Preferences
                  </span>
                  <div className="flex items-center gap-2">
                    <SoundToggle />
                    <ThemeToggle />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
                  <span>New Delhi, India (IST)</span>
                  <a
                    href="mailto:ayushsingh7360@gmail.com"
                    className="font-semibold text-[var(--ink)] underline underline-offset-4 hover:opacity-75"
                  >
                    ayushsingh7360@gmail.com
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
