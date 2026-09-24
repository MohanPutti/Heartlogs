"use client";

import Link from "next/link";
import { Bell, BellOff, Repeat } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ReminderType } from "@/types";

const REPEAT_LABELS: Record<string, string> = {
  none: "Once",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function ReminderCard({ reminder }: { reminder: ReminderType }) {
  return (
    <Link href={`/reminders/${reminder.id}/edit`} className="block">
      <article
        className="rounded-2xl border p-4 flex items-center justify-between gap-3"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {reminder.enabled ? (
              <Bell size={13} className="text-[var(--accent)] shrink-0" />
            ) : (
              <BellOff size={13} className="text-[var(--text-muted)] shrink-0" />
            )}
            <h3 className="font-medium text-sm text-[var(--text-primary)] truncate">{reminder.title}</h3>
          </div>
          {reminder.note && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">{reminder.note}</p>}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
            <span>{format(parseISO(reminder.date), "MMM d, yyyy")}</span>
            <span>{reminder.time}</span>
            {reminder.repeat !== "none" && (
              <span className="flex items-center gap-1">
                <Repeat size={11} />
                {REPEAT_LABELS[reminder.repeat]}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
