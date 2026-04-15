import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { HeartPulse, BookOpen, Lock, Sparkles, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeartLogs — Your Private Digital Diary",
  description:
    "HeartLogs is a beautiful, private online diary. Write daily journal entries, track your mood, add tags, and reflect on your life — completely private, always yours.",
  alternates: { canonical: "https://heartlogs.com" },
  openGraph: {
    title: "HeartLogs — Your Private Digital Diary",
    description:
      "A beautiful, private online diary. Write journal entries, track your mood, and reflect on your life. Free to use.",
    url: "https://heartlogs.com",
    siteName: "HeartLogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartLogs — Your Private Digital Diary",
    description:
      "A beautiful, private online diary. Write journal entries, track your mood, and reflect on your life.",
  },
};

const features = [
  {
    icon: BookOpen,
    title: "Rich journal entries",
    desc: "Write with a full-featured editor — bold, italic, links, highlights, and more. Your thoughts, beautifully formatted.",
  },
  {
    icon: Lock,
    title: "Completely private",
    desc: "Your diary is yours alone. Entries are tied to your account and never shared with anyone.",
  },
  {
    icon: Sparkles,
    title: "Mood tracking",
    desc: "Log how you feel each day — great, good, okay, low, or rough — and spot patterns over time.",
  },
  {
    icon: Calendar,
    title: "Calendar view",
    desc: "Navigate your past entries by date. See which days you wrote and revisit any moment in your life.",
  },
  {
    icon: Tag,
    title: "Tags & search",
    desc: "Organise entries with tags and find anything instantly with full-text search across your entire journal.",
  },
  {
    icon: HeartPulse,
    title: "Daily streaks",
    desc: "Build the habit of journaling. Track your current streak and stay motivated to write every day.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <div className="flex items-center gap-2">
          <HeartPulse size={22} className="text-[var(--accent)]" />
          <span className="font-display text-xl font-bold">HeartLogs</span>
        </div>
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

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
        >
          <HeartPulse size={12} className="text-[var(--accent)]" />
          Free private diary — no ads, no tracking
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-3xl mb-6" style={{ color: "var(--text-primary)" }}>
          Your thoughts deserve a{" "}
          <span style={{ color: "var(--accent)" }}>beautiful home</span>
        </h1>
        <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          HeartLogs is a private online diary where you can write freely, track your mood, and reflect on your life — one entry at a time.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-2xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Start your diary — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-2xl font-medium text-sm transition-colors"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-20 max-w-5xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
          Everything you need to journal consistently
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 border"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "var(--bg-elevated)" }}
              >
                <Icon size={18} className="text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mx-6 md:mx-12 mb-16 rounded-3xl px-8 py-14 text-center border"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Start writing today
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Join people who use HeartLogs to process their thoughts, track their moods, and build a journaling habit.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-2xl font-medium text-sm shadow-md hover:shadow-lg transition-all"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Create your free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} HeartLogs · Private by design
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "HeartLogs",
            url: "https://heartlogs.com",
            description:
              "A beautiful, private online diary. Write journal entries, track your mood, and reflect on your life.",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
