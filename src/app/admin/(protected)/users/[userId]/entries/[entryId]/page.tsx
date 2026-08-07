import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DiaryEditor } from "@/components/editor/DiaryEditor";
import { MOODS } from "@/types";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ userId: string; entryId: string }>;
}

export default async function AdminEntryPage({ params }: Props) {
  const { userId, entryId } = await params;

  const entry = await prisma.entry.findFirst({
    where: { id: entryId, userId, deletedAt: null },
    include: { entryTags: { include: { tag: true } } },
  });
  if (!entry) notFound();

  const mood = entry.mood ? MOODS.find((m) => m.key === entry.mood) : null;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Link
        href={`/admin/users/${userId}`}
        className="flex items-center gap-2 text-sm mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={16} />
        Back to entries
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <time className="text-sm" style={{ color: "var(--text-muted)" }}>
            {entry.createdAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </time>
          {mood && (
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: mood.color + "20", color: mood.color }}
            >
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>

        {entry.title && (
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            {entry.title}
          </h1>
        )}

        {entry.entryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.entryTags.map(({ tag }) => (
              <span
                key={tag.id}
                className="px-2.5 py-1 rounded-full text-xs"
                style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 h-px" style={{ background: "var(--border)" }} />
      </div>

      <div className="tiptap-content">
        <DiaryEditor initialContent={entry.content} readOnly />
      </div>

      <div
        className="mt-12 pt-6 border-t text-xs flex items-center justify-between"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <span>{entry.wordCount} words</span>
        <span>
          Last updated {entry.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}
