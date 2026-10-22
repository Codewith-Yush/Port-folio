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
      Boolean(
        target.closest(
          "a, button, [role='button'], input, textarea, select, label, .cursor-pointer",
        ),
      );

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
  }, [
    onMouseMove,
    onMouseOver,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseEnter,
  ]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Playful neon cursor aura */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[9999] grid place-items-center rounded-full border will-change-transform ${isTextHover ? "border-fuchsia-700 bg-fuchsia-800/10 shadow-[0_0_28px_rgba(190,24,93,0.2)] dark:border-fuchsia-400 dark:bg-fuchsia-400/10 dark:shadow-[0_0_28px_rgba(255,84,200,0.28)]" : hovering ? "border-emerald-800 bg-emerald-900/10 shadow-[0_0_24px_rgba(4,120,87,0.2)] dark:border-lime-300 dark:bg-lime-300/10 dark:shadow-[0_0_24px_rgba(197,255,47,0.28)]" : "border-emerald-800/60 bg-emerald-950/[0.03] shadow-[0_0_14px_rgba(4,120,87,0.12)] dark:border-lime-300/60 dark:bg-lime-300/[0.035] dark:shadow-[0_0_14px_rgba(197,255,47,0.12)]"}`}
        style={{
          width: isTextHover ? "72px" : hovering ? "56px" : "30px",
          height: isTextHover ? "72px" : hovering ? "56px" : "30px",
          border: isTextHover
            ? "1px solid rgba(255, 84, 200, 0.9)"
            : hovering
              ? "1px solid rgba(197, 255, 47, 0.95)"
              : "1px solid rgba(197, 255, 47, 0.58)",
          backgroundColor: isTextHover
            ? "rgba(255, 84, 200, 0.12)"
            : hovering
              ? "rgba(197, 255, 47, 0.12)"
              : "rgba(197, 255, 47, 0.035)",
          mixBlendMode: isTextHover ? "difference" : "normal",
          opacity: visible ? 1 : 0,
          scale: clicking ? "0.82" : "1",
          boxShadow: isTextHover
            ? "0 0 28px rgba(255, 84, 200, 0.28), inset 0 0 18px rgba(255, 84, 200, 0.1)"
            : hovering
              ? "0 0 24px rgba(197, 255, 47, 0.28), inset 0 0 14px rgba(197, 255, 47, 0.08)"
              : "0 0 14px rgba(197, 255, 47, 0.12)",
          transition:
            "width 0.32s cubic-bezier(0.16, 1, 0.3, 1), height 0.32s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background-color 0.25s ease, opacity 0.2s ease, scale 0.14s ease, box-shadow 0.25s ease",
        }}
      >
        <span
          className={`font-mono text-[17px] font-bold leading-none ${isTextHover ? "text-fuchsia-800 dark:text-fuchsia-300" : "text-emerald-900 dark:text-lime-300"}`}
          style={{
            color: isTextHover ? "#ff54c8" : "#c5ff2f",
            opacity: hovering || isTextHover ? 1 : 0,
            transform: clicking
              ? "scale(0.75) rotate(-12deg)"
              : "scale(1) rotate(0deg)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {isTextHover ? "✳" : "↗"}
        </span>
      </div>

      {/* Bright pinpoint when the cursor is in its default state */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10000] rounded-full will-change-transform shadow-[0_0_10px_rgba(4,120,87,0.8)] dark:[--cursor-dot:#c5ff2f] dark:shadow-[0_0_10px_rgba(197,255,47,0.95)]"
        style={{
          width: hovering || isTextHover ? "0px" : "5px",
          height: hovering || isTextHover ? "0px" : "5px",
          boxShadow: "0 0 10px rgba(197, 255, 47, 0.95)",
          backgroundColor: "var(--cursor-dot, #047857)",
          opacity: visible && !hovering && !isTextHover ? 1 : 0,
          scale: clicking ? "0.55" : "1",
          transition:
            "opacity 0.2s ease, scale 0.12s ease, width 0.2s ease, height 0.2s ease",
        }}
      />
    </>
  );
}
