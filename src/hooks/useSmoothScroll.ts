import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/locomotive-scroll.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

import { handleScrollMovement } from "../utils/soundEffects";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __locomotiveScroll?: LocomotiveScroll;
  }
}

/**
 * Enterprise-grade smooth scroll hook powered by Locomotive Scroll v5.
 * - Perfectly synchronized with GSAP's RAF ticker to eliminate frame stutter
 * - Notifies ScrollTrigger on every tick
 * - Handles anchor link interception with smooth easing & header offset
 * - Respects prefers-reduced-motion accessibility preferences
 */
export function useSmoothScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Accessibility check: do not hijack scroll if user prefers reduced motion
    if (reducedMotion) {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "";
      };
    }

    // Initialize Locomotive Scroll v5
    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        infinite: false,
      },
      scrollCallback: (data?: { scroll?: number; velocity?: number; direction?: number }) => {
        ScrollTrigger.update();
        handleScrollMovement(
          data?.scroll ?? window.scrollY,
          data?.velocity,
          data?.direction
        );
      },
      initCustomTicker: (render) => {
        gsap.ticker.add(render);
      },
      destroyCustomTicker: (render) => {
        gsap.ticker.remove(render);
      },
    });

    scrollRef.current = locomotiveScroll;
    window.__locomotiveScroll = locomotiveScroll;

    // Refresh ScrollTrigger once Locomotive Scroll is initialized
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Global anchor link handler with Locomotive Scroll
    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = href === "#hero" ? 0 : document.querySelector<HTMLElement>(href);
      if (!target && href !== "#hero") return;

      event.preventDefault();

      locomotiveScroll.scrollTo(target as HTMLElement | number, {
        offset: -80,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleAnchorClick);

    // Handle initial hash in URL if present
    if (window.location.hash) {
      const hash = window.location.hash;
      const target = hash === "#hero" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target || hash === "#hero") {
        window.setTimeout(() => {
          locomotiveScroll.scrollTo(target as HTMLElement | number, {
            offset: -80,
            duration: 1,
          });
        }, 200);
      }
    }

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener("click", handleAnchorClick);
      locomotiveScroll.destroy();
      window.__locomotiveScroll = undefined;
      scrollRef.current = null;
    };
  }, [reducedMotion]);

  return scrollRef;
}
