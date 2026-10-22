import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Enterprise Scroll & Route Restoration Manager:
 * - Restores scroll to top (0, 0) instantly on page switches with no hash
 * - Smoothly navigates to section hash targets (#work, #skills, #telemetry, #contact, etc.)
 * - Maps alias hashes like #live-activity -> #telemetry
 * - Retries positioning to compensate for image layout shifts & LocomotiveScroll initialization
 * - Refreshes GSAP ScrollTrigger on every route change
 */
export function ScrollManager() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const isNewPath = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    // Refresh ScrollTrigger instances so triggers align with the new page layout
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    if (location.hash) {
      // Map alias hashes
      let rawHash = location.hash;
      if (rawHash === "#live-activity") rawHash = "#telemetry";

      const scrollToTarget = () => {
        const locomotiveScroll = window.__locomotiveScroll;
        const target =
          rawHash === "#hero" || rawHash === "#"
            ? 0
            : document.querySelector<HTMLElement>(rawHash);

        if (locomotiveScroll) {
          if (rawHash === "#hero" || rawHash === "#") {
            locomotiveScroll.scrollTo(0, {
              duration: 1.0,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else if (target) {
            locomotiveScroll.scrollTo(target, {
              offset: -80,
              duration: 1.1,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        } else {
          if (rawHash === "#hero" || rawHash === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = Math.max(0, elementPosition - headerOffset);
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      };

      // Staggered attempts to ensure proper scrolling once DOM is ready & images stabilize
      const t1 = window.setTimeout(scrollToTarget, 50);
      const t2 = window.setTimeout(scrollToTarget, 250);
      const t3 = window.setTimeout(scrollToTarget, 650);

      return () => {
        clearTimeout(refreshTimer);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      // Navigated to a new page without a hash
      if (isNewPath) {
        const locomotiveScroll = window.__locomotiveScroll;
        if (locomotiveScroll) {
          locomotiveScroll.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      return () => {
        clearTimeout(refreshTimer);
      };
    }
  }, [location.pathname, location.hash]);

  return null;
}

