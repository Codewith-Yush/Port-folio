import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

    // Use fast native momentum scroll on touch devices / mobile to eliminate any touch lag
    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    // 1. Initialize Lenis with high-performance desktop settings
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Synchronize smoothly with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    // Enable reasonable lag smoothing so CPU spikes don't cause visible jumps
    gsap.ticker.lagSmoothing(500, 33);

    // 3. Handle anchor link clicks smoothly
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = 75;

      lenis.scrollTo(target, {
        offset: -headerOffset,
        duration: 1.1,
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
            offset: -75,
            immediate: true,
          });
        }, 100);
      }
    }

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      lenis.destroy();
      document.removeEventListener("click", handleClick);
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return lenisRef.current;
}
