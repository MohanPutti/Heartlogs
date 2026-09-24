import { PrismaClient } from "@prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Intended to run once a day via cron. Notifies subscribed users who haven't
// written an entry yet today.
async function main() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const subscriptions = await prisma.pushSubscription.findMany({
    include: {
      user: {
        include: {
          entries: {
            where: { createdAt: { gte: startOfToday }, deletedAt: null },
            select: { id: true },
            take: 1,
          },
        },
      },
    },
  });

  const targets = subscriptions.filter((sub) => sub.user.entries.length === 0);

  const payload = JSON.stringify({
    title: "HeartLogs",
    body: "Take a moment to write today's entry.",
    url: "/entry/new",
  });

  let sent = 0;
  for (const sub of targets) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (error: unknown) {
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      } else {
        console.error(`Failed to notify subscription ${sub.id}:`, error);
      }
    }
  }

  console.log(`Sent ${sent}/${targets.length} journal reminders.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
