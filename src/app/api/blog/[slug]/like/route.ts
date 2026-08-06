import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const session = await auth();

  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [count, liked] = await Promise.all([
    prisma.blogLike.count({ where: { postId: post.id } }),
    session?.user?.id
      ? prisma.blogLike.findUnique({
          where: { postId_userId: { postId: post.id, userId: session.user.id } },
        })
      : null,
  ]);

  return NextResponse.json({ count, liked: !!liked });
}

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.blogLike.findUnique({
    where: { postId_userId: { postId: post.id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.blogLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.blogLike.create({ data: { postId: post.id, userId: session.user.id } });
  }

  const count = await prisma.blogLike.count({ where: { postId: post.id } });
  return NextResponse.json({ count, liked: !existing });
}
