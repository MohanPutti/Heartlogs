import Link from "next/link";
import { HeartPulse, Check, X } from "lucide-react";
import type { Metadata } from "next";
import { DonateNavLink, DonateFooterLink } from "@/components/DonateLink";

export const metadata: Metadata = {
  title: "Journey Cloud vs Premium (& a Free Alternative) — HeartLogs",
  description:
    "Confused about Journey Cloud vs Premium pricing tiers? Here's what each plan actually includes, plus a free alternative with no subscription and no tracking scripts.",
  alternates: { canonical: "/vs/journey" },
  openGraph: {
    title: "Journey Cloud vs Premium — Pricing Compared, Plus a Free Alternative",
    description:
      "What's the real difference between Journey Cloud and Journey Premium? A breakdown of both plans, and a free, subscription-free alternative.",
    url: "https://heartlogs.com/vs/journey",
    siteName: "HeartLogs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journey Cloud vs Premium — Compared",
    description: "What Journey Cloud and Premium each include, and a free alternative with no subscription.",
  },
};

const rows = [
  { label: "Price", heartlogs: "Free forever", other: "Free tier limited; premium subscription for multi-device sync" },
  { label: "Platform", heartlogs: "Any browser — phone, tablet, or computer", other: "iOS, Android, Web, Windows, Mac (native apps)" },
  { label: "Mood tracking", heartlogs: true, other: true },
  { label: "Tags", heartlogs: true, other: true },
  { label: "Full-text search", heartlogs: true, other: true },
  { label: "Daily streaks", heartlogs: true, other: false },
  { label: "Calendar view", heartlogs: true, other: true },
  { label: "Ads", heartlogs: false, other: false },
  { label: "Analytics/tracking scripts", heartlogs: false, other: true },
  { label: "Sync limit on free tier", heartlogs: "None — works from any browser", other: "Multi-device sync often requires premium" },
];

const faqs = [
  {
    q: "What's the difference between Journey Cloud and Journey Premium?",
    a: "Journey Cloud is Journey's sync/backup tier that keeps your entries backed up and available across devices. Journey Premium sits on top of that and unlocks the full feature set — location and weather tagging, PDF export, custom themes, and multi-device editing without limits. In short: Cloud gets your data synced, Premium removes the feature caps. Both are paid subscriptions on top of the free app.",
  },
  {
    q: "Is HeartLogs a good free alternative to Journey?",
    a: "Yes. HeartLogs covers the core journaling features people use Journey for — mood tracking, tags, search, calendar view — as a free web app, with no premium tier needed to access your diary from multiple devices.",
  },
  {
    q: "Do I need to install an app to use HeartLogs like Journey's native apps?",
    a: "No. HeartLogs works entirely in your browser, so signing in from any device gives you the same diary — no app installs, no OS-specific versions to manage.",
  },
  {
    q: "Why would I choose Journey over HeartLogs?",
    a: "Journey offers native offline apps across many platforms and features like automatic location/weather tagging and cloud backup integrations. If you want a native app experience with offline-first editing, Journey may fit better. If you want a free, private, browser-based diary with no subscription, HeartLogs is built for that.",
  },
];

export default function JourneyComparisonPage() {
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
          HeartLogs vs Journey
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Both are cross-platform digital diary apps, but they take different approaches. Here&apos;s an honest
          comparison to help you pick the right private journal.
        </p>
      </section>

      {/* Journey Cloud vs Premium breakdown */}
      <section className="px-6 md:px-12 pb-16 max-w-3xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Journey Cloud vs Premium: what each plan actually gets you
        </h2>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Journey Cloud</strong> is the sync layer — it backs up
            your entries and keeps them available if you switch phones or reinstall the app. Without it, your diary
            lives only on one device.
          </p>
          <p>
            <strong style={{ color: "var(--text-primary)" }}>Journey Premium</strong> is the feature-unlock tier on
            top of Cloud: location and weather auto-tagging, PDF/Word export, custom themes and covers, and
            multi-device editing without the free plan&apos;s entry limits.
          </p>
          <p>
            If you just want your diary backed up and synced — no export tools, no location tagging, no
            subscription — that&apos;s exactly what HeartLogs gives you for free: every entry is available from any
            browser you sign into, with mood tracking, tags, calendar view, and full-text search included, no Cloud
            or Premium tier required.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 md:px-12 pb-16 max-w-3xl mx-auto w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[480px]">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}></th>
              <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--accent)" }}>HeartLogs</th>
              <th className="text-left py-3 font-semibold" style={{ color: "var(--text-primary)" }}>Journey</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b" style={{ borderColor: "var(--border)" }}>
                <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>{row.label}</td>
                <td className="py-3 pr-4" style={{ color: "var(--text-secondary)" }}>
                  {typeof row.heartlogs === "boolean" ? (
                    row.heartlogs ? <Check size={16} className="text-[var(--accent)]" /> : <X size={16} style={{ color: "var(--text-muted)" }} />
                  ) : (
                    row.heartlogs
                  )}
                </td>
                <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                  {typeof row.other === "boolean" ? (
                    row.other ? <Check size={16} className="text-[var(--accent)]" /> : <X size={16} style={{ color: "var(--text-muted)" }} />
                  ) : (
                    row.other
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          Journey is a trademark of its respective owner. Pricing and features can change — check their site for current details.
        </p>
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
          Try the free alternative to Journey
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
          <Link href="/alternatives" className="hover:underline">Alternatives</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <DonateFooterLink />
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
