import { useEffect, useState } from "react";

type UseActiveSectionOptions = {
  sectionSelector?: string;
};

export function useActiveSection(hrefs: string[], options: UseActiveSectionOptions = {}) {
  const { sectionSelector = "section[id]" } = options;
  const [activeHref, setActiveHref] = useState<string>(hrefs[0] ?? "#hero");

  useEffect(() => {
    const win = globalThis as unknown as Window & typeof globalThis;
    const ids = hrefs
      .map((href) => (href.startsWith("#") ? href.slice(1) : ""))
      .filter(Boolean);

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const setFromScrollPosition = () => {
      const y = win.scrollY + 120;
      let best: HTMLElement | null = null;
      for (const section of sections) {
        if (section.offsetTop <= y) best = section;
      }
      if (best) setActiveHref(`#${best.id}`);
    };

    if (typeof (win as unknown as { IntersectionObserver?: unknown }).IntersectionObserver !== "function") {
      setFromScrollPosition();
      win.addEventListener("scroll", setFromScrollPosition, { passive: true });
      return () => win.removeEventListener("scroll", setFromScrollPosition);
    }

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;
          visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveHref(`#${bestId}`);
          return;
        }

        setFromScrollPosition();
      },
      {
        root: null,
        // Pick the section around the “reading” band of viewport.
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.4, 0.6],
      },
    );

    // Ensure we only observe sections (ignore other section-like elements).
    for (const section of sections) {
      if (section.matches(sectionSelector)) observer.observe(section);
    }

    // Initialize.
    setFromScrollPosition();

    return () => observer.disconnect();
  }, [hrefs, sectionSelector]);

  return activeHref;
}

