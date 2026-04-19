export const ONBOARDING_STEPS = [
  { slug: "account", label: "Compte", href: "/onboarding/account" },
  { slug: "mentors", label: "Encadrants", href: "/onboarding/mentors" },
  { slug: "cv", label: "CV", href: "/onboarding/cv" },
  { slug: "pfe", label: "Sujet PFE", href: "/onboarding/pfe" },
  { slug: "stack", label: "Stack", href: "/onboarding/stack" },
  { slug: "assessment", label: "Évaluation IA", href: "/onboarding/assessment" },
] as const;

export type OnboardingSlug = (typeof ONBOARDING_STEPS)[number]["slug"];

export const NIVEAU_OPTIONS = [
  {
    value: "licence-3",
    label: "3ème licence",
    description: "Dernière année de licence — PFE de fin de cycle",
  },
  {
    value: "master-2",
    label: "2ème master",
    description: "Année de mémoire de master",
  },
  {
    value: "ingenieur-3",
    label: "3ème ingénieur",
    description: "Année de PFE en cycle d'ingénieur",
  },
] as const;

export const SPECIALITES = [
  "Génie logiciel",
  "Génie informatique",
  "Systèmes d'information",
  "Réseaux et télécommunications",
  "Intelligence artificielle",
  "Data science",
  "Cybersécurité",
  "Cloud computing",
  "Développement mobile",
  "Génie électrique",
];

export const STACK_CATALOG: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript"],
  Backend: ["Spring Boot", "Node.js", "Express", "Django", "FastAPI", ".NET", "Laravel"],
  Mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  "Data / IA": ["Python", "Pandas", "TensorFlow", "PyTorch", "scikit-learn", "Jupyter"],
  Bases: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "ElasticSearch"],
  Infra: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform"],
};

export type AssessmentQuestion =
  | {
      id: string;
      kind: "qcm";
      topic: string;
      prompt: string;
      options: string[];
    }
  | {
      id: string;
      kind: "open";
      topic: string;
      prompt: string;
      placeholder: string;
    };

export const ASSESSMENT_PREVIEW: AssessmentQuestion[] = [
  {
    id: "q1",
    kind: "qcm",
    topic: "React",
    prompt:
      "Lequel de ces hooks vous permet de mémoriser une valeur dérivée coûteuse entre les rendus ?",
    options: ["useState", "useMemo", "useEffect", "useRef"],
  },
  {
    id: "q2",
    kind: "open",
    topic: "Architecture",
    prompt:
      "Décrivez en quelques phrases comment vous structureriez les couches de votre application Spring Boot pour respecter une séparation claire des responsabilités.",
    placeholder: "Présentez vos couches : controller, service, repository…",
  },
  {
    id: "q3",
    kind: "qcm",
    topic: "Bases de données",
    prompt:
      "Quel index est le plus adapté pour accélérer la recherche sur une colonne textuelle libre fréquemment interrogée par mots-clés ?",
    options: [
      "Index B-tree classique",
      "Index full-text (GIN/GiST)",
      "Index hash",
      "Index BRIN",
    ],
  },
  {
    id: "q4",
    kind: "open",
    topic: "Mise à l'échelle",
    prompt:
      "Votre API connaît un pic de trafic inattendu et la latence dépasse 800 ms. Décrivez votre démarche d'investigation.",
    placeholder: "Détaillez les étapes : observation, hypothèses, mesures…",
  },
];
