import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        await prisma.donation.updateMany({
          where: { razorpayOrderId: payment.order_id },
          data: { status: "paid", razorpayPaymentId: payment.id },
        });
      }
      break;
    }
    case "subscription.charged": {
      const subscription = event.payload?.subscription?.entity;
      const payment = event.payload?.payment?.entity;
      if (subscription?.id) {
        await prisma.donation.updateMany({
          where: { razorpaySubscriptionId: subscription.id },
          data: { status: "active", razorpayPaymentId: payment?.id },
        });
      }
      break;
    }
    case "subscription.cancelled":
    case "subscription.completed": {
      const subscription = event.payload?.subscription?.entity;
      if (subscription?.id) {
        await prisma.donation.updateMany({
          where: { razorpaySubscriptionId: subscription.id },
          data: { status: "cancelled" },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
