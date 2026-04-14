"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [entryDates, setEntryDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/calendar?year=${current.getFullYear()}&month=${current.getMonth()}`)
      .then((r) => r.json())
      .then((d) => {
        setEntryDates(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, [current]);

  function prev() {
    setDirection(-1);
    setCurrent((d) => subMonths(d, 1));
  }
  function next() {
    setDirection(1);
    setCurrent((d) => addMonths(d, 1));
  }

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
        Calendar
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          {format(current, "MMMM yyyy")}
        </h2>
        <button onClick={next}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={format(current, "yyyy-MM")}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.25 }}
        >
          {loading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <CalendarView
              year={current.getFullYear()}
              month={current.getMonth()}
              entryDates={entryDates}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-xs text-center text-[var(--text-muted)]">
        {entryDates.length} {entryDates.length === 1 ? "entry" : "entries"} this month
      </p>
    </div>
  );
}
