import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

async function getOwnedEntry(id: string, userId: string) {
  return prisma.entry.findFirst({ where: { id, userId, deletedAt: null } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await getOwnedEntry(id, session.user.id);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${extension}`;
  const dir = path.join(process.cwd(), "uploads", id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  const url = `/api/uploads/${id}/${filename}`;
  const image = await prisma.entryImage.create({
    data: {
      entryId: id,
      url,
      filename,
      mimeType: file.type,
      size: file.size,
    },
  });

  return NextResponse.json({ id: image.id, url: image.url });
}
