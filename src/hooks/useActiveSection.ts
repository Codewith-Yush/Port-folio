import { useEffect, useState } from "react";

export function useActiveSection(hrefs: string[]) {
  const [activeHref, setActiveHref] = useState<string>(hrefs[0] ?? "#about");

  useEffect(() => {
    const ids = hrefs
      .map((href) => (href.startsWith("#") ? href.slice(1) : ""))
      .filter(Boolean);

    let rafId = 0;

    const calculateActiveSection = () => {
      const scrollY = window.scrollY;

      // If at the very top of the page, no specific section or first section
      if (scrollY < 100) {
        setActiveHref("");
        return;
      }

      // Check all section elements
      const headerOffset = 140;
      let currentActive = "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Section is considered active when its top is above the offset line
        // and its bottom is still below the offset line
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          currentActive = `#${id}`;
          break;
        }
      }

      // If near bottom of page, activate the last section (Contact)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        const lastId = ids[ids.length - 1];
        if (lastId) currentActive = `#${lastId}`;
      }

      if (currentActive) {
        setActiveHref(currentActive);
      }
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        calculateActiveSection();
      });
    };

    // Run on mount and attach scroll + resize listeners
    calculateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [hrefs]);

  return activeHref;
}
