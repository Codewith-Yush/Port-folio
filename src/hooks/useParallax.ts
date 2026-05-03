import { useEffect, useState } from "react";

export function useParallax(strength = 0.04) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOffset(window.scrollY * strength);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [strength]);

  return offset;
}
