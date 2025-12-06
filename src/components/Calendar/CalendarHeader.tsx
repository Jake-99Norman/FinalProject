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
      <button className="btn todayBtn" onClick={goToToday}>
        Today
      </button>

      <button className="btn prevBtn" onClick={goToPrevMonth}>
        {"<"}
      </button>

      <button className="btn nextBtn" onClick={goToNextMonth}>
        {">"}
      </button>

      <h2>
        {monthName} {year}
      </h2>
    </header>
  );
}
