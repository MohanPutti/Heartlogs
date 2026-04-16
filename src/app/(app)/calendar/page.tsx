"use client";

import { useState, useEffect } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { format, addMonths, subMonths, setMonth, setYear, getYear, getMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS_PER_PAGE = 12;
type View = "days" | "months" | "years";

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [entryDates, setEntryDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [view, setView] = useState<View>("days");
  const [yearPageStart, setYearPageStart] = useState(() =>
    Math.floor(new Date().getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE
  );

  useEffect(() => {
    if (view !== "days") return;
    setLoading(true);
    fetch(`/api/calendar?year=${current.getFullYear()}&month=${current.getMonth()}`)
      .then((r) => r.json())
      .then((d) => {
        setEntryDates(Array.isArray(d) ? d : []);
        setLoading(false);
      });
  }, [current, view]);

  function prev() {
    if (view === "days") { setDirection(-1); setCurrent((d) => subMonths(d, 1)); }
    else if (view === "months") setCurrent((d) => setYear(d, getYear(d) - 1));
    else setYearPageStart((y) => y - YEARS_PER_PAGE);
  }
  function next() {
    if (view === "days") { setDirection(1); setCurrent((d) => addMonths(d, 1)); }
    else if (view === "months") setCurrent((d) => setYear(d, getYear(d) + 1));
    else setYearPageStart((y) => y + YEARS_PER_PAGE);
  }

  function pickMonth(monthIdx: number) {
    setCurrent((d) => setMonth(d, monthIdx));
    setView("days");
  }
  function pickYear(year: number) {
    setCurrent((d) => setYear(d, year));
    setYearPageStart(Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE);
    setView("months");
  }

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);
  const today = new Date();

  return (
    <div className="max-w-lg mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
        Calendar
      </h1>

      {/* Navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
          <ChevronLeft size={18} />
        </button>

        {view === "days" && (
          <button
            onClick={() => setView("months")}
            className="font-display text-xl font-semibold px-3 py-1 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {format(current, "MMMM yyyy")}
          </button>
        )}
        {view === "months" && (
          <button
            onClick={() => { setYearPageStart(Math.floor(getYear(current) / YEARS_PER_PAGE) * YEARS_PER_PAGE); setView("years"); }}
            className="font-display text-xl font-semibold px-3 py-1 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {getYear(current)}
          </button>
        )}
        {view === "years" && (
          <span className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {yearPageStart} – {yearPageStart + YEARS_PER_PAGE - 1}
          </span>
        )}

        <button onClick={next}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "days" && (
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
        )}

        {view === "months" && (
          <motion.div
            key="months"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m, i) => {
                const isSelected = i === getMonth(current) && getYear(current) === getYear(current);
                const isCurrentMonth = i === getMonth(today) && getYear(current) === getYear(today);
                const isActive = i === getMonth(current);
                return (
                  <button
                    key={m}
                    onClick={() => pickMonth(i)}
                    className="py-3 rounded-xl text-sm font-medium transition-colors"
                    style={
                      isActive
                        ? { background: "var(--accent)", color: "white" }
                        : isCurrentMonth
                        ? { color: "var(--accent)", background: "var(--bg-elevated)" }
                        : { color: "var(--text-primary)" }
                    }
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isCurrentMonth ? "var(--bg-elevated)" : ""; }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {view === "years" && (
          <motion.div
            key={`years-${yearPageStart}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-3 gap-2">
              {years.map((y) => {
                const isSelected = y === getYear(current);
                const isCurrentYear = y === getYear(today);
                return (
                  <button
                    key={y}
                    onClick={() => pickYear(y)}
                    className="py-3 rounded-xl text-sm font-medium transition-colors"
                    style={
                      isSelected
                        ? { background: "var(--accent)", color: "white" }
                        : isCurrentYear
                        ? { color: "var(--accent)", background: "var(--bg-elevated)" }
                        : { color: "var(--text-primary)" }
                    }
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = isCurrentYear ? "var(--bg-elevated)" : ""; }}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === "days" && (
        <p className="mt-6 text-xs text-center text-[var(--text-muted)]">
          {entryDates.length} {entryDates.length === 1 ? "entry" : "entries"} this month
        </p>
      )}
    </div>
  );
}
