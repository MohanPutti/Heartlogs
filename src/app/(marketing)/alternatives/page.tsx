import Link from "next/link";
import { HeartPulse, Check, X } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Free Online Diary Alternatives — HeartLogs vs Day One, Journey & More",
  description:
    "Comparing online diary and digital journal apps? See how HeartLogs stacks up against Day One, Journey, Penzu, and other popular journaling apps — free, private, and no limits.",
  alternates: { canonical: "/alternatives" },
  openGraph: {
    title: "Best Free Online Diary Alternatives — HeartLogs vs Day One, Journey & More",
    description:
      "A fair, feature-by-feature comparison of the top online diary and digital journal apps to help you pick the right one.",
    url: "https://heartlogs.com/alternatives",
    siteName: "HeartLogs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free Online Diary Alternatives",
    description:
      "See how HeartLogs compares to Day One, Journey, Penzu, and other journaling apps.",
  },
};

const apps = [
  {
    name: "HeartLogs",
    highlight: true,
    price: "Free forever",
    platform: "Web (any device)",
    mood: true,
    tags: true,
    search: true,
    streaks: true,
    ads: false,
    tracking: false,
    limits: "None",
  },
  {
    name: "Day One",
    price: "Free tier limited; premium subscription for sync & unlimited entries",
    platform: "iOS, Mac (web/Android limited)",
    mood: true,
    tags: true,
    search: true,
    streaks: false,
    ads: false,
    tracking: true,
    limits: "Free tier caps entries and photos",
  },
  {
    name: "Journey",
    price: "Free tier limited; premium subscription for multi-device sync",
    platform: "iOS, Android, Web, Windows, Mac",
    mood: true,
    tags: true,
    search: true,
    streaks: false,
    ads: false,
    tracking: true,
    limits: "Free tier limits sync across devices",
  },
  {
    name: "Penzu",
    price: "Free tier limited; premium subscription for extra features",
    platform: "Web, iOS, Android",
    mood: false,
    tags: false,
    search: true,
    streaks: false,
    ads: true,
    tracking: true,
    limits: "Free tier restricts customization",
  },
];

const faqs = [
  {
    q: "What is the best free online diary alternative?",
    a: "It depends on your needs. HeartLogs is a strong choice if you want a completely free, ad-free, private online diary with mood tracking, tags, and streaks and don't need native mobile apps. Day One and Journey are good if you want dedicated mobile apps and don't mind a subscription for full features.",
  },
  {
    q: "Is there a free alternative to Day One?",
    a: "Yes. HeartLogs is a free alternative to Day One that works in any browser, includes mood tracking, tags, full-text search, and daily streaks, and never limits your entries or charges a subscription.",
  },
  {
    q: "Is there a free alternative to Journey?",
    a: "HeartLogs offers similar core journaling features to Journey — mood tracking, tags, calendar view — as a web app, completely free, without needing a premium plan to sync across devices since it works from any browser you're signed into.",
  },
  {
    q: "Do I have to install anything to use HeartLogs?",
    a: "No. HeartLogs runs entirely in your browser, so it works the same on your phone, tablet, or computer without installing an app.",
  },
];

export default function AlternativesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Online diary alternatives, compared
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Looking for a digital diary that isn&apos;t Day One, Journey, or Penzu? Here&apos;s an honest, feature-by-feature
          comparison to help you choose the right private journaling app.
        </p>
      </section>

      {/* Comparison table */}
      <section className="px-6 md:px-12 pb-16 max-w-5xl mx-auto w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[640px]">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>App</th>
              <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Price</th>
              <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Platform</th>
              <th className="text-center py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Mood tracking</th>
              <th className="text-center py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Ads</th>
              <th className="text-left py-3 font-semibold" style={{ color: "var(--text-primary)" }}>Limits</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr
                key={app.name}
                className="border-b"
                style={{
                  borderColor: "var(--border)",
                  background: app.highlight ? "var(--bg-elevated)" : "transparent",
                }}
              >
                <td className="py-3 pr-4 font-medium" style={{ color: app.highlight ? "var(--accent)" : "var(--text-primary)" }}>
                  {app.name}
                </td>
                <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>{app.price}</td>
                <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>{app.platform}</td>
                <td className="py-3 pr-4 text-center">
                  {app.mood ? (
                    <Check size={16} className="inline text-[var(--accent)]" />
                  ) : (
                    <X size={16} className="inline" style={{ color: "var(--text-muted)" }} />
                  )}
                </td>
                <td className="py-3 pr-4 text-center">
                  {app.ads ? (
                    <Check size={16} className="inline" style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <X size={16} className="inline text-[var(--accent)]" />
                  )}
                </td>
                <td className="py-3" style={{ color: "var(--text-secondary)" }}>{app.limits}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          Pricing and platform support for third-party apps can change — check each provider&apos;s site for current details.
        </p>
      </section>

      {/* Direct comparisons */}
      <section className="px-6 md:px-12 pb-16 max-w-4xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
          Detailed comparisons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/vs/day-one"
            className="rounded-2xl p-6 border transition-shadow hover:shadow-md block"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>HeartLogs vs Day One</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              See how HeartLogs compares to Day One on price, platforms, and privacy.
            </p>
          </Link>
          <Link
            href="/vs/journey"
            className="rounded-2xl p-6 border transition-shadow hover:shadow-md block"
            style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>HeartLogs vs Journey</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              See how HeartLogs compares to Journey on features, sync, and cost.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 pb-20 max-w-3xl mx-auto w-full" id="faq">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h2>
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
          Try the free alternative
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          No subscription, no ads, no limits. Start your private online diary in seconds.
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
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        © {new Date().getFullYear()} HeartLogs · Free private online diary
      </footer>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
