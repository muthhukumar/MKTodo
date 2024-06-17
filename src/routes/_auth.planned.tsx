import {createFileRoute} from "@tanstack/react-router"
import {z} from "zod"
import {Tasks} from "~/components"
import {API} from "~/service"
import {useAsyncFilteredTasks} from "~/utils/tasks/hooks"

const plannedFilter = z.object({
  filter: z
    .enum(["all-planned", "overdue", "today", "tomorrow", "this-week", "later"])
    .catch("all-planned"),
  query: z.string().catch(""),
})

export const Route = createFileRoute("/_auth/planned")({
  validateSearch: plannedFilter,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    return {
      tasks: await API.getTasks(null, query),
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
