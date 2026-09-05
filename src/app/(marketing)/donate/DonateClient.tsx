"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import toast from "react-hot-toast";
import { HeartPulse, Heart, ShieldCheck, ServerCog, Ban } from "lucide-react";
import { DonateFooterLink } from "@/components/DonateLink";

const PRESET_AMOUNTS = [99, 199, 499, 999];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function DonateClient() {
  const [frequency, setFrequency] = useState<"one_time" | "recurring">("one_time");
  const [amount, setAmount] = useState<number>(199);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleDonate = async () => {
    if (!effectiveAmount || effectiveAmount < 20) {
      toast.error("Minimum donation is ₹20");
      return;
    }
    setLoading(true);
    try {
      const endpoint = frequency === "one_time" ? "/api/donate/order" : "/api/donate/subscription";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "HeartLogs",
        description: frequency === "one_time" ? "One-time donation" : "Monthly support",
        prefill: { name, email },
        theme: { color: "#e0447e" },
        handler: async (response: Record<string, string>) => {
          const verifyRes = await fetch("/api/donate/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            setDone(true);
          } else {
            toast.error("We couldn't verify your payment. Please contact us if you were charged.");
          }
        },
      };

      if (frequency === "one_time") {
        options.order_id = data.orderId;
        options.amount = data.amount;
        options.currency = data.currency;
      } else {
        options.subscription_id = data.subscriptionId;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse size={22} className="text-[var(--accent)]" />
          <span className="font-display text-xl font-bold">HeartLogs</span>
        </Link>
        <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          Back home
        </Link>
      </nav>

      <section className="flex-1 px-6 py-14 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
            <Heart size={26} className="text-[var(--accent)] fill-current" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">Keep HeartLogs free and ad-free</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            HeartLogs is free for everyone, with no ads and no data selling. Donations from readers like you cover
            hosting, database, and email costs so it can stay that way.
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <Heart size={28} className="mx-auto mb-3 text-[var(--accent)] fill-current" />
            <h2 className="font-display text-lg font-bold mb-2">Thank you!</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Your support means a lot — it genuinely helps keep the lights on.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border p-6 md:p-8" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex rounded-xl p-1 mb-6" style={{ background: "var(--bg-elevated)" }}>
              {(["one_time", "recurring"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    frequency === f ? "text-white" : "text-[var(--text-secondary)]"
                  }`}
                  style={frequency === f ? { background: "var(--accent)" } : undefined}
                >
                  {f === "one_time" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount("");
                  }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    !customAmount && amount === a ? "text-white" : "text-[var(--text-secondary)]"
                  }`}
                  style={
                    !customAmount && amount === a
                      ? { background: "var(--accent)", borderColor: "var(--accent)" }
                      : { borderColor: "var(--border)" }
                  }
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <input
              type="number"
              min={20}
              placeholder="Custom amount (₹)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full mb-4 px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-primary)" }}
            />

            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-primary)" }}
            />
            <input
              type="email"
              placeholder="Email (optional, for a receipt)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-6 px-4 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-primary)" }}
            />

            <button
              onClick={handleDonate}
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Starting…" : `Donate ₹${effectiveAmount || 0}${frequency === "recurring" ? "/month" : ""}`}
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <ServerCog size={18} className="mx-auto mb-1.5 text-[var(--accent)]" />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Covers hosting & DB costs</p>
          </div>
          <div>
            <Ban size={18} className="mx-auto mb-1.5 text-[var(--accent)]" />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>No ads, ever</p>
          </div>
          <div>
            <ShieldCheck size={18} className="mx-auto mb-1.5 text-[var(--accent)]" />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Secure checkout via Razorpay</p>
          </div>
        </div>
      </section>

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
