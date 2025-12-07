export type CalendarEvent = {
    id: string
    title: string
    date: Date
    startTime: string
    endTime: string
    allDay: boolean
    color: "blue" | "green" | "red"
}
