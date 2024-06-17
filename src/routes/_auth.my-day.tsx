import {createFileRoute} from "@tanstack/react-router"
import {Tasks} from "~/components"
import {API} from "~/service"
import {SearchQuerySchema} from "~/utils/schema"

export const Route = createFileRoute("/_auth/my-day")({
  validateSearch: SearchQuerySchema,
  loaderDeps: ({search: {query}}) => ({query}),
  loader: async ({deps: {query}}) => {
    return {
      tasks: await API.getTasks("my-day", query),
    }
  },
  component: MyDayTasks,
})

function MyDayTasks() {
  const {tasks} = Route.useLoaderData()

  return <Tasks tasks={tasks} />
}
