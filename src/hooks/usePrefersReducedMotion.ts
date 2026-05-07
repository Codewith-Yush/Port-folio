import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const win = globalThis as unknown as Window & typeof globalThis;
    const media = win.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();

    const modern = media as MediaQueryList & {
      addEventListener?: (type: "change", listener: () => void) => void;
      removeEventListener?: (type: "change", listener: () => void) => void;
    };

    if (typeof modern.addEventListener === "function" && typeof modern.removeEventListener === "function") {
      modern.addEventListener("change", update);
      return () => modern.removeEventListener("change", update);
    }

    const legacy = media as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    legacy.addListener?.(update);
    return () => legacy.removeListener?.(update);
  }, []);

  return reduced;
}

