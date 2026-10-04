import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { FAB } from "@/components/layout/FAB";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { AppLock } from "@/components/app-lock/AppLock";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLock>
      <div className="flex h-full min-h-screen" style={{ background: "var(--bg)" }}>
        <Sidebar />
        <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
        <FAB />
        <InstallPrompt />
      </div>
    </AppLock>
  );
}
