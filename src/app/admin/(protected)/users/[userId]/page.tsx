import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MOODS } from "@/types";
import { extractTextFromTipTap, truncate } from "@/lib/utils";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserEntriesPage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) notFound();

  const entries = await prisma.entry.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Link href="/admin" className="text-xs mb-4 inline-block" style={{ color: "var(--text-muted)" }}>
        ← All users
      </Link>
      <h1 className="font-display text-2xl font-bold mb-1">{user.name || user.email}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {user.email} · {entries.length} {entries.length === 1 ? "entry" : "entries"}
      </p>

      <div className="space-y-3">
        {entries.map((entry) => {
          const mood = entry.mood ? MOODS.find((m) => m.key === entry.mood) : null;
          const preview = truncate(extractTextFromTipTap(entry.content), 160);
          return (
            <Link
              key={entry.id}
              href={`/admin/users/${user.id}/entries/${entry.id}`}
              className="block rounded-2xl border p-4 transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {entry.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                {mood && <span title={mood.label}>{mood.emoji}</span>}
              </div>
              <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                {entry.title || "Untitled"}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {preview || "(empty entry)"}
              </p>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{entry.wordCount} words</p>
            </Link>
          );
        })}
        {entries.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
