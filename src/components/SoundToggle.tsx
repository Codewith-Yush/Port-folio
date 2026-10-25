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
      title={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      aria-label={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      className="btn-neo-control group relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] active:scale-95"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4 text-emerald-600 dark:text-[#C7ED70] transition-colors" />
      ) : (
        <VolumeX className="h-4 w-4 text-[var(--muted)] transition-opacity group-hover:text-[var(--ink)]" />
      )}
      {enabled && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#C7ED70]" />
        </span>
      )}
    </button>
  );
}
