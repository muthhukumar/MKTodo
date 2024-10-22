import {DueDateFilters, TTask} from "~/@types"
import {
  areDatesSame,
  getTodayDate,
  getTomorrowDate,
  isDateBeforeToday,
  isDatePastThisWeek,
  isDateWithinThisWeek,
} from "~/utils/date"
import {AsyncTasksFilter} from "./hooks"

self.onmessage = function (event) {
  const {tasks, query, dueDateFilter} = event.data as AsyncTasksFilter

  let result = query ? tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase())) : tasks

  result = dueDateFilter
    ? tasks.filter(t => taskDueDateMatchesDueDateFilter(t, dueDateFilter))
    : result

  self.postMessage(result)
}

function taskDueDateMatchesDueDateFilter(task: TTask, dueDateFilter: DueDateFilters): boolean {
  const {due_date: dueDate} = task

  if (!dueDate) return false

  switch (dueDateFilter) {
    case null:
      return true
    case "all-planned":
      return Boolean(dueDate)
    case "overdue":
      return isDateBeforeToday(dueDate)
    case "today":
      return areDatesSame(dueDate, getTodayDate())
    case "tomorrow":
      return areDatesSame(dueDate, getTomorrowDate())
    case "this-week":
      return isDateWithinThisWeek(dueDate)
    case "later":
      return isDatePastThisWeek(dueDate)
    case "recurring":
      return Boolean(task.recurrence_pattern)
    default:
      return false
  }
}
