// Manually defined types for Prisma query results to avoid v7 import issues

export interface TagRow {
  id: string;
  name: string;
  color: string | null;
  userId: string;
}

export interface EntryTagRow {
  entryId: string;
  tagId: string;
  tag: TagRow;
}

export interface EntryWithTagsRow {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  entryTags: EntryTagRow[];
}

export function formatEntry(entry: EntryWithTagsRow) {
  return {
    id: entry.id,
    userId: entry.userId,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    wordCount: entry.wordCount,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    tags: entry.entryTags.map((et) => et.tag),
  };
}
