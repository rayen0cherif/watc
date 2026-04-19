/* ────────────────────────────────────────────────────────
   Shared types for the student frontend
   ──────────────────────────────────────────────────────── */

export type KanbanTask = {
  id: number;
  title: string;
  status: "a_faire" | "en_cours" | "terminé" | "termine";
  priority: "high" | "medium" | "low";
  jalon: string;
  dueDate: string;
};

export type Meeting = {
  id: number;
  title: string;
  date: string;
  time: string;
  mentor: string;
  mentorInitials: string;
  mentorColor: string;
  upcoming: boolean;
};

export type MilestoneV1 = {
  id: number;
  title: string;
  status: "terminé" | "en cours" | "bloqué" | "à faire";
  date: string;
};

export type Skill = {
  name: string;
  progress: number;
};

export type Deliverable = {
  id: number;
  name: string;
  type: string;
  status: "validé" | "en_attente" | "en_cours" | "a_faire";
  date: string;
};

export type EvaluationCriterion = {
  id: number;
  name: string;
  description: string;
  stars: number;
  maxStars: number;
};

export type AIQuestion = {
  id: number;
  context: string;
  question: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
};

export type JobOpportunity = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  match: number;
  skills: string[];
  urgent: boolean;
};

export type StudentProfile = {
  id: number;
  fullName: string;
  initials: string;
  email: string;
  role: string;
  department: string;
};

export type ProjectData = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  deadline: string;
  defenseDate: string | null;
  companyName: string | null;
  companyAddress: string | null;
  progress: number;
  aiScore: number;
  student: StudentProfile;
};
