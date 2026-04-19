const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateShortFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
});

const dateTimeShortFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const relativeFormatter = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

export function formatDateShort(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateShortFormatter.format(date);
}

export function formatDateTimeShort(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateTimeShortFormatter.format(date);
}

export function formatRelative(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 1) {
      return relativeFormatter.format(Math.round(diffMs / (1000 * 60)), "minute");
    }
    return relativeFormatter.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 7) {
    return relativeFormatter.format(diffDays, "day");
  }
  return formatDate(date);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)} %`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
