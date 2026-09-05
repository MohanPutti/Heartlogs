import Link from "next/link";
import { HeartPulse, BookOpen, Lock, Sparkles, Calendar, Tag, TrendingUp, Shield, Search, PenLine, Smile } from "lucide-react";
import type { Metadata } from "next";
import { DonateNavLink, DonateFooterLink } from "@/components/DonateLink";

export const metadata: Metadata = {
  title: "Features — Free Private Online Diary & Digital Journal",
  description:
    "Explore all HeartLogs features: private diary, mood tracking, calendar view, tags, full-text search, daily streaks, and beautiful rich-text editing. The best free online diary for daily journaling.",
  openGraph: {
    title: "HeartLogs Features — Free Private Digital Diary",
    description:
      "A feature-rich, free private online diary. Mood tracking, calendar navigation, tags, search, streaks, and a beautiful editor — all completely free and private.",
  },
};

const detailedFeatures = [
  {
    icon: BookOpen,
    title: "Beautiful Rich-Text Diary Editor",
    tagline: "Write beautifully, every time.",
    desc: "HeartLogs comes with a full-featured TipTap editor. Write in bold or italic, create headings, add bullet lists and blockquotes, insert links, highlight text, and change font family. Your private digital diary entries look as good as they feel. No markdown required — just write naturally.",
    bullets: [
      "Bold, italic, strikethrough, and highlight",
      "Multiple heading levels for structure",
      "Bullet and ordered lists",
      "Blockquotes and horizontal rules",
      "Hyperlinks and text color",
      "Font family selection",
      "Automatic word count",
    ],
  },
  {
    icon: Smile,
    title: "Daily Mood Tracker",
    tagline: "Understand your emotional patterns.",
    desc: "Log a mood with every diary entry — Great 😄, Good 🙂, Okay 😐, Low 😔, or Rough 😢. Your mood tracker diary builds a visual picture over time. See your 7-day mood summary on the dashboard and spot trends in how you've been feeling. It's like a mood journal that actually helps you reflect.",
    bullets: [
      "Five mood levels: Great to Rough",
      "Visual mood summary on dashboard",
      "Spot weekly emotional patterns",
      "Mood badges on every entry",
      "Helps build self-awareness over time",
    ],
  },
  {
    icon: Calendar,
    title: "Interactive Calendar View",
    tagline: "See your journaling journey at a glance.",
    desc: "Navigate your entire diary on a beautiful calendar. Days you've written glow with dots — one entry, two entries, or three or more. Click any date to read what you wrote, or start a new entry. The calendar also supports month and year drill-down for quick navigation through years of journaling.",
    bullets: [
      "Visual dot indicators for entry density",
      "Click any date to read or write",
      "Month and year drill-down navigation",
      "Smooth animated transitions",
      "Perfect for backdating old entries",
    ],
  },
  {
    icon: Tag,
    title: "Tags & Full-Text Search",
    tagline: "Never lose a thought.",
    desc: "Organise every entry with custom tags — #gratitude, #work, #travel, #reflection, anything you want. The full-text search instantly finds entries by title or content with debounced real-time results. Your free online diary stays organised and searchable, always.",
    bullets: [
      "Unlimited custom tags per entry",
      "Tags auto-created on first use",
      "Full-text search across title and content",
      "Debounced real-time results",
      "Search results linkable via URL (shareable queries)",
      "Filter entries by date from calendar",
    ],
  },
  {
    icon: TrendingUp,
    title: "Daily Streaks & Stats",
    tagline: "Build the journaling habit that sticks.",
    desc: "Your dashboard shows your current journaling streak, total entries written, and total words. Watch the numbers grow as you build a consistent habit. Streaks are computed from consecutive writing days — the best motivation to keep your safe digital diary active every day.",
    bullets: [
      "Current journaling streak counter",
      "Total entries and total word count",
      "Motivational dashboard overview",
      "Helps maintain daily writing habit",
    ],
  },
  {
    icon: Lock,
    title: "Private & Secure by Design",
    tagline: "Your diary is yours alone.",
    desc: "Every entry is tied to your authenticated account. We use NextAuth with encrypted credential storage or Google OAuth. Passwords are hashed with bcrypt. We run no analytics, no tracking pixels, no third-party scripts. Your private online diary stays private — no data sharing, no data mining, no ads.",
    bullets: [
      "Email/password or Google sign-in",
      "bcrypt password hashing",
      "Zero analytics or tracking",
      "No third-party scripts or cookies",
      "Your data is never shared or sold",
    ],
  },
  {
    icon: PenLine,
    title: "Backdate Any Entry",
    tagline: "Document your past, not just today.",
    desc: "Missed a day? Going on a trip and want to journal later? Use the date picker when creating a new entry to set any date you like. Your digital journal can be a complete record of your life — not just from today forward.",
    bullets: [
      "Set custom dates on new entries",
      "Backfill vacation or past memories",
      "Date picker with month and year selection",
      "Entries sorted by date automatically",
    ],
  },
  {
    icon: Shield,
    title: "Free Forever — No Limits",
    tagline: "No paywalls. No premium tiers. No limits.",
    desc: "HeartLogs is a completely free online diary. Write unlimited entries, add unlimited tags, use every feature without paying a cent. Many journal apps restrict free tiers to 10 entries or sell your data. HeartLogs doesn't. Start your free digital journal today and never worry about hitting a limit.",
    bullets: [
      "Unlimited entries",
      "Unlimited tags",
      "All features included",
      "No premium plans or subscriptions",
      "Free forever — genuinely",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse size={22} className="text-[var(--accent)]" />
          <span className="font-display text-xl font-bold">HeartLogs</span>
        </Link>
        <div className="flex items-center gap-3">
          <DonateNavLink />
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
      <section className="text-center px-6 pt-16 pb-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Everything your free online diary needs
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          HeartLogs is the most complete free private digital journal available — rich editing, mood tracking, tags, search, streaks, and zero limits. All your journaling tools in one safe place.
        </p>
      </section>

      {/* Detailed features */}
      <section className="px-6 md:px-12 pb-20 max-w-4xl mx-auto w-full">
        <div className="space-y-12">
          {detailedFeatures.map(({ icon: Icon, title, tagline, desc, bullets }, i) => (
            <div
              key={title}
              className="rounded-2xl border p-6 md:p-8"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <Icon size={22} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: "var(--accent)" }}>{tagline}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                {desc}
              </p>
              <ul className="space-y-1.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                    {b}
                  </li>
                ))}
              </ul>
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
          Ready for a better way to journal?
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Start your free private online diary today. No credit card, no limits, no data sharing.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-2xl font-medium text-sm shadow-md hover:shadow-lg transition-all"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Create your free diary
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/alternatives" className="hover:underline">Alternatives</Link>
          <DonateFooterLink />
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        © {new Date().getFullYear()} HeartLogs · Free private online diary
      </footer>
    </div>
  );
}
