"use client";

import { MOODS } from "@/types";
import { motion } from "framer-motion";

interface MoodSummaryProps {
  moodCounts: Record<string, number>;
}

export function MoodSummary({ moodCounts }: MoodSummaryProps) {
  const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium text-[var(--text-muted)] mb-4">This week&apos;s mood</p>
      {total === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No entries yet this week</p>
      ) : (
        <div className="space-y-2">
          {MOODS.map((m) => {
            const count = moodCounts[m.key] ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={m.key} className="flex items-center gap-2">
                <span className="text-base w-6 text-center">{m.emoji}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)] w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
