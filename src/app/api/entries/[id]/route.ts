import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatEntry } from "@/lib/prisma-types";

async function getOwnedEntry(id: string, userId: string) {
  return prisma.entry.findFirst({
    where: { id, userId, deletedAt: null },
    include: { entryTags: { include: { tag: true } } },
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await getOwnedEntry(id, session.user.id);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(formatEntry(entry));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedEntry(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, content, mood, tags, wordCount, entryDate } = await req.json();

  const createdAt = entryDate ? new Date(entryDate) : undefined;

  await prisma.entry.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      content: content ?? existing.content,
      mood: mood !== undefined ? mood : existing.mood,
      wordCount: wordCount ?? existing.wordCount,
      ...(createdAt ? { createdAt } : {}),
    },
  });

  if (tags !== undefined) {
    await prisma.entryTag.deleteMany({ where: { entryId: id } });
    for (const tagName of tags as string[]) {
      const tag = await prisma.tag.upsert({
        where: { name_userId: { name: tagName, userId: session.user.id } },
        update: {},
        create: { name: tagName, userId: session.user.id },
      });
      await prisma.entryTag.create({ data: { entryId: id, tagId: tag.id } });
    }
  }

  const full = await prisma.entry.findUnique({
    where: { id },
    include: { entryTags: { include: { tag: true } } },
  });

  return NextResponse.json(formatEntry(full!));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedEntry(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.entry.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ success: true });
}
