"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { updateTaskStatus } from "@/lib/api/tracking";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const COLUMNS: Array<{ id: TaskStatus; label: string; icon: React.ReactNode; tone: string }> = [
  { id: "todo", label: "À faire", icon: <Circle className="h-4 w-4" strokeWidth={1.5} aria-hidden />, tone: "text-neutral-600" },
  { id: "in_progress", label: "En cours", icon: <Loader2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />, tone: "text-primary-600" },
  { id: "done", label: "Terminé", icon: <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />, tone: "text-accent-600" },
];

const PRIORITY_TONE: Record<TaskPriority, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: "Prioritaire",
  medium: "Moyenne",
  low: "Faible",
};

export function KanbanBoard({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initial);

  const byColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], done: [] };
    tasks.forEach((task) => {
      map[task.status].push(task);
    });
    return map;
  }, [tasks]);

  const handleChange = async (taskId: string, next: TaskStatus) => {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: next } : task)),
    );
    try {
      await updateTaskStatus(taskId, next);
      toast.success("Statut mis à jour.");
    } catch {
      setTasks(previous);
      toast.error("Impossible de mettre à jour la tâche.");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = byColumn[column.id];
        return (
          <section
            key={column.id}
            aria-labelledby={`col-${column.id}`}
            className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <header className="mb-4 flex items-center justify-between">
              <h3
                id={`col-${column.id}`}
                className={cn("flex items-center gap-2 text-sm font-semibold", column.tone)}
              >
                {column.icon}
                {column.label}
              </h3>
              <span className="text-xs font-medium text-neutral-600">
                {columnTasks.length}
              </span>
            </header>

            <ul className="flex flex-col gap-3">
              {columnTasks.length === 0 ? (
                <li className="rounded-lg border border-dashed border-neutral-200 bg-white px-3 py-6 text-center text-xs text-neutral-600">
                  Aucune tâche.
                </li>
              ) : (
                columnTasks.map((task) => (
                  <li key={task.id}>
                    <Card className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                        <Badge tone={PRIORITY_TONE[task.priority]}>
                          {PRIORITY_LABEL[task.priority]}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-neutral-600">
                        {task.milestone} · échéance {formatDate(task.dueDate)}
                      </p>

                      <label className="mt-3 block">
                        <span className="sr-only">Statut de la tâche</span>
                        <Select
                          value={task.status}
                          onChange={(event) =>
                            handleChange(task.id, event.target.value as TaskStatus)
                          }
                          className="text-xs"
                        >
                          <option value="todo">À faire</option>
                          <option value="in_progress">En cours</option>
                          <option value="done">Terminé</option>
                        </Select>
                      </label>
                    </Card>
                  </li>
                ))
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
