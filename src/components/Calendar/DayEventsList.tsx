// import { format } from "date-fns"
// import type { CalendarEvent } from "../../types/calendar"

// type DayEventsListProps = {
//   events: CalendarEvent[]
//   selectedDay: Date
//   onEventClick: (event: CalendarEvent) => void
//   onAddEvent: () => void
// }

// export function DayEventsList({
//   events,
//   selectedDay,
//   onEventClick,
//   onAddEvent,
// }: DayEventsListProps) {
//   return (
//     <div className="day-events">
//       <div className="day-events-header">
//         <h3 className="day-events-title">
//           Events for {format(selectedDay, "MMMM d, yyyy")}
//         </h3>

//         <button className="add-event-btn" onClick={onAddEvent}>+</button>
//       </div>

//       {events.map((event) => (
//         <div
//           key={event.id}
//           className="day-event-item"
//           onClick={() => onEventClick(event)}
//         ></div>
//       ))}
//     </div>
//   )
// }
