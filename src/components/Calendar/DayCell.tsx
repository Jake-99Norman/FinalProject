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
  showWeekday?: boolean
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

  // Separate all-day and timed events
  const allDayEvents = events.filter(e => e.allDay)
  const timedEvents = events.filter(e => !e.allDay)

  // Combine events for display, limit to 5
  const combinedEvents = [...allDayEvents, ...timedEvents]
  const visibleEvents = combinedEvents.slice(0, 5)
  const overflowCount = combinedEvents.length - visibleEvents.length

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

      {/* Add event button */}
      <button
        className="add-event-fab"
        onClick={(ev) => {
          ev.stopPropagation()
          onAddEvent(day)
        }}
      >
        +
      </button>

      {/* Render visible events */}
      {visibleEvents.map((e) => {
        if (e.allDay) {
          return (
            <div
              key={e.id}
              className={`day-event-rectangle ${e.color}`}
              onClick={(ev) => {
                ev.stopPropagation()
                onEventClick(e)
              }}
            >
              {e.title}
            </div>
          )
        } else {
          if (!e.startTime) {
            throw new Error(`Timed event "${e.title}" is missing a startTime!`)
          }
          const [hours, minutes] = e.startTime.split(":").map(Number)
          const start = new Date(day)
          start.setHours(hours, minutes, 0, 0)

          return (
            <div
              key={e.id}
              className="day-event-wrapper"
              onClick={(ev) => {
                ev.stopPropagation()
                onEventClick(e)
              }}
            >
              <span className={`day-event-dot ${e.color}`}></span>
              <span className="day-event-time">{format(start, "h:mm a")}</span>
              <span className="day-event-title">{e.title}</span>
            </div>
          )
        }
      })}

      {/* Overflow indicator */}
      {overflowCount > 0 && (
        <div
          className="day-event-more"
          onClick={(ev) => {
            ev.stopPropagation()
            onOpenOverflow(day)
          }}
        >
          +{overflowCount} more
        </div>
      )}
    </div>
  )
}
