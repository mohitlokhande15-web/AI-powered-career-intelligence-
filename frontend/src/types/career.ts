export type ScoreMetric = {
  label: string;
  score: number;
};

export type CareerInsight = {
  title: string;
  description: string;
  severity?: string;
};

export type CareerRoadmapItem = {
  number: string;
  period: string;
  title: string;
  description: string;
};