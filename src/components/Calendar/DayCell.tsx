import { format, isToday } from "date-fns"
import type { CalendarEvent } from "../../types/calendar"

type DayCellProps = {
  day: Date
  isCurrentMonth: boolean
  isSelected: boolean
  onClick: () => void
  onAddEvent: (day: Date) => void
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onOpenOverflow: (day: Date) => void
  showWeekday?: boolean // new prop
}

export function DayCell({
  day,
  isCurrentMonth,
  isSelected,
  onClick,
  onAddEvent,
  events,
  onEventClick,
  onOpenOverflow,
  showWeekday = false,
}: DayCellProps) {
  const today = isToday(day)

  return (
    <div
      className={`day-cell ${!isCurrentMonth ? "outside-month" : ""} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {showWeekday && (
        <div className="calendar-weekday">{format(day, "EEE")}</div>
      )}

      <div className={`day-number ${today ? "today" : ""}`}>
        {day.getDate()}
      </div>

      {events.slice(0, 2).map((e) => (
        <div
          key={e.id}
          className={`day-event-dot ${e.color}`}
          onClick={(ev) => {
            ev.stopPropagation()
            onEventClick(e)
          }}
        >
          {e.title}
        </div>
      ))}

      {events.length > 2 && (
        <div
          className="day-event-more"
          onClick={(ev) => {
            ev.stopPropagation()
            onOpenOverflow(day)
          }}
        >
          +{events.length - 2} more
        </div>
      )}

      <button
        className="add-event-fab"
        onClick={(ev) => {
          ev.stopPropagation()
          onAddEvent(day)
        }}
      >
        +
      </button>
    </div>
  )
}
