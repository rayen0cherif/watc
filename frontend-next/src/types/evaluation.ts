export type EvaluationStage = "midterm" | "final";

export interface EvaluationCriterion {
  id: string;
  label: string;
  description: string;
  score: number;
  max: number;
}

export interface Evaluation {
  id: string;
  stage: EvaluationStage;
  gradedBy: string;
  gradedAt: string;
  overallScore: number;
  maxScore: number;
  criteria: EvaluationCriterion[];
  strengths: string;
  improvements: string;
}
