import Link from "next/link";
import { HeartPulse } from "lucide-react";
import type { Metadata } from "next";
import { DonateNavLink, DonateFooterLink } from "@/components/DonateLink";

export const metadata: Metadata = {
  title: "Privacy Policy — Safe & Private Digital Diary",
  description:
    "HeartLogs privacy policy. We never share, sell, or analyze your diary entries. No tracking, no ads, no third-party scripts. Your private online diary is truly private.",
};

export default function PrivacyPage() {
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

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Last updated: January 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Our promise to you</h2>
            <p className="leading-relaxed">
              HeartLogs is built on a simple belief: your diary entries belong to you and only you. We do not share, sell, analyse, or monetise your personal journal entries. Period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>What data we collect</h2>
            <p className="leading-relaxed">
              To provide the service, we collect only what is necessary:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li><strong>Account information</strong> — your name, email address, and a hashed password (or Google account identifier if you sign in with Google).</li>
              <li><strong>Diary entries</strong> — the content, title, mood, tags, and timestamps you provide when writing.</li>
              <li><strong>Session data</strong> — standard authentication cookies to keep you logged in. We do not use tracking cookies, analytics cookies, or advertising cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>What we do NOT collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>No analytics or tracking scripts</li>
              <li>No advertising identifiers</li>
              <li>No location data</li>
              <li>No browsing history outside HeartLogs</li>
              <li>No IP logging beyond standard server operations</li>
              <li>No third-party data sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>How we protect your data</h2>
            <p className="leading-relaxed">
              Passwords are hashed using bcrypt with a cost factor of 12. All data is stored in a secure MySQL database. Authentication is handled by NextAuth with JWT-based sessions. Your diary is protected by your account credentials — we cannot read your entries without access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Data retention & deletion</h2>
            <p className="leading-relaxed">
              Your data is retained for as long as your account is active. You can delete any diary entry at any time. If you wish to delete your entire account and all associated data, please contact us. When you delete entries, they are permanently removed from our database.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Third-party services</h2>
            <p className="leading-relaxed">
              HeartLogs uses Google OAuth as an optional sign-in method. If you choose Google sign-in, Google shares your name, email, and profile picture with us solely for account creation. We do not receive or store your Google password. The application is hosted on AWS EC2. Both providers operate under their own privacy and security standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Contact</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy or want to request account deletion, email us at privacy@heartlogs.com.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <DonateFooterLink />
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </div>
        © {new Date().getFullYear()} HeartLogs · Free private online diary
      </footer>
    </div>
  );
}
