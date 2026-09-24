"use client";

import { useEffect, useState } from "react";

export function usePushSubscription() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  // iOS only exposes the Push API to installed (standalone) home-screen apps —
  // in a regular Safari tab, "PushManager" in window is false even though it
  // will work fine once installed. Surface that distinction to the UI instead
  // of lumping it in with "not supported in this browser."
  const [needsInstallOnIOS, setNeedsInstallOnIOS] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setNeedsInstallOnIOS(isIOS && !isStandalone);
      setLoading(false);
      return;
    }
    setIsSupported(true);
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        setLoading(false);
      });
  }, []);

  return { isSupported, subscription, setSubscription, loading, needsInstallOnIOS };
}
