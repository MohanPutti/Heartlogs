"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/lib/stores/editorStore";

interface AutosaveOptions {
  entryId: string | null;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  wordCount: number;
  entryDate?: string;
  onCreated?: (id: string) => void;
  delay?: number;
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
  delay = 1500,
  enabled = true,
}: AutosaveOptions) {
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);

  const currentIdRef = useRef<string | null>(entryId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const prevEnabledRef = useRef(enabled);

  // Always-current values — save() reads from here, never from closure.
  // Updated synchronously during render (not in useEffect) so it is never
  // stale when a timer callback or child effect fires.
  const latestRef = useRef({ title, content, mood, tags, wordCount, entryDate, onCreated });
  latestRef.current = { title, content, mood, tags, wordCount, entryDate, onCreated };

  useEffect(() => {
    currentIdRef.current = entryId;
  }, [entryId]);

  // Stable save function — deps are only setSaveStatus (which is stable from Zustand)
  const save = useCallback(async () => {
    const { title, content, mood, tags, wordCount, entryDate, onCreated } = latestRef.current;

    // Don't create a blank entry
    if (!currentIdRef.current && !wordCount && !title.trim()) return;

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
      } else {
        const res = await fetch(`/api/entries/${currentIdRef.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, tags, wordCount, entryDate }),
        });
        if (!res.ok) throw new Error("Failed to update");
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  }, [setSaveStatus]);

  // Trigger debounced autosave whenever anything changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevEnabledRef.current = enabled;
      return;
    }
    // Skip the trigger that fires when `enabled` first becomes true (entry just loaded)
    if (enabled && !prevEnabledRef.current) {
      prevEnabledRef.current = enabled;
      return;
    }
    prevEnabledRef.current = enabled;
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, content, mood, tags, wordCount, entryDate, save, delay, enabled]);

  return { save };
}
