import { useEffect, useState } from "react";

export function useActiveSection(hrefs: string[]) {
  const [activeHref, setActiveHref] = useState<string>("");
  const hrefsKey = hrefs.join(",");

  useEffect(() => {
    const ids = hrefs
      .map((href) => (href.startsWith("#") ? href.slice(1) : ""))
      .filter(Boolean);

    let rafId = 0;

    // Cache elements to prevent getElementById lookup thrashing during fast scroll
    const getCachedElements = () =>
      ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((item): item is { id: string; el: HTMLElement } => Boolean(item.el));

    let cached = getCachedElements();

    const calculateActiveSection = () => {
      const scrollY = window.scrollY;

      // If at the very top of the page
      if (scrollY < 100) {
        setActiveHref((prev) => (prev === "" ? prev : ""));
        return;
      }

      // Refresh cache if elements weren't found on initial mount
      if (cached.length === 0) {
        cached = getCachedElements();
      }

      const headerOffset = 140;
      let currentActive = "";

      for (const { id, el } of cached) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          currentActive = `#${id}`;
          break;
        }
      }

      // If near bottom of page, activate the last section
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        const last = cached[cached.length - 1];
        if (last) currentActive = `#${last.id}`;
      }

      setActiveHref((prev) => (prev === currentActive ? prev : currentActive));
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        calculateActiveSection();
      });
    };

    calculateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hrefsKey]);

  return activeHref;
}
