import {
  CareerInsight,
  CareerRoadmapItem,
  ScoreMetric,
} from "@/types/career";

export const scoreMetrics: ScoreMetric[] = [
  {
    label: "Resume quality",
    score: 84,
  },
  {
    label: "Technical alignment",
    score: 76,
  },
  {
    label: "Career readiness",
    score: 71,
  },
  {
    label: "Professional evidence",
    score: 68,
  },
];

export const strengths: CareerInsight[] = [
  {
    title: "Analytical foundation",
    description:
      "Your profile demonstrates exposure to Python, data analysis, and structured technical problem solving.",
  },
  {
    title: "Project-driven learning",
    description:
      "Practical projects provide evidence that you can apply technical concepts beyond academic coursework.",
  },
  {
    title: "Cross-domain profile",
    description:
      "Your engineering and AI exposure creates a broader technical foundation for analytical roles.",
  },
];

export const limitations: CareerInsight[] = [
  {
    title: "Limited SQL evidence",
    description:
      "SQL is relevant to your target role but is not strongly demonstrated through projects or experience.",
    severity: "High impact",
  },
  {
    title: "Weak business intelligence evidence",
    description:
      "Your profile does not yet show enough dashboard development or business reporting work.",
    severity: "High impact",
  },
  {
    title: "Project impact is unclear",
    description:
      "Several projects explain technical work but do not communicate measurable outcomes or professional value.",
    severity: "Medium impact",
  },
];

export const roadmap: CareerRoadmapItem[] = [
  {
    number: "01",
    period: "Now",
    title: "Strengthen SQL proficiency",
    description:
      "Learn joins, subqueries, aggregations, window functions, and apply them in one complete analytics project.",
  },
  {
    number: "02",
    period: "Next",
    title: "Build a business intelligence project",
    description:
      "Create a Power BI dashboard that solves a clear business problem and communicates measurable insights.",
  },
  {
    number: "03",
    period: "Then",
    title: "Rebuild project positioning",
    description:
      "Rewrite resume projects around problems, technical decisions, measurable outcomes, and professional impact.",
  },
  {
    number: "04",
    period: "Target",
    title: "Apply to aligned analyst roles",
    description:
      "Prioritise graduate and entry-level analytical roles where your improved profile reaches stronger alignment.",
  },
];