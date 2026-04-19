export interface AiProfile {
  headline: string;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export interface AiQuizOption {
  id: string;
  label: string;
}

export interface AiQuizQuestion {
  id: string;
  topic: string;
  difficulty: "facile" | "intermédiaire" | "avancé";
  prompt: string;
  options: AiQuizOption[];
}

export interface AiQuiz {
  id: string;
  questions: AiQuizQuestion[];
}

export interface AiEvaluationResult {
  score: number;
  summary: string;
}
