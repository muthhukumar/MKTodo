import moment from "moment"

export function timeAgo(date: Date | string) {
  return moment(date).fromNow()
}

export function isDateSameAsToday(date: Date | string) {
  return moment(date).isSame(moment(), "day")
}

export function getTodayDate(): string {
  const today = new Date()

  return today.toISOString().split("T")[0]
}

export function getTomorrowDate(): string {
  const today = new Date()

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow.toISOString().split("T")[0]
}

export function getComingMondayDate(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day <= 1 ? 1 - day : 8 - day

  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + diff)

  return nextMonday.toISOString().split("T")[0]
}

export function getDayFromDate(date: string): string {
  return moment(date).format("ddd")
}

export function areDatesSame(date1: Date | string, date2: Date | string) {
  return moment(date1).isSame(moment(date2), "day")
}

export function formatDueDate(date: Date | string): string {
  return moment(date).format("ddd, D MMMM")
}

export function isDateBeforeToday(date: Date | string): boolean {
  return moment(date).isBefore(moment(), "day")
}

export function isDateWithinThisWeek(date: Date | string): boolean {
  const startOfWeek = moment().startOf("week")
  const endOfWeek = moment().endOf("week")

  const inputDate = moment(date)

  return inputDate.isSameOrAfter(startOfWeek, "day") && inputDate.isSameOrBefore(endOfWeek, "day")
}

export function isDatePastThisWeek(date: Date | string): boolean {
  const inputDate = moment(date)

  const endOfWeek = moment().endOf("week")

  return inputDate.isAfter(endOfWeek)
}

export function getTodayDateIOSString() {
  return new Date().toISOString()
}

export function isDateInPast(date: string | Date | moment.Moment): boolean {
  return moment(date).isBefore(moment(), "day")
}

export function isTaskMoreThanOneMonthOld(taskDate: string): boolean {
  const oneMonthAgo = moment().subtract(1, "months")
  return moment(taskDate).isBefore(oneMonthAgo)
}

export function format24Hour(date: string | Date) {
  date = new Date(date)

  return date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0]
}
