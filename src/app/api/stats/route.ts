import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function computeStreak(dates: Date[]): number {
  if (!dates.length) return 0;
  const sorted = [...dates]
    .map((d) => d.toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // unique days
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

  const [allEntries, weekEntries, totalWords] = await Promise.all([
    prisma.entry.findMany({
      where: { userId: session.user.id },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.entry.findMany({
      where: { userId: session.user.id, createdAt: { gte: sevenDaysAgo } },
      select: { mood: true },
    }),
    prisma.entry.aggregate({
      where: { userId: session.user.id },
      _sum: { wordCount: true },
    }),
  ]);

  const streak = computeStreak(allEntries.map((e: { createdAt: Date }) => e.createdAt));

  const moodCounts: Record<string, number> = {};
  weekEntries.forEach((e: { mood: string | null }) => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] ?? 0) + 1;
  });

  return NextResponse.json({
    streak,
    totalEntries: allEntries.length,
    totalWords: totalWords._sum.wordCount ?? 0,
    moodCounts,
  });
}
