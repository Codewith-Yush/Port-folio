import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * Clean, accessible smooth scroll implementation.
 * Uses native browser scroll behavior without hijacking window.scrollTo or wheel events.
 * Debounces resize events to prevent reflow layout thrashing.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion settings for scrolling
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "smooth";
    }

    // Debounce ScrollTrigger refresh on window resize to prevent layout thrashing
    let resizeTimer: number | null = null;
    const handleRefresh = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", handleRefresh, { passive: true });

    return () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleRefresh);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
}
