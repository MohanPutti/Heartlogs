"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ReminderType, RepeatType } from "@/types";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: "none", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly (birthdays, anniversaries)" },
];

interface Props {
  reminder?: ReminderType;
}

export function ReminderForm({ reminder }: Props) {
  const router = useRouter();
  const { isSupported, subscription, loading: subLoading, needsInstallOnIOS } = usePushSubscription();
  const [title, setTitle] = useState(reminder?.title ?? "");
  const [note, setNote] = useState(reminder?.note ?? "");
  const [date, setDate] = useState(reminder?.date ?? format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(reminder?.time ?? "09:00");
  const [repeat, setRepeat] = useState<RepeatType>(reminder?.repeat ?? "yearly");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const gated = !subLoading && (needsInstallOnIOS || (isSupported && !subscription));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Give the reminder a title");
      return;
    }
    setSaving(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const body = { title, note, date, time, timezone, repeat, enabled: true };
      const res = await fetch(reminder ? `/api/reminders/${reminder.id}` : "/api/reminders", {
        method: reminder ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(reminder ? "Reminder updated" : "Reminder created");
      router.push("/reminders");
    } catch {
      toast.error("Couldn't save reminder");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!reminder) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/reminders/${reminder.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Reminder deleted");
      router.push("/reminders");
    } catch {
      toast.error("Couldn't delete reminder");
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {gated && (
        <div
          className="rounded-xl border px-3.5 py-2.5 text-xs text-[var(--text-muted)]"
          style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
        >
          {needsInstallOnIOS ? (
            <>
              On iPhone/iPad, install HeartLogs as an app and enable notifications in{" "}
              <a href="/settings" className="underline font-medium">
                Settings
              </a>{" "}
              first, or this reminder won&apos;t be able to notify you.
            </>
          ) : (
            <>
              Enable notifications in{" "}
              <a href="/settings" className="underline font-medium">
                Settings
              </a>{" "}
              first, or this reminder won&apos;t be able to notify you.
            </>
          )}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Mom's birthday"
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Don't forget to call"
          rows={2}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none resize-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Repeat</label>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as RepeatType)}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        >
          {REPEAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {repeat === "monthly" && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Fires on this day of the month; skips months shorter than that day.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--accent)" }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {reminder ? "Save changes" : "Create reminder"}
        </button>
        {reminder && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 disabled:opacity-60"
          >
            <Trash2 size={13} />
            Delete
          </button>
        )}
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete reminder?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  );
}
