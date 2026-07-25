import * as amplitude from "@amplitude/analytics-browser";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_KEY;

let initialized = false;

export function initAmplitude() {
  if (initialized || !API_KEY || typeof window === "undefined") return;
  amplitude.init(API_KEY, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: false, // we'll track manually with better metadata
      formInteractions: false,
      fileDownloads: false,
    },
  });
  initialized = true;
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

export function setUserId(userId: string | undefined) {
  if (!API_KEY || !initialized) return;
  if (userId) {
    amplitude.setUserId(userId);
  }
}
