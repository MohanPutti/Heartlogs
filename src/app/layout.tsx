import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

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
    default: "HeartLogs — Your Private Digital Diary",
    template: "%s · HeartLogs",
  },
  description:
    "HeartLogs is a beautiful, private online diary. Write daily journal entries, track your mood, add tags, and reflect on your life — completely private, always yours.",
  metadataBase: new URL("https://heartlogs.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "HeartLogs — Your Private Digital Diary",
    description:
      "A beautiful, private online diary. Write journal entries, track your mood, and reflect on your life. Free to use.",
    url: "https://heartlogs.com",
    siteName: "HeartLogs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartLogs — Your Private Digital Diary",
    description:
      "A beautiful, private online diary. Write journal entries, track your mood, and reflect on your life.",
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
