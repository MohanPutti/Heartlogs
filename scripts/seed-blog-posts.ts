import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../src/lib/blog-data";

const prisma = new PrismaClient();

async function main() {
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        description: post.description,
        content: post.content,
        author: post.author,
        tags: post.tags.join(","),
        publishedAt: new Date(post.date),
      },
      create: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
        author: post.author,
        tags: post.tags.join(","),
        publishedAt: new Date(post.date),
      },
    });
    console.log(`Upserted: ${post.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
