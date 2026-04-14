"use client";

import { MOODS, Mood } from "@/types";
import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/stores/editorStore";

export function MoodSelector() {
  const mood = useEditorStore((s) => s.mood);
  const setMood = useEditorStore((s) => s.setMood);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs text-[var(--text-muted)] mr-1">Mood:</span>
      {MOODS.map((m) => {
        const active = mood === m.key;
        return (
          <motion.button
            key={m.key}
            onClick={() => setMood(active ? null : (m.key as Mood))}
            title={m.label}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`relative flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
              active ? "font-medium" : "opacity-60 hover:opacity-100"
            }`}
            style={
              active
                ? { background: m.color + "25", color: m.color, outline: `2px solid ${m.color}` }
                : { color: "var(--text-secondary)" }
            }
          >
            <span className="text-base leading-none">{m.emoji}</span>
            {active && <span className="leading-none">{m.label}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
