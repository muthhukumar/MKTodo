export type TTask = {
  id: number
  name: string
  completed: boolean
  completed_on: string
  created_at: string
  is_important: string
  marked_today: string
  due_date: string
  metadata: string
  sub_tasks: Array<SubTask> | null
  incomplete_subtask_count: number
  subtask_count: number

  recurrence_interval: number
  start_date: string
  recurrence_pattern: string

  list_id: number
}

export type List = {
  id: number
  name: string
  created_at: string
}

export type SubTask = {
  id: number
  name: string
  completed: boolean
  created_at: string
  task_id: number
}

export type DueDateFilters =
  | "all-planned"
  | "overdue"
  | "today"
  | "tomorrow"
  | "this-week"
  | "later"
  | "none"
  | "recurring"

// TODO: Change the all to default
export type TaskTypes =
  | "all"
  | "my-day"
  | "important"
  | "planned"
  | "planned:today"
  | "planned:tomorrow"

export type Log = {
  id: number
  log: string
  level: string
  created_at: string
  updated_at: string
}
