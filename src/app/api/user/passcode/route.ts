import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Right after a fresh full re-authentication (password or Google), we trust
// that as strong enough proof of identity to remove a forgotten passcode
// without knowing it — this is the server-side half of that "forgot
// passcode" recovery; the client half is forcing a full sign-out/sign-in.
const FRESH_LOGIN_WINDOW_MS = 5 * 60 * 1000;

function isPasscodeFormat(value: unknown): value is string {
  return typeof value === "string" && /^\d{4,8}$/.test(value);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passcodeHash: true, passcodeLockedUntil: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    hasPasscode: !!user.passcodeHash,
    lockedUntil: user.passcodeLockedUntil,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPasscode, newPasscode } = await req.json();

  if (!isPasscodeFormat(newPasscode)) {
    return NextResponse.json({ error: "Passcode must be 4-8 digits" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.passcodeHash) {
    if (!currentPasscode) {
      return NextResponse.json({ error: "Current passcode required" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPasscode, user.passcodeHash);
    if (!valid) {
      return NextResponse.json({ error: "Current passcode is incorrect" }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passcodeHash: await bcrypt.hash(newPasscode, 12),
      passcodeFailedAttempts: 0,
      passcodeLockedUntil: null,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPasscode } = await req.json().catch(() => ({ currentPasscode: undefined }));

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.passcodeHash) return NextResponse.json({ success: true });

  const freshLogin = !!session.user.loginAt && Date.now() - session.user.loginAt < FRESH_LOGIN_WINDOW_MS;

  if (!freshLogin) {
    if (!currentPasscode) {
      return NextResponse.json({ error: "Current passcode required" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPasscode, user.passcodeHash);
    if (!valid) {
      return NextResponse.json({ error: "Current passcode is incorrect" }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passcodeHash: null, passcodeFailedAttempts: 0, passcodeLockedUntil: null },
  });

  return NextResponse.json({ success: true });
}
