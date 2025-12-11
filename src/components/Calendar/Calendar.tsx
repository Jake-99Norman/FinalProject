import { useState, useMemo, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  format,
} from "date-fns"

import { CalendarHeader } from "./CalendarHeader"
import { CalendarGrid } from "./CalendarGrid"
import { EventModal } from "./EventModal"
import { OverflowModal } from "./OverflowModal"

import type { CalendarEvent } from "../../types/calendar"

export function Calendar() {
  
  const loadEvents = (): CalendarEvent[] => {
    const stored = JSON.parse(
      localStorage.getItem("calendarEvents") || "[]"
    ) as CalendarEvent[]
    return stored.map((e) => ({ ...e, date: new Date(e.date) }))
  }

  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null)


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)

  const [overflowData, setOverflowData] = useState<{
    day: Date
    events: CalendarEvent[]
  } | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      let offset = 0

      switch (e.key) {
        case "ArrowLeft":
          offset = -1
          break

        case "ArrowRight":
          offset = 1
          break

        case "ArrowUp":
          offset = -7
          break

        case "ArrowDown":
          offset = 7
          break

        default:
          return
      }

      setSelectedDay((prev) => {
        const newDate = addDays(prev, offset)

        setCurrentMonth(startOfMonth(newDate))

        return newDate
      })
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events))
  }, [events])


  function goToPrevMonth() {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }
  function goToNextMonth() {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }
  function goToToday() {
    setCurrentMonth(new Date())
  }

  function handleDayClick(day: Date) {
    setSelectedDay(day)
  }

  function handleAddEvent(day: Date) {
    setSelectedDay(day)
    setEventToEdit(null)
    openModal()
  }

  function handleEventClick(event: CalendarEvent) {
    setEventToEdit(event)
    setSelectedDay(event.date)
    openModal()
  }

  function openModal() {
    setIsModalClosing(false)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsModalClosing(false)
    }, 250)
  }

  function handleSaveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id)
      if (exists) return prev.map((e) => (e.id === event.id ? event : e))
      return [...prev, event]
    })

    closeModal()
  }

  function handleDeleteEvent(eventId: string) {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    closeModal()
  }

  function handleOpenOverflow(day: Date) {
    const dayEvents = events.filter((e) => isSameDay(e.date, day))
    setOverflowData({ day, events: dayEvents })
  }

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))

    const days: Date[] = []
    let day = start

    while (day <= end) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [currentMonth])

  const shouldRenderModal = isModalOpen || isModalClosing

  return (
    <div className="calendar-layout">
      <div className="calendar-container">
      <CalendarHeader
        monthName={format(currentMonth, "MMM")}
        year={currentMonth.getFullYear()}
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
      />

      <div className="calendar-body">
        <CalendarGrid
          days={calendarDays}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          onAddEvent={handleAddEvent}
          events={events}
          onEventClick={handleEventClick}
          onOpenOverflow={handleOpenOverflow}
        />
      </div>

      {shouldRenderModal && (
        <EventModal
          isOpen={isModalOpen} 
          isClosing={isModalClosing}
          selectedDate={selectedDay}
          eventToEdit={eventToEdit}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={closeModal}
        />
      )}

      {overflowData && (
        <OverflowModal
          day={overflowData.day}
          events={overflowData.events}
          onClose={() => setOverflowData(null)}
          onEventClick={handleEventClick}
        />
      )}
    </div>
    </div>
  )
}
