import type { Service } from "../data/portfolio";

type ServiceIconProps = {
  icon: Service["icon"];
  className?: string;
};

export function ServiceIcon({ icon, className = "h-6 w-6" }: ServiceIconProps) {
  if (icon === "motion") {
    // AI Content Creation: Minimalist Neural Generative Spark & Kinetic Orbitals
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Central Generative 4-point Spark */}
        <path
          d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
          className="fill-[#B39CFF]/15 stroke-[#B39CFF]"
        />
        {/* Orbital Satellite Points */}
        <circle cx="19" cy="5" r="1.5" className="fill-[#1E90FF] stroke-none" />
        <circle cx="5" cy="19" r="1.5" className="fill-[#FF0099] stroke-none" />
        {/* Micro Glow Cross */}
        <path d="M19 2V8M16 5H22" strokeWidth="1.2" className="stroke-[#B39CFF]/80" />
      </svg>
    );
  }

  if (icon === "systems") {
    // Power BI Dashboards: Precision Telemetry Analytics & Interactive Matrix
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Outer Minimalist Display Border */}
        <rect x="2.5" y="3" width="19" height="18" rx="3" className="stroke-current opacity-30" />
        {/* Telemetry Metric Bars */}
        <rect
          x="6"
          y="13"
          width="2.5"
          height="5"
          rx="1"
          className="fill-[#1E90FF]/30 stroke-[#1E90FF]"
        />
        <rect
          x="10.75"
          y="9"
          width="2.5"
          height="9"
          rx="1"
          className="fill-[#B39CFF]/40 stroke-[#B39CFF]"
        />
        <rect
          x="15.5"
          y="6"
          width="2.5"
          height="12"
          rx="1"
          className="fill-[#B39CFF] stroke-[#B39CFF]"
        />
        {/* Ascending Trend Line */}
        <path
          d="M6 11L11 7L16 4"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          className="stroke-[#1E90FF]"
        />
        <circle cx="16" cy="4" r="1.5" className="fill-[#FF0099] stroke-none" />
      </svg>
    );
  }

  // blocks: Modern Responsive Website Engineering (Architectural Viewport & Code Core)
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Sleek Browser Viewport with Super-ellipse Curvature */}
      <rect x="2" y="3.5" width="20" height="17" rx="3.5" className="stroke-current opacity-35" />
      {/* Header Divider Line */}
      <line x1="2" y1="8" x2="22" y2="8" className="stroke-current opacity-25" />
      {/* Studio Window Dots */}
      <circle cx="5.5" cy="5.75" r="1" className="fill-current opacity-40" />
      <circle cx="8.5" cy="5.75" r="1" className="fill-current opacity-40" />
      {/* Minimalist Code Construct < / > */}
      <path
        d="M8.5 12L6.5 14L8.5 16"
        className="stroke-[#B39CFF]"
        strokeWidth="1.6"
      />
      <path
        d="M15.5 12L17.5 14L15.5 16"
        className="stroke-[#B39CFF]"
        strokeWidth="1.6"
      />
      <line
        x1="13.5"
        y1="11.5"
        x2="10.5"
        y2="16.5"
        className="stroke-[#1E90FF]"
        strokeWidth="1.6"
      />
    </svg>
  );
}