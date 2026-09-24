"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReminderForm } from "@/components/reminders/ReminderForm";

export default function NewReminderPage() {
  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <Link href="/reminders" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-6">
        <ArrowLeft size={14} />
        Reminders
      </Link>
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">New reminder</h1>
      <ReminderForm />
    </div>
  );
}
