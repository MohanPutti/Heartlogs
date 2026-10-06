"use client";

import { useRef } from "react";
import Script from "next/script";

const HOSTED_BUTTON_ID = "UCX36SYMZZXWQ";
const CONTAINER_ID = `paypal-container-${HOSTED_BUTTON_ID}`;

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => { render: (selector: string) => void };
    };
  }
}

export function PayPalDonateButton() {
  const rendered = useRef(false);

  function renderButton() {
    if (rendered.current || !window.paypal) return;
    rendered.current = true;
    window.paypal.HostedButtons({ hostedButtonId: HOSTED_BUTTON_ID }).render(`#${CONTAINER_ID}`);
  }

  return (
    <div>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=BAAm-C-ygkFBgbGSXR5pD3heT-mkjCeAh2WEVB5uSBNyf7M5i33PbKHpBDMAl8Yk8mgHIDP0yy4PHAZWGM&components=hosted-buttons&disable-funding=venmo&currency=USD"
        strategy="lazyOnload"
        onLoad={renderButton}
        onReady={renderButton}
      />
      <p className="text-xs text-center mb-2" style={{ color: "var(--text-muted)" }}>
        International? Donate via PayPal
      </p>
      <div id={CONTAINER_ID} />
      <p className="text-xs text-center mt-2" style={{ color: "var(--text-muted)" }}>
        or send directly via{" "}
        <a
          href="https://paypal.me/mohanputti"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          paypal.me/mohanputti
        </a>
      </p>
    </div>
  );
}
