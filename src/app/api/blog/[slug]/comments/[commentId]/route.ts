import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string; commentId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId } = await params;
  const comment = await prisma.blogComment.findUnique({ where: { id: commentId } });
  if (!comment || comment.deletedAt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.blogComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
  return NextResponse.json({ success: true });
}
