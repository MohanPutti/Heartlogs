import { RegisterForm } from "@/components/auth/RegisterForm";
import { HeartPulse } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "var(--bg-elevated)" }}>
            <HeartPulse size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">
            Start your diary
          </h1>
          <p className="text-sm text-[var(--text-muted)]">Create your private account to begin</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
