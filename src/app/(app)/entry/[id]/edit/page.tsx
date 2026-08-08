"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { DiaryEditor } from "@/components/editor/DiaryEditor";
import { MoodSelector } from "@/components/editor/MoodSelector";
import { TagsInput } from "@/components/editor/TagsInput";
import { useEditorStore } from "@/lib/stores/editorStore";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Save, Check } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { EntryType, Mood } from "@/types";

export default function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { mood, tags, title, setTitle, setTags, setMood, reset, saveStatus } = useEditorStore();
  const [content, setContent] = useState("{}");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    reset();
    fetch(`/api/entries/${id}`)
      .then((r) => {
        if (!r.ok) { router.push("/dashboard"); return null; }
        return r.json();
      })
      .then((data: EntryType | null) => {
        if (!data) return;
        setTitle(data.title);
        setContent(data.content);
        setWordCount(data.wordCount);
        if (data.mood) setMood(data.mood as Mood);
        setTags(data.tags.map((t) => t.name));
        setEntryDate(format(new Date(data.createdAt), "yyyy-MM-dd"));
        setLoading(false);
      });
  }, [id, reset, setTitle, setMood, setTags, router]);

  const handleCreated = useCallback((_id: string) => {}, []);

  const { save } = useAutosave({ entryId: id, title, content, mood, tags, wordCount, entryDate, onCreated: handleCreated, enabled: !loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg)" }}>
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="flex items-center gap-3 px-4 md:px-6 py-3 border-b shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <button
          onClick={async () => { await save(); router.push(`/entry/${id}`); }}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this entry a title…"
            className="w-full font-display text-xl font-semibold bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <DatePicker value={entryDate} onChange={setEntryDate} />
        </div>
        <SaveButton status={saveStatus} onSave={save} />
      </div>

      <div
        className="flex items-center gap-4 px-4 md:px-6 py-2 border-b shrink-0 flex-wrap gap-y-2"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <MoodSelector />
        <div className="h-4 w-px" style={{ background: "var(--border)" }} />
        <TagsInput />
      </div>

      <div className="flex-1 overflow-hidden">
        <DiaryEditor
          initialContent={content}
          onChange={(json, words) => { setContent(json); setWordCount(words); }}
          onEnsureEntryId={async () => id}
        />
      </div>
    </div>
  );
}

function SaveButton({ status, onSave }: { status: string; onSave: () => void }) {
  return (
    <button
      onClick={onSave}
      disabled={status === "saving"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0"
      style={{
        background: status === "saved" ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "var(--bg-elevated)",
        color: status === "saved" ? "var(--accent)" : "var(--text-secondary)",
      }}
    >
      {status === "saving" ? (
        <Loader2 size={13} className="animate-spin" />
      ) : status === "saved" ? (
        <Check size={13} />
      ) : (
        <Save size={13} />
      )}
      {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save"}
    </button>
  );
}
