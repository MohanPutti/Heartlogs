"use client";

import Link from "next/link";
import { BellOff } from "lucide-react";

interface Props {
  needsInstallOnIOS: boolean;
}

export function ReminderPrereqBanner({ needsInstallOnIOS }: Props) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border px-4 py-3 mb-6"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <BellOff size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
      <p className="text-sm text-[var(--text-secondary)]">
        {needsInstallOnIOS
          ? "Reminders need notifications to actually notify you — on iPhone/iPad that means installing HeartLogs as an app first, then "
          : "Reminders need notifications enabled to actually notify you — "}
        <Link href="/settings" className="font-medium text-[var(--accent)] hover:underline">
          set that up in Settings
        </Link>
        .
      </p>
    </div>
  );
}
