import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatEntry } from "@/lib/prisma-types";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json([]);

  const entries = await prisma.entry.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { entryTags: { include: { tag: true } } },
  });

  return NextResponse.json(entries.map(formatEntry));
}
