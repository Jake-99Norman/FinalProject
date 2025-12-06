// import { isSameDay, isSameMonth } from "date-fns"
// import { DayCell } from "./DayCell"
// import type { CalendarEvent } from "../../types/calendar"

// type CalendarGridProps = {
//   days: Date[]
//   currentMonth: Date
//   selectedDay: Date
//   onDayClick: (day: Date) => void
//   onAddEvent: (day: Date) => void
//   events: CalendarEvent[]
//   onEventClick: (event: CalendarEvent) => void
//   onOpenOverflow: (day: Date) => void
// }

// export function CalendarGrid({
//   days,
//   currentMonth,
//   selectedDay,
//   onDayClick,
//   onAddEvent,
//   events,
//   onEventClick,
//   onOpenOverflow,
// }: CalendarGridProps) {
//   const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//   return (
//     <div className="calendar-grid-container">
//       <div className="calendar-grid">
//         {weekdays.map((dayName) => (
//           <div key={dayName} className="calendar-weekday">
//             {dayName}
//           </div>
//         ))}

//         {days.map((day) => (
//           <DayCell
//             key={day.toISOString()}
//             day={day}
//             isCurrentMonth={isSameMonth(day, currentMonth)}
//             isSelected={isSameDay(day, selectedDay)}
//             onClick={() => onDayClick(day)}
//             onAddEvent={onAddEvent}
//             events={events.filter((e) => isSameDay(e.date, day))}
//             onEventClick={onEventClick}
//             onOpenOverflow={onOpenOverflow}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

import { isSameDay, isSameMonth, startOfWeek, addDays } from "date-fns";
import { DayCell } from "./DayCell";
import type { CalendarEvent } from "../../types/calendar";

type CalendarGridProps = {
  days: Date[];
  currentMonth: Date;
  selectedDay: Date;
  onDayClick: (day: Date) => void;
  onAddEvent: (day: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onOpenOverflow: (day: Date) => void;
};

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
  // Get the start of the first week to determine which cells are the first row
  const firstWeekStart = startOfWeek(days[0]);

  return (
    <div className="calendar-grid">
      {days.map((day) => {
        const isFirstWeek = day >= firstWeekStart && day < addDays(firstWeekStart, 7);

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
            showWeekday={isFirstWeek} // pass this prop
          />
        );
      })}
    </div>
  );
}
