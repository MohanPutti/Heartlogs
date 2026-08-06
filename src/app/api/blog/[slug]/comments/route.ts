import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

const MAX_COMMENT_LENGTH = 2000;

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comments = await prisma.blogComment.findMany({
    where: { postId: post.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { id: c.user.id, name: c.user.name ?? "Anonymous", image: c.user.image },
    })),
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { content } = await req.json();
  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
  }

  const comment = await prisma.blogComment.create({
    data: { postId: post.id, userId: session.user.id, content: trimmed },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(
    {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: { id: comment.user.id, name: comment.user.name ?? "Anonymous", image: comment.user.image },
    },
    { status: 201 }
  );
}
