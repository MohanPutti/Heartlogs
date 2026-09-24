"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function roundToNearest5(time: string) {
  const [h, m] = time.split(":").map(Number);
  const rounded = Math.round(m / 5) * 5;
  const totalMinutes = (h * 60 + rounded) % (24 * 60);
  const rh = Math.floor(totalMinutes / 60);
  const rm = totalMinutes % 60;
  return `${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}`;
}

export async function getReminder() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.reminder.findUnique({ where: { userId: session.user.id } });
}

export async function saveReminder(input: { time: string; timezone: string; days: number[]; enabled: boolean }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!/^\d{2}:\d{2}$/.test(input.time)) throw new Error("Invalid time");
  if (input.days.some((d) => d < 0 || d > 6)) throw new Error("Invalid day");

  const time = roundToNearest5(input.time);
  const days = [...new Set(input.days)].sort().join(",") || "0,1,2,3,4,5,6";

  await prisma.reminder.upsert({
    where: { userId: session.user.id },
    update: { time, timezone: input.timezone, days, enabled: input.enabled },
    create: {
      userId: session.user.id,
      time,
      timezone: input.timezone,
      days,
      enabled: input.enabled,
    },
  });

  return { success: true };
}

export async function deleteReminder() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.reminder.deleteMany({ where: { userId: session.user.id } });

  return { success: true };
}
