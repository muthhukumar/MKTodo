import * as React from "react"
import {TTask} from "./@types"
import {API} from "./service"

interface TasksContext {
  tasks: Array<TTask>
  syncStatus: {
    lastSyncedAt: string | Date
    success: boolean
  } | null
  sync: () => void
  createTask: (task: string, onSuccess: () => void) => void
  deleteTask: (id: number) => void
  toggleTask: (id: number) => void
}

const TasksContext = React.createContext<TasksContext>({
  tasks: [],
  syncStatus: null,
  sync: () => undefined,
  createTask: () => undefined,
  deleteTask: () => undefined,
  toggleTask: () => undefined,
})

export default function TasksProvider({children}: {children: React.ReactNode}) {
  const [tasks, setTasks] = React.useState<Array<TTask>>([])
  const [syncStatus, setSyncStatus] = React.useState<TasksContext["syncStatus"]>(null)

  async function sync() {
    try {
      const tasks = await API.getTasks()

      setTasks(tasks)

      setSyncStatus({lastSyncedAt: new Date(), success: true})
    } catch (error) {
      setSyncStatus({lastSyncedAt: new Date(), success: false})
    }
  }

  async function createTask(task: string, onSuccess: () => void) {
    if (!task) return

    try {
      await API.createTask({task})

      setTimeout(sync, 0)

      onSuccess()
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
      await API.toggleTaskById(id)

      setTimeout(sync, 0)
    } catch (error) {
      console.log("failed to toggle task")
    }
  }

  React.useEffect(() => {
    sync()
  }, [])

  return (
    <TasksContext.Provider
      value={{
        tasks,
        sync,
        syncStatus,
        createTask,
        deleteTask,
        toggleTask,
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
