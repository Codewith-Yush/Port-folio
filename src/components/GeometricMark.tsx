type GeometricMarkProps = {
  variant?: "hero" | "compact";
};

export function GeometricMark({ variant = "hero" }: GeometricMarkProps) {
  const compact = variant === "compact";

  return (
    <div
      className={
        compact
          ? "relative h-28 w-28"
          : "hero-geometry relative min-h-[300px] w-full max-w-[480px] sm:min-h-[460px] lg:max-w-[560px] lg:min-h-[520px]"
      }
      aria-hidden="true"
    >
      <div className="absolute inset-0 shape-grid opacity-45" />
      <div className="geometry-orbit absolute left-[6%] top-[3%] h-[42%] w-[42%] rounded-full bg-blush/90 shadow-shape dark:shadow-shape-dark" />
      <div className="geometry-tile absolute right-[10%] top-[10%] h-[32%] w-[32%] bg-flame/85" />
      <div className="geometry-arch clip-semi absolute bottom-[12%] left-[10%] h-[38%] w-[56%] bg-ember/85" />
      <div className="geometry-triangle clip-triangle absolute bottom-[19%] right-[5%] h-[31%] w-[31%] bg-flame/75" />
      <div className="geometry-ring absolute bottom-[32%] left-[42%] h-[17%] w-[17%] rounded-full border-[14px] border-white/70 dark:border-black/30 sm:border-[18px]" />
      <div className="geometry-dot absolute left-[7%] top-[58%] h-[12%] w-[12%] bg-white/70 dark:bg-black/25" />
    </div>
  );
}
