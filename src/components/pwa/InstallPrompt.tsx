"use client";

import { useEffect, useState } from "react";
import { usePwaInstall } from "@/lib/hooks/usePwaInstall";
import { InstallInstructionsModal } from "./InstallInstructionsModal";

const DISMISS_KEY = "heartlogs-install-dismissed-at";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 2000;

export function InstallPrompt() {
  const { mounted, isStandalone, isIOS, isAndroid, canPromptNatively, promptInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!mounted || isStandalone) return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
      return;
    }

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [mounted, isStandalone]);

  function handleClose() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  }

  if (!mounted || isStandalone) return null;

  return (
    <InstallInstructionsModal
      open={open}
      onClose={handleClose}
      isIOS={isIOS}
      isAndroid={isAndroid}
      canPromptNatively={canPromptNatively}
      onInstall={promptInstall}
    />
  );
}
