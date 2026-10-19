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
  link?: string;
  galleryLink?: string;
  galleryImages?: string[];
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
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const projects: Project[] = [
  {
    title: "AI Creator Hub",
    stack: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    description:
      "A modern AI-powered content platform designed for digital creators, brands, and multimedia storytelling with instant generation workflows.",
    image: "/images/projects/ai-creator.png",
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
  },
  {
    title: "Canva Design Showcase",
    stack: ["Canva Pro", "Brand Systems", "Visual Identity", "Typography"],
    description:
      "A curated exhibition of high-impact visual design systems, brand identities, social campaign kits, and editorial print layouts.",
    image: "/images/projects/design1.jpeg",
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
      "/images/projects/design1.jpeg",
      "/images/projects/design2.jpeg",
      "/images/projects/design3.png",
      "/images/projects/design4.png",
      "/images/projects/design5.png",
      "/images/projects/design6.png",
      "/images/projects/design7.png",
      "/images/projects/design8.png",
      "/images/projects/design9.png",
      "/images/projects/design10.png",
      "/images/projects/design11.png",
      "/images/projects/design12.png",
      "/images/projects/design13.png",
      "/images/projects/design14.png",
      "/images/projects/design17.png",
    ],
  },
  {
    title: "Tadka - Indian Restaurant Experience",
    stack: ["React", "Tailwind CSS", "JavaScript", "Responsive UI"],
    description:
      "A culinary web experience for an authentic Indian restaurant, featuring interactive category menus, reservation inquiries, and appetizing visual storytelling.",
    image: "/images/projects/tadka.png",
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