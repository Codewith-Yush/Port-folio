import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "../utils/scrollToSection";
import { useSmoothScroll, getLenis } from "../hooks/useSmoothScroll";

/**
 * Enterprise Scroll & Route Restoration Manager:
 * - Mounts and orchestrates global Lenis smooth scroll engine
 * - Restores scroll to top (0, 0) instantly on page switches with no hash
 * - Accurately navigates to section hash targets (#work, #skills, #contact, etc.)
 * - Polling with requestAnimationFrame ensures dynamic routes and lazy-loaded components
 *   stabilize their layout before scrolling
 * - Intercepts all in-page hash anchor clicks to provide seamless smooth scrolling
 * - Refreshes GSAP ScrollTrigger on every route change
 */
export function ScrollManager() {
  useSmoothScroll();
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
      getLenis()?.resize();
    }, 150);

    if (location.hash) {
      const targetId = location.hash;

      if (targetId === "#hero" || targetId === "#") {
        scrollToSection("#hero", {
          smooth: !isNewPath,
          onComplete: () => {
            if (location.pathname === "/" && window.location.hash) {
              window.history.replaceState(null, "", "/");
            }
          },
        });
        return () => clearTimeout(refreshTimer);
      }

      let cancelled = false;
      let timerId = 0;
      let lastTop = -1;
      let stableChecks = 0;
      let attempts = 0;
      const maxAttempts = 35; // ~1.4s polling window with 40ms interval

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
          if (stableChecks >= 2 || attempts > 15) {
            scrollToSection(targetId, {
              smooth: !isNewPath,
              onComplete: () => {
                if (location.pathname === "/" && window.location.hash) {
                  window.history.replaceState(null, "", "/");
                }
              },
            });
            return;
          }
        }

        if (attempts < maxAttempts) {
          timerId = window.setTimeout(checkAndScroll, 40);
        }
      };

      timerId = window.setTimeout(checkAndScroll, 40);

      return () => {
        cancelled = true;
        window.clearTimeout(timerId);
        clearTimeout(refreshTimer);
      };
    } else {
      // Navigated to a new page without a hash
      if (isNewPath) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
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
