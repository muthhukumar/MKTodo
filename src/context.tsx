import * as React from "react"
import {DueDateFilters, TTask} from "./@types"
import {API} from "./service"
import {useReRenderOnPopState} from "./utils/hooks"
import {getFilter} from "./utils/api"
import {useAsyncFilteredTasks} from "./utils/tasks/hooks"

interface TasksContext {
  loading: boolean
  setLoading: (value: boolean) => void
  tasks: Array<TTask>
  syncStatus: {
    lastSyncedAt: string | Date
    success: boolean
  } | null
  sync: () => void
  createTask: (task: string, onSuccess: () => void) => void
  deleteTask: (id: number) => void
  toggleTaskCompleted: (id: number) => void
  toggleTaskImportance: (id: number) => void
  toggleTaskAddToMyDay: (id: number) => void
  query: string
  setQuery: (value: string) => void
  updateTaskDueDate: (id: number, dueDate: string) => void
  dueDateFilter: DueDateFilters | null
  setDueDateFilter: (value: DueDateFilters) => void
}

const TasksContext = React.createContext<TasksContext>({
  loading: false,
  setLoading: () => undefined,
  tasks: [],
  syncStatus: null,
  sync: () => undefined,
  createTask: () => undefined,
  deleteTask: () => undefined,
  toggleTaskCompleted: () => undefined,
  toggleTaskImportance: () => undefined,
  toggleTaskAddToMyDay: () => undefined,
  query: "",
  setQuery: () => undefined,
  updateTaskDueDate: () => undefined,
  dueDateFilter: null,
  setDueDateFilter: () => undefined,
})

export default function TasksProvider({children}: {children: React.ReactNode}) {
  const [tasks, setTasks] = React.useState<Array<TTask>>([])
  const [loading, setLoading] = React.useState(false)
  const [syncStatus, setSyncStatus] = React.useState<TasksContext["syncStatus"]>(null)
  const [query, setQuery] = React.useState("")
  const [dueDateFilter, setDueDateFilter] = React.useState<DueDateFilters | null>(null)

  useReRenderOnPopState(() => {
    sync()
    setDueDateFilter(null)
  })

  const filteredTasks = useAsyncFilteredTasks({query, tasks, dueDateFilter})

  async function sync() {
    setLoading(true)
    try {
      const tasks = await API.getTasks(getFilter())

      setTasks(tasks)

      setSyncStatus({lastSyncedAt: new Date(), success: true})
    } catch (error) {
      setSyncStatus({lastSyncedAt: new Date(), success: false})
    } finally {
      setLoading(false)
    }
  }

  async function createTask(task: string, onSuccess: () => void) {
    if (!task) return

    try {
      onSuccess()

      await API.createTask({task})

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to create task")
    }
  }

  async function deleteTask(id: number) {
    try {
      await API.deleteTaskById(id)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to delete task")
    }
  }

  async function toggleTask(id: number) {
    try {
      await API.toggleTaskCompletedById(id)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to toggle task")
    }
  }

  async function toggleTaskImportance(id: number) {
    try {
      await API.toggleTaskImportanceById(id)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to toggle task importance")
    }
  }

  async function toggleTaskAddToMyDay(id: number) {
    try {
      await API.toggleTaskAddToMyDayById(id)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to toggle task add to my day")
    }
  }

  async function updateTaskDueDate(id: number, dueDate: string) {
    try {
      await API.updateTaskDueDateById(id, dueDate)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("Failed to update task due date")
    }
  }

  React.useEffect(() => {
    sync()
  }, [])

  return (
    <TasksContext.Provider
      value={{
        loading,
        setLoading,
        tasks: filteredTasks,
        sync,
        syncStatus,
        createTask,
        deleteTask,
        toggleTaskCompleted: toggleTask,
        toggleTaskImportance,
        toggleTaskAddToMyDay,
        query,
        setQuery,
        updateTaskDueDate,
        dueDateFilter,
        setDueDateFilter,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = React.useContext(TasksContext)

  if (!context) {
    console.warn(`useTasks should be used inside TasksProvider`)
  }

  return context
}
