import type { CalendarEvent } from "../../types/calendar"
import "../../styles/overflow.css"

type OverflowModalProps = {
  day: Date
  events: CalendarEvent[]
  onClose: () => void
  onEventClick: (event: CalendarEvent) => void
}

export function OverflowModal({
  day,
  events,
  onClose,
  onEventClick,
}: OverflowModalProps) {
  return (
    <div className="overflow-modal-overlay">
      <div className="overflow-modal">
        <div className="overflow-modal-header">
          <h2 className="overflow-events-name">{day.toLocaleDateString()}</h2>
          <button className="closeBtn" onClick={onClose}>X</button>
        </div>
        {events.map((event) => (
          <div
            key={event.id}
            className={`day-events-item event-${event.color}`}
            onClick={() => onEventClick(event)}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  )
}
