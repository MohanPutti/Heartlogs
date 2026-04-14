"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { motion } from "framer-motion";

export function FAB() {
  return (
    <Link href="/entry/new" className="md:hidden">
      <motion.div
        className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        style={{ background: "var(--accent)", color: "white" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
      >
        <PenLine size={22} />
      </motion.div>
    </Link>
  );
}
