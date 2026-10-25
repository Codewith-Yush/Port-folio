/**
 * Crosshair HUD Cursor Effect (Pointer-class cursor)
 * 
 * Vanilla JS + HTML5 Canvas + CSS (Zero external libraries)
 * 
 * Features:
 * - Full-bleed guide lines at exact pointer position (NO lerp, instantaneous)
 * - 16px tactical centre box with micro reticle
 * - Real-time live coordinate readout (X / Y telemetry)
 * - Adaptive Theme Support: Perfectly visible in BOTH Dark and Light modes
 *   - Dark mode: Crisp white/neon HUD elements (#FFFFFF / rgba(255, 255, 255, 0.3))
 *   - Light mode: Crisp high-contrast deep ink elements (rgba(17, 24, 39, 0.35))
 *   - Real-time reactivity to class="dark" theme toggles via MutationObserver
 * - Interactive target state detection (closest a, button, input)
 * - DPR-scaled canvas rendering (devicePixelRatio capped at 2)
 * - Strict Accessibility:
 *   - Native cursor is NEVER hidden (no cursor: none, system arrow remains fully visible)
 *   - Additive overlay (pointer-events: none, aria-hidden="true")
 *   - Respects prefers-reduced-motion: reduce
 *   - Disables on touch / coarse pointers (matchMedia: (hover: hover) and (pointer: fine))
 *   - Re-evaluates dynamically on media query changes
 * - Single rAF loop with zero-waste redraw gating
 * - Full teardown & listener cleanup
 */

export interface CrosshairHudOptions {
  boxSize?: number;          // default: 16
  lineOpacity?: number;      // default: 0.3
  showCoordinates?: boolean; // default: true
  color?: string;            // custom color override or theme-driven
  mixBlendMode?: string;     // default: 'normal' (avoids washed-out difference mode in light theme)
  container?: HTMLElement | null; // null = viewport overlay
  theme?: "auto" | "light" | "dark"; // default: 'auto'
}

export interface CrosshairHudInstance {
  destroy: () => void;
  setOptions: (newOptions: Partial<CrosshairHudOptions>) => void;
}

export function mountCrosshairHud(
  customContainer?: HTMLElement | null,
  initialOptions: Partial<CrosshairHudOptions> = {}
): CrosshairHudInstance {
  if (typeof window === "undefined") {
    return { destroy: () => {}, setOptions: () => {} };
  }

  let options: Required<CrosshairHudOptions> = {
    boxSize: initialOptions.boxSize ?? 16,
    lineOpacity: initialOptions.lineOpacity ?? 0.3,
    showCoordinates: initialOptions.showCoordinates ?? true,
    color: initialOptions.color ?? "",
    mixBlendMode: initialOptions.mixBlendMode ?? "normal",
    container: customContainer ?? initialOptions.container ?? null,
    theme: initialOptions.theme ?? "auto",
  };

  const isContainerScoped = Boolean(options.container);
  const targetElement: HTMLElement = options.container || document.body;

  // Media query checks
  const finePointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");

  let isEnabled = finePointerMedia.matches && !reducedMotionMedia.matches;

  // Canvas and rendering state
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let rafId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let themeObserver: MutationObserver | null = null;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Pointer telemetry state - NO lerp!
  let pointerX = -9999;
  let pointerY = -9999;
  let isPointerInside = false;
  let isInteractive = false;
  let needsRedraw = false;

  function isDarkModeActive(): boolean {
    if (options.theme === "dark") return true;
    if (options.theme === "light") return false;

    // If scoped to a container, inspect container class or computed background
    if (isContainerScoped && options.container) {
      if (options.container.classList.contains("dark")) return true;
      const bg = window.getComputedStyle(options.container).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const brightness = (Number(rgb[0]) * 299 + Number(rgb[1]) * 587 + Number(rgb[2]) * 114) / 1000;
          return brightness < 128;
        }
      }
    }

    // Document-level theme
    const docEl = document.documentElement;
    if (docEl.classList.contains("dark")) return true;
    if (docEl.classList.contains("light")) return false;
    return colorSchemeMedia.matches;
  }

  function initCanvas() {
    if (canvas) return;

    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("data-cursor-hud", "true");

    // Pure additive overlay styles - never intercepts any pointer, click, or focus events
    Object.assign(canvas.style, {
      position: isContainerScoped ? "absolute" : "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: "9999",
      mixBlendMode: options.mixBlendMode,
      display: "block",
    });

    if (isContainerScoped) {
      const computed = window.getComputedStyle(targetElement);
      if (computed.position === "static") {
        targetElement.style.position = "relative";
      }
    }

    targetElement.appendChild(canvas);
    ctx = canvas.getContext("2d", { alpha: true });

    updateCanvasSize();
  }

  function removeCanvas() {
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
  }

  function updateCanvasSize() {
    if (!canvas || !ctx) return;

    if (isContainerScoped && options.container) {
      const rect = options.container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    // Size canvas backing store to devicePixelRatio (capped at 2)
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale context so drawing units are in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    needsRedraw = true;
  }

  /* ─────────────────────────────────────────────────────────────────
     DRAWING ROUTINE:
     - Full-bleed guide lines at exact pointer (no lerp)
     - 16px tactical centre box
     - Live coordinate readout with edge-flipping logic
     - Adaptive high-contrast coloring for Light and Dark modes
  ───────────────────────────────────────────────────────────────── */
  function draw() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, width, height);

    if (!isPointerInside || pointerX < -50 || pointerY < -50 || pointerX > width + 50 || pointerY > height + 50) {
      return;
    }

    const isDark = isDarkModeActive();
    const px = Math.round(pointerX);
    const py = Math.round(pointerY);
    const boxSize = options.boxSize;
    const halfBox = Math.round(boxSize / 2);

    // Half-pixel alignment ensures 1px strokes are crisp, never blurry
    const lineX = px + 0.5;
    const lineY = py + 0.5;

    /* ── High-Contrast Color Palette Definition ── */
    // Dark mode: crisp white / neon accents
    // Light mode: deep high-contrast charcoal / ink (#111827 / rgb(17, 24, 39))
    const lineAlpha = isInteractive
      ? (isDark ? 0.65 : 0.75)
      : (isDark ? options.lineOpacity : Math.max(0.32, options.lineOpacity));

    const lineStroke = isDark
      ? `rgba(255, 255, 255, ${lineAlpha.toFixed(3)})`
      : `rgba(17, 24, 39, ${lineAlpha.toFixed(3)})`;

    const boxStroke = isInteractive
      ? (isDark ? "rgba(255, 255, 255, 0.98)" : "rgba(17, 24, 39, 1.0)")
      : (isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(17, 24, 39, 0.85)");

    const centerDotColor = isDark ? "#FFFFFF" : "#111827";

    ctx.save();

    /* ── 1. Full-Bleed Guide Lines ── */
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineStroke;

    // Horizontal full-bleed hairline
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(width, lineY);
    ctx.stroke();

    // Vertical full-bleed hairline
    ctx.beginPath();
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX, height);
    ctx.stroke();

    /* ── 2. Centre Box (16px) ── */
    const boxX = px - halfBox + 0.5;
    const boxY = py - halfBox + 0.5;

    ctx.strokeStyle = boxStroke;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    // Micro centre dot at exact pointer coordinate
    ctx.fillStyle = centerDotColor;
    ctx.fillRect(px - 1, py - 1, 2, 2);

    // Corner tick marks when hovering interactive target (closest a, button, input)
    if (isInteractive) {
      const tick = 3;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(boxX - 2, boxY + tick);
      ctx.lineTo(boxX - 2, boxY - 2);
      ctx.lineTo(boxX + tick, boxY - 2);
      // Top-right
      ctx.moveTo(boxX + boxSize - tick, boxY - 2);
      ctx.lineTo(boxX + boxSize + 2, boxY - 2);
      ctx.lineTo(boxX + boxSize + 2, boxY + tick);
      // Bottom-left
      ctx.moveTo(boxX - 2, boxY + boxSize - tick);
      ctx.lineTo(boxX - 2, boxY + boxSize + 2);
      ctx.lineTo(boxX + tick, boxY + boxSize + 2);
      // Bottom-right
      ctx.moveTo(boxX + boxSize - tick, boxY + boxSize + 2);
      ctx.lineTo(boxX + boxSize + 2, boxY + boxSize + 2);
      ctx.lineTo(boxX + boxSize + 2, boxY + boxSize - tick);
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(17, 24, 39, 1.0)";
      ctx.stroke();
    }

    /* ── 3. Live Coordinate Readout ── */
    if (options.showCoordinates) {
      const coordStr = `${px.toString().padStart(4, "0")} : ${py.toString().padStart(4, "0")}`;
      const stateLabel = isInteractive ? " [LOCK]" : "";
      const fullText = `X:Y  ${coordStr}${stateLabel}`;

      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "middle";

      const textMetrics = ctx.measureText(fullText);
      const textWidth = Math.ceil(textMetrics.width);
      const badgeHeight = 16;
      const paddingX = 6;
      const badgeWidth = textWidth + paddingX * 2;

      // Smart positioning: auto-flip if near canvas edges
      let badgeX = px + halfBox + 6;
      let badgeY = py + halfBox + 6;

      if (badgeX + badgeWidth > width - 8) {
        badgeX = px - halfBox - 6 - badgeWidth;
      }
      if (badgeY + badgeHeight > height - 8) {
        badgeY = py - halfBox - 6 - badgeHeight;
      }

      // Readout backdrop tag:
      // Dark mode: translucent obsidian pill
      // Light mode: solid deep ink pill (100% readable over any light background or card)
      ctx.fillStyle = isDark
        ? (isInteractive ? "rgba(10, 10, 14, 0.88)" : "rgba(10, 10, 14, 0.75)")
        : (isInteractive ? "rgba(17, 24, 39, 0.96)" : "rgba(17, 24, 39, 0.88)");
      ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);

      // Readout border
      ctx.strokeStyle = isDark
        ? (isInteractive ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)")
        : (isInteractive ? "rgba(17, 24, 39, 1.0)" : "rgba(17, 24, 39, 0.25)");
      ctx.strokeRect(badgeX + 0.5, badgeY + 0.5, badgeWidth, badgeHeight);

      // Readout text: always crisp white on dark backdrop tag for maximum contrast
      ctx.fillStyle = isInteractive
        ? "#FFFFFF"
        : (isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.92)");
      ctx.fillText(fullText, badgeX + paddingX, badgeY + badgeHeight / 2);
    }

    ctx.restore();
  }

  /* ── On-demand rAF renderer (Zero idle CPU drain) ── */
  function requestDraw() {
    if (!isEnabled) return;
    needsRedraw = true;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (isEnabled && needsRedraw) {
          draw();
          needsRedraw = false;
        }
      });
    }
  }

  function startLoop() {
    requestDraw();
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* ── Event Handlers ── */
  let lastTarget: Element | null = null;

  function onPointerMove(e: PointerEvent | MouseEvent) {
    if (!isEnabled) return;

    if (isContainerScoped && options.container) {
      const rect = options.container.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      isPointerInside =
        pointerX >= 0 && pointerX <= rect.width &&
        pointerY >= 0 && pointerY <= rect.height;
    } else {
      pointerX = e.clientX;
      pointerY = e.clientY;
      isPointerInside = true;
    }

    // Detect interactive target only when pointer enters a new DOM element
    const target = e.target as Element | null;
    if (target !== lastTarget) {
      lastTarget = target;
      if (target && typeof target.closest === "function") {
        isInteractive = Boolean(
          target.closest("a, button, input, textarea, select, [role='button'], .cursor-pointer")
        );
      } else {
        isInteractive = false;
      }
    }

    requestDraw();
  }

  function onPointerLeave() {
    isPointerInside = false;
    lastTarget = null;
    requestDraw();
  }

  function onPointerEnter() {
    isPointerInside = true;
    requestDraw();
  }

  function onResize() {
    updateCanvasSize();
    requestDraw();
  }

  function onThemeChange() {
    requestDraw();
  }

  /* ── Media Query Change Listeners ── */
  function evaluateCapability() {
    const shouldEnable = finePointerMedia.matches && !reducedMotionMedia.matches;
    if (shouldEnable === isEnabled) return;

    isEnabled = shouldEnable;
    if (isEnabled) {
      initCanvas();
      attachListeners();
      startLoop();
    } else {
      detachListeners();
      stopLoop();
      removeCanvas();
    }
  }

  function attachListeners() {
    const scope: Window | HTMLElement = isContainerScoped && options.container ? options.container : window;

    scope.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    scope.addEventListener("pointerleave", onPointerLeave as EventListener, { passive: true });
    scope.addEventListener("pointerenter", onPointerEnter as EventListener, { passive: true });

    if (isContainerScoped && options.container && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateCanvasSize());
      resizeObserver.observe(options.container);
    } else {
      window.addEventListener("resize", onResize, { passive: true });
    }

    // Observe theme toggles on document root
    if (typeof MutationObserver !== "undefined") {
      themeObserver = new MutationObserver(() => {
        onThemeChange();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    }

    colorSchemeMedia.addEventListener("change", onThemeChange);
  }

  function detachListeners() {
    const scope: Window | HTMLElement = isContainerScoped && options.container ? options.container : window;

    scope.removeEventListener("pointermove", onPointerMove as EventListener);
    scope.removeEventListener("pointerleave", onPointerLeave as EventListener);
    scope.removeEventListener("pointerenter", onPointerEnter as EventListener);

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    window.removeEventListener("resize", onResize);

    if (themeObserver) {
      themeObserver.disconnect();
      themeObserver = null;
    }
    colorSchemeMedia.removeEventListener("change", onThemeChange);
  }

  // Initial mount
  if (isEnabled) {
    initCanvas();
    attachListeners();
    startLoop();
  }

  // Listen to pointer/motion capabilities
  finePointerMedia.addEventListener("change", evaluateCapability);
  reducedMotionMedia.addEventListener("change", evaluateCapability);

  /* ── Public API ── */
  return {
    destroy: () => {
      stopLoop();
      detachListeners();
      removeCanvas();

      finePointerMedia.removeEventListener("change", evaluateCapability);
      reducedMotionMedia.removeEventListener("change", evaluateCapability);
    },
    setOptions: (newOptions: Partial<CrosshairHudOptions>) => {
      Object.assign(options, newOptions);
      if (canvas && newOptions.mixBlendMode) {
        canvas.style.mixBlendMode = newOptions.mixBlendMode;
      }
      needsRedraw = true;
    },
  };
}
