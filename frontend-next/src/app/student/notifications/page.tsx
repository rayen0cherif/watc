"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  Calendar,
  CheckCircle2,
  FileText,
  MessageSquare,
  Target,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import type { Notification, NotificationKind } from "@/types";

const KIND_META: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  deliverable_validated: { icon: CheckCircle2, tone: "bg-accent-50 text-accent-600" },
  deliverable_rejected: { icon: FileText, tone: "bg-danger-50 text-danger-500" },
  milestone_reminder: { icon: Target, tone: "bg-warning-50 text-warning-500" },
  meeting_scheduled: { icon: Calendar, tone: "bg-primary-50 text-primary-600" },
  evaluation_published: { icon: Award, tone: "bg-primary-50 text-primary-600" },
  feedback_received: { icon: MessageSquare, tone: "bg-neutral-50 text-neutral-600" },
};

export default function StudentNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = items.filter((item) => !item.read).length;

  const handleMarkRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      toast.error("Impossible de marquer comme lu.");
    }
  };

  const handleMarkAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
      toast.success("Toutes les notifications sont lues.");
    } catch {
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Actions, rappels et retours importants liés à votre PFE.
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button type="button" variant="secondary" size="sm" onClick={handleMarkAll}>
            Tout marquer comme lu
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-600" aria-live="polite">Chargement des notifications…</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Aucune notification pour le moment"
          description="Les nouvelles notifications apparaîtront ici dès qu'une action sera à entreprendre."
        />
      ) : (
        <Card className="p-0">
          <CardHeader className="mb-0 border-b border-neutral-200 p-5">
            <CardTitle>Dernières notifications</CardTitle>
          </CardHeader>
          <ul className="divide-y divide-neutral-200">
            {items.map((notification) => {
              const meta = KIND_META[notification.kind];
              const Icon = meta.icon;
              return (
                <li
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-5 transition-colors",
                    !notification.read && "bg-primary-50/30",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      meta.tone,
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-600">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read ? (
                        <Badge tone="primary">Nouveau</Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-neutral-600">
                        {formatRelative(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-3">
                        {notification.actionHref && notification.actionLabel ? (
                          <Link
                            href={notification.actionHref}
                            className="text-xs font-medium text-primary-600 hover:underline"
                          >
                            {notification.actionLabel}
                          </Link>
                        ) : null}
                        {!notification.read ? (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(notification.id)}
                            className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
                          >
                            Marquer comme lu
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
