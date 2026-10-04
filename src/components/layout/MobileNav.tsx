"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Settings, BookOpen, Heart, BellRing, MoreHorizontal } from "lucide-react";
import { useEditorStore } from "@/lib/stores/editorStore";

const NAV_PRIMARY = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/reminders", icon: BellRing, label: "Reminders" },
];

const NAV_MORE = [
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/donate", icon: Heart, label: "Donate" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const requestSave = useEditorStore((s) => s.requestSave);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const moreActive = NAV_MORE.some((item) => isActive(item.href));

  const handleNav = async (href: string) => {
    if (requestSave) await requestSave();
    setMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
      )}

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] z-40 pb-safe"
        style={{ background: "var(--sidebar-bg)" }}
      >
        {moreOpen && (
          <div
            className="absolute bottom-full left-0 right-0 border-t rounded-t-2xl overflow-hidden mx-2 mb-1 shadow-lg"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            {NAV_MORE.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <button
                  key={href}
                  onClick={() => handleNav(href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    active ? "font-medium text-[var(--accent)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 1.75} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-around px-1 py-2">
          {NAV_PRIMARY.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <button
                key={href}
                onClick={() => handleNav(href)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors min-w-0 shrink-0 ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors min-w-0 shrink-0 ${
              moreOpen || moreActive
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <MoreHorizontal size={20} strokeWidth={moreOpen || moreActive ? 2.5 : 1.75} />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
