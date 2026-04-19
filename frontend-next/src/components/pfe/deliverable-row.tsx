import { FileText, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Deliverable, DeliverableStatus } from "@/types";

const STATUS_LABEL: Record<DeliverableStatus, string> = {
  validated: "Validé",
  in_review: "En revue",
  in_progress: "En cours",
  todo: "À faire",
};

const STATUS_TONE: Record<DeliverableStatus, "success" | "primary" | "warning" | "neutral"> = {
  validated: "success",
  in_review: "warning",
  in_progress: "primary",
  todo: "neutral",
};

export function DeliverableRow({ deliverable }: { deliverable: Deliverable }) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <FileText className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-900">{deliverable.name}</p>
          <p className="mt-0.5 text-xs text-neutral-600">
            {deliverable.format} · échéance {formatDate(deliverable.dueDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:shrink-0">
        <Badge tone={STATUS_TONE[deliverable.status]}>{STATUS_LABEL[deliverable.status]}</Badge>
        <Button
          type="button"
          variant={deliverable.status === "validated" ? "secondary" : "primary"}
          size="sm"
        >
          <UploadCloud className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          {deliverable.status === "validated" ? "Consulter" : "Déposer"}
        </Button>
      </div>
    </li>
  );
}
