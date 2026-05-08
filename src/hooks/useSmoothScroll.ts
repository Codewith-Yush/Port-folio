import { useEffect } from "react";

function getHashTarget(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href?.startsWith("#") || href === "#") {
    return null;
  }

  return document.querySelector<HTMLElement>(href);
}

function scrollToTarget(target: HTMLElement) {
  target.scrollIntoView({ behavior: "smooth", block: "start" });
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
      window.history.pushState(null, "", anchor.getAttribute("href") ?? "");
      scrollToTarget(target);
    };

    const handleHashOnLoad = () => {
      const { hash } = window.location;
      if (!hash) {
        return;
      }

      const target = document.querySelector<HTMLElement>(hash);
      if (target) {
        window.requestAnimationFrame(() => scrollToTarget(target));
      }
    };

    document.addEventListener("click", handleClick, { passive: false });
    window.addEventListener("load", handleHashOnLoad);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("load", handleHashOnLoad);
    };
  }, []);
}
