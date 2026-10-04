"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, X } from "lucide-react";

const DISMISS_KEY = "heartlogs-applock-nudge-dismissed-at";
const DISMISS_DAYS = 14;

export function AppLockNudge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
      return;
    }
    fetch("/api/user/passcode")
      .then((r) => r.json())
      .then((d) => setVisible(!d.hasPasscode));
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-3 mb-6"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <Lock size={16} className="text-[var(--accent)] shrink-0" />
      <p className="flex-1 text-sm text-[var(--text-secondary)]">
        Add a passcode to keep your diary private on this device —{" "}
        <Link href="/settings" className="font-medium text-[var(--accent)] hover:underline">
          set one in Settings
        </Link>
        .
      </p>
      <button onClick={dismiss} className="text-[var(--text-muted)] shrink-0" aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}
