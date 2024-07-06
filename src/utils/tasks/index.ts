import {TTask, TaskTypes} from "~/@types"
import {
  isDateSameAsToday,
  areDatesSame,
  getTomorrowDate,
  formatDueDate,
  getTodayDateIOSString,
  getTodayDate,
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

export class PlannedTask extends NewTask {
  due_date: string = ""
  marked_today: string = ""

  constructor({
    name,
    dueDate,
    marked_today,
  }: {
    name: string
    dueDate: string
    marked_today?: string
  }) {
    super(name)
    this.due_date = dueDate

    if (marked_today) {
      this.marked_today = marked_today
    }
  }
}

export const createTask = (taskType: TaskTypes, task: string) => {
  switch (taskType) {
    case "my-day":
      return new MyDayTask({name: task, myDay: getTodayDateIOSString()})
    case "important":
      return new ImportantTask({important: true, name: task})
    case "planned:today":
      return new PlannedTask({dueDate: getTodayDate(), name: task, marked_today: getTodayDate()})
    case "planned:tomorrow":
      return new PlannedTask({dueDate: getTomorrowDate(), name: task})
    case "planned":
    case "all":
    default:
      return new NewTask(task)
  }
}
