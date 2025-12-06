import { useState, useEffect } from "react"
import type { CalendarEvent } from "../../types/calendar"

type EventModalProps = {
  isOpen: boolean
  selectedDate: Date
  eventToEdit: CalendarEvent | null
  onSave: (event: CalendarEvent) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const COLOR_OPTIONS = ["red", "green", "blue"] as const
type ColorOption = (typeof COLOR_OPTIONS)[number]

export function EventModal({
  isOpen,
  selectedDate,
  eventToEdit,
  onSave,
  onDelete,
  onClose,
}: EventModalProps) {
  const [allDay, setAllDay] = useState(false)
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [color, setColor] = useState<ColorOption>(COLOR_OPTIONS[0])

  // Error states
  const [titleError, setTitleError] = useState("")
  const [timeError, setTimeError] = useState("")

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title)
      setStartTime(eventToEdit.startTime || "")
      setEndTime(eventToEdit.endTime || "")
      setColor(eventToEdit.color || COLOR_OPTIONS[0])
    } else {
      setTitle("")
      setStartTime("")
      setEndTime("")
      setColor(COLOR_OPTIONS[0])
    }

    // Reset errors when modal opens
    setTitleError("")
    setTimeError("")
  }, [eventToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let hasError = false

    // Title validation
    if (!title.trim()) {
      setTitleError("Event needs a name")
      hasError = true
    } else {
      setTitleError("")
    }

    // Time validation if not all-day
    if (!allDay) {
      if (!startTime || !endTime) {
        setTimeError("Start and end time are required")
        hasError = true
      } else if (startTime >= endTime) {
        setTimeError("Start time must be before end time")
        hasError = true
      } else {
        setTimeError("")
      }
    } else {
      setTimeError("")
    }

    if (hasError) return

    onSave({
      id: eventToEdit?.id || Date.now().toString(),
      title,
      date: selectedDate,
      startTime: allDay ? "" : startTime,
      endTime: allDay ? "" : endTime,
      color,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-header-container">
          <h2>{eventToEdit ? "Edit Event" : "Add Event"}</h2>
          <div className="modal-date">{selectedDate.toLocaleDateString("en-US")}</div>
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
            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(eventToEdit.id)}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
