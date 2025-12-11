import { useState, useRef, useEffect } from "react"
import { format, isToday, isBefore, startOfDay } from "date-fns"
import type { CalendarEvent } from "../../types/calendar"

type DayCellProps = {
  day: Date
  isCurrentMonth: boolean
  isSelected: boolean
  onClick: () => void
  onAddEvent: (day: Date) => void
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onOpenOverflow: (day: Date, overflowEvents: CalendarEvent[]) => void
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
  const dayCellRef = useRef<HTMLDivElement>(null)
  const [maxVisibleEvents, setMaxVisibleEvents] = useState(5)

  const today = startOfDay(new Date())
  const isPast = isBefore(day, today)
  const isTodayDay = isToday(day)

  useEffect(() => {
    if (!dayCellRef.current) return

    const observer = new ResizeObserver(() => {
      if (!dayCellRef.current) return
      const cellHeight = dayCellRef.current.offsetHeight
      const headerHeight = 20 
      const addButtonHeight = 24 
      const eventHeight = 28 
      const availableHeight = cellHeight - headerHeight - addButtonHeight
      const max = Math.max(0, Math.floor(availableHeight / eventHeight))
      setMaxVisibleEvents(max)
    })

    observer.observe(dayCellRef.current)
    return () => observer.disconnect()
  }, [])

  // Sort events: all-day first, then timed
  const combinedEvents = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1
    if (!a.allDay && b.allDay) return 1

    if (!a.allDay && !b.allDay) {
      if (!a.startTime || !b.startTime) return 0
      const [aH, aM] = a.startTime.split(":").map(Number)
      const [bH, bM] = b.startTime.split(":").map(Number)
      return aH - bH || aM - bM
    }
    return 0
  })

  const visibleEvents = combinedEvents.slice(0, maxVisibleEvents)
  const overflowEvents = combinedEvents.slice(maxVisibleEvents)

  return (
    <div
      ref={dayCellRef}
      className={`day-cell ${!isCurrentMonth ? "outside-month" : ""} ${
        isSelected ? "selected" : ""
      } ${isPast ? "past-day" : ""}`}
      onClick={isCurrentMonth ? onClick : undefined}
    >
      {showWeekday && (
        <div className="calendar-weekday">{format(day, "EEE")}</div>
      )}

      <div className={`day-number ${isTodayDay ? "today" : ""}`}>
        {day.getDate()}
      </div>

      {isCurrentMonth && (
        <button
          className="add-event-fab"
          onClick={(ev) => {
            ev.stopPropagation()
            onAddEvent(day)
          }}
        >
          +
        </button>
      )}

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

      {overflowEvents.length > 0 && isCurrentMonth && (
        <div
          className="day-event-more"
          onClick={(ev) => {
            ev.stopPropagation()
            onOpenOverflow(day, overflowEvents)
          }}
        >
          +{overflowEvents.length} more
        </div>
      )}
    </div>
  )
}
