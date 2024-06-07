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
