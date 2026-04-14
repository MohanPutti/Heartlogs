"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6 rounded-2xl border"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <motion.div
        animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
      >
        <Flame
          size={32}
          className={streak > 0 ? "text-orange-400" : "text-[var(--text-muted)]"}
          fill={streak > 0 ? "#fb923c" : "none"}
        />
      </motion.div>
      <span className="font-display text-4xl font-bold text-[var(--text-primary)] mt-1">
        {streak}
      </span>
      <span className="text-xs text-[var(--text-muted)] mt-0.5">
        day{streak !== 1 ? "s" : ""} streak
      </span>
    </motion.div>
  );
}
