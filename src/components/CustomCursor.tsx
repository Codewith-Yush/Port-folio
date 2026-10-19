import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   CustomCursor
   • Sharp inner dot (follows pointer instantaneously)
   • Fluid outer ring (follows with smooth 60fps lerp physics)
   • Button / Link Hover: ring smoothly expands + captures
   • Headline / Text Hover: ring scales up with mix-blend difference
   • Click State: snappy scale-down pulse
   • Touch-Safe: auto-disabled on mobile / touchscreens
 ───────────────────────────────────────────────────────────────── */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Smooth lerp coordinates
  const ring = useRef({ x: -100, y: -100 });
  const mouse = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  const [hovering, setHovering] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  /* ── Track Mouse Movement ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    setVisible((prev) => (prev ? prev : true));
  }, []);

  /* ── Interactive Element Detection ── */
  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const tag = target.tagName;
    const isLinkOrBtn =
      tag === "A" ||
      tag === "BUTTON" ||
      target.getAttribute("role") === "button" ||
      target.classList.contains("cursor-pointer");

    const interactive =
      isLinkOrBtn ||
      Boolean(target.closest("a, button, [role='button'], input, textarea, select, label, .cursor-pointer"));

    const heading =
      tag === "H1" ||
      tag === "H2" ||
      tag === "H3" ||
      Boolean(target.closest("h1, h2, h3, .heading-line"));

    const nextHover = Boolean(interactive);
    const nextHeading = Boolean(heading && !interactive);

    setHovering((prev) => (prev !== nextHover ? nextHover : prev));
    setIsTextHover((prev) => (prev !== nextHeading ? nextHeading : prev));
  }, []);

  const onMouseDown = useCallback(() => setClicking(true), []);
  const onMouseUp = useCallback(() => setClicking(false), []);
  const onMouseLeave = useCallback(() => setVisible(false), []);
  const onMouseEnter = useCallback(() => setVisible(true), []);

  /* ── 60 FPS RequestAnimationFrame Lerp Loop ── */
  useEffect(() => {
    const loop = () => {
      const LERP = 0.14;
      ring.current.x += (mouse.current.x - ring.current.x) * LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * LERP;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Desktop Detection & Global Events ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch primary device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [onMouseMove, onMouseOver, onMouseDown, onMouseUp, onMouseLeave, onMouseEnter]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* ── Outer Ring ── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full will-change-transform"
        style={{
          width: isTextHover ? "84px" : hovering ? "54px" : "34px",
          height: isTextHover ? "84px" : hovering ? "54px" : "34px",
          border: isTextHover
            ? "none"
            : hovering
            ? "2px solid #10B981"
            : "1.5px solid var(--cursor-ring, rgba(16, 185, 129, 0.6))",
          backgroundColor: isTextHover
            ? "rgba(255, 255, 255, 0.9)"
            : hovering
            ? "rgba(16, 185, 129, 0.12)"
            : "transparent",
          mixBlendMode: isTextHover ? "difference" : "normal",
          opacity: visible ? 1 : 0,
          scale: clicking ? "0.85" : "1",
          boxShadow: hovering
            ? "0 0 16px rgba(16, 185, 129, 0.35)"
            : "none",
          transition:
            "width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background-color 0.25s ease, opacity 0.2s ease, scale 0.12s ease, box-shadow 0.25s ease",
        }}
      />

      {/* ── Inner Sharp Dot ── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full will-change-transform"
        style={{
          width: hovering || isTextHover ? "0px" : "6px",
          height: hovering || isTextHover ? "0px" : "6px",
          backgroundColor: "#10B981",
          boxShadow: "0 0 8px #10B981",
          opacity: visible && !hovering && !isTextHover ? 1 : 0,
          scale: clicking ? "0.6" : "1",
          transition:
            "opacity 0.2s ease, scale 0.12s ease, width 0.2s ease, height 0.2s ease",
        }}
      />
    </>
  );
}
