"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DiaryEditor } from "@/components/editor/DiaryEditor";
import { EntryType, MOODS } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { trackEvent } from "@/lib/analytics";

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/entries/${id}`)
      .then((r) => {
        if (!r.ok) { router.push("/dashboard"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) { setEntry(data); setLoading(false); }
      });
  }, [id, router]);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    if (res.ok) {
      trackEvent("Entry Deleted");
      toast.success("Entry deleted");
      router.push("/dashboard");
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!entry) return null;

  const mood = entry.mood ? MOODS.find((m) => m.key === entry.mood) : null;

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 md:px-8 py-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back nav */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/entry/${id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <Pencil size={14} />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>

      {/* Entry header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <time className="text-sm text-[var(--text-muted)]">
            {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")}
          </time>
          {mood && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: mood.color + "20", color: mood.color }}>
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>

        {entry.title && (
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight">
            {entry.title}
          </h1>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2.5 py-1 rounded-full text-xs"
                style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* Content */}
      <div className="tiptap-content">
        <DiaryEditor
          initialContent={entry.content}
          readOnly
        />
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-xs text-[var(--text-muted)] flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}>
        <span>{entry.wordCount} words</span>
        <span>Last updated {format(new Date(entry.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete entry?"
        message="This entry will be permanently deleted. This action can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => { setShowDeleteConfirm(false); handleDelete(); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </motion.div>
  );
}
