import { useState, useEffect, useMemo } from "react";
import type { CalendarEvent } from "../../types/calendar";

type EventModalProps = {
  isOpen: boolean;
  isClosing: boolean;          // NEW PROP for animation
  selectedDate: Date | string;
  eventToEdit: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

const COLOR_OPTIONS = ["red", "green", "blue"] as const;
type ColorOption = (typeof COLOR_OPTIONS)[number];

export function EventModal({
  isOpen,
  isClosing,
  selectedDate,
  eventToEdit,
  onSave,
  onDelete,
  onClose,
}: EventModalProps) {
  const [allDay, setAllDay] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState<ColorOption>(COLOR_OPTIONS[0]);

  const [titleError, setTitleError] = useState("");
  const [timeError, setTimeError] = useState("");

  // Ensure selectedDate is always a Date object
  const safeDate = useMemo(() => {
    return selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  }, [selectedDate]);

  // Load event data when editing
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartTime(eventToEdit.startTime || "");
      setEndTime(eventToEdit.endTime || "");
      setColor(eventToEdit.color || COLOR_OPTIONS[0]);
      setAllDay(eventToEdit.allDay);
    } else {
      setTitle("");
      setStartTime("");
      setEndTime("");
      setColor(COLOR_OPTIONS[0]);
      setAllDay(false);
    }

    setTitleError("");
    setTimeError("");
  }, [eventToEdit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let hasError = false;

    if (!title.trim()) {
      setTitleError("Event needs a name");
      hasError = true;
    } else setTitleError("");

    if (!allDay) {
      if (!startTime || !endTime) {
        setTimeError("Start and end time are required");
        hasError = true;
      } else if (startTime >= endTime) {
        setTimeError("Start time must be before end time");
        hasError = true;
      } else setTimeError("");
    } else setTimeError("");

    if (hasError) return;

    const newEvent: CalendarEvent = {
        id: eventToEdit?.id || Date.now().toString(),
        title,
        date: safeDate,
        startTime: allDay ? "" : startTime,
        endTime: allDay ? "" : endTime,
        color,
        allDay,
        isClosing: false
    };

    onSave(newEvent);

    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem("calendarEvents") || "[]") as CalendarEvent[];
    const exists = stored.some(e => e.id === newEvent.id);
    const updatedEvents = exists
      ? stored.map(e => (e.id === newEvent.id ? newEvent : e))
      : [...stored, newEvent];
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  }

  function handleDelete() {
    if (!eventToEdit) return;

    onDelete(eventToEdit.id);

    const stored = JSON.parse(localStorage.getItem("calendarEvents") || "[]") as CalendarEvent[];
    const updatedEvents = stored.filter(e => e.id !== eventToEdit.id);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  }

  if (!isOpen && !isClosing) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className={`modal ${isClosing ? "modal-close" : "modal-open"}`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header-container">
          <h2>{eventToEdit ? "Edit Event" : "Add Event"}</h2>
          <div className="modal-date">{safeDate.toLocaleDateString("en-US")}</div>
          <button className="closeBtn" type="button" onClick={onClose}>
            X
          </button>
        </div>

        <label htmlFor="event-title">
          Name
          <input
            className="event-title"
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {titleError && <div className="error">{titleError}</div>}
        </label>

        <label htmlFor="all-day" className="all-day">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            name="all-day"
            id="all-day"
          />
          All Day?
        </label>

        <div className="time-inputs">
          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={allDay}
              required={!allDay}
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={allDay}
              required={!allDay}
            />
          </label>
          {timeError && <div className="error">{timeError}</div>}
        </div>

        <label className="colorName" htmlFor="color">
          Color
          <div className="color-options">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-btn ${c} ${color === c ? "selected" : ""}`}
                onClick={() => setColor(c)}
              ></button>
            ))}
          </div>
        </label>

        <div className="modal-actions">
          <button type="submit">Save</button>
          {eventToEdit && (
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
