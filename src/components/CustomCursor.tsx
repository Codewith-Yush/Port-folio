import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   CustomCursor
   • A sharp inner dot (follows the pointer instantly via requestAnimationFrame)
   • A soft outer ring that lags behind using rAF lerp
   • Hover state: ring expands + blurs, dot hides → feels magnetic
   • Text hover: ring expands + difference mode → cinematic reveal
   • Click state: brief scale-down pulse
   • Hides on touch devices automatically
   • Optimized: 
     - requestAnimationFrame throttles both cursor and ring updates
     - Fast-path checking for interactive elements (tagName matches)
     - Functional state updates to prevent event listener rebinding
 ───────────────────────────────────────────────────────────────── */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  // Lerp targets for the ring and instant target for the dot
  const ring  = useRef({ x: -100, y: -100 });
  const mouse = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  const [hovering, setHovering]     = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [clicking, setClicking]     = useState(false);
  const [visible,  setVisible]      = useState(false);
  const [isTouchDev, setIsTouchDev]   = useState(false);

  /* ── Move: update mouse target coords ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    setVisible(prev => prev ? prev : true);
  }, []);

  /* ── Hover detection on interactive elements ── */
  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    // Fast-path: Check tag name directly
    const tag = target.tagName;
    const isLinkOrBtn = tag === 'A' || tag === 'BUTTON' || target.getAttribute('role') === 'button';

    const interactive = isLinkOrBtn || target.closest(
      'a, button, [role="button"], input, textarea, select, label, .magnetic-wrap, [data-cursor-hover]'
    );
    const heading = (tag === 'H1' || tag === 'H2' || tag === 'H3') || target.closest('h1, h2, h3, .hero-gradient-text');
    
    const nextHovering = !!interactive;
    const nextTextHover = !!heading;

    setHovering(prev => prev !== nextHovering ? nextHovering : prev);
    setIsTextHover(prev => prev !== nextTextHover ? nextTextHover : prev);
  }, []);

  /* ── Click pulse ── */
  const onMouseDown = useCallback(() => setClicking(true),  []);
  const onMouseUp   = useCallback(() => setClicking(false), []);

  /* ── Hide when leaving viewport ── */
  const onMouseLeave = useCallback(() => setVisible(false), []);
  const onMouseEnter = useCallback(() => setVisible(true),  []);

  /* ── rAF loop: update both ring and dot positions ── */
  useEffect(() => {
    const loop = () => {
      const LERP = 0.115;
      ring.current.x += (mouse.current.x - ring.current.x) * LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * LERP;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%,-50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%,-50%)`;
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
              ? "2px solid white"
              : "1.5px solid rgba(255, 255, 255, 0.7)"),
          backdropFilter: "none",
          backgroundColor: isTextHover 
            ? "white" 
            : (hovering ? "rgba(255, 255, 255, 0.1)" : "transparent"),
          mixBlendMode: "difference",
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
          backgroundColor: "white",
          mixBlendMode:    "difference",
          opacity:         visible ? ((hovering || isTextHover) ? 0 : 1) : 0,
          scale:           clicking ? "0.7" : "1",
          transition:
            "opacity 0.2s ease, scale 0.15s ease, width 0.25s ease, height 0.25s ease",
        }}
      />
    </>
  );
}
