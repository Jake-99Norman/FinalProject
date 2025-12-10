type CalendarHeaderProps = {
  monthName: string;
  year: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
};

export function CalendarHeader({
  monthName,
  year,
  goToPrevMonth,
  goToNextMonth,
  goToToday,
}: CalendarHeaderProps) {
  return (
    <header className="calendarHeader">
      <button className="btn today-btn" onClick={goToToday}>
        Today
      </button>

      <button className="btn prev-btn" onClick={goToPrevMonth}>
        {"<"}
      </button>

      <button className="btn next-btn" onClick={goToNextMonth}>
        {">"}
      </button>

      <h2>
        {monthName} {year}
      </h2>
    </header>
  );
}
