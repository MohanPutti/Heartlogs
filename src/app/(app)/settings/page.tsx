"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Eye, EyeOff, Loader2, Save, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import toast from "react-hot-toast";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSavingProfile(false);
    if (res.ok) {
      await update({ name });
      toast.success("Name updated");
    } else {
      toast.error("Failed to update name");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSavingPw(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    setSavingPw(false);
    if (res.ok) {
      toast.success("Password changed");
      setCurrentPw("");
      setNewPw("");
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to change password");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8">
        Settings
      </h1>

      {/* Profile */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">Profile</h2>
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="Avatar" width={56} height={56} className="rounded-full" />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold text-white"
                style={{ background: "var(--accent)" }}>
                {(session?.user?.name ?? session?.user?.email ?? "?")[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-[var(--text-primary)]">{session?.user?.name ?? "Unnamed"}</p>
              <p className="text-sm text-[var(--text-muted)]">{session?.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 px-3.5 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
            <button
              type="submit"
              disabled={savingProfile}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-1.5 disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {savingProfile ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save
            </button>
          </form>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">Appearance</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Password */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">Security</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Current password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingPw || !currentPw || !newPw}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {savingPw && <Loader2 size={13} className="animate-spin" />}
              Change password
            </button>
          </form>
        </div>
      </section>

      {/* Sign out */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">Account</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
