import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   CustomCursor
   • A sharp inner dot (follows the pointer instantly via CSS vars)
   • A soft outer ring that lags behind using rAF lerp
   • Hover state: ring expands + blurs, dot hides → feels magnetic
   • Text hover: ring expands + difference mode → cinematic reveal
   • Click state: brief scale-down pulse
   • Hides on touch devices automatically
───────────────────────────────────────────────────────────────── */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  // Lerp targets for the ring
  const ring  = useRef({ x: -100, y: -100 });
  const mouse = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  const [hovering, setHovering]     = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [clicking, setClicking]     = useState(false);
  const [visible,  setVisible]      = useState(false);
  const [isTouchDev, setIsTouchDev]   = useState(false);

  /* ── Move: update CSS vars for the dot (instant), lerp for the ring ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (!visible) setVisible(true);

    // Dot follows instantly via style transform
    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }
  }, [visible]);

  /* ── Hover detection on interactive elements ── */
  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest(
      'a, button, [role="button"], input, textarea, select, label, .magnetic-wrap, [data-cursor-hover]'
    );
    const heading = target.closest('h1, h2, h3, .hero-gradient-text');
    
    setHovering(!!interactive);
    setIsTextHover(!!heading);
  }, []);

  /* ── Click pulse ── */
  const onMouseDown = useCallback(() => setClicking(true),  []);
  const onMouseUp   = useCallback(() => setClicking(false), []);

  /* ── Hide when leaving viewport ── */
  const onMouseLeave = useCallback(() => setVisible(false), []);
  const onMouseEnter = useCallback(() => setVisible(true),  []);

  /* ── rAF loop: lerp ring position ── */
  useEffect(() => {
    const loop = () => {
      const LERP = 0.115;
      ring.current.x += (mouse.current.x - ring.current.x) * LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * LERP;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Event listeners ── */
  useEffect(() => {
    // Detect touch-primary device → hide custom cursor entirely
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDev(true);
      return;
    }

    document.addEventListener("mousemove",  onMouseMove,  { passive: true });
    document.addEventListener("mouseover",  onMouseOver,  { passive: true });
    document.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mouseup",    onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Hide system cursor globally
    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mouseover",  onMouseOver);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.style.cursor = "";
    };
  }, [onMouseMove, onMouseOver, onMouseDown, onMouseUp, onMouseLeave, onMouseEnter]);

  if (isTouchDev) return null;

  return (
    <>
      {/* ── Outer ring ── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          zIndex:        9999,
          pointerEvents: "none",
          willChange:    "transform",
          width:  isTextHover ? "90px" : (hovering ? "52px" : "36px"),
          height: isTextHover ? "90px" : (hovering ? "52px" : "36px"),
          borderRadius:  "999px",
          border:        isTextHover
            ? "none"
            : (hovering
              ? "2px solid var(--flame)"
              : "1.5px solid color-mix(in srgb, var(--flame) 70%, transparent)"),
          backdropFilter: (hovering || isTextHover) ? "blur(2px)" : "none",
          backgroundColor: isTextHover 
            ? "white" 
            : (hovering ? "color-mix(in srgb, var(--flame) 12%, transparent)" : "transparent"),
          mixBlendMode: isTextHover ? "difference" : "normal",
          opacity:   visible ? 1 : 0,
          transform: `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`,
          scale:     clicking ? "0.85" : "1",
          transition:
            "width 0.35s cubic-bezier(0.19,1,0.22,1), height 0.35s cubic-bezier(0.19,1,0.22,1), " +
            "border 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease, " +
            "opacity 0.25s ease, scale 0.15s ease",
        }}
      />

      {/* ── Inner dot ── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          zIndex:          10000,
          pointerEvents:   "none",
          willChange:      "transform",
          width:           (hovering || isTextHover) ? "0px" : "7px",
          height:          (hovering || isTextHover) ? "0px" : "7px",
          borderRadius:    "999px",
          backgroundColor: "var(--flame)",
          opacity:         visible ? ((hovering || isTextHover) ? 0 : 1) : 0,
          scale:           clicking ? "0.7" : "1",
          transition:
            "opacity 0.2s ease, scale 0.15s ease, width 0.25s ease, height 0.25s ease",
        }}
      />
    </>
  );
}
