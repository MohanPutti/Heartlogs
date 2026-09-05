import Link from "next/link";
import { Heart } from "lucide-react";

export function DonateNavLink() {
  return (
    <Link
      href="/donate"
      className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
      style={{ color: "var(--accent)" }}
    >
      <Heart size={14} className="fill-current" />
      Donate
    </Link>
  );
}

export function DonateFooterLink() {
  return (
    <Link href="/donate" className="hover:underline">
      Donate
    </Link>
  );
}
