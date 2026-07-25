import Link from "next/link";
import { HeartPulse, ArrowRight, Calendar as CalendarIcon, Tag } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Blog — Free Private Online Diary Tips & Journaling Guides",
  description:
    "Read the HeartLogs blog for journaling tips, diary privacy guides, mood tracking advice, and digital journal recommendations. Learn how to build a meaningful daily writing habit.",
  openGraph: {
    title: "HeartLogs Blog — Free Online Diary Tips & Guides",
    description:
      "Journaling tips, mood tracking guides, privacy advice, and everything you need to make the most of your private digital diary.",
  },
};

export default function BlogPage() {
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

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 w-full">
        <BreadcrumbJsonLd items={[
          { name: "HeartLogs", url: "https://heartlogs.com" },
          { name: "Blog", url: "https://heartlogs.com/blog" },
        ]} />
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          HeartLogs Blog
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Journaling tips, diary privacy guides, and everything about your free online diary.
        </p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border p-6 transition-all hover:shadow-md"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">
                  <CalendarIcon size={12} />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span>·</span>
                <span>{post.author}</span>
              </div>
              <h2 className="font-display text-lg md:text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                {post.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
                Read more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>

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
