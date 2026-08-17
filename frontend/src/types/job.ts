export type Job = {
  id: string;
  initials: string;
  company: string;
  title: string;
  location: string;
  workMode: string;
  match: number;
  skills: string[];
  missingSkills: string[];
  description: string;
  url?: string | null;
};