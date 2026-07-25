import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { AnalyticsInit } from "@/components/layout/AnalyticsInit";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HeartLogs — Free Private Online Diary & Digital Journal",
    template: "%s · HeartLogs",
  },
  description:
    "HeartLogs is a free, private online diary and digital journal. Write daily entries, track your mood with our mood tracker, organize with tags, browse your story on a calendar, and build journaling streaks. Completely safe, no ads, no tracking, no limits.",
  metadataBase: new URL("https://heartlogs.com"),
  alternates: { canonical: "/" },
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
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "HeartLogs — Free Private Online Diary & Digital Journal",
    description:
      "A free, private online diary with mood tracking, tags, calendar view, daily streaks, and a beautiful writing experience. No ads, no tracking, completely safe.",
    url: "https://heartlogs.com",
    siteName: "HeartLogs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartLogs — Free Private Online Diary",
    description:
      "Write securely with the best free online diary. Track moods, organize tags, and build a daily journaling habit — completely private.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        <SessionProvider>
          <ThemeProvider>
            <AnalyticsInit />
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--card-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
