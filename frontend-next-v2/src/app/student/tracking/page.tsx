"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Plus,
  Filter,
  MessageSquare,
  Clock,
  AlignLeft,
  Check,
  ChevronRight,
  Trash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { KanbanTask, Meeting, ProjectData } from "@/lib/types";
import { fetchApi } from "@/lib/api";

const MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "Point Hebdo - Sprint 2",
    date: "Demain",
    time: "14:00",
    mentor: "Dr. Karim B.",
    mentorInitials: "DK",
    mentorColor: "blue",
    upcoming: true,
  },
  {
    id: 2,
    title: "Revue Architecture",
    date: "24 Mar",
    time: "10:00",
    mentor: "Sarah M.",
    mentorInitials: "SM",
    mentorColor: "green",
    upcoming: false,
  },
];

const COLUMNS = [
  { id: "a_faire" as const, title: "À Faire", color: "bg-neutral-100 text-neutral-700" },
  { id: "en_cours" as const, title: "En Cours", color: "bg-primary-50 text-primary-700" },
  { id: "terminé" as const, title: "Terminé", color: "bg-success-50 text-success-600" },
];

function getPriorityColor(p: string) {
  switch (p) {
    case "high":
      return "bg-danger-50 text-danger-500";
    case "medium":
      return "bg-warning-50 text-warning-500";
    case "low":
      return "bg-primary-50 text-primary-600";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function getPriorityLabel(p: string) {
  switch (p) {
    case "high":
      return "Haute";
    case "medium":
      return "Moyenne";
    case "low":
      return "Basse";
    default:
      return p;
  }
}

export default function ProjectTrackingPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchApi<ProjectData>("/projects/mine")
      .then((proj) => {
        setProjectId(proj.id);
        return fetchApi<KanbanTask[]>(`/projects/${proj.id}/tasks`);
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = async (status: KanbanTask["status"]) => {
    if (!projectId) return;
    const title = prompt("Nom de la tâche ?");
    if (title) {
        const newTask = {
            title,
            status,
            priority: "medium",
            jalon: "Sprint X",
            dueDate: "Aujourd'hui"
        };
        try {
            const saved = await fetchApi<KanbanTask>(`/projects/${projectId}/tasks`, {
                method: "POST",
                body: JSON.stringify(newTask)
            });
            setTasks([...tasks, saved]);
        } catch (err) {
            console.error("Failed to add task", err);
        }
    }
  };

  const handleRemove = async (taskId: number) => {
    try {
        await fetchApi(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
        setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
        console.error("Failed to delete task", err);
    }
  };
  
  const handleAdvance = async (taskId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "a_faire" ? "en_cours" : "terminé";
    try {
        const updated = await fetchApi<KanbanTask>(`/projects/${projectId}/tasks/${taskId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: nextStatus })
        });
        setTasks(tasks.map((t) => t.id === taskId ? updated : t));
    } catch (err) {
        console.error("Failed to advance task", err);
    }
  };

  return (
    <div className="flex h-full flex-col mx-auto max-w-[1200px] px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex shrink-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
            <Activity className="h-6 w-6 text-primary-500" />
            Suivi du Projet
          </h1>
          <p className="text-neutral-500">
            Gérez vos tâches, jalons et préparez vos réunions d&apos;encadrement.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      <div className="grid min-h-[500px] flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Kanban Board (3 cols) */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 lg:col-span-3">
          {loading ? (
             <div className="flex h-full items-center justify-center">
                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
             </div>
          ) : (
          <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.id} className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-neutral-900">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        col.id === "a_faire" && "bg-neutral-400",
                        col.id === "en_cours" && "bg-primary-500",
                        col.id === "terminé" && "bg-success-500"
                      )}
                    />
                    {col.title}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-2xs font-bold",
                      col.color
                    )}
                  >
                    {tasks.filter((t) => t.status === col.id).length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-neutral-100/50 p-3">
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="group cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-primary-200"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span
                            className={cn(
                              "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                              getPriorityColor(task.priority)
                            )}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              className="text-neutral-400 hover:text-danger-500"
                              title="Supprimer"
                              onClick={() => handleRemove(task.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                            {task.status !== "terminé" && (
                              <button
                                className="text-neutral-400 hover:text-primary-500"
                                title="Avancer"
                                onClick={() => handleAdvance(task.id, task.status)}
                              >
                                {task.status === "a_faire" ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <h4 className="mb-3 text-sm font-semibold leading-snug text-neutral-900">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between text-2xs text-neutral-500">
                          <div className="flex items-center gap-1.5 font-medium">
                            <AlignLeft className="h-3.5 w-3.5" />
                            {task.jalon}
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {task.dueDate}
                          </div>
                        </div>
                      </div>
                    ))}

                  <button onClick={() => handleAddTask(col.id)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:border-primary-500 hover:text-primary-500">
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col space-y-6">
          {/* Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-500" />
                Prochains RDV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MEETINGS.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "relative overflow-hidden rounded-xl border p-3",
                      m.upcoming
                        ? "border-primary-100 bg-primary-50/50"
                        : "border-neutral-100 bg-neutral-50"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1",
                        m.upcoming ? "bg-primary-500" : "bg-neutral-300"
                      )}
                    />
                    <p
                      className={cn(
                        "mb-1 text-2xs font-bold",
                        m.upcoming ? "text-primary-500" : "text-neutral-500"
                      )}
                    >
                      {m.date}, {m.time}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {m.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                          m.mentorColor === "blue"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-accent-100 text-accent-700"
                        )}
                      >
                        {m.mentorInitials}
                      </div>
                      <span className="text-2xs text-neutral-500">
                        {m.mentor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-primary-500 hover:underline">
                Planifier un RDV <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
