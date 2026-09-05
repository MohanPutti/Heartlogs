import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRazorpay, MIN_DONATION_RUPEES } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const { amount, name, email } = await req.json();

  const rupees = Number(amount);
  if (!Number.isFinite(rupees) || rupees < MIN_DONATION_RUPEES) {
    return NextResponse.json({ error: `Minimum donation is ₹${MIN_DONATION_RUPEES}` }, { status: 400 });
  }
  const paise = Math.round(rupees * 100);
  const razorpay = getRazorpay();

  const plan = await razorpay.plans.create({
    period: "monthly",
    interval: 1,
    item: {
      name: `HeartLogs monthly support - ₹${rupees}`,
      amount: paise,
      currency: "INR",
    },
  });

  const subscription = await razorpay.subscriptions.create({
    plan_id: plan.id,
    customer_notify: 1,
    total_count: 120, // 10 years of monthly charges; donor can cancel anytime
    notes: { purpose: "HeartLogs monthly donation" },
  });

  await prisma.donation.create({
    data: {
      type: "recurring",
      status: "created",
      amount: paise,
      currency: "INR",
      name: name || null,
      email: email || null,
      razorpaySubscriptionId: subscription.id,
    },
  });

  return NextResponse.json({ subscriptionId: subscription.id, amount: paise, currency: "INR" });
}
