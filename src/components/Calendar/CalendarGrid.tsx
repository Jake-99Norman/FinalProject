import { isSameDay, isSameMonth, startOfWeek, addDays } from "date-fns"
import { DayCell } from "./DayCell"
import type { CalendarEvent } from "../../types/calendar"

type CalendarGridProps = {
  days: Date[]
  currentMonth: Date
  selectedDay: Date
  onDayClick: (day: Date) => void
  onAddEvent: (day: Date) => void
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onOpenOverflow: (day: Date) => void
}

export function CalendarGrid({
  days,
  currentMonth,
  selectedDay,
  onDayClick,
  onAddEvent,
  events,
  onEventClick,
  onOpenOverflow,
}: CalendarGridProps) {

    const firstWeekStart = startOfWeek(days[0])

  return (
    <div className="calendar-grid">
      {days.map((day) => {
        const isFirstWeek =
          day >= firstWeekStart && day < addDays(firstWeekStart, 7)

        return (
          <DayCell
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isSameMonth(day, currentMonth)}
            isSelected={isSameDay(day, selectedDay)}
            onClick={() => onDayClick(day)}
            onAddEvent={onAddEvent}
            events={events.filter((e) => isSameDay(e.date, day))}
            onEventClick={onEventClick}
            onOpenOverflow={onOpenOverflow}
            showWeekday={isFirstWeek} 
          />
        )
      })}
    </div>
  )
}
