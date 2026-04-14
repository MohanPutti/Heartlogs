"use client";

import Link from "next/link";
import { EntryType, MOODS } from "@/types";
import { formatEntryDate, extractTextFromTipTap, truncate } from "@/lib/utils";
import { motion } from "framer-motion";

interface EntryCardProps {
  entry: EntryType;
}

export function EntryCard({ entry }: EntryCardProps) {
  const mood = entry.mood ? MOODS.find((m) => m.key === entry.mood) : null;
  const preview = truncate(extractTextFromTipTap(entry.content), 140);
  const displayTitle = entry.title || formatEntryDate(entry.createdAt);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <Link href={`/entry/${entry.id}`} className="block">
        <article
          className="rounded-2xl border p-5 transition-colors cursor-pointer"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card-bg)")}
        >
          {/* Date + mood */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">
              {formatEntryDate(entry.createdAt)}
            </span>
            {mood && (
              <span className="text-base" title={mood.label}>{mood.emoji}</span>
            )}
          </div>

          {/* Title */}
          {entry.title && (
            <h3 className="font-display text-base font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">
              {displayTitle}
            </h3>
          )}

          {/* Preview text */}
          {preview && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
              {preview}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1 flex-wrap">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {entry.wordCount} words
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
