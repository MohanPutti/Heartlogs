"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <Link href="/admin" className="flex items-center gap-2 font-display font-bold text-sm">
          <ShieldAlert size={16} className="text-[var(--accent)]" />
          HeartLogs Admin
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs font-medium transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          Sign out
        </button>
      </nav>
      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  );
}
