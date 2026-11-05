/**
 * Tactile Micro-Sound Effects Engine powered by native Web Audio API.
 * - 0 KB download, 0 external audio files
 * - Synthesizes tactile, modern acoustic feedback in real time
 * - Global audio auto-unlock on user gesture
 * - Universal click audio on every click across the portfolio
 * - Persistent toggle state via localStorage ('portfolio_sound_fx')
 */

let audioCtx: AudioContext | null = null;
let lastExplicitSoundTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  return audioCtx;
}

// Global user interaction listener to unlock AudioContext on first tap/click/key
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };

  window.addEventListener("pointerdown", unlockAudio, { passive: true, capture: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true, capture: true });
}

export function isSoundFxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("portfolio_sound_fx");
  return stored === null ? true : stored === "true";
}

export function setSoundFxEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("portfolio_sound_fx", String(enabled));
  window.dispatchEvent(
    new CustomEvent("portfolio-sound-change", { detail: { enabled } })
  );
  if (enabled) {
    playClick("interactive");
  }
}

export function toggleSoundFx(): boolean {
  const next = !isSoundFxEnabled();
  setSoundFxEnabled(next);
  return next;
}

export function markExplicitSound(): void {
  lastExplicitSoundTime = performance.now();
}

/**
 * Tactile Click Synthesis:
 * - "interactive": Dual-layer luxury tactile switch (sharp high transient + subtle low body thump)
 * - "subtle": Soft, gentle micro-tap for general background/text clicks
 */
export function playClick(variant: "interactive" | "subtle" = "interactive"): void {
  if (!isSoundFxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    lastExplicitSoundTime = performance.now();

    const execute = () => {
      const now = ctx.currentTime;
      // Organic micro-pitch variation (±4%) to mimic real mechanical switches
      const jitter = 0.96 + Math.random() * 0.08;

      if (variant === "subtle") {
        // Soft, elegant micro-tap for non-interactive / background clicks
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1150 * jitter, now);
        osc.frequency.exponentialRampToValueAtTime(480 * jitter, now + 0.018);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.075, now + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.024);
        return;
      }

      // Crisp luxury tactile switch click for interactive elements (buttons, links, controls)
      // Layer 1: High-frequency transient snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();

      snapOsc.type = "sine";
      snapOsc.frequency.setValueAtTime(1450 * jitter, now);
      snapOsc.frequency.exponentialRampToValueAtTime(360 * jitter, now + 0.022);

      snapGain.gain.setValueAtTime(0.0001, now);
      snapGain.gain.linearRampToValueAtTime(0.24, now + 0.001);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.028);

      // Layer 2: Tactile low-end body thump (simulates physical mechanical key bottom-out)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(165 * jitter, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(55 * jitter, now + 0.028);

      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.linearRampToValueAtTime(0.14, now + 0.001);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.035);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(execute).catch(() => {});
    } else {
      execute();
    }
  } catch {
    // Fail silently
  }
}

/**
 * Filter / tab transition pop (satisfying subtle bubble)
 */
export function playTab(): void {
  if (!isSoundFxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    markExplicitSound();

    const execute = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.07);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(execute).catch(() => {});
    } else {
      execute();
    }
  } catch {
    // Fail silently
  }
}

/**
 * Dual-tone chime for Theme Toggle (Light/Dark switch)
 */
export function playSwitch(): void {
  if (!isSoundFxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    markExplicitSound();

    const execute = () => {
      const now = ctx.currentTime;
      [580, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        const startAt = now + idx * 0.045;
        osc.frequency.setValueAtTime(freq, startAt);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startAt + 0.06);

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(0.22, startAt + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startAt);
        osc.stop(startAt + 0.065);
      });
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(execute).catch(() => {});
    } else {
      execute();
    }
  } catch {
    // Fail silently
  }
}

/**
 * Pleasant ascending triad chime for success (Email copied / Form sent)
 */
export function playSuccess(): void {
  if (!isSoundFxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    markExplicitSound();

    const execute = () => {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        const startAt = now + idx * 0.065;
        osc.frequency.setValueAtTime(freq, startAt);

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(0.24, startAt + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startAt);
        osc.stop(startAt + 0.32);
      });
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(execute).catch(() => {});
    } else {
      execute();
    }
  } catch {
    // Fail silently
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Scroll Sound (Disabled per request)
───────────────────────────────────────────────────────────────────────────── */

/**
 * Scroll notch sound (disabled)
 */
export function playScrollTick(_direction: number = 1, _velocity: number = 0): void {
  // Disabled
}

/**
 * Scroll movement handler (disabled)
 */
export function handleScrollMovement(
  _currentY: number,
  _velocity?: number,
  _direction?: number
): void {
  // Disabled
}

/* ─────────────────────────────────────────────────────────────────────────────
   Universal Click Interceptor
   • Captures EVERY click anywhere across the portfolio
   • Differentiates between interactive elements and general page clicks
   • Deduplicates against explicit component sounds (Theme switch, Success chime)
───────────────────────────────────────────────────────────────────────────── */

function handleGlobalDocumentClick(event: MouseEvent): void {
  if (!isSoundFxEnabled()) return;

  // If a specialized sound or component explicit click was triggered within 45ms, don't duplicate
  const now = performance.now();
  if (now - lastExplicitSoundTime < 45) return;

  const target = event.target as HTMLElement | null;
  if (!target) return;

  // Skip if clicking the sound toggle button itself (so muting doesn't play a click)
  if (target.closest("[data-sound-toggle]")) return;

  // Skip if element explicitly requests no sound
  if (target.closest("[data-no-sound]")) return;

  // Determine whether target is an interactive element
  const isInteractive = Boolean(
    target.closest(
      "button, a, input, textarea, select, label, [role='button'], [role='tab'], summary, [data-clickable='true'], .cursor-pointer"
    ) ||
    target.tagName === "BUTTON" ||
    target.tagName === "A" ||
    target.getAttribute("role") === "button"
  );

  if (isInteractive) {
    playClick("interactive");
  } else {
    // General background, canvas, or text reading click
    playClick("subtle");
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Global Sound Engine Auto-Initialization
───────────────────────────────────────────────────────────────────────────── */

let isInitialized = false;

export function initGlobalSoundSystem(): () => void {
  if (typeof window === "undefined" || isInitialized) {
    return () => {};
  }
  isInitialized = true;

  // Universal click listener (bubble phase on document)
  document.addEventListener("click", handleGlobalDocumentClick, { passive: true });

  // Cleanup helper
  return () => {
    document.removeEventListener("click", handleGlobalDocumentClick);
    isInitialized = false;
  };
}

// Auto-run in browser environment
if (typeof window !== "undefined") {
  initGlobalSoundSystem();
}
