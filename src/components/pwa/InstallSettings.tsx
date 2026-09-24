"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import { InstallInstructionsModal } from "./InstallInstructionsModal";

export function InstallSettings() {
  const { mounted, isStandalone, isIOS, isAndroid, canPromptNatively, promptInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);

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
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Install app</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Add HeartLogs to your device for quicker access.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <Download size={13} />
          Install
        </button>
      </div>
      <InstallInstructionsModal
        open={open}
        onClose={() => setOpen(false)}
        isIOS={isIOS}
        isAndroid={isAndroid}
        canPromptNatively={canPromptNatively}
        onInstall={promptInstall}
      />
    </>
  );
}
