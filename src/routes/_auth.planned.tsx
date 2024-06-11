import {createFileRoute} from "@tanstack/react-router"
import {z} from "zod"
import {Tasks} from "~/components"
import {API} from "~/service"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"

const plannedFilter = z.object({
  filter: z
    .enum(["all-planned", "overdue", "today", "tomorrow", "this-week", "later"])
    .catch("all-planned"),
})

export const Route = createFileRoute("/_auth/planned")({
  validateSearch: plannedFilter,
  loader: async () => {
    return {
      tasks: await API.getTasks(null),
    }
  },
  component: PlannedTasks,
})

function PlannedTasks() {
  const {tasks} = Route.useLoaderData()

  const {filter} = Route.useSearch()

  const filteredTasks = useAsyncFilteredTasks({
    query: "",
    dueDateFilter: filter,
    tasks,
  })

  return <Tasks tasks={filteredTasks} showFilters title="Planned" />
}
