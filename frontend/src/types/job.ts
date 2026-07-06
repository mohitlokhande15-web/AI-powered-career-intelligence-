export type Job = {
  id: number;
  initials: string;
  company: string;
  title: string;
  location: string;
  workMode: string;
  match: number;
  skills: string[];
  missingSkills: string[];
  description: string;
};