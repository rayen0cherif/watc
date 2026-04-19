import { Calendar, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { KanbanBoard } from "@/components/tracking/kanban-board";
import { fetchFeedback, fetchMeetings, fetchTasks } from "@/lib/api/tracking";
import { formatDate, formatDateTimeShort } from "@/lib/format";

export default async function StudentTrackingPage() {
  const [tasks, meetings, feedback] = await Promise.all([
    fetchTasks(),
    fetchMeetings(),
    fetchFeedback(),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Suivi du projet
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Vos tâches, rendez-vous et retours de vos encadrants, au même endroit.
        </p>
      </div>

      <section aria-labelledby="kanban-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="kanban-title" className="text-base font-semibold text-neutral-900">
            Tableau des tâches
          </h2>
        </div>
        {tasks.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucune tâche enregistrée"
            description="Vos encadrants pourront vous assigner des tâches dès le démarrage du sprint."
          />
        ) : (
          <KanbanBoard tasks={tasks} />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous planifiés</CardTitle>
          </CardHeader>
          {meetings.length === 0 ? (
            <p className="text-sm text-neutral-600">Aucun rendez-vous à venir.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {meetings.map((meeting) => (
                <li key={meeting.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Calendar className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900">{meeting.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">
                      {formatDateTimeShort(meeting.scheduledAt)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-600">
                      <Avatar initials={meeting.mentorInitials} size="sm" />
                      {meeting.mentorName}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retours des encadrants</CardTitle>
          </CardHeader>
          {feedback.length === 0 ? (
            <p className="text-sm text-neutral-600">Aucun retour pour le moment.</p>
          ) : (
            <ul className="space-y-4">
              {feedback.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={item.mentorInitials} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        {item.mentorName}
                      </p>
                      <p className="text-xs text-neutral-600">{formatDate(item.postedAt)}</p>
                    </div>
                    <MessageSquare
                      className="h-4 w-4 text-neutral-400"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-900">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
