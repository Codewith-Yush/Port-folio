import { useEffect, useState } from "react";

type LoaderOverlayProps = {
  durationMs?: number;
};

export function LoaderOverlay({ durationMs = 3000 }: LoaderOverlayProps) {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("exit"), durationMs);
    const doneTimer = window.setTimeout(() => setPhase("done"), durationMs + 520);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [durationMs]);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.style.overflow = "";
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`loader-overlay ${phase === "exit" ? "loader-overlay--exit" : ""}`}>
      <div className="loader-overlay__grain" aria-hidden="true" />
      <div className="loader-overlay__content">
        <div className="uiverse-loader-card" aria-hidden="true">
          <div className="uiverse-loader">
            <span>Loading</span>
            <div className="uiverse-words">
              <span className="uiverse-word">portfolio</span>
              <span className="uiverse-word">projects</span>
              <span className="uiverse-word">skills</span>
              <span className="uiverse-word">contact</span>
              <span className="uiverse-word">portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

