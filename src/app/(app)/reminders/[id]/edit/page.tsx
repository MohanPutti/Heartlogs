"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { ReminderType } from "@/types";

export default function EditReminderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [reminder, setReminder] = useState<ReminderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reminders/${id}`)
      .then((r) => {
        if (!r.ok) {
          router.push("/reminders");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setReminder(d.reminder);
        setLoading(false);
      });
  }, [id, router]);

  if (loading || !reminder) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={22} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <Link href="/reminders" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-6">
        <ArrowLeft size={14} />
        Reminders
      </Link>
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">Edit reminder</h1>
      <ReminderForm reminder={reminder} />
    </div>
  );
}
