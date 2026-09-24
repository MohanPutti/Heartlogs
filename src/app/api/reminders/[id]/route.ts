import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REPEATS = new Set(["none", "daily", "weekly", "monthly", "yearly"]);

async function getOwnedReminder(id: string, userId: string) {
  return prisma.reminder.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const reminder = await getOwnedReminder(id, session.user.id);
  if (!reminder) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ reminder });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedReminder(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { title, note, date, time, timezone, repeat, enabled } = await req.json();

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(time ?? "")) return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  if (!REPEATS.has(repeat)) return NextResponse.json({ error: "Invalid repeat" }, { status: 400 });

  const dateChanged = date !== existing.date;
  const timeChanged = time !== existing.time;
  const repeatChanged = repeat !== existing.repeat;

  const reminder = await prisma.reminder.update({
    where: { id },
    data: {
      title: title.trim(),
      note: note?.trim() || null,
      date,
      time,
      timezone: timezone ?? existing.timezone,
      repeat,
      enabled: enabled ?? existing.enabled,
      // Editing the schedule should let it fire again if it already did today.
      ...(dateChanged || timeChanged || repeatChanged ? { lastSentDate: null } : {}),
    },
  });

  return NextResponse.json({ reminder });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedReminder(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.reminder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
