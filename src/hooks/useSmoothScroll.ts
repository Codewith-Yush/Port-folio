import { useEffect } from "react";
// @ts-ignore
import LocomotiveScroll from "locomotive-scroll";

function getHashTarget(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href?.startsWith("#") || href === "#") {
    return null;
  }

  return document.querySelector<HTMLElement>(href);
}

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Basic fallback for users who prefer reduced motion
      const handleFallbackClick = (event: MouseEvent) => {
        const anchor = (event.target as Element | null)?.closest("a");
        if (!anchor) return;
        const target = getHashTarget(anchor);
        if (!target) return;
        event.preventDefault();
        window.history.pushState(null, "", anchor.getAttribute("href") ?? "");
        target.scrollIntoView({ behavior: "auto", block: "start" });
      };
      document.addEventListener("click", handleFallbackClick);
      return () => document.removeEventListener("click", handleFallbackClick);
    }

    // Initialize premium global smooth scrolling
    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08, // Gives that heavy, cinematic premium scroll feel
        smoothWheel: true,
        wheelMultiplier: 1,
         // Don't hijack native touch scrolling to keep mobile UX perfect
      }
    });

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");

      if (!anchor) {
        return;
      }

      const target = getHashTarget(anchor);

      if (!target) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", anchor.getAttribute("href") ?? "");
      
      // Smooth scroll to target anchor
      locomotiveScroll.scrollTo(target, { 
        duration: 1.5, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    };

    const handleHashOnLoad = () => {
      const { hash } = window.location;
      if (!hash) {
        return;
      }

      const target = document.querySelector<HTMLElement>(hash);
      if (target) {
        window.requestAnimationFrame(() => locomotiveScroll.scrollTo(target, { duration: 0 }));
      }
    };

    document.addEventListener("click", handleClick, { passive: false });
    window.addEventListener("load", handleHashOnLoad);

    return () => {
      locomotiveScroll.destroy();
      document.removeEventListener("click", handleClick);
      window.removeEventListener("load", handleHashOnLoad);
    };
  }, []);
}
