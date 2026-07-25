import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { HeartPulse, BookOpen, Lock, Sparkles, Calendar, Tag, TrendingUp, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeartLogs — Free Private Online Diary & Digital Journal | Secure & Safe",
  description:
    "HeartLogs is a free, private online diary and digital journal. Write daily entries, track your mood, organize with tags, and browse your story on a calendar. Completely private, encrypted, and yours forever — no ads, no tracking, no data sharing.",
  keywords: [
    "free online diary",
    "private digital diary",
    "online journal",
    "daily diary app",
    "private journal",
    "mood tracker diary",
    "safe diary online",
    "digital journal free",
    "journaling app",
    "personal diary",
    "encrypted diary",
    "private writing app",
  ],
  openGraph: {
    title: "HeartLogs — Free Private Online Diary & Digital Journal",
    description:
      "Write securely with our free private online diary. Track your mood, organize with tags, and build a daily journaling habit — completely safe, no ads, always yours.",
    url: "https://heartlogs.com",
    siteName: "HeartLogs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartLogs — Free Private Online Diary",
    description:
      "A beautiful, private digital diary. Write entries, track moods, and reflect on your life. Free to use.",
  },
  other: {
    "google-site-verification": "", // Add your Google Search Console code here
  },
};

const features = [
  {
    icon: BookOpen,
    title: "Rich digital diary entries",
    desc: "Pour your heart out with our full-featured editor — bold, italic, links, highlights, headings, and bullet lists. Your private journal entries look exactly the way you imagine them, every time you write.",
  },
  {
    icon: Lock,
    title: "Private & safe — always",
    desc: "Your diary is completely private. Every entry is tied to your account, behind authentication, and never shared. No ads, no data mining, no third-party access. Your safe digital diary is yours alone.",
  },
  {
    icon: Sparkles,
    title: "Daily mood tracking",
    desc: "Log how you feel each day — Great, Good, Okay, Low, or Rough — and spot emotional patterns over weeks and months. Your mood tracker diary helps you understand yourself better over time.",
  },
  {
    icon: Calendar,
    title: "Calendar navigation",
    desc: "See your entire journaling journey on a beautiful calendar. Green dots show your writing days. Click any date to re-read entries or write a new one. The perfect free online diary for daily reflection.",
  },
  {
    icon: Tag,
    title: "Tags & full-text search",
    desc: "Organise every diary entry with custom tags and find anything instantly with full-text search across your entire private journal. Never lose a thought in your digital diary.",
  },
  {
    icon: TrendingUp,
    title: "Daily streaks & stats",
    desc: "Build the journaling habit that sticks. Track your current streak, see your total entries and words written, and watch your consistency grow. Your free digital journal keeps you motivated.",
  },
  {
    icon: Shield,
    title: "Your data, your control",
    desc: "No tracking pixels, no analytics, no data selling. This private online diary is built with your privacy first. You can edit or delete any entry anytime. What you write stays between you and HeartLogs.",
  },
  {
    icon: HeartPulse,
    title: "Free forever diary",
    desc: "No paywalls, no premium tiers, no limits on entries. HeartLogs is a completely free online diary. Write as much as you want, as often as you want — your story deserves a free home.",
  },
];

const faqs = [
  {
    q: "Is HeartLogs really free? Will I ever be charged?",
    a: "Yes, HeartLogs is completely free. There are no premium plans, no monthly subscriptions, and no hidden fees. You can write unlimited entries, add unlimited tags, and use every feature without paying a cent.",
  },
  {
    q: "Is my online diary private and safe?",
    a: "Absolutely. Your diary is protected by authentication — only you can access your account. We do not share, sell, or analyze your entries. No ads, no tracking pixels, no third-party scripts. Your safe digital diary stays private.",
  },
  {
    q: "Can I write entries for past dates?",
    a: "Yes! When you create a new diary entry, you can set any date you like. Use this to backfill entries from a trip, document past memories, or maintain a continuous journal even if you miss a day.",
  },
  {
    q: "What's the difference between a digital diary and a paper journal?",
    a: "A digital diary like HeartLogs gives you search, tags, mood tracking, streaks, and calendar navigation — things a paper journal can't offer. You never run out of pages, never lose a notebook, and can find any entry in seconds.",
  },
  {
    q: "Can I read my old entries easily?",
    a: "Yes. Use the Calendar view to see which days you've written on, click a date to read what you wrote, or use Search to find entries by keyword. Your entire online diary is browseable and searchable instantly.",
  },
  {
    q: "How is HeartLogs different from other journaling apps?",
    a: "HeartLogs is a private, free online diary with no limits. Many journal apps restrict free tiers or sell your data. HeartLogs is built differently — privacy-first, feature-rich, and genuinely free forever.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "HeartLogs",
        url: "https://heartlogs.com",
        description:
          "A free, private online diary and digital journal. Write daily entries, track your mood, organize with tags, and browse your story on a calendar.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Private diary",
          "Mood tracking",
          "Calendar view",
          "Tags and search",
          "Daily streaks",
          "Rich text editor",
        ],
        browserRequirements: "Requires JavaScript",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

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
          Free private online diary — no ads, no tracking, no limits
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-6" style={{ color: "var(--text-primary)" }}>
          The{" "}
          <span style={{ color: "var(--accent)" }}>free private online diary</span>{" "}
          for your daily thoughts
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          HeartLogs is a beautiful, safe digital journal where you can write freely, track your mood,{ " "}
          organize with tags, and reflect on your life — one entry at a time. Completely private, totally free.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-2xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Start your free diary — it&apos;s 100% free
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-2xl font-medium text-sm transition-colors"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            Sign in to your journal
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto w-full" id="features">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: "var(--text-primary)" }}>
          Why HeartLogs is the best free online diary
        </h2>
        <p className="text-sm text-center max-w-xl mx-auto mb-12" style={{ color: "var(--text-muted)" }}>
          A private digital journal with everything you need to write, track, and reflect — without limits or hidden costs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 border transition-shadow hover:shadow-md"
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

      {/* How it works */}
      <section className="px-6 md:px-12 pb-20 max-w-4xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
          How your private digital diary works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { step: "1", title: "Create your free account", desc: "Sign up with email or Google in seconds. No credit card, no commitment, no data shared." },
            { step: "2", title: "Write your first entry", desc: "Use the beautiful editor to pour out your thoughts. Add a mood and tags to capture the moment." },
            { step: "3", title: "Build your journaling habit", desc: "Write daily, watch your streak grow, and browse your diary on the calendar. Your story, beautifully kept." },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-bold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {step}
              </div>
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 pb-20 max-w-3xl mx-auto w-full" id="faq">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h2>
        <p className="text-sm text-center max-w-xl mx-auto mb-10" style={{ color: "var(--text-muted)" }}>
          Everything you need to know about your free, private online diary.
        </p>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-2xl border overflow-hidden transition-all open:shadow-sm"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <summary
                className="px-5 py-4 text-sm font-medium cursor-pointer select-none transition-colors hover:bg-[var(--bg-elevated)]"
                style={{ color: "var(--text-primary)" }}
              >
                {q}
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="mx-6 md:mx-12 mb-16 rounded-3xl px-8 py-14 text-center border"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Start your free private diary today
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Join people who use HeartLogs to process their thoughts, track their moods, and build a daily journaling habit that lasts.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-2xl font-medium text-sm shadow-md hover:shadow-lg transition-all"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Create your free private diary
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        © {new Date().getFullYear()} HeartLogs · Free private online diary · No ads, no tracking, no limits
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
