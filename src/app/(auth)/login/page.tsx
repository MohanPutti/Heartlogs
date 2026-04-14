import { LoginForm } from "@/components/auth/LoginForm";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "var(--bg-elevated)" }}>
            <HeartPulse size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Your private journal is waiting</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
