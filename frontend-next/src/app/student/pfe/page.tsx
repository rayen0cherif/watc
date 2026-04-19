import { Building2, CalendarDays, GraduationCap, Target } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineCard } from "@/components/dashboard/timeline-card";
import { JournalCard } from "@/components/dashboard/journal-card";
import { MentorsCard } from "@/components/dashboard/mentors-card";
import { DeliverableRow } from "@/components/pfe/deliverable-row";
import { fetchCurrentPFE } from "@/lib/api/pfe";
import { formatDate } from "@/lib/format";

export default async function StudentPfePage() {
  const project = await fetchCurrentPFE();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* Identity card */}
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <Badge tone="primary">Projet de Fin d'Études · En cours</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
              {project.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
              {project.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.keywords.map((keyword) => (
                <li key={keyword}>
                  <Badge tone="neutral">{keyword}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-sm shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
                Avancement
              </span>
              <span className="text-2xl font-semibold text-neutral-900">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} tone="primary" />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <MetaField
                icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                label="Début"
                value={formatDate(project.startDate)}
              />
              <MetaField
                icon={<CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                label="Fin prévue"
                value={formatDate(project.endDate)}
              />
              <MetaField
                icon={<Target className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                label="Soutenance"
                value={formatDate(project.defenseDate)}
              />
              <MetaField
                icon={<GraduationCap className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                label="Université"
                value={project.university}
              />
              <MetaField
                icon={<Building2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                label="Entreprise"
                value={project.company.name}
              />
            </dl>
          </div>
        </div>
      </Card>

      {/* Tabs section */}
      <Tabs defaultValue="milestones">
        <TabsList>
          <TabsTrigger value="milestones">Jalons</TabsTrigger>
          <TabsTrigger value="deliverables">Livrables</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="mentors">Encadrement</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="pt-6">
          <TimelineCard milestones={project.milestones} />
        </TabsContent>

        <TabsContent value="deliverables" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Livrables du projet</CardTitle>
            </CardHeader>
            <ul className="divide-y divide-neutral-200">
              {project.deliverables.map((deliverable) => (
                <DeliverableRow key={deliverable.id} deliverable={deliverable} />
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="pt-6">
          <JournalCard entries={project.journal} />
        </TabsContent>

        <TabsContent value="mentors" className="pt-6">
          <MentorsCard mentors={project.mentors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetaField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-neutral-600">
        {icon}
        <span>{label}</span>
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
