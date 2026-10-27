export type Project = {
  title: string;
  category?: "web" | "data" | "design";
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
  link?: string;
  github?: string;
  galleryLink?: string;
  galleryImages?: string[];
};

export type SkillGroup = {
  title: string;
  category: string;
  skills: Array<{
    name: string;
    level: number;
    tier: "Advanced" | "Core" | "Specialized" | "Production";
    tags?: string[];
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

export const personalInfo = {
  name: "Ayush Singh",
  title: "Full Stack Developer & Creative Technologist",
  headline: "Full Stack Developer, Creative Technologist & Data Science (Power BI)",
  bio: "I build responsive digital systems bridging the gap between scalable data architecture, interactive Power BI business intelligence, and modern high-performance web applications.",
  email: "ayushsingh7360@gmail.com",
  github: "https://github.com/codewith-Yush",
  linkedin: "https://linkedin.com/in/ayush-singh-643a4b25a",
  twitter: "https://twitter.com/ayushsingh",
  resumeUrl: "/resume",
  location: "New Delhi, India (IST)",
  availability: "Available for Freelance & Full-time Roles",
};

export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Gallery", href: "/canva-gallery" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "#contact" },
];

export const projects: Project[] = [
  {
    title: "AI Creator Hub",
    category: "web",
    stack: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    description:
      "A modern AI-powered content platform designed for digital creators, brands, and multimedia storytelling with instant generation workflows.",
    image: "/images/projects/ai-creator.webp",
    role: "Frontend Development & UI Design",
    year: "2026",
    impact:
      "Built an intuitive creative suite that streamlines AI prompt curation, workflow orchestration, and digital branding assets.",
    features: [
      "Responsive and modern high-contrast dashboard layout",
      "Dynamic real-time generation previews and prompt history",
      "Modular, reusable UI components built with Tailwind and React",
      "Optimized client-side rendering with sub-second page transitions",
    ],
    metrics: [
      { value: "40%", label: "higher user retention" },
      { value: "15+", label: "production UI components" },
    ],
    link: "https://astragen-ai-ten.vercel.app/",
    github: "https://github.com/codewith-Yush/astragen-ai",
  },
  {
    title: "PulseAnalytics - Predictive BI Platform",
    category: "data",
    stack: ["Python", "Power BI", "React", "FastAPI", "Data Science"],
    description:
      "An end-to-end business intelligence engine integrating machine learning predictive models with interactive Power BI analytical dashboards for automated trend forecasting.",
    image: "/images/projects/web.webp",
    role: "Data Engineering & Full Stack Development",
    year: "2026",
    impact:
      "Engineered automated ETL pipelines and predictive forecasting models, decreasing manual reporting overhead by 60% and delivering real-time actionable insights.",
    features: [
      "Automated multi-source data ingestion pipeline built with Python",
      "Interactive Power BI embedded dashboards with granular drill-down filters",
      "Time-series predictive forecasting algorithm for quarterly metric analysis",
      "Production-ready responsive analytics interface with sub-second queries",
    ],
    metrics: [
      { value: "60%", label: "faster reporting cycles" },
      { value: "99.4%", label: "pipeline data integrity" },
    ],
    github: "https://github.com/codewith-Yush/pulse-analytics-dashboard",
    link: "https://github.com/codewith-Yush/pulse-analytics-dashboard",
  },
  {
    title: "Canva Design Showcase",
    category: "design",
    stack: ["Canva Pro", "Brand Systems", "Visual Identity", "Typography"],
    description:
      "A curated exhibition of high-impact visual design systems, brand identities, social campaign kits, and editorial print layouts.",
    image: "/images/projects/design1.webp",
    role: "Creative Direction & Visual Systems",
    year: "2026",
    impact:
      "Engineered reusable design token systems and marketing assets that elevated visual engagement across multi-channel campaigns.",
    features: [
      "15+ production-ready brand templates and visual identities",
      "Multi-channel social campaigns, motion graphics, and banners",
      "High-resolution print media and editorial composition",
      "Cohesive typographic hierarchy and color theory execution",
    ],
    metrics: [
      { value: "15+", label: "exhibition artworks showcased" },
      { value: "100%", label: "bespoke brand typography & grids" },
    ],
    galleryLink: "/canva-gallery",
    galleryImages: [
      "/images/projects/design1.webp",
      "/images/projects/design2.webp",
      "/images/projects/design3.webp",
      "/images/projects/design4.webp",
      "/images/projects/design5.webp",
      "/images/projects/design6.webp",
      "/images/projects/design7.webp",
      "/images/projects/design8.webp",
      "/images/projects/design9.webp",
      "/images/projects/design10.webp",
      "/images/projects/design11.webp",
      "/images/projects/design12.webp",
      "/images/projects/design13.webp",
      "/images/projects/design14.webp",
      "/images/projects/design17.webp",
    ],
  },
  {
    title: "Tadka Indian Dining",
    category: "web",
    stack: ["React", "Tailwind CSS", "JavaScript", "Responsive UI"],
    description:
      "A culinary web experience for an authentic Indian restaurant, featuring interactive category menus, reservation inquiries, and appetizing visual storytelling.",
    image: "/images/projects/tadka.webp",
    role: "UI/UX Design & Frontend Engineering",
    year: "2025",
    impact:
      "Designed and launched an engaging restaurant platform that drives table reservations and showcases culinary specialties with high conversion.",
    features: [
      "Dynamic interactive menu with rich dietary filters and pricing",
      "Fast online table reservation and direct inquiry flow",
      "Cinematic culinary gallery with smooth touch swipe support",
      "100% mobile-first responsive layout with sub-second page loads",
    ],
    metrics: [
      { value: "98/100", label: "Lighthouse performance score" },
      { value: "100%", label: "mobile-optimized reservation flow" },
    ],
    link: "https://tadka-indian-restaurant.vercel.app/",
    github: "https://github.com/codewith-Yush/tadka-restaurant",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Web Engineering",
    category: "Full Stack & Modern Frontend",
    skills: [
      { name: "React 19 & Next.js", level: 95, tier: "Advanced", tags: ["SSR", "Hooks", "Server Actions"] },
      { name: "TypeScript & JavaScript", level: 92, tier: "Advanced", tags: ["Type Safety", "ESNext", "Async"] },
      { name: "Tailwind CSS & Responsive UI", level: 94, tier: "Production", tags: ["Design Systems", "Mobile First"] },
      { name: "REST APIs & Modern Backend", level: 88, tier: "Core", tags: ["FastAPI", "Node.js", "JSON"] },
    ],
  },
  {
    title: "Data Science & AI",
    category: "Analytics & Machine Learning",
    skills: [
      { name: "Python & Data Processing", level: 88, tier: "Advanced", tags: ["Pandas", "NumPy", "Automation"] },
      { name: "Power BI & BI Dashboards", level: 90, tier: "Production", tags: ["DAX", "Power Query", "Visuals"] },
      { name: "Data Visualization & EDA", level: 86, tier: "Core", tags: ["Matplotlib", "Seaborn", "Stats"] },
      { name: "Generative AI & Video Workflows", level: 90, tier: "Specialized", tags: ["Prompting", "AI Pipeline"] },
    ],
  },
  {
    title: "Design & Workflow",
    category: "Visual Direction & Tooling",
    skills: [
      { name: "UI/UX & Brand Design", level: 92, tier: "Advanced", tags: ["Canva Pro", "Figma", "Typography"] },
      { name: "GSAP & Kinetic Motion", level: 88, tier: "Specialized", tags: ["ScrollTrigger", "Micro-Interactions"] },
      { name: "Git, GitHub & CI/CD", level: 90, tier: "Core", tags: ["Version Control", "Vercel", "Vite"] },
      { name: "Creative Strategy & Branding", level: 94, tier: "Production", tags: ["Social Kits", "Content Systems"] },
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
