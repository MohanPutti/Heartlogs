import Link from "next/link";
import { notFound } from "next/navigation";
import { HeartPulse, ArrowLeft, Calendar as CalendarIcon, Tag } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} · HeartLogs Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} · HeartLogs Blog`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · HeartLogs Blog`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse size={22} className="text-[var(--accent)]" />
          <span className="font-display text-xl font-bold">HeartLogs</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Start free
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 md:px-12 py-12 w-full">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={13} />
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <CalendarIcon size={12} />
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="font-display text-xl font-bold pt-4" style={{ color: "var(--text-primary)" }}>
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("### ")) {
              return (
                <h3 key={i} className="font-display text-lg font-semibold pt-2" style={{ color: "var(--text-primary)" }}>
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("- **")) {
              const items = para.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc pl-5 space-y-1">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace(/^- \*\*(.*?)\*\*/, "$1 — ")}{item.match(/^\*\*(.*?)\*\*/) ? "" : item.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }
            if (para.startsWith("| ")) {
              const lines = para.split("\n").filter((l) => l.startsWith("|"));
              const headers = lines[0].split("|").filter(Boolean).map((h) => h.trim());
              const rows = lines.slice(2).map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));
              return (
                <div key={i} className="overflow-x-auto" style={{ color: "var(--text-primary)" }}>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        {headers.map((h, j) => (
                          <th key={j} className="text-left px-3 py-2 font-semibold border-b" style={{ borderColor: "var(--border)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k} className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            // Regular paragraph
            const formatted = para
              .split("\n")
              .filter((l) => !l.startsWith("|") && !l.startsWith("- **") && !l.startsWith("- ") && !l.startsWith("## ") && !l.startsWith("### ") && !l.startsWith("---"))
              .join(" ");
            if (!formatted.trim()) return null;
            return <p key={i}>{formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>;
          })}
        </div>

        {/* CTA in article */}
        <div
          className="mt-12 rounded-2xl border p-6 text-center"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Start your free private online diary
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            HeartLogs is free, private, and unlimited. No ads, no tracking, no limits.
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Create your free diary
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        © {new Date().getFullYear()} HeartLogs · Free private online diary
      </footer>
    </div>
  );
}
