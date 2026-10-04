"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2, Lock, Check } from "lucide-react";
import toast from "react-hot-toast";

type Mode = "summary" | "editing" | "removing";

export function AppLockSettings() {
  const [hasPasscode, setHasPasscode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<Mode>("summary");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    return fetch("/api/user/passcode")
      .then((r) => r.json())
      .then((d) => setHasPasscode(!!d.hasPasscode))
      .finally(() => setLoaded(true));
  }

  useEffect(() => {
    refresh();
  }, []);

  function resetForm() {
    setMode("summary");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4,8}$/.test(next)) {
      toast.error("Passcode must be 4-8 digits");
      return;
    }
    if (next !== confirm) {
      toast.error("Passcodes don't match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/passcode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPasscode: current || undefined, newPasscode: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't save passcode");
        return;
      }
      toast.success(hasPasscode ? "Passcode changed" : "Passcode set");
      resetForm();
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/passcode", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPasscode: current }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't remove passcode");
        return;
      }
      toast.success("Passcode removed");
      resetForm();
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return <Loader2 size={14} className="animate-spin text-[var(--text-muted)]" />;

  if (mode === "summary") {
    return (
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
            <Lock size={13} className="text-[var(--accent)]" />
            App lock
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {hasPasscode ? (
              <span className="flex items-center gap-1">
                <Check size={11} className="text-[var(--accent)]" /> A passcode protects your diary
              </span>
            ) : (
              "Require a passcode to open HeartLogs on this device"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMode("editing")}
            className="px-3.5 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            {hasPasscode ? "Change" : "Set passcode"}
          </button>
          {hasPasscode && (
            <button
              onClick={() => setMode("removing")}
              className="text-xs font-medium text-red-500 flex items-center gap-1"
            >
              <Trash2 size={12} />
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === "removing") {
    return (
      <form onSubmit={handleRemove} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Enter your current passcode to remove app lock
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            autoFocus
            value={current}
            onChange={(e) => setCurrent(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || current.length < 4}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "#dc2626" }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Remove passcode
          </button>
          <button type="button" onClick={resetForm} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)]">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      {hasPasscode && (
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Current passcode</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={current}
            onChange={(e) => setCurrent(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">New passcode (4-8 digits)</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value.replace(/\D/g, ""))}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Confirm new passcode</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--accent)" }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save
        </button>
        <button type="button" onClick={resetForm} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)]">
          Cancel
        </button>
      </div>
    </form>
  );
}
