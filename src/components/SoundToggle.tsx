import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundFxEnabled, toggleSoundFx } from "../utils/soundEffects";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundFxEnabled);

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail) {
        setEnabled(custom.detail.enabled);
      }
    };

    window.addEventListener("portfolio-sound-change", handleSoundChange);
    return () => {
      window.removeEventListener("portfolio-sound-change", handleSoundChange);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleSoundFx();
    setEnabled(next);
  };

  return (
    <button
      type="button"
      data-sound-toggle="true"
      onClick={handleToggle}
      title={enabled ? "Mute interactive sounds" : "Enable interactive sounds"}
      aria-label={enabled ? "Mute interactive sounds" : "Enable interactive sounds"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--ink)] dark:text-white transition-all duration-300 hover:scale-105 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4 text-emerald-500 transition-colors group-hover:text-emerald-400" />
      ) : (
        <VolumeX className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
      )}
      {enabled && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
    </button>
  );
}
