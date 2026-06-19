"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  Event,
  getEventsForDate,
  toIsoDate,
  parseLocalDate,
  getCalendarGridStart,
  daysInMonth,
  formatEventDateLong,
} from "@/lib/events";
import { EventCard } from "@/components/ui/EventCard";

type Props = {
  events: Event[];
  /** Initial month to display. Default: today. */
  initialDate?: Date;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Month-grid calendar view. Click any day to expand and see all
 * events on that date. Boosted events are pinned with a gold accent.
 */
export function CalendarGrid({ events, initialDate }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    initialDate ? new Date(initialDate) : new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month0 = cursor.getMonth();
  const start = getCalendarGridStart(year, month0);
  const todayIso = toIsoDate(today);

  // Build 6 weeks (42 cells) starting from `start`.
  const cells: { date: Date; inMonth: boolean; iso: string }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({
      date: d,
      inMonth: d.getMonth() === month0,
      iso: toIsoDate(d),
    });
  }

  // For each cell, what events are on it? (built lazily once)
  const eventsByDate: Record<string, Event[]> = {};
  for (const c of cells) {
    eventsByDate[c.iso] = getEventsForDate(c.iso);
  }

  function prevMonth() {
    setCursor(new Date(year, month0 - 1, 1));
    setSelectedDate(null);
  }
  function nextMonth() {
    setCursor(new Date(year, month0 + 1, 1));
    setSelectedDate(null);
  }
  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayIso);
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div>
      {/* Header bar: month nav + Today button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="min-h-touch min-w-touch p-2 bg-white border-2 border-stone-300 rounded-full hover:border-black"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-black min-w-[12ch] text-center">
            {MONTH_NAMES[month0]} {year}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="min-h-touch min-w-touch p-2 bg-white border-2 border-stone-300 rounded-full hover:border-black"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="px-4 py-2 text-base font-display font-medium bg-white border-2 border-stone-300 rounded-full hover:border-black min-h-touch"
        >
          Today
        </button>
      </div>

      {/* Weekday header row */}
      <div className="mt-6 grid grid-cols-7 text-center text-xs sm:text-sm font-bold text-stone-600 uppercase tracking-wide">
        {WEEKDAY_NAMES.map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-stone-200 border-2 border-stone-200 rounded-2xl overflow-hidden">
        {cells.map((c) => {
          const dayEvents = eventsByDate[c.iso] ?? [];
          const isToday = c.iso === todayIso;
          const isSelected = c.iso === selectedDate;
          const hasEvents = dayEvents.length > 0;
          const hasBoosted = dayEvents.some((e) => e.isBoosted);
          return (
            <button
              key={c.iso}
              type="button"
              onClick={() => setSelectedDate(c.iso)}
              className={[
                "relative bg-white min-h-[88px] sm:min-h-[100px] p-2 text-left flex flex-col gap-1 transition",
                c.inMonth ? "text-black" : "text-stone-300",
                isSelected ? "ring-2 ring-black ring-inset" : "",
                "hover:bg-stone-50",
              ].join(" ")}
              aria-label={`${formatEventDateLong(c.iso)}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}` : ""}`}
            >
              <span
                className={[
                  "inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full text-sm font-semibold",
                  isToday ? "bg-black text-white" : "",
                ].join(" ")}
              >
                {c.date.getDate()}
              </span>
              {/* Event dots */}
              {hasEvents && (
                <div className="mt-auto flex items-center gap-1 flex-wrap">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={[
                        "inline-block w-2 h-2 rounded-full",
                        e.isBoosted ? "bg-amber-500" : "bg-stone-700",
                      ].join(" ")}
                      title={e.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[10px] text-stone-600 font-semibold">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
              {hasBoosted && (
                <Sparkles
                  className="absolute top-2 right-2 w-3.5 h-3.5 text-amber-500"
                  strokeWidth={2}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected-day event list */}
      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-2xl font-display font-medium text-black">
            {formatEventDateLong(selectedDate)}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="mt-3 text-base text-stone-700">
              No events scheduled on this day.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {selectedEvents.map((e) => (
                <EventCard key={e.id} event={e} variant="inline" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}