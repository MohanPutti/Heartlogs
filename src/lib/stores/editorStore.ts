import { create } from "zustand";
import { Mood } from "@/types";

interface EditorStore {
  mood: Mood | null;
  tags: string[];
  title: string;
  isDirty: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  // Registered by useAutosave while an editor is mounted; null otherwise.
  requestSave: (() => Promise<void>) | null;

  setMood: (mood: Mood | null) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
  setTitle: (title: string) => void;
  setDirty: (dirty: boolean) => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setRequestSave: (fn: (() => Promise<void>) | null) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  mood: null,
  tags: [],
  title: "",
  isDirty: false,
  saveStatus: "idle",
  requestSave: null,

  setMood: (mood) => set({ mood, isDirty: true }),
  addTag: (tag) =>
    set((s) => ({
      tags: s.tags.includes(tag) ? s.tags : [...s.tags, tag],
      isDirty: true,
    })),
  removeTag: (tag) =>
    set((s) => ({ tags: s.tags.filter((t) => t !== tag), isDirty: true })),
  setTags: (tags) => set({ tags }),
  setTitle: (title) => set({ title, isDirty: true }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setRequestSave: (requestSave) => set({ requestSave }),
  reset: () =>
    set({ mood: null, tags: [], title: "", isDirty: false, saveStatus: "idle", requestSave: null }),
}));
