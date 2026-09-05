import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Donate — Support HeartLogs, a Free Ad-Free Diary",
  description:
    "HeartLogs is free and ad-free. If it's helped you journal, consider a small one-time or monthly donation to help cover hosting and keep it that way.",
};

export default function DonatePage() {
  return <DonateClient />;
}
