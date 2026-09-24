import { PrismaClient } from "@prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Intended to run every 5 minutes via cron. Handles two independent notification
// types that share the same push-delivery plumbing:
//   1. JournalReminder — the single "write today's entry" nudge, skipped if the
//      user already wrote today (in their own local day).
//   2. Reminder — general-purpose, user-created reminders (birthdays,
//      anniversaries, one-off notes) with configurable recurrence.
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

function dateKeyParts(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, weekday };
}

async function sendPush(subs: { id: string; endpoint: string; p256dh: string; auth: string }[], payload: string) {
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
}

async function sendJournalReminders(now: Date) {
  const reminders = await prisma.journalReminder.findMany({
    where: { enabled: true },
    include: {
      user: {
        include: {
          pushSubscriptions: true,
          entries: { select: { createdAt: true }, where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 5 },
        },
      },
    },
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

    if (reminder.user.pushSubscriptions.length === 0) continue;

    await sendPush(
      reminder.user.pushSubscriptions,
      JSON.stringify({ title: "HeartLogs", body: "Take a moment to write today's entry.", url: "/entry/new" })
    );
    await prisma.journalReminder.update({ where: { id: reminder.id }, data: { lastSentDate: todayKey } });
    sent++;
  }

  console.log(`Journal reminders: sent ${sent}/${reminders.length}.`);
}

async function sendGeneralReminders(now: Date) {
  const reminders = await prisma.reminder.findMany({
    where: { enabled: true },
    include: { user: { include: { pushSubscriptions: true } } },
  });

  let sent = 0;
  for (const reminder of reminders) {
    if (localTimeHHMM(now, reminder.timezone) !== reminder.time) continue;

    const todayKey = localDateKey(now, reminder.timezone);
    if (reminder.lastSentDate === todayKey) continue;

    const today = dateKeyParts(todayKey);
    const anchor = dateKeyParts(reminder.date);

    const matches =
      reminder.repeat === "daily" ||
      (reminder.repeat === "none" && todayKey === reminder.date) ||
      (reminder.repeat === "weekly" && today.weekday === anchor.weekday) ||
      (reminder.repeat === "monthly" && today.day === anchor.day) ||
      (reminder.repeat === "yearly" && today.month === anchor.month && today.day === anchor.day);
    if (!matches) continue;

    if (reminder.user.pushSubscriptions.length === 0) continue;

    await sendPush(
      reminder.user.pushSubscriptions,
      JSON.stringify({ title: reminder.title, body: reminder.note || "Reminder", url: "/reminders" })
    );
    await prisma.reminder.update({ where: { id: reminder.id }, data: { lastSentDate: todayKey } });
    sent++;
  }

  console.log(`General reminders: sent ${sent}/${reminders.length}.`);
}

async function main() {
  const now = new Date();
  await sendJournalReminders(now);
  await sendGeneralReminders(now);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
