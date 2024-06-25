import {TTask, TaskTypes} from "~/@types"
import {
  isDateSameAsToday,
  areDatesSame,
  getTomorrowDate,
  formatDueDate,
  getTodayDateIOSString,
} from "~/utils/date"

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

export class NewTask {
  constructor(public name: string) {}
}

export class MyDayTask extends NewTask {
  marked_today: string = ""
  constructor({name, myDay}: {name: string; myDay: string}) {
    super(name)
    this.marked_today = myDay
  }
}

export class ImportantTask extends NewTask {
  is_important: boolean = true
  constructor({name, important}: {name: string; important: boolean}) {
    super(name)
    this.is_important = important
  }
}

export const createTask = (taskType: TaskTypes, task: string) => {
  switch (taskType) {
    case "my-day":
      return new MyDayTask({name: task, myDay: getTodayDateIOSString()})
    case "important":
      return new ImportantTask({important: true, name: task})
    case "planned":
    case "all":
    default:
      return new NewTask(task)
  }
}
