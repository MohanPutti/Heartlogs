import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { passcode } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.passcodeHash) return NextResponse.json({ valid: true });

  if (user.passcodeLockedUntil && user.passcodeLockedUntil > new Date()) {
    return NextResponse.json(
      { valid: false, lockedUntil: user.passcodeLockedUntil },
      { status: 429 }
    );
  }

  const valid = typeof passcode === "string" && (await bcrypt.compare(passcode, user.passcodeHash));

  if (valid) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passcodeFailedAttempts: 0, passcodeLockedUntil: null },
    });
    return NextResponse.json({ valid: true });
  }

  // Past lockouts don't carry over — a cleared lockout gets a fresh run of attempts.
  const wasLocked = !!user.passcodeLockedUntil;
  const attempts = (wasLocked ? 0 : user.passcodeFailedAttempts) + 1;
  const lockedUntil = attempts >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passcodeFailedAttempts: attempts, passcodeLockedUntil: lockedUntil },
  });

  return NextResponse.json({ valid: false, lockedUntil }, { status: lockedUntil ? 429 : 401 });
}
