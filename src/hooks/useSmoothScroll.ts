import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let instanceRefCount = 0;

/**
 * Access the active global Lenis instance.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Temporarily pause smooth scroll (useful during fullscreen modals, drawers, or heavy overlays)
 */
export function stopSmoothScroll() {
  lenisInstance?.stop();
}

/**
 * Resume smooth scroll
 */
export function startSmoothScroll() {
  lenisInstance?.start();
}

/**
 * Smoothly scroll to a target element, selector, or pixel position using Lenis physics.
 * Automatically falls back to native scrolling for users with prefers-reduced-motion.
 */
export function scrollToTarget(
  target: string | number | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    onComplete?: () => void;
  }
) {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = lenisInstance;

  if (lenis && !prefersReducedMotion && !options?.immediate) {
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: () => options?.onComplete?.(),
    });
  } else {
    // Native fallback for reduced motion or when Lenis is not available
    if (typeof target === "number") {
      window.scrollTo({
        top: Math.max(0, target),
        behavior: prefersReducedMotion || options?.immediate ? "instant" : "smooth",
      });
      options?.onComplete?.();
    } else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
        window.scrollTo({
          top: Math.max(0, top),
          behavior: prefersReducedMotion || options?.immediate ? "instant" : "smooth",
        });
      }
      options?.onComplete?.();
    }
  }
}

/**
 * High-performance, luxury smooth scroll hook powered by Lenis + GSAP.
 * - Perfectly synchronized with GSAP ScrollTrigger via the GSAP Ticker.
 * - Respects prefers-reduced-motion: reduce for complete accessibility.
 * - Leaves native 120Hz mobile touch scrolling intact (syncTouch: false) to prevent touch latency.
 * - Normalizes wheel notches and trackpad momentum for a fluid, weighted feel.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    instanceRefCount++;

    // If an instance already exists, do not duplicate
    if (lenisInstance) {
      return () => {
        instanceRefCount--;
        if (instanceRefCount <= 0 && lenisInstance) {
          lenisInstance.destroy();
          lenisInstance = null;
        }
      };
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "auto";
      return () => {
        instanceRefCount--;
      };
    }

    // Initialize Lenis with optimized physics curves
    const lenis = new Lenis({
      duration: 1.05, // Silky weighted momentum without input lag
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // Responsive wheel step sensitivity
      touchMultiplier: 1.5,
      syncTouch: false, // Preserves 120Hz native touch momentum on iOS/Android
      autoResize: true,
    });

    lenisInstance = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis updates directly through GSAP's ticker to guarantee 0 dropped frames or desync
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // lagSmoothing(500, 33) cushions against momentary GC/render hiccups instead of jarringly skipping frames
    gsap.ticker.lagSmoothing(500, 33);

    // Debounce resize events to recalculate Lenis dimensions & ScrollTrigger triggers
    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      instanceRefCount--;
      if (instanceRefCount <= 0) {
        if (resizeTimer !== null) clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResize);
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        lenisInstance = null;
      }
    };
  }, []);
}
