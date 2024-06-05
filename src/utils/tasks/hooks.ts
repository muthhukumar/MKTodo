import * as React from "react"

import {TTask} from "../../@types"

export function useAsyncFilteredTasks(query: string, tasks: Array<TTask>) {
  const [filteredTasks, setFilteredTasks] = React.useState(tasks)

  React.useEffect(() => {
    const worker = new Worker(new URL("filterTasksWorker", import.meta.url))

    worker.postMessage({tasks, query})

    worker.onmessage = function (event) {
      setFilteredTasks(event.data)
    }

    return () => {
      worker.terminate()
    }
  }, [query, tasks])

  return filteredTasks
}
