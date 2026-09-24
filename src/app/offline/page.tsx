import { WifiOff } from "lucide-react";

export const metadata = { title: "You're offline" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: "var(--bg)" }}>
      <WifiOff size={40} className="text-[var(--text-muted)]" />
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">You&apos;re offline</h1>
      <p className="text-sm text-[var(--text-muted)] max-w-sm">
        HeartLogs couldn&apos;t reach the network. Check your connection and try again — anything you already had open should still work.
      </p>
    </div>
  );
}
