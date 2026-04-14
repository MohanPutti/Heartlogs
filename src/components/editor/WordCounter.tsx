"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/stores/editorStore";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface WordCounterProps {
  getCount: () => number;
}

export function WordCounter({ getCount }: WordCounterProps) {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const [count, setCount] = useState(0);

  // Poll word count every second (lightweight)
  useEffect(() => {
    const id = setInterval(() => setCount(getCount()), 800);
    return () => clearInterval(id);
  }, [getCount]);

  return (
    <div
      className="flex items-center justify-between px-4 md:px-10 py-2 border-t text-xs text-[var(--text-muted)]"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <span>{count} {count === 1 ? "word" : "words"}</span>
      <span className="flex items-center gap-1.5">
        {saveStatus === "saving" && (
          <>
            <Loader2 size={11} className="animate-spin" />
            Saving…
          </>
        )}
        {saveStatus === "saved" && (
          <>
            <Check size={11} className="text-green-500" />
            <span className="text-green-600">Saved</span>
          </>
        )}
        {saveStatus === "error" && (
          <>
            <AlertCircle size={11} className="text-red-500" />
            <span className="text-red-500">Error saving</span>
          </>
        )}
      </span>
    </div>
  );
}
