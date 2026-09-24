"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, Settings, BookOpen, Heart, BellRing } from "lucide-react";
import { useEditorStore } from "@/lib/stores/editorStore";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/reminders", icon: BellRing, label: "Reminders" },
  { href: "/blog", icon: BookOpen, label: "Blog" },
  { href: "/donate", icon: Heart, label: "Donate" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const requestSave = useEditorStore((s) => s.requestSave);

  const handleNav = async (href: string) => {
    if (requestSave) await requestSave();
    router.push(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] z-40 pb-safe"
      style={{ background: "var(--sidebar-bg)" }}>
      <div className="flex items-center justify-around px-1 py-2 overflow-x-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <button
              key={href}
              onClick={() => handleNav(href)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-0 shrink-0 ${
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
      </div>
    </nav>
  );
}
