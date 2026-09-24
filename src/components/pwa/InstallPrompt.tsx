"use client";

import { useEffect, useState } from "react";
import { Share } from "lucide-react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone || !isIOS) return null;

  return (
    <div
      className="flex items-center gap-2 text-xs text-[var(--text-muted)] rounded-xl border px-3.5 py-2.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <Share size={14} className="shrink-0" />
      <span>
        Install HeartLogs: tap the share icon in Safari, then &quot;Add to Home Screen&quot;.
      </span>
    </div>
  );
}
