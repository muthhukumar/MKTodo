import {createFileRoute, Outlet} from "@tanstack/react-router"
import {z} from "zod"
import {Tasks} from "~/components"
import {ErrorMessage, LoadingScreen} from "~/components/screens"
import {API} from "~/service"
import {getCancelTokenSource} from "~/service/axios"
import {taskQueue} from "~/utils/task-queue"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"

const plannedFilter = z.object({
  filter: z
    .enum(["all-planned", "overdue", "today", "tomorrow", "this-week", "later"])
    .catch("all-planned"),
})

export const Route = createFileRoute("/_auth/tasks/planned")({
  validateSearch: plannedFilter,
  loader: async () => {
    const cancelToken = getCancelTokenSource()

    return {
      tasks: await taskQueue.enqueueUnique({
        // TODO: get tasks by default should require cancel token
        task: () => API.getTasks(null, "", false, cancelToken),
        id: "fetchPlannedTasks",
        cancelTokenSource: cancelToken,
      }),
    }
  },
  component: PlannedTasks,
  errorComponent: ErrorMessage,
  pendingComponent: LoadingScreen,
})

function PlannedTasks() {
  const {tasks} = Route.useLoaderData()

  const {filter} = Route.useSearch()

  const filteredTasks = useAsyncFilteredTasks({
    query: "",
    dueDateFilter: filter,
    tasks,
  })

  return (
    <>
      <Outlet />
      <Tasks type="planned" tasks={filteredTasks} showFilters title="Planned" />
    </>
  )
}
