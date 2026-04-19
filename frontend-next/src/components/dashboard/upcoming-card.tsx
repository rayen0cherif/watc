import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDateTimeShort } from "@/lib/format";
import type { Meeting } from "@/types";

export function UpcomingCard({ meetings }: { meetings: Meeting[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochains rendez-vous</CardTitle>
      </CardHeader>

      {meetings.length === 0 ? (
        <p className="text-sm text-neutral-600">Aucune réunion planifiée.</p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Calendar className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900">{meeting.title}</p>
                <p className="mt-0.5 text-xs text-neutral-600">
                  {formatDateTimeShort(meeting.scheduledAt)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar initials={meeting.mentorInitials} size="sm" />
                  <span className="text-xs text-neutral-600">{meeting.mentorName}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
