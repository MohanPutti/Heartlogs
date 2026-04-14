"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/register")
      .then((r) => r.json())
      .then((d) => {
        if (!d.available) router.replace("/login");
        else setChecking(false);
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      const d = await res.json();
      setError(d.error ?? "Registration failed");
      setLoading(false);
    }
  }

  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
  ];

  if (checking) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl text-sm text-red-500 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Your name <span className="text-[var(--text-muted)]">(optional)</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sofia"
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {password && (
          <div className="mt-2 space-y-1">
            {rules.map((r) => (
              <div key={r.label} className="flex items-center gap-1.5 text-xs">
                {r.ok
                  ? <CheckCircle2 size={13} className="text-green-500" />
                  : <XCircle size={13} className="text-[var(--text-muted)]" />}
                <span className={r.ok ? "text-green-600" : "text-[var(--text-muted)]"}>{r.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || password.length < 8}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        style={{ background: "var(--accent)" }}
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        Create my diary
      </button>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">Sign in</Link>
      </p>
    </form>
  );
}
