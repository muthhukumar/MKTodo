import {TTask} from "~/@types"
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

export function separateTasks(tasks: Array<TTask>) {
  const pendingTasks = []
  const completedTasks = []

  for (const task of tasks) {
    if (task.completed) {
      completedTasks.push(task)
    } else {
      pendingTasks.push(task)
    }
  }

  return {
    pendingTasks,
    completedTasks,
  }
}
