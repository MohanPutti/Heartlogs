"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, BellRing } from "lucide-react";
import { ReminderType } from "@/types";
import { ReminderCard } from "@/components/reminders/ReminderCard";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reminders")
      .then((r) => r.json())
      .then((d) => {
        setReminders(d.reminders ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Reminders</h1>
        <Link
          href="/reminders/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          <Plus size={14} />
          New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-[var(--text-muted)]" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16">
          <BellRing size={28} className="mx-auto mb-3 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)]">
            No reminders yet — birthdays, anniversaries, anything worth a nudge.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </div>
      )}
    </div>
  );
}
