import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { IsometricClipboard } from "@/components/landing/isometric-clipboard";
import { IsometricClipboardSmall } from "@/components/landing/isometric-clipboard-small";
import { IsometricBrain } from "@/components/landing/isometric-brain";
import { IsometricFolder } from "@/components/landing/isometric-folder";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 85% 10%, rgba(110,220,159,0.12) 0%, transparent 40%), radial-gradient(circle at 15% 90%, rgba(79,110,219,0.08) 0%, transparent 35%)",
          }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Badge tone="primary" className="mb-6">
              Plateforme PFE · MVP 2026
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
              Structurez le cycle complet de vos{" "}
              <span className="text-primary-600">Projets de Fin d'Études</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              Mentora réunit étudiants et encadrants dans un espace de travail
              clair : jalons, livrables, évaluations et analyse IA continue
              des compétences, sans distraction.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Créer un compte
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Se connecter
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-neutral-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" strokeWidth={1.5} aria-hidden />
                Suivi structuré
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" strokeWidth={1.5} aria-hidden />
                Évaluation IA continue
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-600" strokeWidth={1.5} aria-hidden />
                Documents centralisés
              </li>
            </ul>
          </div>

          <div className="relative hidden justify-self-center lg:flex">
            <IsometricClipboard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Une méthode claire pour faire avancer chaque PFE
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Chaque fonctionnalité est pensée pour réduire les va-et-vient et
              concentrer l'énergie sur la livraison du projet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<IsometricClipboardSmall />}
              title="Jalons & livrables synchronisés"
              description="Centralisez cahier des charges, rapports et dépôts de code. Vos encadrants valident chaque étape sans quitter la plateforme."
            />
            <FeatureCard
              icon={<IsometricBrain />}
              title="Évaluation IA continue"
              description="Gemini analyse le CV, génère un test technique sur-mesure et suit l'évolution de vos compétences tout au long du projet."
            />
            <FeatureCard
              icon={<IsometricFolder />}
              title="Dossier académique structuré"
              description="Un espace unique pour rédiger le journal de bord, préparer la soutenance et produire un dossier prêt à évaluer."
            />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Deux rôles, un seul flux de travail
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Étudiants et encadrants disposent d'espaces distincts mais
              connectés. Pas de messagerie libre, pas de fil social — uniquement
              les actions qui comptent pour l'avancement du projet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RoleCard
              icon={<GraduationCap className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              tone="primary"
              title="Pour les étudiants"
              description="Un tableau de bord orienté action : tâches, livrables, journal de bord, suggestions IA et visibilité claire sur les échéances."
              bullets={[
                "Soumission guidée du sujet de PFE",
                "Test technique IA après inscription",
                "Suivi Kanban des sprints et jalons",
                "Évaluations mi-parcours et finales détaillées",
              ]}
            />
            <RoleCard
              icon={<Users className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              tone="accent"
              title="Pour les encadrants"
              description="Une vue d'ensemble des étudiants supervisés : alertes de blocage, validations asynchrones et historique complet."
              bullets={[
                "Tableau global des étudiants suivis",
                "Alertes automatiques en cas de retard",
                "Validation des livrables en un clic",
                "Rapports d'évaluation consolidés",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="bg-primary-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Prêt à structurer votre PFE ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-primary-50">
            Rejoignez Mentora et transformez votre projet en rampe de lancement
            pour votre carrière académique et professionnelle.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-accent-500 px-6 text-base font-medium text-neutral-900 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
          >
            Démarrer maintenant
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-primary-500/30">
      <div className="mb-5">{icon}</div>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  bullets,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  tone: "primary" | "accent";
}) {
  const bgClass = tone === "primary" ? "bg-primary-50 text-primary-600" : "bg-accent-50 text-accent-600";
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${bgClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
      <ul className="mt-6 space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm text-neutral-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.5} aria-hidden />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
