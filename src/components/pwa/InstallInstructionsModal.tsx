"use client";

import Image from "next/image";
import { X, Share, MoreVertical, Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  isIOS: boolean;
  isAndroid: boolean;
  canPromptNatively: boolean;
  onInstall: () => Promise<boolean>;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold text-white mt-0.5"
        style={{ background: "var(--accent)" }}
      >
        {n}
      </span>
      <span className="text-sm text-[var(--text-primary)] leading-relaxed">{children}</span>
    </li>
  );
}

export function InstallInstructionsModal({ open, onClose, isIOS, isAndroid, canPromptNatively, onInstall }: Props) {
  const [installing, setInstalling] = useState(false);

  if (!open) return null;

  async function handleInstall() {
    setInstalling(true);
    const accepted = await onInstall();
    setInstalling(false);
    if (accepted) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 relative"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <Image src="/icon-192.png" alt="" width={44} height={44} className="rounded-xl" />
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Install HeartLogs</h3>
            <p className="text-xs text-[var(--text-muted)]">Quicker access, and it works offline</p>
          </div>
        </div>

        {canPromptNatively ? (
          <button
            onClick={handleInstall}
            disabled={installing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {installing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Install
          </button>
        ) : isIOS ? (
          <ol className="space-y-3">
            <Step n={1}>
              Tap the Share icon <Share size={14} className="inline align-text-bottom mx-0.5" /> in Safari&apos;s toolbar
            </Step>
            <Step n={2}>Scroll down and tap &quot;Add to Home Screen&quot;</Step>
            <Step n={3}>Tap &quot;Add&quot; in the top right</Step>
          </ol>
        ) : isAndroid ? (
          <ol className="space-y-3">
            <Step n={1}>
              Tap the menu <MoreVertical size={14} className="inline align-text-bottom mx-0.5" /> in your browser&apos;s toolbar
            </Step>
            <Step n={2}>Tap &quot;Add to Home screen&quot; or &quot;Install app&quot;</Step>
            <Step n={3}>Confirm by tapping &quot;Install&quot; or &quot;Add&quot;</Step>
          </ol>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            Open heartlogs.com in Chrome or Edge to install it as an app, or use your browser&apos;s menu and look for
            &quot;Install&quot; or &quot;Add to Home Screen.&quot;
          </p>
        )}
      </div>
    </div>
  );
}
