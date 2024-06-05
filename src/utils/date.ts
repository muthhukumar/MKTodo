import moment from "moment"

export function timeAgo(date: Date | string) {
  return moment(date).fromNow()
}

export function isDateSameAsToday(date: Date | string) {
  return moment(date).isSame(moment(), "day")
}
