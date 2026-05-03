export type Project = {
  title: string;
  stack: string[];
  description: string;
  image: string;
  role: string;
  year: string;
  impact: string;
  features: string[];
  metrics: Array<{
    value: string;
    label: string;
  }>;
};

export type SkillGroup = {
  title: string;
  skills: Array<{
    name: string;
    level: number;
  }>;
};

export type Service = {
  title: string;
  description: string;
  icon: "blocks" | "motion" | "systems";
  outcome: string;
  timeline: string;
  deliverables: string[];
  process: string[];
  bestFor: string[];
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const projects: Project[] = [
  {
    title: "Orbit Studio",
    stack: ["React", "TypeScript", "Tailwind"],
    description:
      "A modular creative dashboard with animated panels, realtime filters, and crisp responsive states.",
    image: "/projects/orbit-studio.svg",
    role: "Frontend architecture and UI motion",
    year: "2026",
    impact:
      "Built a focused studio dashboard that helps creators move from idea to polished campaign without losing visual context.",
    features: [
      "Layered workspace with responsive panels",
      "Animated filter states and saved views",
      "Reusable card and toolbar system",
    ],
    metrics: [
      { value: "38%", label: "faster campaign setup" },
      { value: "12", label: "reusable UI modules" },
    ],
  },
  {
    title: "Pulse Commerce",
    stack: ["Next.js", "Node", "Design Systems"],
    description:
      "A conversion-focused commerce interface with fast product discovery and polished checkout flows.",
    image: "/projects/pulse-commerce.svg",
    role: "Product UI, checkout flow, performance",
    year: "2025",
    impact:
      "Designed a sharp commerce experience that keeps product discovery quick, visual, and easy to complete on mobile.",
    features: [
      "Fast product filtering and comparison",
      "High-trust checkout interaction states",
      "Mobile-first product card layout",
    ],
    metrics: [
      { value: "24%", label: "checkout friction reduced" },
      { value: "1.8s", label: "target interaction load" },
    ],
  },
  {
    title: "Signal Atlas",
    stack: ["React", "Charts", "API Design"],
    description:
      "An analytics workspace that turns dense operational data into calm, scannable decision surfaces.",
    image: "/projects/signal-atlas.svg",
    role: "Data UI, charts, API integration",
    year: "2025",
    impact:
      "Created a clean analytics surface where teams can scan trends, compare signals, and make decisions quickly.",
    features: [
      "Metric cards with progressive disclosure",
      "Chart-ready API data structure",
      "Accessible status and alert patterns",
    ],
    metrics: [
      { value: "3x", label: "faster signal scanning" },
      { value: "9", label: "dashboard states covered" },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React architecture", level: 94 },
      { name: "TypeScript", level: 90 },
      { name: "Interface systems", level: 92 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "API integration", level: 84 },
      { name: "Node workflows", level: 78 },
      { name: "Performance tuning", level: 86 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Design systems", level: 91 },
      { name: "Testing strategy", level: 82 },
      { name: "Delivery automation", level: 80 },
    ],
  },
];

export const services: Service[] = [
  {
    title: "Product Interfaces",
    description:
      "Sharp, accessible web products designed around real workflows and long-term maintainability.",
    icon: "blocks",
    outcome:
      "A polished interface system that feels premium, loads fast, and stays easy to extend as the product grows.",
    timeline: "2-6 weeks",
    deliverables: [
      "Responsive page and component build",
      "Accessible interaction states",
      "Reusable Tailwind component patterns",
    ],
    process: ["Audit", "Layout system", "Component build", "Responsive polish"],
    bestFor: ["Portfolios", "Dashboards", "SaaS products"],
  },
  {
    title: "Motion Systems",
    description:
      "Subtle transitions and microinteractions that make complex UI feel direct and responsive.",
    icon: "motion",
    outcome:
      "A smooth motion layer that guides attention without slowing the experience or making the interface feel busy.",
    timeline: "1-3 weeks",
    deliverables: [
      "Entrance and scroll animations",
      "Hover and press microinteractions",
      "Reduced-motion safe fallbacks",
    ],
    process: ["Motion map", "Timing system", "Interaction pass", "Performance check"],
    bestFor: ["Landing pages", "Portfolios", "Interactive sections"],
  },
  {
    title: "Frontend Foundations",
    description:
      "Component architecture, state patterns, and performance budgets that scale without drama.",
    icon: "systems",
    outcome:
      "A cleaner frontend base with predictable structure, typed data, and fewer fragile one-off UI decisions.",
    timeline: "3-8 weeks",
    deliverables: [
      "Component architecture plan",
      "Typed data and state patterns",
      "Build and performance cleanup",
    ],
    process: ["Code review", "Refactor map", "System build", "Quality pass"],
    bestFor: ["Growing apps", "Team handoff", "Legacy UI cleanup"],
  },
];
