import moment from "moment"

export function timeAgo(date: Date | string) {
  return moment(date).fromNow()
}
