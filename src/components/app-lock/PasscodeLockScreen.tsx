"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { HeartPulse, Loader2, Lock } from "lucide-react";

interface Props {
  onUnlock: (passcode: string) => Promise<{ success: boolean; error?: string; lockedUntil?: string }>;
}

export function PasscodeLockScreen({ onUnlock }: Props) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await onUnlock(passcode);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Incorrect passcode");
      setPasscode("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{ background: "var(--bg-elevated)" }}
        >
          <Lock size={24} className="text-[var(--accent)]" />
        </div>
        <h1 className="font-display text-xl font-bold text-[var(--text-primary)] mb-1 flex items-center justify-center gap-1.5">
          <HeartPulse size={16} className="text-[var(--accent)]" />
          Enter passcode
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">Unlock HeartLogs to continue</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            maxLength={8}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            className="w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || passcode.length < 4}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "var(--accent)" }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Unlock
          </button>
        </form>

        <button
          onClick={() => signOut({ callbackUrl: "/login?resetPasscode=1" })}
          className="mt-6 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
        >
          Forgot passcode?
        </button>
      </div>
    </div>
  );
}
