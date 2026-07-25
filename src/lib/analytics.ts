import * as amplitude from "@amplitude/analytics-browser";
import { Identify } from "@amplitude/analytics-browser";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_KEY;

let initialized = false;

export function initAmplitude(userId?: string) {
  if (initialized || !API_KEY || typeof window === "undefined") return;
  amplitude.init(API_KEY, userId, {
    defaultTracking: {
      sessions: true,
      pageViews: false,
      formInteractions: false,
      fileDownloads: false,
    },
  });
  initialized = true;
}

export function setUserId(userId: string | undefined) {
  if (!API_KEY || !initialized) return;
  amplitude.setUserId(userId);
  amplitude.flush();
}

export function identifyUser(properties: Record<string, string | number | boolean>) {
  if (!API_KEY || !initialized) return;
  const identify = new Identify();
  for (const [key, value] of Object.entries(properties)) {
    identify.set(key, value);
  }
  amplitude.identify(identify);
  amplitude.flush();
}

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean | undefined>
) {
  if (!API_KEY || !initialized) return;
  amplitude.track(event, properties);
}

export function trackPageView(pageName: string, extra?: Record<string, string | number | boolean>) {
  trackEvent("Page Viewed", { page: pageName, ...extra });
}
