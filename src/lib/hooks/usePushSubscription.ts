"use client";

import { useEffect, useState } from "react";

export function usePushSubscription() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
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

  return { isSupported, subscription, setSubscription, loading };
}
