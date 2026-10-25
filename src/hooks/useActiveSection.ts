import { useEffect, useState } from "react";

export function useActiveSection(hrefs: string[]) {
  const [activeHref, setActiveHref] = useState<string>("");
  const hrefsKey = hrefs.join(",");

  useEffect(() => {
    const ids = hrefs
      .map((href) => (href.startsWith("#") ? href.slice(1) : ""))
      .filter(Boolean);

    let rafId = 0;
    let resizeTimer: number | null = null;

    interface SectionMetrics {
      id: string;
      top: number;
      height: number;
    }

    let metrics: SectionMetrics[] = [];

    const measureSections = () => {
      const scrollY = window.scrollY;
      metrics = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            id: `#${id}`,
            top: rect.top + scrollY,
            height: rect.height,
          };
        })
        .filter((item): item is SectionMetrics => item !== null);
    };

    const calculateActiveSection = () => {
      const scrollY = window.scrollY;

      // If at the very top of the page
      if (scrollY < 100) {
        setActiveHref((prev) => (prev === "" ? prev : ""));
        return;
      }

      if (metrics.length === 0) {
        measureSections();
      }

      const headerOffset = 160;
      const targetScroll = scrollY + headerOffset;
      let currentActive = "";

      for (const section of metrics) {
        if (targetScroll >= section.top && targetScroll < section.top + section.height) {
          currentActive = section.id;
          break;
        }
      }

      // If near bottom of page, activate the last section
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        const last = metrics[metrics.length - 1];
        if (last) currentActive = last.id;
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

    const handleResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        measureSections();
        calculateActiveSection();
      }, 150);
    };

    // Initial measurement
    measureSections();
    calculateActiveSection();

    // Settle after late-loading web fonts
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureSections();
        calculateActiveSection();
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hrefsKey]);

  return activeHref;
}
