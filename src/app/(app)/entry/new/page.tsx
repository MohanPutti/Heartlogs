"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DiaryEditor } from "@/components/editor/DiaryEditor";
import { MoodSelector } from "@/components/editor/MoodSelector";
import { TagsInput } from "@/components/editor/TagsInput";
import { useEditorStore } from "@/lib/stores/editorStore";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { format } from "date-fns";
import { ArrowLeft, Save, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/DatePicker";

function NewEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mood, tags, title, setTitle, reset, saveStatus } = useEditorStore();
  const [content, setContent] = useState("{}");
  const [wordCount, setWordCount] = useState(0);
  const [entryId, setEntryId] = useState<string | null>(null);

  const [entryDate, setEntryDate] = useState(() => {
    return searchParams.get("date") ?? format(new Date(), "yyyy-MM-dd");
  });

  useEffect(() => { reset(); }, [reset]);

  const handleCreated = useCallback(
    (id: string) => {
      setEntryId(id);
      router.replace(`/entry/${id}/edit`);
    },
    [router]
  );

  const { save } = useAutosave({ entryId, title, content, mood, tags, wordCount, entryDate, onCreated: handleCreated });

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="flex items-center gap-3 px-4 md:px-6 py-3 border-b shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <Link href="/dashboard" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
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
        <DiaryEditor onChange={(json, words) => { setContent(json); setWordCount(words); }} />
      </div>
    </div>
  );
}

export default function NewEntryPage() {
  return (
    <Suspense>
      <NewEntryContent />
    </Suspense>
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
