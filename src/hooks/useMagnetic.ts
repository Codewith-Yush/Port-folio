import { useRef } from "react";
import { gsap } from "gsap";

/**
 * Reusable magnetic hover physics hook matching Projects.tsx.
 * Pulls elements smoothly toward the pointer using GSAP power2 easing,
 * and springs back gently with elastic physics on mouse leave.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22, disabled = false) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  };

  return { ref, onMouseMove, onMouseLeave };
}
