"use client";

import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { subscribeUser, unsubscribeUser } from "@/app/actions/push";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function PushNotificationManager() {
  const { isSupported, subscription, setSubscription, needsInstallOnIOS } = usePushSubscription();
  const [loading, setLoading] = useState(false);

  async function subscribeToPush() {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });
      await subscribeUser(JSON.parse(JSON.stringify(sub)));
      setSubscription(sub);
      toast.success("Notifications enabled");
    } catch {
      toast.error("Couldn't enable notifications");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    if (!subscription) return;
    setLoading(true);
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await unsubscribeUser(endpoint);
      setSubscription(null);
      toast.success("Notifications disabled");
    } catch {
      toast.error("Couldn't disable notifications");
    } finally {
      setLoading(false);
    }
  }

  if (needsInstallOnIOS) {
    return (
      <p className="text-xs text-[var(--text-muted)]">
        On iPhone/iPad, notifications only work once HeartLogs is installed as an app. See{" "}
        <span className="font-medium text-[var(--text-primary)]">&quot;Install app&quot;</span> above, then come back
        here.
      </p>
    );
  }

  if (!isSupported) {
    return (
      <p className="text-xs text-[var(--text-muted)]">
        Push notifications aren&apos;t supported in this browser.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Journal reminders</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {subscription ? "You'll get reminders on this device." : "Get a gentle nudge to write."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={subscription ? unsubscribeFromPush : subscribeToPush}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium disabled:opacity-60"
          style={{
            background: subscription ? "var(--bg-surface)" : "var(--accent)",
            color: subscription ? "var(--text-primary)" : "white",
            border: subscription ? "1px solid var(--border)" : "none",
          }}
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : subscription ? (
            <BellOff size={13} />
          ) : (
            <Bell size={13} />
          )}
          {subscription ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
}
