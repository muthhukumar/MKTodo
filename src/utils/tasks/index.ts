import {isDateSameAsToday, areDatesSame, getTomorrowDate, formatDueDate} from "~/utils/date"

export function getDueDateDisplayStr(dueDate: string) {
  if (isDateSameAsToday(dueDate)) {
    return "Today"
  }

  if (areDatesSame(dueDate, getTomorrowDate())) {
    return "Tomorrow"
  }

  return formatDueDate(dueDate)
}
