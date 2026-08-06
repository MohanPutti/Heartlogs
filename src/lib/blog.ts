import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/lib/blog-data";

function toBlogPost(row: {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  tags: string;
  publishedAt: Date;
}): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    author: row.author,
    tags: row.tags.split(",").filter(Boolean),
    date: row.publishedAt.toISOString(),
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return rows.map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  return row ? toBlogPost(row) : null;
}
