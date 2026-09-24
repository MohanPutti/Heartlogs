import { PrismaClient } from "@prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Intended to run every 5 minutes via cron. For each user's configured
// Reminder, fires a push if it's currently their chosen local time on an
// enabled day and they haven't written an entry yet today (their local day).
const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function localTimeHHMM(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function localDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function localDayOfWeek(date: Date, timezone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(date);
  return DAY_KEYS.indexOf(weekday);
}

async function main() {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: { enabled: true },
    include: { user: { include: { pushSubscriptions: true, entries: { select: { createdAt: true }, where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 5 } } } },
  });

  let sent = 0;
  for (const reminder of reminders) {
    if (localTimeHHMM(now, reminder.timezone) !== reminder.time) continue;

    const todayKey = localDateKey(now, reminder.timezone);
    if (reminder.lastSentDate === todayKey) continue;

    const days = reminder.days.split(",").map(Number);
    if (!days.includes(localDayOfWeek(now, reminder.timezone))) continue;

    const wroteToday = reminder.user.entries.some((e) => localDateKey(e.createdAt, reminder.timezone) === todayKey);
    if (wroteToday) continue;

    const subs = reminder.user.pushSubscriptions;
    if (subs.length === 0) continue;

    const payload = JSON.stringify({
      title: "HeartLogs",
      body: "Take a moment to write today's entry.",
      url: "/entry/new",
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
      } catch (error: unknown) {
        const statusCode = (error as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error(`Failed to notify subscription ${sub.id}:`, error);
        }
      }
    }

    await prisma.reminder.update({ where: { id: reminder.id }, data: { lastSentDate: todayKey } });
    sent++;
  }

  console.log(`Sent ${sent}/${reminders.length} reminders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
