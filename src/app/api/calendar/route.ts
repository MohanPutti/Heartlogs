import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth()));

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const entries = await prisma.entry.findMany({
    where: { userId: session.user.id, createdAt: { gte: start, lte: end } },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(entries.map((e: { id: string; createdAt: Date }) => e.createdAt.toISOString()));
}
