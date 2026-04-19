export type NotificationKind =
  | "deliverable_validated"
  | "deliverable_rejected"
  | "milestone_reminder"
  | "meeting_scheduled"
  | "evaluation_published"
  | "feedback_received";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}
