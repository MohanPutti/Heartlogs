import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { razorpay_payment_id, razorpay_signature, razorpay_order_id, razorpay_subscription_id } = body;

  if (!razorpay_payment_id || !razorpay_signature || (!razorpay_order_id && !razorpay_subscription_id)) {
    return NextResponse.json({ error: "Missing verification fields" }, { status: 400 });
  }

  const payload = razorpay_order_id
    ? `${razorpay_order_id}|${razorpay_payment_id}`
    : `${razorpay_payment_id}|${razorpay_subscription_id}`;

  if (!verifySignature(payload, razorpay_signature)) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  if (razorpay_order_id) {
    await prisma.donation.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: { status: "paid", razorpayPaymentId: razorpay_payment_id },
    });
  } else {
    await prisma.donation.update({
      where: { razorpaySubscriptionId: razorpay_subscription_id },
      data: { status: "active", razorpayPaymentId: razorpay_payment_id },
    });
  }

  return NextResponse.json({ success: true });
}
