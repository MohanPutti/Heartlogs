"use client";

import { useState, useEffect } from "react";
import { EntryCard } from "@/components/entry/EntryCard";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { MoodSummary } from "@/components/dashboard/MoodSummary";
import { EntryType } from "@/types";
import { PenLine, BookText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface Stats {
  streak: number;
  totalEntries: number;
  totalWords: number;
  moodCounts: Record<string, number>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/entries?limit=12").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
    ]).then(([entriesData, statsData]) => {
      setEntries(entriesData.entries ?? []);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const name = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Greeting */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
          {greeting()}{name ? `, ${name}` : ""} ✨
        </h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          {entries.length === 0
            ? "Start your first entry and begin your journey"
            : `You have ${stats?.totalEntries ?? 0} entries and ${(stats?.totalWords ?? 0).toLocaleString()} words written`}
        </p>
      </motion.div>

      {/* Stats row */}
      {!loading && stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StreakCounter streak={stats.streak} />
          <MoodSummary moodCounts={stats.moodCounts} />
        </div>
      )}

      {/* New entry CTA (when no entries) */}
      {!loading && entries.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BookText size={40} className="text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)] mb-4 text-center max-w-xs">
            Your diary is empty. Write your first entry and capture this moment.
          </p>
          <Link
            href="/entry/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            <PenLine size={15} />
            Write first entry
          </Link>
        </motion.div>
      )}

      {/* Entry grid */}
      {entries.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-4">
            Recent Entries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <EntryCard entry={entry} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
