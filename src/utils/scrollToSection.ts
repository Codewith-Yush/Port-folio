import { scrollToTarget } from "../hooks/useSmoothScroll";

/**
 * Unified Smooth Scroll Helper for Antigravity Portfolio
 * 
 * Provides pixel-perfect framing across all sections (#work, #skills, #services, #contact, #hero)
 * powered by the Lenis inertial engine, allowing each section's internal padding
 * to provide the exact designed breathing distance below the sticky header.
 */
export function scrollToSection(
  rawTarget: string,
  options: {
    smooth?: boolean;
    updateHistory?: boolean;
    onComplete?: () => void;
  } = {}
) {
  const { smooth = true, updateHistory = true, onComplete } = options;

  if (typeof window === "undefined") return;

  const hash = rawTarget.startsWith("#") ? rawTarget : `#${rawTarget}`;

  if (hash === "#hero" || hash === "#" || hash === "") {
    scrollToTarget(0, {
      immediate: !smooth,
      duration: 1.2,
      onComplete: () => {
        if (updateHistory) {
          window.history.pushState(null, "", "#hero");
        }
        onComplete?.();
      },
    });
    return;
  }

  const targetId = hash;
  const element = document.querySelector<HTMLElement>(targetId);

  if (!element) return;

  scrollToTarget(element, {
    offset: 0,
    immediate: !smooth,
    duration: 1.2,
    onComplete: () => {
      if (updateHistory) {
        window.history.pushState(null, "", hash);
      }
      onComplete?.();
    },
  });
}
