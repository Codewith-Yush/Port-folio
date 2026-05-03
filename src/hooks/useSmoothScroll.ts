import { useEffect } from "react";

const headerOffset = 96;

function getHashTarget(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href?.startsWith("#") || href === "#") {
    return null;
  }

  return document.querySelector<HTMLElement>(href);
}

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");

      if (!anchor) {
        return;
      }

      const target = getHashTarget(anchor);

      if (!target) {
        return;
      }

      event.preventDefault();

      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.history.pushState(null, "", anchor.getAttribute("href") ?? "");
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
