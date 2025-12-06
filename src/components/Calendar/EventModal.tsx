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

// Define allowed colors
const COLOR_OPTIONS = ["blue", "green", "red"] as const
type ColorOption = (typeof COLOR_OPTIONS)[number]

export function EventModal({
  isOpen,
  selectedDate,
  eventToEdit,
  onSave,
  onDelete,
  onClose,
}: EventModalProps) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [color, setColor] = useState<ColorOption>(COLOR_OPTIONS[0])

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title)
      setStartTime(eventToEdit.startTime || "09:00")
      setEndTime(eventToEdit.endTime || "10:00")
      setColor(eventToEdit.color || COLOR_OPTIONS[0])
    } else {
      setTitle("")
      setStartTime("09:00")
      setEndTime("10:00")
      setColor(COLOR_OPTIONS[0])
    }
  }, [eventToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return

    onSave({
      id: eventToEdit?.id || Date.now().toString(),
      title,
      date: selectedDate,
      startTime,
      endTime,
      color,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>{eventToEdit ? "Edit Event" : "Add Event"}</h2>
        <div className="modal-date">{selectedDate.toDateString()}</div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          required
        />

        <div className="time-inputs">
          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="color-options">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-btn ${c} ${color === c ? "selected" : ""}`}
              onClick={() => setColor(c)}
            >
              {color === c ? "●" : "○"}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          {eventToEdit && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(eventToEdit.id)}
            >
              Delete
            </button>
          )}
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
