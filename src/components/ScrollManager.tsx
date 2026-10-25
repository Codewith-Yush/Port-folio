import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "../utils/scrollToSection";

/**
 * Enterprise Scroll & Route Restoration Manager:
 * - Restores scroll to top (0, 0) instantly on page switches with no hash
 * - Accurately navigates to section hash targets (#work, #skills, #contact, etc.)
 * - Polling with requestAnimationFrame ensures dynamic routes and lazy-loaded components
 *   stabilize their layout before scrolling
 * - Intercepts all in-page hash anchor clicks to provide seamless smooth scrolling
 * - Refreshes GSAP ScrollTrigger on every route change
 */
export function ScrollManager() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Global anchor click listener for hash links on the current page
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLAnchorElement>("a[href]");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Handle internal section links like "#work" or "/#work"
      const isInternalHash = href.startsWith("#") || (href.startsWith("/#") && location.pathname === "/");
      if (isInternalHash) {
        const hash = href.startsWith("/#") ? href.slice(1) : href;
        if (hash === "#" || hash === "") return;

        e.preventDefault();
        scrollToSection(hash);
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [location.pathname]);

  // Route & Hash Change Handler
  useEffect(() => {
    const isNewPath = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    // Refresh ScrollTrigger instances so triggers align with the new page layout
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    if (location.hash) {
      const targetId = location.hash;

      if (targetId === "#hero" || targetId === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return () => clearTimeout(refreshTimer);
      }

      let cancelled = false;
      let animationFrameId = 0;
      let lastTop = -1;
      let stableChecks = 0;
      let attempts = 0;
      const maxAttempts = 150; // ~2.5s polling window for async hydration

      const checkAndScroll = () => {
        if (cancelled) return;
        attempts++;

        const target = document.querySelector<HTMLElement>(targetId);

        if (target) {
          const currentTop = target.getBoundingClientRect().top + window.scrollY;

          if (Math.abs(currentTop - lastTop) < 3) {
            stableChecks++;
          } else {
            stableChecks = 0;
            lastTop = currentTop;
          }

          // Once position has stabilized across consecutive checks
          if (stableChecks >= 3 || (attempts > 35 && stableChecks >= 1)) {
            window.scrollTo({
              top: Math.max(0, currentTop),
              behavior: isNewPath ? "instant" : "smooth",
            });

            // Post-scroll check for late-loading images or layout shifts
            if (isNewPath) {
              const settleTimer = window.setTimeout(() => {
                if (cancelled) return;
                const finalTarget = document.querySelector<HTMLElement>(targetId);
                if (finalTarget) {
                  const finalTop = finalTarget.getBoundingClientRect().top + window.scrollY;
                  if (Math.abs(window.scrollY - finalTop) > 6) {
                    window.scrollTo({
                      top: Math.max(0, finalTop),
                      behavior: "smooth",
                    });
                  }
                }
              }, 400);

              return () => {
                window.clearTimeout(settleTimer);
              };
            }
            return;
          }
        }

        if (attempts < maxAttempts) {
          animationFrameId = requestAnimationFrame(checkAndScroll);
        }
      };

      animationFrameId = requestAnimationFrame(checkAndScroll);

      return () => {
        cancelled = true;
        cancelAnimationFrame(animationFrameId);
        clearTimeout(refreshTimer);
      };
    } else {
      // Navigated to a new page without a hash
      if (isNewPath) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      return () => {
        clearTimeout(refreshTimer);
      };
    }
  }, [location.pathname, location.hash]);

  return null;
}

