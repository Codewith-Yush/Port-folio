import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      type="button"
      data-sound-toggle="true"
      onClick={handleToggle}
      title={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      aria-label={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      className="btn-neo-control group relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:border-[#B39CFF]"
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={enabled ? "sound-on" : "sound-off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {enabled ? (
              <Volume2 className="h-4 w-4 text-[#1E90FF] dark:text-[#B39CFF] transition-colors" />
            ) : (
              <VolumeX className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--ink)]" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {enabled && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1E90FF] dark:bg-[#B39CFF]" />
        </span>
      )}
    </motion.button>
  );
}
