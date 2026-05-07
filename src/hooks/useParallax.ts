import { useCallback, useEffect, useRef } from "react";

export function useParallax(strength = 0.04) {
  const elements = useRef(new Map<HTMLElement, number>());

  const register = useCallback(
    (multiplier = 1) =>
      (node: HTMLElement | null) => {
        if (!node) {
          return;
        }

        elements.current.set(node, multiplier);
      },
    [],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY * strength;
      for (const [node, multiplier] of elements.current) {
        node.style.transform = `translate3d(0, ${y * multiplier}px, 0)`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [strength]);

  return register;
}
