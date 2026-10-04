"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { PasscodeLockScreen } from "./PasscodeLockScreen";

const UNLOCKED_KEY = "heartlogs-app-unlocked";
// Right after a full sign-in, skip the lock screen — mainly so the "forgot
// passcode" recovery (full sign-out/sign-in) can land back on Settings to
// remove the passcode without needing the passcode to get there.
const FRESH_LOGIN_GRACE_MS = 2 * 60 * 1000;

export function AppLock({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [hasPasscode, setHasPasscode] = useState(false);
  const [checked, setChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [freshLogin, setFreshLogin] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    setFreshLogin(!!session?.user?.loginAt && Date.now() - session.user.loginAt < FRESH_LOGIN_GRACE_MS);
    fetch("/api/user/passcode")
      .then((r) => r.json())
      .then((d) => setHasPasscode(!!d.hasPasscode))
      .finally(() => setChecked(true));
  }, [status, session?.user?.loginAt]);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(UNLOCKED_KEY) === "1");
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        sessionStorage.removeItem(UNLOCKED_KEY);
        setUnlocked(false);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  async function handleUnlock(passcode: string) {
    const res = await fetch("/api/user/passcode/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json();
    if (data.valid) {
      sessionStorage.setItem(UNLOCKED_KEY, "1");
      setUnlocked(true);
      return { success: true };
    }
    return {
      success: false,
      error: res.status === 429 ? "Too many attempts — try again in a minute" : "Incorrect passcode",
    };
  }

  if (status !== "authenticated" || !checked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={22} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  const locked = hasPasscode && !unlocked && !freshLogin;

  if (locked) {
    return <PasscodeLockScreen onUnlock={handleUnlock} />;
  }

  return <>{children}</>;
}
