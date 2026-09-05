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

  const order = await getRazorpay().orders.create({
    amount: paise,
    currency: "INR",
    notes: { purpose: "HeartLogs donation" },
  });

  await prisma.donation.create({
    data: {
      type: "one_time",
      status: "created",
      amount: paise,
      currency: "INR",
      name: name || null,
      email: email || null,
      razorpayOrderId: order.id,
    },
  });

  return NextResponse.json({ orderId: order.id, amount: paise, currency: "INR" });
}
