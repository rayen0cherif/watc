import type {
  AiProfile,
  AiQuiz,
  Evaluation,
  JournalEntry,
  Meeting,
  Feedback,
  Notification,
  Opportunity,
  PFEProject,
  Skill,
  Task,
  StudentProfile,
} from "@/types";

export const mockStudent: StudentProfile = {
  id: "s-001",
  name: "Lina Meziou",
  email: "lina.meziou@student.univ.tn",
  role: "student",
  level: "M2",
  specialty: "Génie Logiciel",
  avatarUrl: "",
};

export const mockMilestones: PFEProject["milestones"] = [
  { id: "m-1", title: "Analyse des besoins", dueDate: "2026-02-15", status: "done" },
  { id: "m-2", title: "Conception de l'architecture", dueDate: "2026-03-10", status: "in_progress" },
  { id: "m-3", title: "Implémentation (Sprint 1)", dueDate: "2026-04-05", status: "blocked" },
  { id: "m-4", title: "Tests et validation", dueDate: "2026-05-20", status: "todo" },
  { id: "m-5", title: "Soutenance", dueDate: "2026-06-15", status: "todo" },
];

export const mockDeliverables: PFEProject["deliverables"] = [
  { id: "d-1", name: "Cahier des charges", format: "PDF", dueDate: "2026-02-15", status: "validated" },
  { id: "d-2", name: "Rapport mi-parcours", format: "PDF", dueDate: "2026-04-15", status: "in_review" },
  { id: "d-3", name: "Code source (dépôt Git)", format: "Lien", dueDate: "2026-06-30", status: "in_progress" },
  { id: "d-4", name: "Rapport final", format: "PDF", dueDate: "2026-06-30", status: "todo" },
  { id: "d-5", name: "Présentation de soutenance", format: "PPTX", dueDate: "2026-07-10", status: "todo" },
];

export const mockJournal: JournalEntry[] = [
  {
    id: "j-1",
    date: "2026-04-17",
    summary:
      "Mise en place de l'authentification avec JWT terminée. Un problème subsiste sur le rafraîchissement du token côté mobile.",
    blockers: "Refresh token intermittent sur iOS.",
    nextStep: "Corriger le refresh et démarrer le module Utilisateur.",
  },
  {
    id: "j-2",
    date: "2026-03-12",
    summary: "Structure de la base de données validée. Les migrations sont prêtes.",
    blockers: "Aucun.",
    nextStep: "Commencer l'API REST des utilisateurs.",
  },
];

export const mockProject: PFEProject = {
  id: "pfe-001",
  title: "Plateforme de gestion intelligente des PFE",
  description:
    "Conception et développement d'une plateforme web gérant le cycle de vie complet des projets de fin d'études, incluant une évaluation IA continue et un suivi structuré des jalons.",
  keywords: ["Next.js", "Spring Boot", "Supabase", "Gemini"],
  startDate: "2026-02-01",
  endDate: "2026-06-30",
  defenseDate: "2026-07-15",
  progress: 45,
  status: "in_progress",
  company: {
    name: "TechCorp Solutions",
    address: "Tunis, Tunisie",
  },
  university: "Université de la Manouba",
  milestones: mockMilestones,
  deliverables: mockDeliverables,
  mentors: [
    {
      id: "mt-1",
      name: "Dr. Karim Benali",
      role: "academic",
      title: "Professeur des universités",
      organization: "Université de la Manouba",
      avatarInitials: "KB",
    },
    {
      id: "mt-2",
      name: "Sarah Mezghani",
      role: "professional",
      title: "Tech Lead",
      organization: "TechCorp Solutions",
      avatarInitials: "SM",
    },
  ],
  journal: mockJournal,
};

export const mockTasks: Task[] = [
  { id: "t-1", title: "Définir le schéma de la base de données", status: "done", priority: "high", milestone: "Sprint 1", dueDate: "2026-03-10" },
  { id: "t-2", title: "Implémenter l'authentification JWT", status: "done", priority: "high", milestone: "Sprint 1", dueDate: "2026-03-12" },
  { id: "t-3", title: "Maquette du tableau de bord étudiant", status: "in_progress", priority: "medium", milestone: "Sprint 2", dueDate: "2026-03-18" },
  { id: "t-4", title: "Intégrer l'API Gemini pour l'évaluation", status: "in_progress", priority: "high", milestone: "Sprint 2", dueDate: "2026-03-20" },
  { id: "t-5", title: "Module d'upload des livrables", status: "todo", priority: "medium", milestone: "Sprint 3", dueDate: "2026-03-25" },
  { id: "t-6", title: "Rédiger le rapport mi-parcours", status: "todo", priority: "low", milestone: "Documentation", dueDate: "2026-04-10" },
];

export const mockMeetings: Meeting[] = [
  { id: "mt-1", title: "Point hebdomadaire — Sprint 2", scheduledAt: "2026-04-19T14:00:00", mentorName: "Dr. Karim Benali", mentorInitials: "KB" },
  { id: "mt-2", title: "Revue d'architecture", scheduledAt: "2026-04-24T10:00:00", mentorName: "Sarah Mezghani", mentorInitials: "SM" },
];

export const mockFeedback: Feedback[] = [
  {
    id: "f-1",
    mentorName: "Sarah Mezghani",
    mentorInitials: "SM",
    postedAt: "2026-04-16",
    body: "L'architecture de la base de données me semble correcte. Pensez à ajouter un index sur les requêtes de recherche des jalons pour optimiser les performances.",
  },
  {
    id: "f-2",
    mentorName: "Dr. Karim Benali",
    mentorInitials: "KB",
    postedAt: "2026-04-13",
    body: "Très bon état de l'art dans le chapitre 1. Veillez à bien citer vos sources au format IEEE.",
  },
];

export const mockEvaluations: Evaluation[] = [
  {
    id: "e-1",
    stage: "midterm",
    gradedBy: "Dr. Karim Benali & Sarah Mezghani",
    gradedAt: "2026-04-15",
    overallScore: 16,
    maxScore: 20,
    criteria: [
      { id: "c-1", label: "Qualité technique", description: "Architecture, code propre, respect des standards.", score: 4, max: 5 },
      { id: "c-2", label: "Documentation & suivi", description: "Mises à jour régulières, clarté du journal de bord.", score: 5, max: 5 },
      { id: "c-3", label: "Autonomie & initiative", description: "Capacité à résoudre les blocages et proposer des solutions.", score: 4, max: 5 },
    ],
    strengths:
      "Excellente progression sur la partie backend. Le choix de l'architecture microservices est pertinent et l'implémentation est propre.",
    improvements:
      "Gestion d'état côté frontend à optimiser. Augmenter la couverture de tests sur les composants critiques.",
  },
];

export const mockSkills: Skill[] = [
  { id: "sk-1", name: "React / Next.js", category: "frontend", level: 85, trend: 8, lastAssessedAt: "2026-04-10", recommendation: "Approfondir les Server Components." },
  { id: "sk-2", name: "Spring Boot", category: "backend", level: 72, trend: 12, lastAssessedAt: "2026-04-08", recommendation: "Pratiquer Spring Security avec OAuth2." },
  { id: "sk-3", name: "PostgreSQL", category: "database", level: 70, trend: 6, lastAssessedAt: "2026-04-05", recommendation: "Explorer les index GIN et les extensions géographiques." },
  { id: "sk-4", name: "Gestion de projet agile", category: "methodology", level: 88, trend: 4, lastAssessedAt: "2026-04-03" },
  { id: "sk-5", name: "Docker & CI/CD", category: "devops", level: 58, trend: 15, lastAssessedAt: "2026-04-12", recommendation: "Automatiser le déploiement sur Fly.io." },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "op-1",
    title: "Ingénieur logiciel full-stack",
    company: "TechCorp Innov",
    location: "Tunis (hybride)",
    contractType: "cdi",
    matchScore: 92,
    skills: ["React", "Node.js", "Microservices"],
    urgent: true,
    url: "#",
  },
  {
    id: "op-2",
    title: "Développeur backend Node.js",
    company: "DataSystems Group",
    location: "Sousse (sur site)",
    contractType: "internship",
    matchScore: 85,
    skills: ["Node.js", "PostgreSQL", "Docker"],
    urgent: false,
    url: "#",
  },
  {
    id: "op-3",
    title: "Ingénieur frontend (React)",
    company: "Creative Studio",
    location: "Télétravail",
    contractType: "freelance",
    matchScore: 78,
    skills: ["React", "TypeScript", "TailwindCSS"],
    urgent: false,
    url: "#",
  },
];

export const mockAiProfile: AiProfile = {
  headline: "Profil orienté ingénierie full-stack",
  summary:
    "Votre parcours témoigne d'une solide maîtrise des technologies web modernes et d'une approche structurée de la gestion de projet. L'évaluation technique va approfondir vos connaissances sur l'architecture logicielle et la qualité du code.",
  strengths: [
    "Développement frontend React/Next.js",
    "Gestion de projet agile",
    "Conception de bases de données relationnelles",
  ],
  gaps: [
    "Tests automatisés et CI/CD",
    "Sécurité applicative (OWASP)",
    "Performance et observabilité",
  ],
};

export const mockAiQuiz: AiQuiz = {
  id: "quiz-baseline-001",
  questions: [
    {
      id: "q-1",
      topic: "Architecture",
      difficulty: "intermédiaire",
      prompt:
        "Dans une architecture microservices, quelle stratégie limite le mieux le couplage entre services ?",
      options: [
        { id: "a", label: "Partager la même base de données entre plusieurs services" },
        { id: "b", label: "Communiquer uniquement via des événements asynchrones quand c'est possible" },
        { id: "c", label: "Appeler directement les endpoints internes de chaque service" },
        { id: "d", label: "Regrouper les services dans un unique dépôt monolithique" },
      ],
    },
    {
      id: "q-2",
      topic: "Tests",
      difficulty: "facile",
      prompt: "Quel type de tests vérifie qu'un composant isolé fonctionne comme attendu ?",
      options: [
        { id: "a", label: "Tests end-to-end" },
        { id: "b", label: "Tests de charge" },
        { id: "c", label: "Tests unitaires" },
        { id: "d", label: "Tests de régression visuelle" },
      ],
    },
    {
      id: "q-3",
      topic: "Base de données",
      difficulty: "intermédiaire",
      prompt:
        "Dans PostgreSQL, quel type d'index est le plus adapté pour accélérer les recherches en texte intégral ?",
      options: [
        { id: "a", label: "BTREE" },
        { id: "b", label: "HASH" },
        { id: "c", label: "GIN" },
        { id: "d", label: "BRIN" },
      ],
    },
    {
      id: "q-4",
      topic: "Sécurité",
      difficulty: "avancé",
      prompt:
        "Laquelle de ces pratiques atténue le mieux une attaque par injection SQL ?",
      options: [
        { id: "a", label: "Échapper manuellement les chaînes dans les requêtes" },
        { id: "b", label: "Utiliser des requêtes préparées (paramétrées)" },
        { id: "c", label: "Masquer les messages d'erreur en production" },
        { id: "d", label: "Interdire les caractères spéciaux côté client" },
      ],
    },
    {
      id: "q-5",
      topic: "Gestion de projet",
      difficulty: "facile",
      prompt:
        "Dans un sprint Scrum, quel artefact présente le travail restant à réaliser pour atteindre l'objectif ?",
      options: [
        { id: "a", label: "Product backlog" },
        { id: "b", label: "Sprint backlog" },
        { id: "c", label: "Increment" },
        { id: "d", label: "Definition of Done" },
      ],
    },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: "n-1",
    kind: "deliverable_validated",
    title: "Livrable validé",
    message: "Dr. Karim Benali a validé votre cahier des charges.",
    createdAt: "2026-04-17T10:24:00",
    read: false,
    actionLabel: "Voir le livrable",
    actionHref: "/student/pfe",
  },
  {
    id: "n-2",
    kind: "meeting_scheduled",
    title: "Réunion planifiée",
    message: "Point hebdomadaire avec Dr. Karim Benali demain à 14h00.",
    createdAt: "2026-04-17T09:02:00",
    read: false,
    actionLabel: "Voir l'agenda",
    actionHref: "/student/tracking",
  },
  {
    id: "n-3",
    kind: "feedback_received",
    title: "Nouveau retour",
    message: "Sarah Mezghani a laissé un commentaire sur votre sprint en cours.",
    createdAt: "2026-04-16T17:15:00",
    read: true,
    actionLabel: "Lire le retour",
    actionHref: "/student/tracking",
  },
  {
    id: "n-4",
    kind: "milestone_reminder",
    title: "Jalon à venir",
    message: "Le jalon « Implémentation Sprint 1 » arrive à échéance dans 5 jours.",
    createdAt: "2026-04-13T08:00:00",
    read: true,
    actionLabel: "Voir le jalon",
    actionHref: "/student/dashboard",
  },
];
