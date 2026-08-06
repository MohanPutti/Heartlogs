import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

interface PostInput {
  slug: string;
  title: string;
  description: string;
  content: string;
  author?: string;
  tags: string[];
  date?: string;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/publish-blog-post.ts <post.json>");
    process.exit(1);
  }

  const post: PostInput = JSON.parse(readFileSync(file, "utf-8"));

  await prisma.blogPost.upsert({
    where: { slug: post.slug },
    update: {
      title: post.title,
      description: post.description,
      content: post.content,
      author: post.author ?? "HeartLogs Team",
      tags: post.tags.join(","),
      ...(post.date ? { publishedAt: new Date(post.date) } : {}),
    },
    create: {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      author: post.author ?? "HeartLogs Team",
      tags: post.tags.join(","),
      publishedAt: post.date ? new Date(post.date) : new Date(),
    },
  });

  console.log(`Published: /blog/${post.slug}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
