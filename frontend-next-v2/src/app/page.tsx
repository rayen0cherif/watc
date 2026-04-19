import Link from "next/link";
import Image from "next/image";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Logo } from "@/components/layout/logo";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";
const FEATURE_KANBAN =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";
const FEATURE_AI =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
const FEATURE_DOCS =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80";
const ROLES_IMAGE =
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80";
const APPROACH_SECURITY =
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80";
const APPROACH_GROWTH =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";
const APPROACH_EVALUATION =
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-neutral-50 font-sans">
      <MarketingNav />

      <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/[0.06] blur-3xl" />
          <div className="absolute right-0 top-20 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-accent-500/[0.10] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-primary-400/[0.06] blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="relative z-10 max-w-2xl">
            <span className="mb-6 inline-flex items-center rounded-full border border-accent-500/30 bg-accent-500/15 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent-700">
              Encadrement nouvelle génération
            </span>

            <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              L&apos;écosystème intelligent pour vos{" "}
              <span className="text-primary-500">
                Projets de Fin d&apos;Études
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-balance text-lg leading-relaxed text-neutral-600">
              Une plateforme structurée intégrant l&apos;intelligence artificielle pour
              guider les étudiants, simplifier le suivi pour les encadrants, et
              évaluer les compétences en temps réel.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600"
              >
                Rejoindre l&apos;espace
              </Link>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                Découvrir
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-600">
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success-500" />
                Suivi structuré
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success-500" />
                Évaluation IA
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success-500" />
                Centralisation
              </li>
            </ul>
          </div>

          <div className="relative hidden h-[500px] w-full lg:block">
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-2xl">
              <Image
                src={HERO_IMAGE}
                alt="Étudiants travaillant ensemble sur un projet"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary-700/10" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 px-5 py-4 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  Promotion 2026
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-900">
                  Plus de 240 PFE encadrés cette année par Mentora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="fonctionnalites"
        className="relative border-y border-neutral-200 bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-neutral-900">
              Une approche moderne et structurée
            </h2>
            <p className="text-balance text-neutral-600">
              Découvrez les outils conçus spécifiquement pour maximiser la
              réussite de votre PFE, de l&apos;idée initiale à la soutenance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={FEATURE_KANBAN}
                  alt="Tableau de planification avec post-its"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="mb-3 text-xl font-bold text-neutral-900">
                  Suivi Kanban intégré
                </h3>
                <p className="leading-relaxed text-neutral-600">
                  Fini les mails éparpillés. Organisez vos sprints, suivez vos
                  jalons et synchronisez votre progression avec vos encadrants
                  au même endroit.
                </p>
              </div>
            </article>

            <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={FEATURE_AI}
                  alt="Tableau d'analyse de données"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="mb-3 text-xl font-bold text-neutral-900">
                  Évaluation par IA
                </h3>
                <p className="leading-relaxed text-neutral-600">
                  Notre assistant IA évalue vos compétences techniques à travers
                  des quiz adaptatifs et vous suggère des ressources pour vous
                  améliorer en continu.
                </p>
              </div>
            </article>

            <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={FEATURE_DOCS}
                  alt="Dossiers et documents organisés"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="mb-3 text-xl font-bold text-neutral-900">
                  Dossier centralisé
                </h3>
                <p className="leading-relaxed text-neutral-600">
                  Livrables, cahier des charges, code source et rapports. Tout
                  votre dossier de PFE est structuré, sécurisé et prêt pour
                  l&apos;évaluation finale.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="roles" className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-neutral-200 shadow-2xl">
              <Image
                src={ROLES_IMAGE}
                alt="Étudiants et encadrants en réunion de travail"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-neutral-900/40" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="mb-3 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  MVP
                </span>
                <h3 className="mb-2 text-2xl font-bold">
                  Un pont entre l&apos;académique et le pro
                </h3>
                <p className="text-sm text-white/80">
                  Une conception pensée pour répondre aux exigences réelles des
                  universités et des entreprises.
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-neutral-900">
                  Deux rôles, une même vision
                </h2>
                <p className="leading-relaxed text-neutral-600">
                  Mentora sépare clairement les espaces de travail pour offrir
                  une expérience sur-mesure à chaque acteur du projet, sans
                  bruit ni distraction sociale.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-base font-bold text-primary-600">
                    01
                  </span>
                  <div>
                    <h4 className="mb-2 text-lg font-bold text-neutral-900">
                      Pour les étudiants
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      Un tableau de bord orienté action : suivi des tâches,
                      validation des livrables, conseils IA personnalisés et
                      visibilité claire sur les objectifs à atteindre.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-base font-bold text-neutral-700">
                    02
                  </span>
                  <div>
                    <h4 className="mb-2 text-lg font-bold text-neutral-900">
                      Pour les encadrants
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      Une vue d&apos;ensemble sur tous les étudiants supervisés.
                      Recevez les alertes en cas de blocage, évaluez les
                      livrables de manière asynchrone et gagnez du temps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="approche" className="border-y border-neutral-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-neutral-900">
              Conçu pour l&apos;excellence académique
            </h2>
            <p className="text-balance text-neutral-600">
              Trois piliers fondamentaux garantissent une expérience
              professionnelle et fiable tout au long du projet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={APPROACH_SECURITY}
                  alt="Espace sécurisé"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  Pilier 01
                </p>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  Données protégées
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Vos livrables et évaluations restent confidentiels et
                  accessibles uniquement aux personnes autorisées.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={APPROACH_GROWTH}
                  alt="Indicateurs de progression"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-700">
                  Pilier 02
                </p>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  Progression mesurable
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Indicateurs clairs et historisés pour identifier les axes
                  d&apos;amélioration semaine après semaine.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={APPROACH_EVALUATION}
                  alt="Soutenance et évaluation"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  Pilier 03
                </p>
                <h3 className="mb-2 font-semibold text-neutral-900">
                  Évaluation transparente
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Critères normalisés, traces écrites et restitution structurée
                  pour des soutenances équitables.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-primary-700" />
        <div aria-hidden className="absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-accent-500/20 blur-3xl" />
        <div aria-hidden className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-primary-400/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold text-white md:text-4xl">
            Prêt à structurer votre PFE ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-balance text-primary-50/90">
            Rejoignez la plateforme et transformez votre projet de fin
            d&apos;études en une véritable rampe de lancement pour votre
            carrière.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-8 py-4 text-lg font-bold text-neutral-900 shadow-xl shadow-accent-500/25 transition-colors hover:bg-accent-400"
          >
            Démarrer maintenant
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <Link href="/" aria-label="Mentora">
            <Logo />
          </Link>
          <p className="text-sm text-neutral-600">
            © 2026 Mentora. Une plateforme dédiée à l&apos;excellence
            académique.
          </p>
        </div>
      </footer>
    </div>
  );
}
