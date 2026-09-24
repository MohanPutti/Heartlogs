"use server";

import webpush from "web-push";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

type SubscriptionPayload = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function subscribeUser(sub: SubscriptionPayload) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { p256dh: sub.keys.p256dh, auth: sub.keys.auth, userId: session.user.id },
    create: {
      userId: session.user.id,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  });

  return { success: true };
}

export async function unsubscribeUser(endpoint: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.pushSubscription.deleteMany({
    where: { endpoint, userId: session.user.id },
  });

  return { success: true };
}

export async function isSubscribed(endpoint: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const existing = await prisma.pushSubscription.findFirst({
    where: { endpoint, userId: session.user.id },
  });
  return !!existing;
}

export async function sendTestNotification() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subs = await prisma.pushSubscription.findMany({ where: { userId: session.user.id } });
  if (subs.length === 0) throw new Error("No subscription available");

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({
            title: "HeartLogs",
            body: "This is a test notification. Reminders will look like this.",
            url: "/dashboard",
          })
        );
      } catch (error: unknown) {
        const statusCode = (error as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );

  return { success: true };
}
