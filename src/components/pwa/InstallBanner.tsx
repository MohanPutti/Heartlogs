"use client";

import { useEffect, useState } from "react";
import { X, Share, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "heartlogs-install-dismissed-at";
const DISMISS_DAYS = 14;

export function InstallBanner() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream);

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (!mounted || isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-sm border-b"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
    >
      <Download size={16} className="shrink-0 text-[var(--accent)]" />
      {deferredPrompt ? (
        <>
          <span className="flex-1">Install HeartLogs for quicker access and offline writing.</span>
          <button
            onClick={install}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0"
            style={{ background: "var(--accent)" }}
          >
            Install
          </button>
        </>
      ) : (
        <span className="flex-1 flex items-center gap-1.5 flex-wrap">
          Install HeartLogs: tap
          <Share size={14} className="inline" />
          then &quot;Add to Home Screen&quot;.
        </span>
      )}
      <button onClick={dismiss} className="text-[var(--text-muted)] shrink-0" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
