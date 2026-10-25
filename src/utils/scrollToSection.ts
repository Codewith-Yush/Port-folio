/**
 * Unified Smooth Scroll Helper for Antigravity Portfolio
 * 
 * Provides pixel-perfect framing across all sections (#work, #skills, #contact, #hero)
 * by aligning the section container with the viewport top, allowing each section's internal padding
 * (py-16 sm:py-24 md:py-28) to provide the exact designed breathing distance below the sticky header.
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
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
    if (updateHistory) {
      window.history.pushState(null, "", "#hero");
    }
    onComplete?.();
    return;
  }

  const targetId = hash;
  const element = document.querySelector<HTMLElement>(targetId);

  if (!element) return;

  // Align section container to the viewport top
  const targetTop = element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: smooth ? "smooth" : "instant",
  });

  if (updateHistory) {
    window.history.pushState(null, "", hash);
  }

  onComplete?.();
}
