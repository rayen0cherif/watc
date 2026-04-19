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

export const SUPERVISOR_PROFILE = {
  name: "Dr. Hatem Belaïd",
  role: "Encadrant — ENSI",
  initials: "HB",
};

export const SUMMARY = {
  studentsTotal: 8,
  studentsCapacity: 12,
  alertsTotal: 2,
  alertsCritical: 1,
  averageProgress: 64,
  progressDelta: 4,
  upcomingEvaluations: 3,
  upcomingThisWeek: 2,
};

export const STATUS_LABEL: Record<StudentStatus, string> = {
  actif: "Actif",
  "a-risque": "À risque",
  "en-attente": "En attente",
  termine: "Terminé",
};

export const STUDENTS: SupervisorStudent[] = [
  {
    id: "s-01",
    name: "Sami Belkacem",
    initials: "SB",
    email: "sami.belkacem@ensi.tn",
    promo: "ENSI · 5A",
    projectTitle: "Plateforme d'analyse de logs distribués en temps réel",
    progress: 78,
    status: "actif",
    hasAlert: false,
    lastActivity: "il y a 2 h",
    nextMilestone: "Sprint 04 · 25 avr.",
  },
  {
    id: "s-02",
    name: "Inès Triki",
    initials: "IT",
    email: "ines.triki@ensi.tn",
    promo: "ENSI · 5A",
    projectTitle: "Détection d'anomalies sur réseaux IoT industriels",
    progress: 41,
    status: "a-risque",
    hasAlert: true,
    alertReason: "Aucune mise à jour depuis 9 jours",
    lastActivity: "il y a 9 j",
    nextMilestone: "Revue intermédiaire · 22 avr.",
  },
  {
    id: "s-03",
    name: "Khalil Bouazizi",
    initials: "KB",
    email: "khalil.bouazizi@ensi.tn",
    promo: "INSAT · 5A",
    projectTitle: "Optimisation de pipelines CI/CD pour mono-repos",
    progress: 62,
    status: "actif",
    hasAlert: false,
    lastActivity: "hier",
    nextMilestone: "Livrable 03 · 28 avr.",
  },
  {
    id: "s-04",
    name: "Rania Mokrani",
    initials: "RM",
    email: "rania.mokrani@ensi.tn",
    promo: "ENSI · 5A",
    projectTitle: "Recommandation de cours par embeddings vectoriels",
    progress: 88,
    status: "actif",
    hasAlert: false,
    lastActivity: "il y a 4 h",
    nextMilestone: "Pré-soutenance · 02 mai",
  },
  {
    id: "s-05",
    name: "Yassine Nour",
    initials: "YN",
    email: "yassine.nour@ensi.tn",
    promo: "INSAT · 5A",
    projectTitle: "Application mobile de suivi nutritionnel hors-ligne",
    progress: 24,
    status: "a-risque",
    hasAlert: true,
    alertReason: "Retard de 14 jours sur le jalon 02",
    lastActivity: "il y a 6 j",
    nextMilestone: "Recadrage · 21 avr.",
  },
  {
    id: "s-06",
    name: "Lina Saidi",
    initials: "LS",
    email: "lina.saidi@ensi.tn",
    promo: "ENSI · 5A",
    projectTitle: "Détection de fraude bancaire par graph neural networks",
    progress: 55,
    status: "actif",
    hasAlert: false,
    lastActivity: "il y a 3 h",
    nextMilestone: "Sprint 03 · 26 avr.",
  },
  {
    id: "s-07",
    name: "Mehdi Ferchichi",
    initials: "MF",
    email: "mehdi.ferchichi@ensi.tn",
    promo: "ESPRIT · 5A",
    projectTitle: "Indexation sémantique de documentation technique",
    progress: 12,
    status: "en-attente",
    hasAlert: false,
    lastActivity: "il y a 2 j",
    nextMilestone: "Validation du sujet · 23 avr.",
  },
  {
    id: "s-08",
    name: "Hela Ben Romdhane",
    initials: "HR",
    email: "hela.benromdhane@ensi.tn",
    promo: "ENSI · 5A",
    projectTitle: "Analyse de sentiment multilingue pour service client",
    progress: 100,
    status: "termine",
    hasAlert: false,
    lastActivity: "il y a 5 j",
    nextMilestone: "Soutenance — terminée",
  },
];
