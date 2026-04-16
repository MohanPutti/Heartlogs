"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  parseISO,
  setMonth,
  setYear,
  getMonth,
  getYear,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DatePickerProps {
  value: string; // "yyyy-MM-dd"
  onChange: (value: string) => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS_PER_PAGE = 12;

type View = "days" | "months" | "years";

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("days");
  const [viewDate, setViewDate] = useState(() => parseISO(value));
  const [yearPageStart, setYearPageStart] = useState(() => {
    const y = getYear(parseISO(value));
    return Math.floor(y / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  });
  const ref = useRef<HTMLDivElement>(null);

  const selected = parseISO(value);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView("days");
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    const d = parseISO(value);
    setViewDate(d);
    setYearPageStart(Math.floor(getYear(d) / YEARS_PER_PAGE) * YEARS_PER_PAGE);
  }, [value]);

  // ── Days view ──────────────────────────────────────────────
  const days = eachDayOfInterval({ start: startOfMonth(viewDate), end: endOfMonth(viewDate) });
  const startPad = getDay(startOfMonth(viewDate));

  function pick(day: Date) {
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
    setView("days");
  }

  // ── Months view ────────────────────────────────────────────
  function pickMonth(monthIdx: number) {
    setViewDate((d) => setMonth(d, monthIdx));
    setView("days");
  }

  // ── Years view ─────────────────────────────────────────────
  function pickYear(year: number) {
    setViewDate((d) => setYear(d, year));
    setYearPageStart(Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE);
    setView("months");
  }

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs transition-colors group"
        style={{ color: "var(--text-muted)" }}
      >
        <CalendarDays size={11} className="group-hover:text-[var(--accent)] transition-colors" />
        <span className="group-hover:text-[var(--accent)] transition-colors">
          {format(selected, "EEEE, MMMM d, yyyy")}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-6 left-0 z-50 rounded-2xl border shadow-xl p-4 w-72"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          {view === "days" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setViewDate((d) => subMonths(d, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("months")}
                  className="text-sm font-semibold px-2 py-0.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {format(viewDate, "MMMM yyyy")}
                </button>
                <button
                  type="button"
                  onClick={() => setViewDate((d) => addMonths(d, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="text-center text-[10px] font-medium py-1" style={{ color: "var(--text-muted)" }}>
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: startPad }).map((_, i) => <div key={`p${i}`} />)}
                {days.map((day) => {
                  const isSelected = isSameDay(day, selected);
                  const isTodayDate = isToday(day);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => pick(day)}
                      className="aspect-square rounded-lg text-xs font-medium transition-colors flex items-center justify-center"
                      style={
                        isSelected
                          ? { background: "var(--accent)", color: "white" }
                          : isTodayDate
                          ? { color: "var(--accent)", fontWeight: 700 }
                          : { color: "var(--text-primary)" }
                      }
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = ""; }}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "months" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setViewDate((d) => setYear(d, getYear(d) - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => { setYearPageStart(Math.floor(getYear(viewDate) / YEARS_PER_PAGE) * YEARS_PER_PAGE); setView("years"); }}
                  className="text-sm font-semibold px-2 py-0.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {getYear(viewDate)}
                </button>
                <button
                  type="button"
                  onClick={() => setViewDate((d) => setYear(d, getYear(d) + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS.map((m, i) => {
                  const isCurrentMonth = i === getMonth(viewDate) && getYear(viewDate) === getYear(selected);
                  const isSelectedMonth = i === getMonth(selected) && getYear(viewDate) === getYear(selected);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => pickMonth(i)}
                      className="py-2 rounded-xl text-xs font-medium transition-colors"
                      style={
                        isSelectedMonth
                          ? { background: "var(--accent)", color: "white" }
                          : isCurrentMonth
                          ? { color: "var(--accent)", background: "var(--bg-elevated)" }
                          : { color: "var(--text-primary)" }
                      }
                      onMouseEnter={(e) => { if (!isSelectedMonth) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={(e) => { if (!isSelectedMonth) e.currentTarget.style.background = isCurrentMonth ? "var(--bg-elevated)" : ""; }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "years" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setYearPageStart((y) => y - YEARS_PER_PAGE)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {yearPageStart} – {yearPageStart + YEARS_PER_PAGE - 1}
                </span>
                <button
                  type="button"
                  onClick={() => setYearPageStart((y) => y + YEARS_PER_PAGE)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {years.map((y) => {
                  const isSelectedYear = y === getYear(selected);
                  const isCurrentYear = y === getYear(new Date());
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => pickYear(y)}
                      className="py-2 rounded-xl text-xs font-medium transition-colors"
                      style={
                        isSelectedYear
                          ? { background: "var(--accent)", color: "white" }
                          : isCurrentYear
                          ? { color: "var(--accent)", background: "var(--bg-elevated)" }
                          : { color: "var(--text-primary)" }
                      }
                      onMouseEnter={(e) => { if (!isSelectedYear) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={(e) => { if (!isSelectedYear) e.currentTarget.style.background = isCurrentYear ? "var(--bg-elevated)" : ""; }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
