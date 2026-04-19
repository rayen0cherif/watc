import type { Notification } from "@/types";
import { mockNotifications } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/notifications
export function fetchNotifications(): Promise<Notification[]> {
  return delay(mockNotifications);
}

// TODO(backend): PATCH /api/student/notifications/:id
export function markNotificationRead(id: string): Promise<{ id: string }> {
  return delay({ id });
}

// TODO(backend): PATCH /api/student/notifications/mark-all-read
export function markAllNotificationsRead(): Promise<void> {
  return delay(undefined);
}
