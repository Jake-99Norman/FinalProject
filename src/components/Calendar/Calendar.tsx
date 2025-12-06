import { useState, useMemo } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, format } from "date-fns";

import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { EventModal } from "./EventModal";
import { OverflowModal } from "./OverflowModal";

import type { CalendarEvent } from "../../types/calendar";

type CalendarProps = {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
};

export function Calendar({ events, setEvents }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [overflowData, setOverflowData] = useState<{ day: Date; events: CalendarEvent[] } | null>(null);

  function goToPrevMonth() { setCurrentMonth(prev => subMonths(prev, 1)); }
  function goToNextMonth() { setCurrentMonth(prev => addMonths(prev, 1)); }
  function goToToday() { setCurrentMonth(new Date()); }

  function handleDayClick(day: Date) { setSelectedDay(day); }

  function handleAddEvent(day: Date) {
    setSelectedDay(day);
    setEventToEdit(null);
    setIsModalOpen(true);
  }

  function handleEventClick(event: CalendarEvent) {
    setEventToEdit(event);
    setSelectedDay(event.date);
    setIsModalOpen(true);
  }

  function handleSaveEvent(event: CalendarEvent) {
    setEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      if (exists) return prev.map(e => e.id === event.id ? event : e);
      return [...prev, event];
    });
    setIsModalOpen(false);
  }

  function handleDeleteEvent(eventId: string) {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsModalOpen(false);
  }

  function handleOpenOverflow(day: Date) {
    const dayEvents = events.filter(e => isSameDay(e.date, day));
    setOverflowData({ day, events: dayEvents });
  }

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  return (
    <div className="calendar-layout">
      <CalendarHeader
        monthName={format(currentMonth, "MMM")}
        year={currentMonth.getFullYear()}
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
      />

      <div className="calendar-body">
        <CalendarGrid
          days={calendarDays}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          onAddEvent={handleAddEvent}
          events={events}
          onEventClick={handleEventClick}
          onOpenOverflow={handleOpenOverflow}
        />
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          selectedDate={selectedDay}
          eventToEdit={eventToEdit}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {overflowData && (
        <OverflowModal
          day={overflowData.day}
          events={overflowData.events}
          onClose={() => setOverflowData(null)}
          onEventClick={handleEventClick}
        />
      )}
    </div>
  );
}
