import { useState } from "react"
import { Calendar } from "./components/Calendar/Calendar"
import type { CalendarEvent } from "./types/calendar"

import "./styles/calendar.css"

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  return <Calendar events={events} setEvents={setEvents} />
}

export default App
