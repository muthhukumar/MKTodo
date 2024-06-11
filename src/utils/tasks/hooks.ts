import type {DueDateFilters, TTask} from "~/@types"
import * as React from "react"

import FilterWorker from "./filterTasksWorker?worker"

export type AsyncTasksFilter = Parameters<typeof useAsyncFilteredTasks>[0]

export function useAsyncFilteredTasks({
  dueDateFilter,
  query,
  tasks,
}: {
  dueDateFilter: null | DueDateFilters // Use this type from router or somewhere
  query: string
  tasks: Array<TTask>
}) {
  const [filteredTasks, setFilteredTasks] = React.useState(tasks)

  React.useEffect(() => {
    const worker = new FilterWorker()

    worker.postMessage({tasks, query, dueDateFilter})

    worker.onmessage = function (event) {
      setFilteredTasks(event.data)
    }
    return () => {
      worker.terminate()
    }
  }, [query, tasks, dueDateFilter])

  return filteredTasks
}
