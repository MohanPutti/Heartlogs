import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { FAB } from "@/components/layout/FAB";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
      <FAB />
    </div>
  );
}
