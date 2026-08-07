"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border p-6"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <h1 className="font-display text-xl font-bold mb-6">Admin sign in</h1>

        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="w-full rounded-xl border px-3 py-2 text-sm mb-4 focus:outline-none"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />

        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-xl border px-3 py-2 text-sm mb-4 focus:outline-none"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />

        {error && (
          <p className="text-xs mb-4" style={{ color: "#e05252" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
