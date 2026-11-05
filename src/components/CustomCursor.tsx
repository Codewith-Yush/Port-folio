import { useEffect, useRef } from "react";

/**
 * CustomCursor - "Orbit Ring"
 *
 * - A small dot that tracks the pointer exactly
 * - A ring that trails with smooth easing, stretches slightly in the
 *   direction of travel, and shrinks on press
 * - Over interactive elements the ring expands into a soft filled halo
 * - Add data-cursor="Label" to any element to show a text label in the ring
 *
 * Theme:
 * - High-contrast adaptive styling for both Light and Dark modes
 * - In Light Mode: Deep charcoal dot and ring with subtle contrast halo
 * - In Dark Mode: Crisp white dot and ring with subtle lavender glow
 *
 * Accessibility:
 * - The native cursor is never hidden
 * - Overlay is fixed, pointer-events: none, aria-hidden
 * - Disabled on touch/coarse pointers and with prefers-reduced-motion
 */

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mx = -100, my = -100; // pointer
    let rx = -100, ry = -100; // ring position
    let scale = 1, targetScale = 1;
    let pressed = false;
    let visible = false;
    let raf = 0;
    let isRunning = false;
    let lastTarget: Element | null = null;

    const requestTick = () => {
      if (!isRunning) {
        isRunning = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx;
        ry = my;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = e.target as Element | null;
      if (target !== lastTarget) {
        lastTarget = target;
        const interactiveTarget = target?.closest?.(INTERACTIVE) as HTMLElement | null;
        if (interactiveTarget) {
          const text = interactiveTarget.getAttribute("data-cursor");
          label.textContent = text ?? "";
          targetScale = text ? 3.2 : 2.2;
          ring.dataset.state = text ? "label" : "hover";
        } else {
          label.textContent = "";
          targetScale = 1;
          ring.dataset.state = "idle";
        }
      }

      requestTick();
    };

    const onDown = () => {
      pressed = true;
      requestTick();
    };

    const onUp = () => {
      pressed = false;
      requestTick();
    };

    const onLeave = () => {
      visible = false;
      lastTarget = null;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      // ease ring toward pointer
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.16;
      ry += dy * 0.16;
      const currentTargetScale = pressed ? targetScale * 0.8 : targetScale;
      scale += (currentTargetScale - scale) * 0.18;

      // stretch along velocity for a fluid feel (only when idle-sized)
      const speed = Math.min(Math.hypot(dx, dy) / 60, 0.35);
      const angle = Math.atan2(dy, dx);
      const stretch = targetScale === 1 ? 1 + speed : 1;
      const squash = targetScale === 1 ? 1 - speed * 0.4 : 1;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${
        targetScale > 1 ? 0.5 : pressed ? 0.7 : 1
      })`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${
        scale * stretch
      }, ${scale * squash})`;
      // keep label upright and unscaled
      label.style.transform = `rotate(${-angle}rad) scale(${1 / (scale * stretch)}, ${
        1 / (scale * squash)
      })`;

      // Idle sleep detection: cancel rAF when cursor settles to save 100% idle GPU/CPU cycles
      const settled =
        Math.abs(dx) < 0.05 &&
        Math.abs(dy) < 0.05 &&
        Math.abs(currentTargetScale - scale) < 0.005;

      if (!settled) {
        raf = requestAnimationFrame(tick);
      } else {
        isRunning = false;
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="orbit-cursor-root">
      <style>{`
        .orbit-cursor-root {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2147483647;
        }
        .orbit-dot,
        .orbit-ring {
          position: fixed;
          top: 0;
          left: 0;
          border-radius: 50%;
          opacity: 0;
          will-change: transform;
          pointer-events: none;
        }

        /* ── Light Mode (Default) ── */
        .orbit-dot {
          width: 6px;
          height: 6px;
          background: #18181b;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
          transition: opacity .2s ease, background-color .25s ease, box-shadow .25s ease;
        }
        .orbit-ring {
          width: 36px;
          height: 36px;
          border: 1.5px solid rgba(24, 24, 27, 0.72);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.45);
          display: grid;
          place-items: center;
          transition: opacity .2s ease, background-color .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .orbit-ring[data-state="hover"] {
          background: rgba(24, 24, 27, 0.08);
          border-color: #18181b;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.55);
        }
        .orbit-ring[data-state="label"] {
          background: #18181b;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }
        .orbit-label {
          font: 600 5.5px/1 "Plus Jakarta Sans", system-ui, sans-serif;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
          pointer-events: none;
        }

        /* ── Dark Mode (.dark on <html>) ── */
        .dark .orbit-dot {
          background: #ffffff;
          box-shadow: 0 0 8px rgba(179, 156, 255, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.5);
        }
        .dark .orbit-ring {
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
        }
        .dark .orbit-ring[data-state="hover"] {
          background: rgba(255, 255, 255, 0.16);
          border-color: #ffffff;
          box-shadow: 0 0 12px rgba(179, 156, 255, 0.35);
        }
        .dark .orbit-ring[data-state="label"] {
          background: #ffffff;
          border-color: transparent;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
        }
        .dark .orbit-label {
          color: #0d0d0d;
        }
      `}</style>
      <div ref={ringRef} className="orbit-ring" data-state="idle">
        <span ref={labelRef} className="orbit-label" />
      </div>
      <div ref={dotRef} className="orbit-dot" />
    </div>
  );
}