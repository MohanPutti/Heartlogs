"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HeartPulse, LayoutDashboard, Calendar, Search, Settings, PenLine, LogOut, BookOpen } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import { useEditorStore } from "@/lib/stores/editorStore";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const requestSave = useEditorStore((s) => s.requestSave);

  const handleNav = async (href: string) => {
    if (requestSave) await requestSave();
    router.push(href);
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 border-r border-[var(--border)] z-40"
      style={{ background: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <HeartPulse size={20} className="text-[var(--accent)]" />
          <span className="font-display text-lg font-semibold text-[var(--text-primary)]">HeartLogs</span>
        </div>
      </div>

      {/* New Entry CTA */}
      <div className="px-4 mb-4">
        <Link
          href="/entry/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--accent)" }}
        >
          <PenLine size={15} />
          New Entry
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <button
              key={href}
              onClick={() => handleNav(href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "font-medium text-[var(--accent)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-[var(--border)] flex items-center gap-3">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}>
            {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {session?.user?.name ?? "My Diary"}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">{session?.user?.email}</p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
