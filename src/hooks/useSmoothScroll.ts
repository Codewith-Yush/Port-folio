import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const shouldSkipSmoothScroll = prefersReducedMotion || isTouchDevice;

    if (shouldSkipSmoothScroll) {
      return;
    }

    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Synchronize with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // 3. Handle anchor link clicks
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = window.matchMedia("(max-width: 768px)").matches ? 70 : 80;

      lenis.scrollTo(target, {
        offset: -headerOffset,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleClick);

    if (window.location.hash) {
      const target = document.querySelector<HTMLElement>(window.location.hash);
      if (target) {
        setTimeout(() => {
          lenis.scrollTo(target, {
            offset: -80,
            immediate: true,
          });
        }, 100);
      }
    }

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleClick);
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return lenisRef.current;
}

