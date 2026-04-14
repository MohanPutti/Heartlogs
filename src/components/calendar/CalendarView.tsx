"use client";

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isSameDay,
  isToday,
} from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CalendarViewProps {
  year: number;
  month: number;
  entryDates: string[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ year, month, entryDates }: CalendarViewProps) {
  const router = useRouter();
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start, end });
  const startPadding = getDay(start);
  const parsedDates = entryDates.map((d) => new Date(d));

  function getEntryCount(day: Date) {
    return parsedDates.filter((d) => isSameDay(d, day)).length;
  }

  function handleDayClick(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd");
    const count = getEntryCount(day);
    if (count > 0) {
      // View existing entries for this date
      router.push(`/search?date=${dateStr}`);
    } else {
      // Create a new entry for this date
      router.push(`/entry/new?date=${dateStr}`);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const count = getEntryCount(day);
          const hasEntry = count > 0;
          const today = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer hover:bg-[var(--bg-elevated)] ${
                today ? "ring-2 ring-[var(--accent)]" : ""
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  today
                    ? "text-[var(--accent)]"
                    : hasEntry
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {format(day, "d")}
              </span>
              {hasEntry && (
                <div
                  className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      count >= 3
                        ? "var(--accent)"
                        : count === 2
                        ? "var(--accent-light)"
                        : "var(--border-strong)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
