import { mockAiProfile, mockAiQuiz } from "@/data/mocks";
import type { AiEvaluationResult, AiProfile, AiQuiz } from "@/types";

// TODO(backend): wire to /api/ai/* endpoints (Gemini-backed).

export async function fetchAiProfileDraft(): Promise<AiProfile> {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return mockAiProfile;
}

export async function fetchAiQuiz(): Promise<AiQuiz> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAiQuiz;
}

export async function submitAiEvaluation(_payload: {
  answers: Record<string, string>;
}): Promise<AiEvaluationResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Deterministic mock scoring — produce a realistic mid-range score.
  const filled = Object.keys(_payload.answers).length;
  const score = Math.min(95, 55 + filled * 5);
  return {
    score,
    summary:
      "Solide maîtrise des fondamentaux. Des axes d'approfondissement identifiés autour du design logiciel et des tests.",
  };
}
