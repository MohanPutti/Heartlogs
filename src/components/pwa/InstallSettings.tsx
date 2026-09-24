"use client";

import { useEffect, useState } from "react";
import { Share, Download, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallSettings() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream);

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (!mounted) return null;

  if (isStandalone) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Check size={15} className="text-[var(--accent)]" />
        HeartLogs is installed on this device.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Install app</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {isIOS
            ? <>Tap <Share size={12} className="inline mx-0.5" /> in Safari, then &quot;Add to Home Screen&quot;.</>
            : "Add HeartLogs to your device for quicker access."}
        </p>
      </div>
      {!isIOS && (
        <button
          onClick={install}
          disabled={!deferredPrompt}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          <Download size={13} />
          Install
        </button>
      )}
    </div>
  );
}
