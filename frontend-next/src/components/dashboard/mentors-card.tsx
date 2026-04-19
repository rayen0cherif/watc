import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "@/types";

export function MentorsCard({ mentors }: { mentors: Mentor[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipe d'encadrement</CardTitle>
      </CardHeader>

      <ul className="space-y-4">
        {mentors.map((mentor) => (
          <li key={mentor.id} className="flex items-start gap-3">
            <Avatar initials={mentor.avatarInitials} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-neutral-900">{mentor.name}</p>
                <Badge tone={mentor.role === "academic" ? "primary" : "accent"}>
                  {mentor.role === "academic" ? "Académique" : "Entreprise"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-neutral-600">{mentor.title}</p>
              <p className="text-xs text-neutral-600">{mentor.organization}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
