import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/* ==========================================================================
   CUSTOM CURSOR
   - Dot follows the pointer instantly, ring follows with soft easing
   - Context aware via data attributes (no per-component wiring):
       data-cursor="View"   → ring becomes a filled disc with that label
       data-cursor="hide"   → cursor disappears over this element
       data-magnetic        → ring is gently pulled toward the element centre
     Links / buttons / role=button / tabs automatically get the "link" state.
   - Text fields fall back to the native text caret.
   - Fine-pointer (mouse) devices only. Touch devices are untouched.
   - Zero React renders while moving: direct transform writes inside rAF.
   - Mount ONCE, e.g. in App.tsx:  <CustomCursor />
   ========================================================================== */

const STYLES = `
html.has-custom-cursor,
html.has-custom-cursor * { cursor: none !important; }
html.has-custom-cursor input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),
html.has-custom-cursor textarea,
html.has-custom-cursor [contenteditable="true"] { cursor: text !important; }

.cur-root {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  z-index: 2147483000;
  pointer-events: none;
  contain: layout style;
}
.cur-layer { position: absolute; left: 0; top: 0; will-change: transform; }

.cur-dot {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--lavender, #B39CFF);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out;
}

.cur-ring {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  border: 1px solid var(--cursor-ring, rgba(179, 156, 255, 0.65));
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease-out,
    background-color 0.3s ease-out,
    border-color 0.3s ease-out;
}

.cur-label {
  position: absolute;
  left: 0;
  top: 0;
  width: 88px;
  height: 88px;
  margin: -44px 0 0 -44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #B39CFF;
  color: #0D0D0D;
  font: 700 11px/1 "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out;
}

.cur-pulse {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  border: 1px solid #B39CFF;
  opacity: 0;
}

/* ---- states ---- */
.cur-root[data-state="link"] .cur-ring {
  transform: scale(1.55);
  background-color: rgba(179, 156, 255, 0.14);
  border-color: #B39CFF;
}
.cur-root[data-state="link"] .cur-dot { transform: scale(0.5); }

.cur-root[data-state="label"] .cur-ring { transform: scale(0.5); opacity: 0; }
.cur-root[data-state="label"] .cur-dot { opacity: 0; }
.cur-root[data-state="label"] .cur-label { transform: scale(1); opacity: 1; }

/* pressed */
.cur-root[data-state="idle"][data-down="true"] .cur-ring { transform: scale(0.75); }
.cur-root[data-state="link"][data-down="true"] .cur-ring { transform: scale(1.25); }
.cur-root[data-state="label"][data-down="true"] .cur-label { transform: scale(0.88); }

/* hidden (window left / hide zone / native text caret) */
.cur-root[data-visible="false"] .cur-dot,
.cur-root[data-visible="false"] .cur-ring,
.cur-root[data-visible="false"] .cur-label,
.cur-root[data-state="hide"] .cur-dot,
.cur-root[data-state="hide"] .cur-ring,
.cur-root[data-state="hide"] .cur-label,
.cur-root[data-state="native"] .cur-dot,
.cur-root[data-state="native"] .cur-ring,
.cur-root[data-state="native"] .cur-label { opacity: 0 !important; }

@media (prefers-reduced-motion: reduce) {
  .cur-dot, .cur-ring, .cur-label { transition-duration: 0.01ms; }
}
`;

const INTERACTIVE =
  '[data-cursor], a[href], button, [role="button"], [role="tab"], summary, label, select, [data-clickable="true"]';
const TEXTISH =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';
const MAGNETIC = ".btn-neo-base, .btn-neo-control, [data-magnetic]";

type CursorState = "idle" | "link" | "label" | "hide" | "native";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const pulse = pulseRef.current;
    if (!root || !dot || !ring || !label || !pulse) return;

    document.documentElement.classList.add("has-custom-cursor");

    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let first = true;
    let raf = 0;
    let running = false;
    let lastT = 0;
    let state: CursorState = "idle";
    let hoverEl: HTMLElement | null = null;
    let magnetic = false;
    let scrollQueued = false;

    const setState = (next: CursorState) => {
      if (next === state) return;
      state = next;
      root.dataset.state = next;
    };

    const frame = (now: number) => {
      const dt = lastT ? Math.min(64, now - lastT) : 16;
      lastT = now;

      let gx = tx;
      let gy = ty;
      if (hoverEl && magnetic) {
        const r = hoverEl.getBoundingClientRect();
        gx = tx + (r.left + r.width / 2 - tx) * 0.28;
        gy = ty + (r.top + r.height / 2 - ty) * 0.28;
      }

      // frame-rate independent smoothing (~70ms time constant)
      const k = reduced ? 1 : 1 - Math.exp(-dt / 70);
      rx += (gx - rx) * k;
      ry += (gy - ry) * k;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px,${ry.toFixed(2)}px,0)`;

      const settled = Math.abs(gx - rx) < 0.1 && Math.abs(gy - ry) < 0.1;
      if (settled && !(hoverEl && magnetic)) {
        running = false;
        lastT = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const resolve = (t: Element | null) => {
      hoverEl = null;
      magnetic = false;
      if (!t || !(t as HTMLElement).closest) return setState("idle");

      if (t.closest(TEXTISH)) return setState("native");

      const el = t.closest<HTMLElement>(INTERACTIVE);
      if (!el) return setState("idle");

      const custom = el.dataset.cursor;
      if (custom === "hide") return setState("hide");
      if (custom) {
        label.textContent = custom;
        return setState("label");
      }

      setState("link");
      hoverEl = el;
      if (el.matches(MAGNETIC)) {
        const r = el.getBoundingClientRect();
        magnetic = r.width < 260 && r.height < 120;
      }
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      if (first) {
        first = false;
        rx = tx;
        ry = ty;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        root.dataset.visible = "true";
      }
      kick();
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      resolve(e.target as Element | null);
    };

    // Re-evaluate what's under the pointer while the page scrolls (Lenis / wheel)
    const onScroll = () => {
      if (scrollQueued || first) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        resolve(document.elementFromPoint(tx, ty));
      });
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.dataset.down = "true";
      if (!reduced && state !== "native" && state !== "hide") {
        pulse.animate(
          [
            { transform: "scale(0.5)", opacity: 0.7 },
            { transform: "scale(1.9)", opacity: 0 },
          ],
          { duration: 560, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
      }
    };
    const onUp = () => {
      root.dataset.down = "false";
    };

    const onLeave = () => {
      root.dataset.visible = "false";
    };
    const onEnter = () => {
      if (!first) root.dataset.visible = "true";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="cur-root"
      data-state="idle"
      data-visible="false"
      data-down="false"
      aria-hidden="true"
    >
      <style>{STYLES}</style>
      <div ref={ringRef} className="cur-layer">
        <div className="cur-ring" />
        <div ref={pulseRef} className="cur-pulse" />
        <div ref={labelRef} className="cur-label" />
      </div>
      <div ref={dotRef} className="cur-layer">
        <div className="cur-dot" />
      </div>
    </div>
  );
}

export default CustomCursor;