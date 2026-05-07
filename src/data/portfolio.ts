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
    title: "AI Creator Hub",
    stack: ["React", "Next.js", "Tailwind"],
    description:
      "A modern AI-powered content platform designed for creators, brands, and digital storytelling.",
    image: "images/projects/ai-creator.png",
    role: "Frontend development and UI design",
    year: "2026",
    impact:
      "Built a creative platform that helps users manage content creation, branding, and digital engagement more efficiently.",
    features: [
      "Responsive and modern dashboard layout",
      "Smooth animations and interactive sections",
      "Reusable UI components with clean structure",
    ],
    metrics: [
      { value: "40%", label: "improved user engagement" },
      { value: "15+", label: "reusable components created" },
    ],
  },
  {
    title: "Vision Commerce",
    stack: ["Next.js", "Node.js", "Tailwind"],
    description:
      "A fast and responsive ecommerce experience focused on clean design and smooth user interactions.",
    image: "/projects/pulse-commerce.svg",
    role: "UI development and responsive optimization",
    year: "2025",
    impact:
      "Created a user-friendly shopping experience optimized for mobile users and fast product discovery.",
    features: [
      "Modern product browsing interface",
      "Responsive mobile-first design",
      "Optimized checkout interaction flow",
    ],
    metrics: [
      { value: "28%", label: "better conversion experience" },
      { value: "1.6s", label: "average interaction speed" },
    ],
  },
  {
    title: "Insight Analytics",
    stack: ["Power BI", "React", "API Integration"],
    description:
      "An analytics dashboard built to transform complex business data into simple and actionable insights.",
    image: "/projects/signal-atlas.svg",
    role: "Dashboard design and data visualization",
    year: "2025",
    impact:
      "Developed a clean analytics workspace for tracking performance, trends, and business growth.",
    features: [
      "Interactive Power BI dashboards",
      "Real-time data visualization",
      "Clean and accessible chart layouts",
    ],
    metrics: [
      { value: "3x", label: "faster data analysis" },
      { value: "10+", label: "dashboard modules designed" },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Web Development",
    skills: [
      { name: "React & Next.js", level: 92 },
      { name: "HTML, CSS & JavaScript", level: 95 },
      { name: "Responsive UI Design", level: 90 },
    ],
  },
  {
    title: "AI & Content",
    skills: [
      { name: "AI Video Generation", level: 88 },
      { name: "Canva Designing", level: 94 },
      { name: "Content Creation", level: 90 },
    ],
  },
  {
    title: "Analytics & Tools",
    skills: [
      { name: "Power BI Dashboards", level: 86 },
      { name: "Data Visualization", level: 84 },
      { name: "Git & GitHub", level: 82 },
    ],
  },
];

export const services: Service[] = [
  {
    title: "Website Development",
    description:
      "Modern, responsive, and high-performance websites designed for businesses, creators, and personal brands.",
    icon: "blocks",
    outcome:
      "A clean and professional website experience that looks premium, performs fast, and works across all devices.",
    timeline: "2-5 weeks",
    deliverables: [
      "Responsive website development",
      "Modern UI and smooth interactions",
      "Optimized performance and layouts",
    ],
    process: ["Planning", "UI Design", "Development", "Final Optimization"],
    bestFor: ["Portfolios", "Business Websites", "Landing Pages"],
  },
  {
    title: "AI Content Creation",
    description:
      "Creative AI-generated visuals and videos built for social media growth and modern digital branding.",
    icon: "motion",
    outcome:
      "High-quality content that helps brands and creators stand out with engaging visuals and modern storytelling.",
    timeline: "1-2 weeks",
    deliverables: [
      "AI-generated short videos",
      "Social media content design",
      "Creative promotional visuals",
    ],
    process: ["Research", "Content Planning", "AI Generation", "Final Editing"],
    bestFor: ["Instagram Reels", "YouTube Shorts", "Brand Promotion"],
  },
  {
    title: "Power BI Dashboards",
    description:
      "Interactive dashboards and reports that transform raw data into meaningful business insights.",
    icon: "systems",
    outcome:
      "Professional dashboards that help businesses track performance, analyze trends, and make smarter decisions.",
    timeline: "2-4 weeks",
    deliverables: [
      "Interactive Power BI dashboards",
      "Data visualization reports",
      "Business performance analytics",
    ],
    process: ["Data Collection", "Visualization Setup", "Dashboard Design", "Reporting"],
    bestFor: ["Business Analytics", "Sales Reports", "Performance Tracking"],
  },
];