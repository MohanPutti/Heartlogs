"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/lib/stores/editorStore";
import { trackEvent } from "@/lib/analytics";

interface AutosaveOptions {
  entryId: string | null;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  wordCount: number;
  entryDate?: string;
  onCreated?: (id: string) => void;
  enabled?: boolean;
}

export function useAutosave({
  entryId,
  title,
  content,
  mood,
  tags,
  wordCount,
  entryDate,
  onCreated,
  enabled = true,
}: AutosaveOptions) {
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const setRequestSave = useEditorStore((s) => s.setRequestSave);

  const currentIdRef = useRef<string | null>(entryId);

  // Always-current values — save() reads from here, never from closure.
  const latestRef = useRef({ title, content, mood, tags, wordCount, entryDate, onCreated, enabled });
  latestRef.current = { title, content, mood, tags, wordCount, entryDate, onCreated, enabled };

  useEffect(() => {
    currentIdRef.current = entryId;
  }, [entryId]);

  const save = useCallback(async () => {
    const { title, content, mood, tags, wordCount, entryDate, onCreated, enabled } = latestRef.current;

    if (!enabled) return currentIdRef.current;
    // Don't create a blank entry
    if (!currentIdRef.current && !wordCount && !title.trim()) return currentIdRef.current;

    setSaveStatus("saving");
    try {
      if (!currentIdRef.current) {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, tags, wordCount, entryDate }),
        });
        if (!res.ok) throw new Error("Failed to create");
        const data = await res.json();
        currentIdRef.current = data.id;
        onCreated?.(data.id);
        trackEvent("Entry Created", { wordCount, hasMood: mood ? "yes" : "no", tagCount: tags.length });
      } else {
        const res = await fetch(`/api/entries/${currentIdRef.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, tags, wordCount, entryDate }),
        });
        if (!res.ok) throw new Error("Failed to update");
        trackEvent("Entry Updated", { wordCount, hasMood: mood ? "yes" : "no" });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
    return currentIdRef.current;
  }, [setSaveStatus]);

  // Expose save globally so sidebar/nav can call it before soft-navigating away.
  useEffect(() => {
    setRequestSave(save);
    return () => setRequestSave(null);
  }, [save, setRequestSave]);

  // Save when the user switches tabs or minimises the window.
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [save]);

  // Best-effort save on page close / refresh.
  useEffect(() => {
    const handler = () => save();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [save]);

  return { save };
}
