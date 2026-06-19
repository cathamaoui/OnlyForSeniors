"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Printer, X, FileText, List } from "lucide-react";
import {
  Event,
  getEventsForDate,
  getPrintableEventsForMonth,
  toIsoDate,
  parseLocalDate,
  getCalendarGridStart,
  daysInMonth,
  formatEventDateLong,
  formatEventTimeRange,
  formatEventDate,
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
  /** Ref to the "selected day" container so we can scroll into view. */
  const selectedRef = useRef<HTMLDivElement | null>(null);
  /** "detailed" = full cards w/ description, "condensed" = title+date+time+venue only. */
  const [printMode, setPrintMode] = useState<"detailed" | "condensed">("detailed");
  /** When true, the on-screen print preview overlay is shown. */
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

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
  // Printable events: non-boosted only, for the currently-displayed month.
  const printMonthEvents = getPrintableEventsForMonth(year, month0);
  // Group consecutive events that share the same startDate into one
  // "day" so the print view is easy to scan.
  const printMonthEventsByDate: Record<string, Event[]> = {};
  for (const e of printMonthEvents) {
    if (!printMonthEventsByDate[e.startDate]) printMonthEventsByDate[e.startDate] = [];
    printMonthEventsByDate[e.startDate].push(e);
  }
  const printMonthEventDates = Object.keys(printMonthEventsByDate).sort();

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToday}
            className="px-4 py-2 text-base font-display font-medium bg-white border-2 border-stone-300 rounded-full hover:border-black min-h-touch"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setPrintPreviewOpen(true)}
            className="px-4 py-2 text-base font-display font-medium bg-white border-2 border-stone-300 rounded-full hover:border-black min-h-touch inline-flex items-center gap-2 no-print"
            aria-label="Print this month's events"
          >
            <Printer className="w-4 h-4" strokeWidth={1.75} />
            Print this month
          </button>
        </div>
      </div>

      {/* Weekday header row */}
      <div className="mt-6 grid grid-cols-7 text-center text-xs sm:text-sm font-bold text-stone-600 uppercase tracking-wide">
        {WEEKDAY_NAMES.map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid grid grid-cols-7 gap-px bg-stone-200 border-2 border-stone-200 rounded-2xl overflow-hidden">
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
              onClick={() => {
                setSelectedDate(c.iso);
                // Scroll to the events-for-this-day list below the grid.
                // requestAnimationFrame lets React paint the new state
                // before we measure the container.
                requestAnimationFrame(() => {
                  selectedRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                });
              }}
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

      {/* Selected-day event list.
          scroll-mt-32 leaves room for the sticky site header when the
          page smooth-scrolls here after a calendar cell is clicked. */}
      {selectedDate && (
        <div ref={selectedRef} className="mt-8 scroll-mt-32" data-calendar-selected>
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

      {/* ON-SCREEN PRINT PREVIEW. Modal-style sheet that mirrors what
          will be printed. Two tabs: Detailed and Condensed. The active
          tab is mirrored onto the .print-only block via data-print-mode
          so @media print renders the same view. */}
      {printPreviewOpen && (
        <div
          className="no-print fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Print preview"
          onClick={() => setPrintPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview header */}
            <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-black">
                  Print preview — {MONTH_NAMES[month0]} {year}
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Choose a layout. Boosted/promoted events are excluded.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrintPreviewOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 min-h-touch min-w-touch flex items-center justify-center"
                aria-label="Close print preview"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Mode tabs */}
            <div className="flex border-b border-stone-200">
              <button
                type="button"
                onClick={() => setPrintMode("detailed")}
                className={[
                  "flex-1 px-4 py-3 text-sm sm:text-base font-display font-medium inline-flex items-center justify-center gap-2",
                  printMode === "detailed"
                    ? "border-b-4 border-black text-black"
                    : "border-b-4 border-transparent text-stone-500 hover:text-black",
                ].join(" ")}
              >
                <FileText className="w-4 h-4" strokeWidth={1.75} />
                Detailed (full card)
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("condensed")}
                className={[
                  "flex-1 px-4 py-3 text-sm sm:text-base font-display font-medium inline-flex items-center justify-center gap-2",
                  printMode === "condensed"
                    ? "border-b-4 border-black text-black"
                    : "border-b-4 border-transparent text-stone-500 hover:text-black",
                ].join(" ")}
              >
                <List className="w-4 h-4" strokeWidth={1.75} />
                Condensed (date + time)
              </button>
            </div>

            {/* Preview body — uses the same markup as the printed view */}
            <div className="p-4 sm:p-8 max-h-[60vh] overflow-y-auto bg-stone-50">
              <div
                className="print-only-preview bg-white p-6 sm:p-10 shadow-sm"
                data-print-mode={printMode}
              >
                <header>
                  <h1>Calendar of Events — {MONTH_NAMES[month0]} {year}</h1>
                  <p>Only For Seniors · onlyforseniors.ca</p>
                </header>
                {printMonthEventDates.length === 0 ? (
                  <p>No events scheduled this month.</p>
                ) : (
                  <ol>
                    {printMonthEventDates.map((iso) => (
                      <li key={iso}>
                        <h2>{formatEventDateLong(iso)}</h2>
                        {printMonthEventsByDate[iso].map((e) => (
                          <article key={e.id}>
                            <h3>{e.title}</h3>
                            <p className="meta">
                              <strong>{formatEventTimeRange(e.startTime, e.endTime)}</strong>
                              {e.endDate !== e.startDate && (
                                <em> (multi-day event through {formatEventDateLong(e.endDate)})</em>
                              )}
                            </p>
                            <p className="venue">
                              {e.venue}, {e.city}, {e.province}
                            </p>
                            <p className="price">
                              {e.isFree ? "Free admission" : (e.price ?? "Ticketed event")}
                            </p>
                            <p className="organizer">
                              <em>Organized by {e.organizer}.</em>
                            </p>
                            <p className="description">{e.description}</p>
                          </article>
                        ))}
                      </li>
                    ))}
                  </ol>
                )}
                <footer>
                  <p>
                    Generated {formatEventDateLong(toIsoDate(new Date()))} ·
                    {" "}Visit onlyforseniors.ca/categories/news/ for the latest.
                  </p>
                </footer>
              </div>
            </div>

            {/* Preview footer */}
            <div className="flex items-center justify-end gap-2 p-4 sm:p-6 border-t border-stone-200 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => setPrintPreviewOpen(false)}
                className="px-4 py-2 text-base font-display font-medium bg-white border-2 border-stone-300 rounded-full hover:border-black min-h-touch"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Make sure the visible mode matches the data attr,
                  // then fire the system print dialog.
                  setPrintMode(printMode);
                  window.print();
                }}
                className="px-5 py-2 text-base font-display font-semibold bg-black text-white rounded-full hover:bg-stone-800 min-h-touch inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" strokeWidth={1.75} />
                Print now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY: mirrors the preview content with both layouts
          available. The active layout is chosen via data-print-mode,
          which the user toggles in the preview (and which @media print
          honors). Hidden on screen. */}
      <div
        className="print-only"
        aria-hidden="true"
        data-print-mode={printMode}
      >
        <div className="print-only-detailed">
          <header>
            <h1>Calendar of Events — {MONTH_NAMES[month0]} {year}</h1>
            <p>Only For Seniors · onlyforseniors.ca</p>
          </header>
          {printMonthEventDates.length === 0 ? (
            <p>No events scheduled this month.</p>
          ) : (
            <ol>
              {printMonthEventDates.map((iso) => (
                <li key={iso}>
                  <h2>{formatEventDateLong(iso)}</h2>
                  {printMonthEventsByDate[iso].map((e) => (
                    <article key={e.id}>
                      <h3>{e.title}</h3>
                      <p>
                        <strong>{formatEventTimeRange(e.startTime, e.endTime)}</strong>
                        {e.endDate !== e.startDate && (
                          <em> (multi-day event through {formatEventDateLong(e.endDate)})</em>
                        )}
                      </p>
                      <p>
                        {e.venue}, {e.address}, {e.city}, {e.province}
                      </p>
                      <p>
                        {e.isFree ? "Free admission" : (e.price ?? "Ticketed event")}
                        {e.url && (
                          <>
                            {" — "}
                            <a href={e.url}>{e.url}</a>
                          </>
                        )}
                      </p>
                      <p>
                        <em>Organized by {e.organizer}.</em>
                      </p>
                      <p>{e.description}</p>
                    </article>
                  ))}
                </li>
              ))}
            </ol>
          )}
          <footer>
            <p>
              Generated {formatEventDateLong(toIsoDate(new Date()))} ·
              {" "}Visit onlyforseniors.ca/categories/news/ for the latest.
            </p>
          </footer>
        </div>
        <div className="print-only-condensed">
          <header>
            <h1>Calendar of Events — {MONTH_NAMES[month0]} {year}</h1>
            <p>Only For Seniors · onlyforseniors.ca</p>
          </header>
          {printMonthEventDates.length === 0 ? (
            <p>No events scheduled this month.</p>
          ) : (
            <ol>
              {printMonthEventDates.map((iso) => (
                <li key={iso}>
                  <h2>{formatEventDateLong(iso)}</h2>
                  {printMonthEventsByDate[iso].map((e) => (
                    <article key={e.id} className="condensed-row">
                      <h3>{e.title}</h3>
                      <p>
                        <strong>{formatEventTimeRange(e.startTime, e.endTime)}</strong>
                        {" · "}
                        {e.venue}, {e.city}
                      </p>
                    </article>
                  ))}
                </li>
              ))}
            </ol>
          )}
          <footer>
            <p>
              Generated {formatEventDateLong(toIsoDate(new Date()))} ·
              {" "}Visit onlyforseniors.ca/categories/news/ for the latest.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}