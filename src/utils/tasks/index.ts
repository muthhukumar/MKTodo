import {TTask, TaskTypes} from "~/@types"
import {
  isDateSameAsToday,
  areDatesSame,
  getTomorrowDate,
  formatDueDate,
  getTodayDateIOSString,
  getTodayDate,
} from "~/utils/date"
import {invariant} from "../invariants"

type TaskType = {
  value: TaskTypes
  title: string
}

export const taskTypes: Array<TaskType> = [
  {
    value: "all",
    title: "Default",
  },
  {
    value: "my-day",
    title: "My Day",
  },
  {
    value: "important",
    title: "Important",
  },
  {
    value: "planned:today",
    title: "Today",
  },
  {
    value: "planned:tomorrow",
    title: "Tomorrow",
  },
]

const taskTypeTags = ["myday", "important", "all", "today", "tomorrow"]

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
  metadata: string = ""
  constructor(public name: string) {
    const {tags, modifiedStr} = extractTags(name)

    this.metadata = tags.filter(t => !taskTypeTags.includes(t as TaskTypes)).join(",")
    this.name = modifiedStr
  }
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

export function extractTaskTags(metadata: string) {
  const {tags, modifiedStr} = extractTags(metadata)

  for (let i = 0; i < tags.length; i++) {
    if (taskTypeTags.includes(tags[i] as TaskTypes)) {
      const otherTags = tags
        .filter(t => t !== tags[i])
        .map(t => `!${t}`)
        .join(" ")

      return {taskType: tags[i] as TaskTypes, modifiedStr: modifiedStr + " " + otherTags}
    }
  }

  return null
}

const reverseMapTaskType = {
  "tomorrow": "planned:tomorrow",
  "today": "planned:today",
  "myday": "my-day",
}

export const createTask = (
  taskType: string,
  task: string,
): NewTask | ImportantTask | PlannedTask => {
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
    default: {
      const taskTypeFromTag = extractTaskTags(task)

      if (taskTypeFromTag) {
        const tag = reverseMapTaskType[taskTypeFromTag.taskType as keyof typeof reverseMapTaskType]

        return createTask(tag ? tag : taskTypeFromTag.taskType, taskTypeFromTag.modifiedStr)
      }

      return new NewTask(task)
    }
  }
}

export function selectNext<T, VT>({
  data,
  current,
  match,
}: {
  data: Array<T>
  current: VT
  match: (props: {iterator: T; value: VT}) => boolean
}) {
  invariant(Boolean(data.length), "Data should not be empty")

  const index = data.findIndex(t => match({iterator: t as T, value: current}))

  invariant(index !== -1, "Index should never be -1")

  const result = data[(index + 1) % data.length]

  invariant(Boolean(result), "Result should not be null or undefined")

  return result
}

export function extractTags(value: string): {modifiedStr: string; tags: Array<string>} {
  if (!value) return {modifiedStr: "", tags: []}

  let inputStr = value

  let strs = inputStr.split(" ")

  strs = strs.filter(s => {
    if (s[0] === "!") {
      inputStr = inputStr.replace(s, "")

      return true
    }

    return false
  })

  return {
    modifiedStr: inputStr,
    tags: strs.map(s => s.substring(1, s.length)),
  }
}

export function getTaskPageMetaData(taskType: string): {
  title: string
  showFilters?: boolean
  filter: "my-day" | "important" | null
  type: TaskTypes
} {
  switch (taskType) {
    case "my-day":
      return {title: "My Day", type: "my-day", filter: "my-day"}
    case "important":
      return {title: "Important", type: "important", filter: "important"}
    case "planned":
      return {title: "Planned", type: "planned", showFilters: true, filter: null}
    case "all":
    default:
      return {title: "Tasks", type: "all", filter: null}
  }
}
