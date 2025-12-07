import { useState } from "react"
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
  const [closing, setClosing] = useState(false)

  // Play close animation then unmount
  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 240) // match animation duration
  }

  return (
    <div className="overflow-overlay" onClick={handleClose}>
      <div
        className={`overflow-box ${closing ? "modal-close" : "modal-open"}`}
        onClick={(e) => e.stopPropagation()} // prevent background close
      >
        <div className="overflow-header">
          <h2 className="overflow-title">
            {day.toLocaleDateString()}
          </h2>
          <button className="overflow-close" onClick={handleClose}>✕</button>
        </div>

        <div className="overflow-list">
          {events.map((event) => (
            <button
              key={event.id}
              className={`overflow-item color-${event.color}`}
              onClick={() => {
                onEventClick(event)
                handleClose()
              }}
            >
              {event.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
