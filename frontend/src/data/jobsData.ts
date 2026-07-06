import { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: 1,
    initials: "NS",
    company: "Nova Systems",
    title: "Junior Data Analyst",
    location: "Bengaluru",
    workMode: "Hybrid",
    match: 92,
    skills: ["Python", "Excel", "SQL"],
    missingSkills: ["Power BI"],
    description:
      "Analyse business data, identify trends, and support reporting and dashboard development.",
  },
  {
    id: 2,
    initials: "VS",
    company: "Vertex Systems",
    title: "Business Intelligence Analyst",
    location: "Pune",
    workMode: "On-site",
    match: 86,
    skills: ["Excel", "Data Analysis", "Communication"],
    missingSkills: ["Power BI", "SQL"],
    description:
      "Support business intelligence reporting and translate operational data into actionable insights.",
  },
  {
    id: 3,
    initials: "OT",
    company: "Orbit Technologies",
    title: "Graduate Data Analyst",
    location: "Hyderabad",
    workMode: "Hybrid",
    match: 82,
    skills: ["Python", "Statistics", "Excel"],
    missingSkills: ["SQL"],
    description:
      "Work with analytics teams to clean data, create reports, and communicate business insights.",
  },
  {
    id: 4,
    initials: "ND",
    company: "Northstar Digital",
    title: "Associate Analytics Consultant",
    location: "Mumbai",
    workMode: "Hybrid",
    match: 78,
    skills: ["Analytics", "Python", "Communication"],
    missingSkills: ["Power BI", "Consulting"],
    description:
      "Support analytics consulting projects and help clients understand data-driven business opportunities.",
  },
];