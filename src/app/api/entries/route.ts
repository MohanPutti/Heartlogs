import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatEntry } from "@/lib/prisma-types";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const skip = (page - 1) * limit;
  const dateFilter = searchParams.get("date");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (dateFilter) {
    const start = new Date(dateFilter);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateFilter);
    end.setHours(23, 59, 59, 999);
    where.createdAt = { gte: start, lte: end };
  }

  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { entryTags: { include: { tag: true } } },
    }),
    prisma.entry.count({ where }),
  ]);

  return NextResponse.json({
    entries: entries.map(formatEntry),
    total,
    page,
    limit,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, mood, tags, wordCount, entryDate } = await req.json();

  const createdAt = entryDate ? new Date(entryDate) : undefined;

  const entry = await prisma.entry.create({
    data: {
      userId: session.user.id,
      title: title ?? "",
      content: content ?? "{}",
      mood: mood ?? null,
      wordCount: wordCount ?? 0,
      ...(createdAt ? { createdAt, updatedAt: createdAt } : {}),
    },
  });

  if (tags && tags.length > 0) {
    for (const tagName of tags as string[]) {
      const tag = await prisma.tag.upsert({
        where: { name_userId: { name: tagName, userId: session.user.id } },
        update: {},
        create: { name: tagName, userId: session.user.id },
      });
      await prisma.entryTag.create({ data: { entryId: entry.id, tagId: tag.id } });
    }
  }

  const full = await prisma.entry.findUnique({
    where: { id: entry.id },
    include: { entryTags: { include: { tag: true } } },
  });

  return NextResponse.json(formatEntry(full!), { status: 201 });
}
