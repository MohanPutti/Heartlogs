import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REPEATS = new Set(["none", "daily", "weekly", "monthly", "yearly"]);

function localDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reminders = await prisma.reminder.findMany({
    where: { userId: session.user.id },
    orderBy: [{ time: "asc" }],
  });

  // One-time reminders can never fire again once their date has passed —
  // hide them from the list. Recurring ones (daily/weekly/monthly/yearly)
  // always have a future occurrence, so they always stay visible.
  const now = new Date();
  const visible = reminders.filter((r) => r.repeat !== "none" || r.date >= localDateKey(now, r.timezone));

  return NextResponse.json({ reminders: visible });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, note, date, time, timezone, repeat, enabled } = await req.json();

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(time ?? "")) return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  if (!REPEATS.has(repeat)) return NextResponse.json({ error: "Invalid repeat" }, { status: 400 });
  if (!timezone) return NextResponse.json({ error: "Missing timezone" }, { status: 400 });

  const reminder = await prisma.reminder.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      note: note?.trim() || null,
      date,
      time,
      timezone,
      repeat,
      enabled: enabled ?? true,
    },
  });

  return NextResponse.json({ reminder }, { status: 201 });
}
