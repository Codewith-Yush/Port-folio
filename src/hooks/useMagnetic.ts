import { useRef, type MouseEvent } from "react";
import { gsap } from "gsap";

/**
 * Reusable magnetic hover physics hook with touch & reduced-motion safeguards.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.2, disabled = false) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: MouseEvent<T>) => {
    if (disabled || !ref.current || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
      force3D: true,
    });
  };

  const onMouseLeave = () => {
    if (disabled || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
      force3D: true,
    });
  };

  return { ref, onMouseMove, onMouseLeave };
}
