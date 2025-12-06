import type { CalendarEvent } from "../../types/calendar";

type OverflowModalProps = {
  day: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onEventClick: (event: CalendarEvent) => void;
};

export function OverflowModal({ day, events, onClose, onEventClick }: OverflowModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Events for {day.toDateString()}</h2>
        {events.map(event => (
          <div key={event.id} className={`day-events-item event-${event.color}`} onClick={() => onEventClick(event)}>
            {event.title}
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
