import { useEffect } from "react";
import { mountCrosshairHud } from "./crosshair-hud";

/**
 * CustomCursor - "Crosshair HUD" Pointer Effect
 *
 * Full-bleed guide lines at exact pointer position (no lerp)
 * Box size: 16px | Line opacity: 0.35 | Coordinates: On
 *
 * Visibility & Theme:
 * - Perfectly visible in both Light Mode (deep ink lines) & Dark Mode (crisp white lines)
 * - Automatically updates instantly on theme change
 *
 * Accessibility:
 * - Native cursor is never hidden (system arrow stays visible and responsive)
 * - Additive overlay: position: fixed, pointer-events: none, aria-hidden="true"
 * - Disables automatically on touch/coarse pointers and prefers-reduced-motion
 */
export function CustomCursor() {
  useEffect(() => {
    // Mount full-screen viewport crosshair HUD with adaptive theme handling
    const hud = mountCrosshairHud(null, {
      boxSize: 16,
      lineOpacity: 0.35,
      showCoordinates: true,
      theme: "auto",
      mixBlendMode: "normal",
    });

    return () => {
      hud.destroy();
    };
  }, []);

  return null;
}
