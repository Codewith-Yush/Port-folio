import { useEffect } from "react";

function getHashTarget(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href?.startsWith("#") || href === "#") {
    return null;
  }

  return document.querySelector<HTMLElement>(href);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function scrollToTarget(target: HTMLElement, reducedMotion: boolean) {
  const start = window.scrollY;
  const headerOffset = window.matchMedia("(max-width: 768px)").matches ? 84 : 96;
  const targetY = Math.max(0, target.getBoundingClientRect().top + start - headerOffset);
  const distance = targetY - start;

  if (reducedMotion || Math.abs(distance) < 8) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(900, Math.max(420, Math.abs(distance) * 0.42));
  const startTime = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, start + distance * easeOutCubic(progress));

    if (progress < 1) {
      frame = window.requestAnimationFrame(tick);
    }
  };

  frame = window.requestAnimationFrame(tick);

  const cancel = () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
  };

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
}

export function useSmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const target = getHashTarget(anchor);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", anchor.getAttribute("href") ?? "");
      scrollToTarget(target, media.matches);
    };

    const handleHashOnLoad = () => {
      const { hash } = window.location;
      if (!hash) return;

      const target = document.querySelector<HTMLElement>(hash);
      if (target) {
        window.requestAnimationFrame(() => scrollToTarget(target, true));
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("load", handleHashOnLoad, { once: true });

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("load", handleHashOnLoad);
    };
  }, []);
}
