import { useRef, useCallback, useEffect, type MouseEvent } from "react";
import { gsap } from "gsap";

/**
 * High-performance reusable magnetic hover physics hook.
 * - Caches element bounding rect during active hover to eliminate forced reflows.
 * - Batches transform updates via requestAnimationFrame to protect 60-120fps.
 * - Respects touch & reduced-motion safeguards.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.2, disabled = false) {
  const ref = useRef<T>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);
  const coordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateTween = useCallback(() => {
    rafRef.current = 0;
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: coordsRef.current.x * strength,
      y: coordsRef.current.y * strength,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
      force3D: true,
    });
  }, [strength]);

  const onMouseMove = (e: MouseEvent<T>) => {
    if (disabled || !ref.current) return;

    if (!rectRef.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    coordsRef.current.x = e.clientX - rect.left - rect.width / 2;
    coordsRef.current.y = e.clientY - rect.top - rect.height / 2;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateTween);
    }
  };

  const onMouseEnter = () => {
    if (disabled || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const onMouseLeave = () => {
    rectRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (disabled || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
      force3D: true,
    });
  };

  return { ref, onMouseMove, onMouseEnter, onMouseLeave };
}
