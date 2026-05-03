import type { Service } from "../data/portfolio";

type ServiceIconProps = {
  icon: Service["icon"];
};

export function ServiceIcon({ icon }: ServiceIconProps) {
  if (icon === "motion") {
    return (
      <span className="relative block h-12 w-12" aria-hidden="true">
        <span className="absolute left-0 top-2 h-8 w-8 rounded-full bg-blush" />
        <span className="absolute bottom-1 right-0 h-7 w-7 rounded-full border-[10px] border-flame" />
      </span>
    );
  }

  if (icon === "systems") {
    return (
      <span className="grid h-12 w-12 grid-cols-2 gap-1" aria-hidden="true">
        <span className="bg-flame" />
        <span className="rounded-full bg-blush" />
        <span className="clip-triangle bg-ember" />
        <span className="bg-flame/70" />
      </span>
    );
  }

  return (
    <span className="grid h-12 w-12 grid-cols-2 gap-1" aria-hidden="true">
      <span className="bg-flame" />
      <span className="bg-ember" />
      <span className="bg-blush" />
      <span className="bg-flame/70" />
    </span>
  );
}
