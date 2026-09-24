"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getJournalReminder, saveJournalReminder, deleteJournalReminder } from "@/app/actions/journal-reminder";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";
import { trackEvent } from "@/lib/analytics";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export function JournalReminderSettings() {
  const { isSupported, subscription, loading: subLoading } = usePushSubscription();
  const [time, setTime] = useState("20:00");
  const [days, setDays] = useState<number[]>(ALL_DAYS);
  const [exists, setExists] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!subscription) return;
    getJournalReminder().then((reminder) => {
      if (reminder) {
        setTime(reminder.time);
        setDays(reminder.days.split(",").map(Number));
        setExists(true);
      }
      setLoaded(true);
    });
  }, [subscription]);

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }

  async function handleSave() {
    if (days.length === 0) {
      toast.error("Pick at least one day");
      return;
    }
    setSaving(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await saveJournalReminder({ time, timezone, days, enabled: true });
      setExists(true);
      trackEvent("Journal Reminder Saved", { time, daysCount: days.length });
      toast.success("Reminder saved");
    } catch {
      toast.error("Couldn't save reminder");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setSaving(true);
    try {
      await deleteJournalReminder();
      setExists(false);
      toast.success("Reminder removed");
    } catch {
      toast.error("Couldn't remove reminder");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupported) return null;

  if (!subLoading && !subscription) {
    return (
      <p className="text-xs text-[var(--text-muted)]">
        Enable notifications above to set a daily journaling reminder.
      </p>
    );
  }

  if (!loaded) {
    return <Loader2 size={14} className="animate-spin text-[var(--text-muted)]" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Daily reminder</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          We&apos;ll nudge you at this time if you haven&apos;t written yet that day.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="time"
          step={300}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
        <div className="flex gap-1">
          {DAY_LABELS.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className="w-7 h-7 rounded-full text-xs font-medium"
              style={{
                background: days.includes(i) ? "var(--accent)" : "var(--bg-surface)",
                color: days.includes(i) ? "white" : "var(--text-muted)",
                border: days.includes(i) ? "none" : "1px solid var(--border)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--accent)" }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save
        </button>
        {exists && (
          <button
            onClick={handleRemove}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] disabled:opacity-60"
          >
            <Trash2 size={13} />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
