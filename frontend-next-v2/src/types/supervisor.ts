export type StudentStatus = "actif" | "a-risque" | "en-attente" | "termine";

export type SupervisorStudent = {
  id: string;
  name: string;
  initials: string;
  email: string;
  promo: string;
  projectTitle: string;
  progress: number;
  status: StudentStatus;
  hasAlert: boolean;
  alertReason?: string;
  lastActivity: string;
  nextMilestone: string;
};

export type SupervisorDashboard = {
  studentsTotal: number;
  studentsCapacity: number;
  alertsTotal: number;
  alertsCritical: number;
  averageProgress: number;
  progressDelta: number;
  upcomingEvaluations: number;
  upcomingThisWeek: number;
  students: SupervisorStudent[];
};

export const STATUS_LABEL: Record<StudentStatus, string> = {
  actif: "Actif",
  "a-risque": "À risque",
  "en-attente": "En attente",
  termine: "Terminé",
};
