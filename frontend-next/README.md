# Mentora — Web App

Next.js 14 (App Router) frontend for the **Mentora** PFE supervision platform.
This is the production codebase. The sibling `../frontend/` folder is a Vite prototype kept as visual reference only.

## Stack

- Next.js 14.2 (App Router, React Server Components by default)
- React 18, TypeScript strict
- Tailwind CSS 3.4
- `motion/react` (Framer Motion v11) for animations
- `lucide-react` for icons
- `react-hook-form` + `zod` for forms
- `sonner` for toasts

## Design system

- **Primary** `#4F6EDB` / **Accent** `#6EDC9F`
- Inter via `next/font/google`
- No gradients outside the landing hero, no emojis in UI, French copy with vouvoiement.

Tokens are declared in `tailwind.config.ts` under the standard Tailwind color scale (`primary-500`, `accent-500`, `neutral-*`, `danger-500`, `warning-500`).

## Scripts

```bash
pnpm install        # or: npm install
pnpm dev            # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm typecheck
```

## Project layout

```
src/
├── app/                  # routes (App Router)
│   ├── (marketing)/      # public nav shell
│   ├── (onboarding)/     # stepper-only shell
│   └── (app)/student/    # sidebar shell (role-gated)
├── components/
│   ├── ui/               # primitives (Button, Input, ...)
│   ├── layout/           # Sidebar, Topbar, shells
│   ├── landing/          # 3D isometric + marketing sections
│   ├── onboarding/       # wizard + CV analyzer + quiz
│   └── student/          # per-page student widgets
├── hooks/
├── lib/
│   ├── api/              # typed Promise<T> stubs (TODO: backend)
│   └── validators/       # zod schemas
├── providers/            # AuthProvider
├── types/
└── data/mocks.ts         # typed fixtures used by the stubs
```

## Routes

| Path | Role | Purpose |
|---|---|---|
| `/` | public | Landing |
| `/login` | public | Connexion |
| `/register` | public | Création de compte (Étudiant / Encadrant) |
| `/onboarding/pfe` | student | Saisie du sujet PFE (3 étapes) |
| `/onboarding/ai-evaluation` | student | Analyse CV + test technique IA |
| `/student/dashboard` | student | Tableau de bord |
| `/student/pfe` | student | Détails projet + livrables |
| `/student/tracking` | student | Kanban + RDV + retours |
| `/student/evaluation` | student | Évaluations mi-parcours et finales |
| `/student/skills` | student | Compétences détaillées |
| `/student/opportunities` | student | Offres professionnelles |
| `/student/notifications` | student | Notifications orientées action |
| `/student/settings` | student | Profil / sécurité / préférences |

## Backend integration

All API calls live in `src/lib/api/*.ts` as typed async stubs that return mock data.
Each function is annotated with `// TODO(backend): wire to Spring Boot endpoint`.
Swap the body of each stub when the Spring Boot + Supabase backend is ready.
